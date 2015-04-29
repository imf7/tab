/*
auther:f7
web: http://www.imf7.com/
Revision: 2.0
editor:2011.10
editor:2013.11 添加mouseover时鼠标滑过灵敏度控制
editor:2014.02 修正wath为数字0时的错误
*/

(function(window){
	
	/** 
     * 除去字符串两边的空白字符
     * @method trim
     * @static
     * @param {String} source 需要处理的字符串
     * @return {String}  除去两端空白字符后的字符串
     * @remark
     */
	var trim = function(source){
		var re = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
		return String(source).replace(re, "");
	};
	
	/** 
     * 为目标元素添加事件监听器
     * @method on||addEvent
     * @static
     * @param {HTMLElement} elem 目标元素
     * @param {String} type 事件名称 如：click|mouseover
     * @param {Function} listener 需要添加的监听器
     * @return 返回操作的元素节点
     */
	var addEvent = function(elem, type, listener){
		type = type.replace(/^on/i, '').toLowerCase();
		var realListener = listener;
		// 事件监听器挂载
		if(elem.addEventListener){
			elem.addEventListener(type, realListener, false);
		}else if(elem.attachEvent){
			elem.attachEvent('on' + type, realListener);
		}
		return elem;
	};
	
	/** 
     * 添加class
     * @method addClass
     * @static
     * @param {HTMLElement} elem 需要处理的元素节点
     * @param {String} className class名称
     * @return 返回操作的元素节点
     * @remark 要添加多个class请以空格隔开
     */
	var addClass = function(elem, className){
		var classArray = className.split(/\s+/);
		var result = elem.className;
		var classMatch = " " + result + " ";
		var i=0, l=classArray.length;
		for (; i < l; i++){
			if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
				result += ' ' + classArray[i];
			}
		}
		elem.className = result;
		return elem;
	};
	
	/** 
     * 移除class
     * @method removeClass
     * @static
     * @param {HTMLElement} elem 需要处理的元素节点
     * @param {String} className class名称
     * @return 返回操作的元素节点
     * @remark 要移除多个class请以空格隔开
     */
	var removeClass = function(elem, className){
		var classArray = className.split(/\s+/);
		var result = elem.className;
		var classMatch = " " + result + " ";
		var i=0, l=classArray.length;
		for (; i < l; i++){
			var re = new RegExp(classArray[i], "g");
			if (classMatch.indexOf(" " + classArray[i] + " ") >= 0) {
				result = trim(result.replace(re, ""));
			}
		}
		elem.className = result;
		return elem;
	};
	
	/** 
     * 页签切换
     * @method Tab
     * @param {Object} source Tab.init接受嘻哈类型的【键：值】参数
	 * {
	 * handle:分组名称的节点数组
	 * content:与分组名称对应的内容的节点数组
	 * current:当前分组名称的样式名称
	 * mode:切换方式，支持“click/mouseover/...”等鼠标事件
	 * speed:有值则自动播放，单位毫秒
	 * callback:每次执行完成后的回调方法，接受三个参数【当前第几个，手柄节点，内容节点】
	 * what:初始化指定当前显示第几个
	 * }
     * @return 
     * @remark
     */
	var Tab = function(){
		this.handle = "";
		this.content = "";
		this.current = "";
		this.mode = "";
		this.speed = "";
		this.callback = "";
		this.what = "";
		
		this.past = 0;// 当前指针
		this.timer = "";// 计时器
		this.delayTimer = ""// 延迟计时器
		this.isStop = 0;// 记录是否停止，0为自动切换，1为停止切换 ；为解决执行停止后鼠标滑过又恢复了自动切换 
	};
	
	Tab.prototype.init = function(o){
		//alert(o);
		this.handle = o.handle;
		this.content = o.content;
		this.current = o.current;
		this.mode = o.mode;
		this.speed = o.speed;
		this.callback = o.callback;
		this.what = o.what;
		this.delay = o.delay ? parseInt(o.delay) : o.delay;
		
		if(this.handle.length != this.content.length) return false;
		
		var that = this,
			count = this.handle.length,
			regex = "";
		
		// 有初始化参数时的处理
		if(this.what || this.what === 0) {
			for(i=0; i<count; i++){
				removeClass(this.handle[i], this.current);
				this.content[i].style.display = "none";
			}
			this.show(parseInt(this.what));
		}
		
		for(i=0; i<count; i++){
			// 当手柄是A标签时默认将A的链接属性去掉
			if(this.handle[i].nodeName === "A" && this.mode === "click"){ this.handle[i].setAttribute("href", "javascript:void(0)")};
			
			if ( that.mode == "mouseover" ) {
				addEvent(
					that.handle[i],
					"mouseout",
					function(){
						clearTimeout(that.delayTimer);
					}
				);
			};

			(function(i){
				addEvent(
					that.handle[i],
					that.mode,
					function(){
						clearTimeout(that.timer);
						clearTimeout(that.delayTimer);
						if ( that.delay ) {
							that.delayTimer = setTimeout(function() {
								that.show(i);
							}, that.delay);
						} else {
							that.show(i);
						};
					}
				);

			})(i);
			// 合法化用户输入的当前class
			currentCla = this.current;
			currentCla = currentCla.replace(/\-/g, "\\-");
			// 检测当前节点是否包含当前class
			regex = new RegExp("(^|\\s)" + currentCla + "(\\s|$)");
			if(regex.test(this.handle[i].className)) this.past = i;
		};
		
		// 自动播放
		if(this.speed) this.show(this.past);
	};
	
	Tab.prototype.show = function(i){
		clearTimeout(this.timer);
		var i = parseInt(i),
			that = this,
			next = i + 1;// 下一个节点标识数
			
		if(next == this.handle.length) next = 0; 
		
		if(i >= this.handle.length){
			i = 0;
		}else if(i < 0){
			i = this.handle.length - 1;
		}
		
		// 熄灭上一条数据
		removeClass(this.handle[this.past], this.current);
		this.content[this.past].style.display = "none";
		// 重置当前指针
		this.past = i;
		// 点亮当前数据
		addClass(this.handle[i], this.current);
		this.content[i].style.display = "block";
		// 当前手柄是A标签时清除点击虚线
		if(this.handle[i].nodeName === "A") this.handle[i].blur();
		
		if(this.speed){
			if(that.isStop == 0){
				this.timer = setTimeout(function(){that.show(next)}, that.speed);
			}
			// 划过内容停止播放
			addEvent(this.content[i], "mouseover", function(){ clearTimeout(that.timer) });
			addEvent(this.content[i], "mouseout", function(){
				if(that.isStop == 0){
					that.start();
				}
			});
			/*// 划过手柄停止播放
			addEvent(this.handle[i], "mouseover", function(){ clearTimeout(that.timer) });
			addEvent(this.handle[i], "mouseout", function(){
				if(that.isStop == 0){
					that.start();
				}
			});*/
		};

		if(this.callback) this.callback(i, this.handle[i], this.content[i]);// 回调函数，传回三个参数【当前数 i，当前手柄节点，当前内容节点】
		
	};
	// 以下两个扩展是针对自动切换处理的
	Tab.prototype.stop = function(){
		this.isStop = 1;
		clearTimeout(this.timer);
	};
	Tab.prototype.start = function(){
		clearTimeout(this.timer);
		this.isStop = 0;
		this.show(this.past);
	};
	
	// 点击切换到上一个
	Tab.prototype.prev = function(){
		this.show(this.past - 1);
	};
	// 点击切换到下一个
	Tab.prototype.next = function(){
		this.show(this.past + 1);
	};
	
	window.Tab = Tab;
})(window);
