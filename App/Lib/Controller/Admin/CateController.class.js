module.exports = Controller("Admin/BaseController", function(){
	return {
		navType: "cate",
		listAction: function(){
			var model = D('Cate');
			var self = this;
			var promise1 = model.count("id").then(function(data){
				self.assign("count", data);
			});
			var promise2 = model._adminGetList(self.http).then(function(data){
				self.assign("list", data);
			});
			return when.all([promise1, promise2]).then(function(){
				self.display();
			})
		},
		itemAction: function(){
			var model = D("Cate");
			return this.end();
		}
	}
})