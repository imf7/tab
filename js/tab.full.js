/*
auther:f7
web: http://www.imf7.com/
Revision: 2.0
editor:2011.10
editor:2013.11 ���mouseoverʱ��껬�������ȿ���
editor:2014.02 ����wathΪ����0ʱ�Ĵ���
*/

(function(window){
	
	/** 
     * ��ȥ�ַ������ߵĿհ��ַ�
     * @method trim
     * @static
     * @param {String} source ��Ҫ������ַ���
     * @return {String}  ��ȥ���˿հ��ַ�����ַ���
     * @remark
     */
	var trim = function(source){
		var re = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
		return String(source).replace(re, "");
	};
	
	/** 
     * ΪĿ��Ԫ������¼�������
     * @method on||addEvent
     * @static
     * @param {HTMLElement} elem Ŀ��Ԫ��
     * @param {String} type �¼����� �磺click|mouseover
     * @param {Function} listener ��Ҫ��ӵļ�����
     * @return ���ز�����Ԫ�ؽڵ�
     */
	var addEvent = function(elem, type, listener){
		type = type.replace(/^on/i, '').toLowerCase();
		var realListener = listener;
		// �¼�����������
		if(elem.addEventListener){
			elem.addEventListener(type, realListener, false);
		}else if(elem.attachEvent){
			elem.attachEvent('on' + type, realListener);
		}
		return elem;
	};
	
	/** 
     * ���class
     * @method addClass
     * @static
     * @param {HTMLElement} elem ��Ҫ�����Ԫ�ؽڵ�
     * @param {String} className class����
     * @return ���ز�����Ԫ�ؽڵ�
     * @remark Ҫ��Ӷ��class���Կո����
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
     * �Ƴ�class
     * @method removeClass
     * @static
     * @param {HTMLElement} elem ��Ҫ�����Ԫ�ؽڵ�
     * @param {String} className class����
     * @return ���ز�����Ԫ�ؽڵ�
     * @remark Ҫ�Ƴ����class���Կո����
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
     * ҳǩ�л�
     * @method Tab
     * @param {Object} source Tab.init�����������͵ġ�����ֵ������
	 * {
	 * handle:�������ƵĽڵ�����
	 * content:��������ƶ�Ӧ�����ݵĽڵ�����
	 * current:��ǰ�������Ƶ���ʽ����
	 * mode:�л���ʽ��֧�֡�click/mouseover/...��������¼�
	 * speed:��ֵ���Զ����ţ���λ����
	 * callback:ÿ��ִ����ɺ�Ļص�����������������������ǰ�ڼ������ֱ��ڵ㣬���ݽڵ㡿
	 * what:��ʼ��ָ����ǰ��ʾ�ڼ���
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
		
		this.past = 0;// ��ǰָ��
		this.timer = "";// ��ʱ��
		this.delayTimer = ""// �ӳټ�ʱ��
		this.isStop = 0;// ��¼�Ƿ�ֹͣ��0Ϊ�Զ��л���1Ϊֹͣ�л� ��Ϊ���ִ��ֹͣ����껬���ָֻ����Զ��л� 
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
		
		// �г�ʼ������ʱ�Ĵ���
		if(this.what || this.what === 0) {
			for(i=0; i<count; i++){
				removeClass(this.handle[i], this.current);
				this.content[i].style.display = "none";
			}
			this.show(parseInt(this.what));
		}
		
		for(i=0; i<count; i++){
			// ���ֱ���A��ǩʱĬ�Ͻ�A����������ȥ��
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
			// �Ϸ����û�����ĵ�ǰclass
			currentCla = this.current;
			currentCla = currentCla.replace(/\-/g, "\\-");
			// ��⵱ǰ�ڵ��Ƿ������ǰclass
			regex = new RegExp("(^|\\s)" + currentCla + "(\\s|$)");
			if(regex.test(this.handle[i].className)) this.past = i;
		};
		
		// �Զ�����
		if(this.speed) this.show(this.past);
	};
	
	Tab.prototype.show = function(i){
		clearTimeout(this.timer);
		var i = parseInt(i),
			that = this,
			next = i + 1;// ��һ���ڵ��ʶ��
			
		if(next == this.handle.length) next = 0; 
		
		if(i >= this.handle.length){
			i = 0;
		}else if(i < 0){
			i = this.handle.length - 1;
		}
		
		// Ϩ����һ������
		removeClass(this.handle[this.past], this.current);
		this.content[this.past].style.display = "none";
		// ���õ�ǰָ��
		this.past = i;
		// ������ǰ����
		addClass(this.handle[i], this.current);
		this.content[i].style.display = "block";
		// ��ǰ�ֱ���A��ǩʱ����������
		if(this.handle[i].nodeName === "A") this.handle[i].blur();
		
		if(this.speed){
			if(that.isStop == 0){
				this.timer = setTimeout(function(){that.show(next)}, that.speed);
			}
			// ��������ֹͣ����
			addEvent(this.content[i], "mouseover", function(){ clearTimeout(that.timer) });
			addEvent(this.content[i], "mouseout", function(){
				if(that.isStop == 0){
					that.start();
				}
			});
			/*// �����ֱ�ֹͣ����
			addEvent(this.handle[i], "mouseover", function(){ clearTimeout(that.timer) });
			addEvent(this.handle[i], "mouseout", function(){
				if(that.isStop == 0){
					that.start();
				}
			});*/
		};

		if(this.callback) this.callback(i, this.handle[i], this.content[i]);// �ص�����������������������ǰ�� i����ǰ�ֱ��ڵ㣬��ǰ���ݽڵ㡿
		
	};
	// ����������չ������Զ��л������
	Tab.prototype.stop = function(){
		this.isStop = 1;
		clearTimeout(this.timer);
	};
	Tab.prototype.start = function(){
		clearTimeout(this.timer);
		this.isStop = 0;
		this.show(this.past);
	};
	
	// ����л�����һ��
	Tab.prototype.prev = function(){
		this.show(this.past - 1);
	};
	// ����л�����һ��
	Tab.prototype.next = function(){
		this.show(this.past + 1);
	};
	
	window.Tab = Tab;
})(window);
