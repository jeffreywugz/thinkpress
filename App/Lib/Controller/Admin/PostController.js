/**
 * 文章管理
 * @return {[type]} [description]
 */
module.exports = Controller("Admin/BaseController", function(){
	return {
		navType: "post",
		/**
		 * 列表
		 * @return {[type]} [description]
		 */
		listAction: function(){
			var self = this;
			return D('Post').order('id DESC').where({
				type: "post"
			}).field('id,title,datetime,status').page(this.get('page')).countSelect().then(function(data){
				data.data = data.data.map(function(item){
					item.datetime = getDateTime(item.datetime);
					return item;
				})
				self.assign('list', data);
				return self.display();
			})
		},
		/**
		 * 单条
		 * @return {[type]} [description]
		 */
		itemAction: function(){
			var self = this;
			var model = D('Post');
			if (self.isGet()) {
				var id = self.get("id");
				var catePromise = D('Cate').select();
				if (id) {
					var postPromise = D('Post').where({
						id: id
					}).find();
				}else{
					var postPromise = getPromise({
						Cate: [],
						Tag: []
					});
				}
				return Promise.all([catePromise, postPromise]).then(function(data){
					data[1].Cate = data[1].Cate.map(function(item){
						return item.id;
					})
					self.assign('cate', data[0]);
					self.assign('item', data[1]);
					return self.display();
				})
			}else if (self.isPost()) {
				return model.postItem(self.http).then(function(rows){
					self.success();
					//删除HTML静态化缓存
					self.rmHtmlCache();
				})
			};
		}
	}
})