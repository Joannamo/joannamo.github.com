(function($){

	$.fn.calendar = function(options){ 

		var defaults = {
			date: new Date(),
			showCurrent:function(){}, // 默认显示的内容
			dateClick:function(){} // 点击发生的行为
		}

		var options = $.extend(defaults, options);

		return this.each(
			function (){
				var target = $(this),
					calendarYear = options.date.getFullYear();
					//跟上面获取年份的目的一样 
					calendarMonth = options.date.getMonth();					

				var calendarHTML= generateHTML();
				target.append(calendarHTML);

				var preMon = $(".calendar_ui_header_arrow_l", target),
					nextMon = $(".calendar_ui_header_arrow_r", target),
					btn = $("td a", target);

				createCalender(options.date);
				
				// event
				var preMon = $(".calendar_ui_header_arrow_l", target),
					nextMon = $(".calendar_ui_header_arrow_r", target),
					btn = $("td a", target);

				
				options.showCurrent(options.date);

				btn.live("click",function(event){
					options.dateClick($(this).attr("date"));
					$(this).parents(".calendar_ui_con_body").children("tr").children("td").removeClass("todaytd");
					$(this).parents("td").addClass("todaytd");
				});

				// 为当天的值添加todaytd
				$("td.selectedtd", target).addClass("todaytd");

				//当点击左按钮时,减去一个月,并重绘TABLE
				preMon.click(function(){ 
					createCalender(new Date(calendarYear, --calendarMonth,1));							
				});
				nextMon.die().live("click", function(){ 
					//createCalender(options.date);
					createCalender(new Date(calendarYear,++calendarMonth,1));					
				});
		
				
			}
		);

		function generateHTML(){
			var calendarHTML, calendarTable;

			calendarHTML = '<div class="calendar_ui_header"> \
									<a title="前一月"  href="javascript:;" class="calendar_ui_header_arrow_l"><span class="arrow_l"></span></a> \
									<span class="calendar_ui_header_con"></span> \
	  								<a title="下一月"  href="javascript:;" class="calendar_ui_header_arrow_r"><span class="arrow_r"></span></a> \
	  							</div>',

			calendarTable = '<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" valign="top" class="calendar_ui_con"> \
					<thead> \
					<tr> \
		              <th>日</th> \
		              <th>一</th> \
		              <th>二</th> \
		              <th>三</th> \
		              <th>四</th> \
		              <th>五</th> \
		              <th>六</th> \
		            </tr> \
				</thead> \
				<tbody class="calendar_ui_con_body"> \
					<tr> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
						<td>&nbsp;</td> \
					</tr> \
			</table>';
			calendarHTML += calendarTable;
			return calendarHTML;
		}

		function createCalender(date){
			var target,
				calendarDay = {
					year: null,
					month: null,
					day: null,
					week: null
				},
			dayTable,
			week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			
			//获得当时的年份,并赋值到calendar属性year中,以便别的方法的调用
			calendarDay.year = date.getFullYear();
			//跟上面获取年份的目的一样 
			calendarDay.month = date.getMonth(); 
			calendarDay.day = date.getDate();
			calendarDay.week = week[date.getDay()];

			// calendar title
			$(".calendar_ui_header_con", target).html(calendarDay.year + '年 ' + (calendarDay.month + 1) + '月');
			clearCalendar($(".calendar_ui_con_body", target).get(0)); //清除calendar 转为DOM


			var monthLen = getMonthLen(calendarDay.year,calendarDay.month), //获取月份长度
			    firstDay = getFirstDay(calendarDay.year,calendarDay.month); //获取月份首天为星期几

			for(var i = 1;i <= monthLen;i++){ //循环写入每天的值进入TABLE中

				var newDay = calendarDay.year + "/" + (calendarDay.month+1) + "/"+i,
					//newDayreplace = newDay.replace(/-/g,   "/"),
				    newDayWeek = (new Date(newDay)).getDay();

				calendarDay.week = week[newDayWeek];

				dayTable = $(".calendar_ui_con_body tr td", target);
				dayTable[i +firstDay -1].innerHTML = '<a href="javascript:;" day="'+i+'" year="'+calendarDay.year+'" month="'+calendarDay.month+'" week="'+calendarDay.week+'" date="'+newDay+'">' +i + '</a>'; 

				//判断是否是当天
				if(i == options.date.getDate() && calendarDay.month == options.date.getMonth() && calendarDay.year == options.date.getFullYear()){$(dayTable).eq(i +firstDay -1).addClass("selectedtd");
				}

			}

			
		}

		function clearCalendar(form){
			this.dayTable = form.getElementsByTagName('td');
			var len = this.dayTable.length;

			$(this.dayTable).removeClass("todaytd");
			for(var i = 0; i < len; i++){
				this.dayTable[i].innerHTML = ' ';
				$(this.dayTable).eq(i).removeClass('selectedtd');	
			}
		}

		function getFirstDay(year,month){
			var firstDay = new Date(year,month,1);
			return firstDay.getDay(); //getDay()方法来获取
		}

		function getMonthLen (year,month){ //获取当月总共有多少天
			var thisMonth = new Date(year, month+1, 0);
			return thisMonth.getDate();
		}
		
	}

})(jQuery);