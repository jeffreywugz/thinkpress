$(function(){
	//codemirror编辑器
	var editor = null;
	if ($('#field_content').length) {
		editor = CodeMirror.fromTextArea(document.getElementById("field_content"), {
			lineNumbers: true,
			styleActiveLine: true,
			matchBrackets: true,
			mode: "markdown",
			lineWrapping: true,
			viewportMargin: Infinity
	  	});
	  	editor.setOption("theme", "solarized dark")
	};
	$(document.body).delegates({
		'#field_title': {
			blur: function(){
				if (!$('#field_alias_title').val()) {
					$('#field_alias_title').val(this.value);
				};
			}
		},
		//发表
		'.btn-publish': function(){
			var title = $('#field_title').val();
			var alias_title = $('#field_alias_title').val();
			var content = editor.getValue();
			var data = {
				id: $('#field_id').val() | 0,
				title: title,
				alias_title: alias_title,
				markdown_content: content
			};
			var tag = [];
			$('.postTagList a.btn span').each(function(){
				tag.push($(this).html());
			});
			data.tag = tag.join(",");
			var cate_ids = [];
			$('#cateList input:checked').each(function(){
				cate_ids.push(this.value);
			})
			data.cate_ids = cate_ids.join(",");
			$.postData("/admin/post/item", data).then(function(){
				location.href = '/admin/post/list';
			})
		},
		'#field_tag': {
			keypress: function(event){
				if (event.keyCode == 13) {
					var tagList = [];
					var postTagList = $('.postTagList');
					postTagList.find('a.btn span').each(function(){
						tagList.push($(this).html());
					});
					console.log(tagList)
					var value = this.value.trim();
					value = value.split(",").filter(function(item){
						item = item.trim();
						if (item) {
							return item;
						};
					});
					value.forEach(function(item){
						if (tagList.indexOf(item) > -1) {
							return true;
						};
						var tpl = '<a class="btn btn-default"><span>'+item+'</span><sup>x</sup></a>';
						$(tpl).appendTo(postTagList);
					});
					this.value = "";
				};
			}
		},
		'.postTagList a.btn sup': function(){
			$(this).parents("a.btn").remove();
		},
		'a.btn-post-remove': function(event){
			event.preventDefault();
			var id = $(this).parents("tr").data("id");
			if (confirm("确认删除么？")) {
				$.postData("/admin/post/item", {
					method:  "delete",
					id: id
				}).then(function(){
					location.reload();
				})
			};
		},
		'.btn-page-save': function(event){
			event.preventDefault();
			var title = $('#field_title').val();
			var alias_title = $('#field_alias_title').val();
			var content = editor.getValue();
			var data = {
				id: $('#field_id').val() | 0,
				title: title,
				alias_title: alias_title,
				markdown_content: content
			};
			$.postData("/admin/page/item", data).then(function(){
				location.href = '/admin/page/list';
			})
		},
		'a.btn-page-remove': function(event){
			event.preventDefault();
			var id = $(this).parents("tr").data("id");
			if (confirm("确认删除么？")) {
				$.postData("/admin/page/item", {
					method:  "delete",
					id: id
				}).then(function(){
					location.reload();
				})
			};
		},
	})
})