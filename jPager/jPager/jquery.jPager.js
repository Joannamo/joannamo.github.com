/*
author: Joanna
date: 2013.5.22

* @config {string} 			    container 操作container下面的children
* @config {string} 			    position 分页显示的位置； after: 在内容的后面，before: 在内容的前面
* @config {Boolean} 			showLength 首否显示总共多少条；true: 显示共多少条信息, false: 不显示
* @config {Boolean} 			showSelect 是否显示选择下拉框；true: 显示下拉框选择条数, false: 不显示
* @config {int} 			    perPage 每页显示多少条信息, 这里的信息是从select里面取
* @config {array}               select 下拉框的信息，这个是showSelect为true时设置才有效 [10, 20, 50, 100]
* @config {int} 			    activePage 默认显示哪一页
 * @config {object}             textmap: {
									first: "首页",
									last: "末页",
									prev: "上一页",
									next: "下一页"
								}
 * @config {string}             children 孩子元素

*/
;(function($){
	$.extend($.fn, {
		jPager: function(options){

			var options = $.extend({
				container: "",                
				position: "after",            
				showLength: true,            
				showSelect: true, 
				showAction:true,           
				perPage: 10,                  
				select: [10, 20, 50, 100],
				activePage: 1,
				textmap: {
					first: "首页",
					last: "末页",
					prev: "上一页",
					next: "下一页"
				},                
				children: "li"                 
			}, options);

			
			return this.each(function(){
				var self = $(this),
					elem = $(options.children, $(options.container)), // 每条信息
					html = "",
					page_html = '',
					children_len = elem.length,  
					page_num = Math.ceil(children_len/options.perPage),
					m = 0;

				self.children(".jPager_container", self).remove();

				// 是否显示选择页码
				if(options.showSelect){
					html +='<div class="jPager_container"> \
								<div class="jPager_Select"> \
								<span>每页显示</span> \
								<select class="jPager_Select_element">';
					for (; m<options.select.length; m++){
						if(options.select[m]==options.perPage){
							html += '<option selected value="'+options.select[m]+'">'+options.select[m]+'</option>';
						}else {
							html += '<option value="'+options.select[m]+'">'+options.select[m]+'</option>';
						}						
					}
					html += '</select></div></div>';
				}else {
					html += '<div class="jPager_container"></div>';
				}

				// 分页是否是元素前显示，还是在元素后显示
				if(options.position=="before"){
					self.prepend(html);
				} else if (options.position=="after"){
					self.append(html);
				}

				$(".jPager_Select_element", self).change(function(){
					var j_select = $(".jPager_Select_element", self).val();
					options.perPage = j_select;
					page_num = Math.ceil(children_len/j_select);
					renderPage();
				}).change();

				renderPage();

				// 页码
				function renderPage(){
					var i = 1;					
					if(page_num>1){	

						if(options.showAction)	{
							page_html = '<ul class="jPager"><li cur_page="1" class="first"><a href="javascript:;">'+options.textmap.first+'</a></li> \
								<li class="prev"><a href="javascript:;">'+options.textmap.prev+'</a></li>';
						}else {
							page_html = '<ul class="jPager">';
						}																		
						

						for (; i<=page_num; i++){
							page_html += '<li class="page_num" cur_page="'+i+'"><a href="javascript:;">'+i+'</a></li>';						
						}

						if(options.showAction){
							page_html += '<li class="next"><a href="javascript:;">'+options.textmap.next+'</a></li> \
								<li cur_page="'+page_num+'" class="last"><a href="javascript:;">'+options.textmap.last+'</a></li>';
						}
						

						// 是否显示共多少条
						if(options.showLength){
							page_html += '<li><span>共'+children_len+'条</span></li></ul>';
						}else {
							page_html += '</ul>';
						}					

						$(".jPager", self).remove();
						if(options.showSelect) {
							
							$(".jPager_container", self).append(page_html);
						}else {
							// 分页是否是元素前显示，还是在元素后显示
							if(options.position=="before"){
								self.prepend(page_html);
							} else if (options.position=="after"){
								self.append(page_html);
							}
						}

											
						var page_num_li = $(".jPager li.page_num"),
							first = $(".first", self),
							last = $(".last", self),
							prev = $(".prev", self),
							next = $(".next", self);				
						
						// 有页码的点击事件
						page_num_li.die().live("click", function(){
							var that = $(this),							
								cur_page = that.attr("cur_page");
								elem.hide();						

							page_num_li.removeClass("active");						
							that.addClass("active");

							if(cur_page==1){ // 首页
								// $(".jPager li[cur_page='1']").addClass("active");
								first.addClass("disabled");
								last.removeClass("disabled");
								prev.addClass("disabled");
								next.removeClass("disabled");

								first.attr("cur_page", "");
								last.attr("cur_page", page_num);
								prev.attr("cur_page", "");
								next.attr("cur_page", 2);

								elem.eq(options.perPage).prevAll(options.children).show();
							}else if(cur_page==page_num){ // 尾页
								// $(".jPager li[cur_page='"+page_num+"']").addClass("active");
								first.removeClass("disabled");
								last.addClass("disabled");
								prev.removeClass("disabled");
								next.addClass("disabled");

								first.attr("cur_page", 1);
								last.attr("cur_page", "");
								prev.attr("cur_page", page_num-1);
								next.attr("cur_page", "");

								elem.eq(options.perPage*(page_num-1)).nextAll(options.children).show();
							}else { // 中间页
								first.removeClass("disabled");
								last.removeClass("disabled");
								prev.removeClass("disabled");
								next.removeClass("disabled");

								first.attr("cur_page", 1);
								last.attr("cur_page", page_num);
								prev.attr("cur_page", parseInt(cur_page)-1);
								next.attr("cur_page", parseInt(cur_page)+1);

								var new_elem = elem.filter(function(index){
									return index>=(cur_page-1)*options.perPage &&index<cur_page*options.perPage;
								});

								new_elem.show();
							}
							return false;	
						});
						
						// 首页点击
						first.die().live("click", function(){
							var cur_page = first.attr("cur_page");

							if(cur_page!=""){
								page_num_li.eq(0).click();
							}						
						});

						// 尾页点击
						last.die().live("click", function(){
							var cur_page = last.attr("cur_page");

							if(cur_page!=""){
								page_num_li.eq(page_num-1).click();
							}						
						});

						// 上一页点击
						prev.die().live("click", function(){
							var that = $(this),
								cur_page = that.attr("cur_page");

							if(cur_page!=""){
								$(".jPager li.page_num[cur_page='"+cur_page+"']", self).click();
							}
						});

						// 下一页点击
						next.die().live("click", function(){
							var that = $(this),
								cur_page = that.attr("cur_page");

							if(cur_page!=""){
								$(".jPager li.page_num[cur_page='"+cur_page+"']", self).click();
							}
						});

						page_num_li.eq(options.activePage-1).click();
					}else {
						elem.show();
						$(".jPager", self).remove();
					}
				};
								
			});

			
		}
	});
})(jQuery);