//----------------Utilities----------------//
var _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  createDateFromISO8601 = function(string) {
  var d, date, offset, regexp, time, _ref;
  regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
  d = string.match(new RegExp(regexp));
  offset = 0;
  date = new Date(d[1], 0, 1);
  if (d[3]) {
    date.setMonth(d[3] - 1);
  }
  if (d[5]) {
    date.setDate(d[5]);
  }
  if (d[7]) {
    date.setHours(d[7]);
  }
  if (d[8]) {
    date.setMinutes(d[8]);
  }
  if (d[10]) {
    date.setSeconds(d[10]);
  }
  if (d[12]) {
    date.setMilliseconds(Number("0." + d[12]) * 1000);
  }
  if (d[14]) {
    offset = (Number(d[16]) * 60) + Number(d[17]);
    offset *= (_ref = d[15] === '-') != null ? _ref : {
      1: -1
    };
  }
  offset -= date.getTimezoneOffset();
  time = Number(date) + (offset * 60 * 1000);
  date.setTime(Number(time));
  return date;
};
var Util = typeof Util !='undefined'? Util:{};
Util.mousePosition = function(e, offsetEl) {
  var offset, _ref1;
  if ((_ref1 = $(offsetEl).css('position')) !== 'absolute' && _ref1 !== 'fixed' && _ref1 !== 'relative') {
    offsetEl = $(offsetEl).offsetParent()[0];
  }
  offset = $(offsetEl).offset();
  return {
    top: e.pageY - offset.top,
    left: e.pageX - offset.left
  };
};
/**
 * jQuery Watch Plugin
 *
 * @author Darcy Clarke
 * @version 2.0
 *
 * Copyright (c) 2012 Darcy Clarke
 * Dual licensed under the MIT and GPL licenses.
 *
 * ADDS: 
 *
 * - $.watch()
 *  
 * USES:
 *
 * - DOMAttrModified event
 * 
 * FALLBACKS:
 * 
 * - propertychange event
 * - setTimeout() with delay 
 *
 * EXAMPLE:
 * 
 * $('div').watch('width height', function(){
 *      console.log(this.style.width, this.style.height);
 * });
 *
 * $('div').animate({width:'100px',height:'200px'}, 500);
 *
 */

(function($){
    $.extend($.fn, {         
        /**
         * Watch Method
         * 
         * @param {String} the name of the properties to watch
         * @param {Object} options to overide defaults (only 'throttle' right now)
         * @param {Function} callback function to be executed when attributes change
         *
         * @return {jQuery Object} returns the jQuery object for chainability
         */   
        watch : function(props, options, callback){
            // Dummmy element
            var element = document.createElement('div');

            /**
             * Checks Support for Event
             * 
             * @param {String} the name of the event
             * @param {Element Object} the element to test support against
             *
             * @return {Boolean} returns result of test (true/false)
             */
            var isEventSupported = function(eventName, el) {
                eventName = 'on' + eventName;
                var supported = (eventName in el);
                if(!supported){
                    el.setAttribute(eventName, 'return;');
                    supported = typeof el[eventName] == 'function';
                }
                return supported;
            };
            // Type check options
            if(typeof(options) == 'function'){
                callback = options;
                options = {};
            }
            // Type check callback
            if(typeof(callback) != 'function')
                callback = function(){};
            // Map options over defaults
            options = $.extend({}, { throttle : 10 }, options);
            /**
             * Checks if properties have changed
             * 
             * @param {Element Object} the element to watch
             *
             */
            var check = function(el) {
                var data = el.data(),
                    changed = false,
                    temp;

                // Loop through properties
                for(var i=0;i < data.props.length; i++){
                    temp = el.css(data.props[i]);
                    if(data.vals[i] != temp){
                        data.vals[i] = temp;
                        changed = true;
                        break;
                    }
                }
                // Run callback if property has changed
                if(changed && data.cb)
                    data.cb.call(el, data);
            };
            return this.each(function(){
                var el = $(this),
                    cb = function(){ check.call(this, el) },
                    data = { props:props.split(','), cb:callback, vals: [] };
                $.each(data.props, function(i){ data.vals[i] = el.css(data.props[i]); });
                el.data(data);
                if(isEventSupported('DOMAttrModified', element)){
                    el.on('DOMAttrModified', callback);
                } else if(isEventSupported('propertychange', element)){
                    el.on('propertychange', callback);
                } else {
                    setInterval(cb, options.throttle);
                }
            });
        }
    });
})(jQuery);



//----------------Load videojs-Annotation Plugin----------------//
(function (){
//-- Load Annotation plugin in videojs
function vjsAnnotation_(options){
	var player = this;
	
	player.annotations=new vjsAnnotation(player, options);
	
	//When the DOM and the video media is loaded
	function initialVideoFinished(event) {
		var plugin = player.annotations;
		
		//All components will be initialize after they have been loaded by videojs
		for (var index in plugin.components) {
			plugin.components[index].init_();
		}

		player.annotations.BigNewAn.show();
		
		//-- Annotator will be on the player object and vice versa
		var wrapper = $('.annotator-wrapper').parent()[0],
			annotator = $.data(wrapper, 'annotator');
			
		//set the position of the big buttom
		plugin.setposBigNew(plugin.options.posBigNew);
		
		if(!options.showDisplay) plugin.hideDisplay();
		
		
		//Get current instance of annotator 
		player.annotator = annotator;
		plugin.annotator = annotator;
		
		//get annotations
		var allannotations = annotator.plugins['Store'].annotations;
		player.allannotations = allannotations;
		plugin.refreshDisplay();
		console.log(allannotations);
		
		//-- Listener to Range Slider Plugin
		player.rangeslider.rstb.on('mousedown', function(){plugin._onMouseDownRS(event)});
		//Open the autoPlay from the API
		if (player.autoPlayAPI){
			var AfterPlay = function (){
				player.one('play', AfterPlay);//fix the delay in the youtube plugin
				player.annotations.showAnnotation(player.autoPlayAPI);
				$('html,body').animate({
					scrollTop: $("#"+player.id_).offset().top},
					'slow');
			}
			if (player.techName == 'Youtube')
				player.one('play', AfterPlay);
			else
				AfterPlay();
		}
		
		//set the number of Annotations to display
		plugin.BackAnDisplay.el_.style.height = plugin.backDSBar.el_.style.height = (plugin.options.NumAnnotations+'em');
		plugin.BackAnDisplay.el_.style.top = plugin.backDSBar.el_.style.top = "-"+(plugin.options.NumAnnotations+2+'em');
		plugin.BackAnDisplayScroll.el_.children[0].style.top = "-"+(plugin.options.NumAnnotations+4+'em');
	}
	if (player.techName == 'Youtube')
		player.one('play', initialVideoFinished);
	else
		player.one('durationchange', initialVideoFinished);
	
	
	console.log("Loaded Annotation Plugin");
}
videojs.plugin('annotations', vjsAnnotation_);


//-- Plugin
function vjsAnnotation(player,options){
	var player = player || this;
	
	this.player = player;
	
	this.components = {}; // holds any custom components we add to the player

	options = options || {}; // plugin options
	
	if(!options.hasOwnProperty('posBigNew')) 
		options.posBigNew = 'ul'; // ul = up left || ur = up right || bl = below left || br = below right || c = center
	if(!options.hasOwnProperty('showDisplay')) 
		options.showDisplay = false; 
	if(!options.hasOwnProperty('NumAnnotations')) 
		options.NumAnnotations = 16; 
	
	this.options = options;
	
	this.init();
}

//-- Methods
vjsAnnotation.prototype = {
	/*Constructor*/
	init:function(){
		var player = this.player || {},
			controlBar = player.controlBar,
			seekBar = player.controlBar.progressControl.seekBar;
			
		this.updatePrecision = 3;
		
		//Components and Quick Aliases
		this.NewAn = this.components.NewAnnotation = controlBar.NewAnnotation;
		this.BigNewAn = this.components.BigNewAnnotation = player.BigNewAnnotation;
		this.ShowAn =this.components.ShowAnnotations = controlBar.ShowAnnotations;
		this.BackAnDisplay = this.components.BackAnDisplay = controlBar.BackAnDisplay;//Background of the panel
		this.AnDisplay = this.components.AnDisplay = controlBar.BackAnDisplay.AnDisplay;//Panel with all the annotations
		this.BackAnDisplayScroll = this.components.BackAnDisplayScroll = controlBar.BackAnDisplayScroll;//Back Panel with all the annotations
		this.backDSBar = this.components.BackAnDisplayScrollBar = this.BackAnDisplayScroll.BackAnDisplayScrollBar;//Scroll Bar
		this.backDSBarSel = this.components.ScrollBarSelector = this.backDSBar.ScrollBarSelector;//Scroll Bar Selector
		this.rsd = this.components.RangeSelectorDisplay = controlBar.BackAnDisplay.RangeSelectorDisplay;//Selection the time to display the annotations
		this.rsdl = this.components.RangeSelectorLeft = this.rsd.RangeSelectorLeft;
		this.rsdr = this.components.RangeSelectorRight = this.rsd.RangeSelectorRight;
		this.rsdb = this.components.RangeSelectorBar = this.rsd.RangeSelectorBar;
		this.rsdbl = this.components.RangeSelectorBarL = this.rsdb.RangeSelectorBarL;
		this.rsdbr = this.components.RangeSelectorBarR = this.rsdb.RangeSelectorBarR;
		this.rs = player.rangeslider;
		
		//local variables
		this.editing = false;
		
		this.BigNewAn.hide(); //Hide until the video is load
	},
	newan: function(start,end){
		var player = this.player,
			annotator = this.annotator,
			sumPercent = 10,//percentage for the last mark
			currentTime = player.currentTime(),
			lastTime = this._sumPercent(currentTime,sumPercent); 
		
		var start = typeof start!='undefined'?start:currentTime,
			end = typeof end!='undefined'?end:lastTime;
			
		this._reset();
		
		//set position RS and pause the player
		player.showSlider();
		player.pause();
		
		player.setValueSlider(start,end);
		
		//This variable is to say the editor that we want create a VideoJS annotation
		annotator.editor.VideoJS = this.player.id_;
		
		annotator.adder.show();
		
		this._setOverRS(annotator.adder);

		//Open a new annotator dialog
		annotator.onAdderClick();
	},
	showDisplay: function(){
		this._reset();
		this.BackAnDisplay.removeClass('disable');
		this.BackAnDisplayScroll.removeClass('disable');
		videojs.addClass(this.ShowAn.el_, 'active');
		this.options.showDisplay =true;
	},
	hideDisplay: function(){
		this.BackAnDisplay.addClass('disable');//close the display
		this.BackAnDisplayScroll.addClass('disable');//close the display
		videojs.removeClass(this.ShowAn.el_, 'active');
		this.options.showDisplay =false;
	},
	showAnnotation: function(annotation){
		var isVideo = this._isVideoJS(annotation);
		if (isVideo){
			var start = annotation.rangeTime.start,
				end = annotation.rangeTime.end;
			
			this._reset();
		
			//show the range slider
			this.rs.show();
		
			//set the slider position
			this.rs.setValues(start,end);
		
			//lock the player		
			this.rs.lock();
		
			//play
			this.rs.playBetween(start,end);
		
			//Add the annotation object to the bar 
			var bar = this.rs.bar.el_,
				holder = $(this.rs.left.el_).parent()[0];
			$(holder).append('<span class="annotator-hl"></div>');
			$(bar).appendTo( $(holder).find('.annotator-hl'));
		
			var span = $(bar).parent()[0];
			$.data(span, 'annotation', annotation);//Set the object in the span
		
			//set the editor over the range slider
			this._setOverRS(this.annotator.editor.element);
			this.annotator.editor.checkOrientation();
		
			//hide the panel
			this.rs.hidePanel();
		}
	},
	hideAnnotation: function(){
		this.rs.hide();
		this.rs.showPanel();
		
		//remove the last single showed annotation
		var bar = this.rs.bar.el_,
			holder = $(this.rs.left.el_).parent()[0];
		if ($(holder).find('.annotator-hl').length > 0){
			$(bar).appendTo(holder);
			$(holder).find('.annotator-hl').remove();
		}
	},
	editAnnotation: function(annotation,editor){
		//This will be usefull when we are going to edit an annotation.
		if (this._isVideoJS(annotation)){
			this.hideDisplay();
			var player = this.player,
				editor = editor || this.annotator.editor;
			
			//show the slider and set in the position
			player.showSlider();
			player.unlockSlider();
			player.setValueSlider(annotation.rangeTime.start,annotation.rangeTime.end);
			
			//show the time panel
			player.showSliderPanel();
			
			//set the editor over the range slider
			this._setOverRS(editor.element);
			editor.checkOrientation();
			
			//set the VideoJS variable
			this.annotator.editor.VideoJS = player.id_;
		}
	},
	refreshDisplay: function(){
		console.log("loadingAnnotations");
		var count = 0, 
			allannotations = this.player.allannotations;
		
		//Sort by date the Array
		this._sortByDate(allannotations);
		
		//reset the panel
		$(this.AnDisplay.el_).find('span').remove();//remove the last html items
		$(this.player.el_).find('.vjs-anpanel-annotation .annotation').remove();//remove a deleted annotation without span wrapper
		
		for (var item in allannotations) {
			var an = allannotations[item];
			
			//check if the annotation is a video annotation
			if (this._isVideoJS(an)){
				var div = document.createElement('div'),
					span = document.createElement('span'),
					start = this.rs._percent(an.rangeTime.start) * 100,
					end = this.rs._percent(an.rangeTime.end) * 100,
					width;
				span.appendChild(div);
				span.className = "annotator-hl";
				width = Math.min(100, Math.max(0, end - start));
				div.className = "annotation";
				div.id = count;
				div.style.top = count+"em";
				div.style.left = start+'%';
				div.style.width = width+'%';
				div.start = an.rangeTime.start;
				div.end = an.rangeTime.end;
				this.AnDisplay.el_.appendChild(span);
				
				//Set the object in the div
				$.data(span, 'annotation', an);
				//Add the highlights to the annotation
				an.highlights = $(span);
				
				count++;
			}
		};
		var start = this.rs._seconds(parseFloat(this.rsdl.el_.style.left)/100),
			end = this.rs._seconds(parseFloat(this.rsdr.el_.style.left)/100);
			
		this.showBetween(start,end,this.rsdl.include,this.rsdr.include);
	},
	showBetween: function (start,end,includeLeft,includeRight){
		var duration = this.player.duration(),
			start = start || 0,
			end = end || duration,
			annotationsHTML = $.makeArray($(this.player.el_).find('.vjs-anpanel-annotation .annotator-hl')),
			count = 0;
		for (var index in annotationsHTML){
			var an = $.data(annotationsHTML[index], 'annotation'),
				expressionLeft = includeLeft?(an.rangeTime.end >= start):(an.rangeTime.start >= start),
				expressionRight = includeRight?(an.rangeTime.start <= end):(an.rangeTime.end <= end);
			if (this._isVideoJS(an) && expressionLeft && expressionRight && typeof an.highlights[0]!='undefined'){
				var annotationHTML = an.highlights[0].children[0];
				annotationHTML.style.marginTop = (-1*parseFloat(annotationHTML.style.top)+count) + 'em';
				$(an.highlights[0]).show();
				count++;
			}else if(this._isVideoJS(an) && typeof an.highlights[0]!='undefined'){
				$(an.highlights[0]).hide();
				an.highlights[0].children[0].style.marginTop = '';
			}
		}
	},
	setposBigNew: function(pos){
		var pos = pos || 'ul',
			el = this.player.BigNewAnnotation.el_;
		videojs.removeClass(el, 'ul');
		videojs.removeClass(el, 'ur');
		videojs.removeClass(el, 'c');
		videojs.removeClass(el, 'bl');
		videojs.removeClass(el, 'br');
		videojs.addClass(el, pos);
	},
	pressedKey: function (key){
		var player = this.player,
			rs = this.player.rs;
		if (typeof key!='undefined' && key==73){ //-- i key
			this._reset();
			
			//show slider
			this.rs.show();
			//hide other elements
			this.rs._reset();
			this.rs.setValue(0,player.currentTime());
			this.rs.right.el_.style.visibility = 'hidden';
			this.rs.tpr.el_.style.visibility = 'hidden';
			this.rs.ctpr.el_.style.visibility = 'hidden';
			this.rs.bar.el_.style.visibility = 'hidden';
			this.lastStartbyKey = player.currentTime();
		}else if (typeof key!='undefined' && key==79){ //-- o key
			if (this.rs.bar.el_.style.visibility == 'hidden'){//the last action was to type the i key
				var start = this.lastStartbyKey!='undefined'?this.lastStartbyKey:0;
				this.newan(start,player.currentTime());
			}else{
				this.newan(player.currentTime(),player.currentTime());
			}
		}
	},
	_reset: function(){
		//Hide all the components
		this.hideDisplay();
		this.hideAnnotation();
		this.player.annotator.adder.hide(); 
		this.player.annotator.editor.hide();
		this.player.annotator.viewer.hide();
		
		//make visible all the range slider element that maybe were hidden in pressedKey event
		this.rs.right.el_.style.visibility = '';
		this.rs.tpr.el_.style.visibility = '';
		this.rs.ctpr.el_.style.visibility = '';
		this.rs.bar.el_.style.visibility = '';
		
		//by default the range slider must be unlocked
		this.rs.unlock();
		
		//set the selection area in the original position
		var duration = this.player.duration();
		this.rsd.setPosition(0,0);
		this.rsd.setPosition(1,this.rs._percent(duration));
		
		
		//whether there is a playing selection
		this.rs.bar.suspendPlay(); 
	},
	_setOverRS: function(elem){
		var annotator = this.player.annotator,
			wrapper = $('.annotator-wrapper')[0],
			positionLeft = videojs.findPosition(this.rs.left.el_),
			positionRight = videojs.findPosition(this.rs.right.el_),
			positionAnnotator = videojs.findPosition(wrapper),
			positionAdder = {};
			
		elem[0].style.display = 'block'; //Show the adder
		
		if (this.player.isFullScreen){
			positionAdder.top = positionLeft.top;
			positionAdder.left = positionLeft.left + (positionRight.left - positionLeft.left) / 2;
		}else{
			positionAdder.left = positionLeft.left + (positionRight.left - positionLeft.left) / 2 - positionAnnotator.left;
			positionAdder.top = positionLeft.top - positionAnnotator.top;
		}
		
		elem.css(positionAdder);
	},
	_onMouseDownRS: function(event){
		event.preventDefault();
		//videojs.blockTextSelection();
	
		if(!this.rs.options.locked) {
			videojs.on(document, "mousemove", videojs.bind(this,this._onMouseMoveRS));
			videojs.on(document, "mouseup", videojs.bind(this,this._onMouseUpRS));
		}
	},
	_onMouseMoveRS: function(event) {
		var player = this.player,
			annotator = player.annotator,
			rs = player.rangeslider;
		annotator.editor.element[0].style.display = 'none';
		rs.show();
		this._setOverRS(annotator.adder);
	},
	_onMouseUpRS: function(event){
		videojs.off(document, "mousemove", this._onMouseMoveRS, false);
		videojs.off(document, "mouseup", this._onMouseUpRS, false);
		
		var player = this.player,
			annotator = player.annotator,
			rs = player.rangeslider;
		annotator.editor.element[0].style.display = 'block';
		
		this._setOverRS(annotator.editor.element);
	},
	_sumPercent: function(seconds,percent) {
		//the percentage is in %
		var duration = this.player.duration();
		var seconds = seconds || 0;
		var percent = percent || 10;
		percent = Math.min(100, Math.max(0, percent));
		
		if(isNaN(duration)) {
			return 0;
		}
		return Math.min(duration, Math.max(0, seconds + duration * percent / 100));
	},
	//Detect if we are creating or editing a video-js annotation
	_EditVideoAn: function (){
		var annotator = this.annotator,
			isOpenVideojs = (typeof this.player != 'undefined'),
			VideoJS = annotator.editor.VideoJS;
		return (isOpenVideojs && typeof VideoJS!='undefined' && VideoJS!==-1);
	},
	//Detect if the annotation is a video-js annotation
	_isVideoJS: function (an){
		var player = this.player,
			rt = an.rangeTime,
			isOpenVideojs = (typeof this.player != 'undefined'),
			isVideo = (typeof an.media!='undefined' && an.media=='video'),
			isContainer = (typeof an.target!='undefined' && an.target.container==player.id_ ),
			isNumber = (typeof rt!='undefined' && !isNaN(parseFloat(rt.start)) && isFinite(rt.start) && !isNaN(parseFloat(rt.end)) && isFinite(rt.end)),
			isSource = false;
			if(isContainer){
				//Compare without extension
				var targetSrc = an.target.src.substring(0,an.target.src.lastIndexOf(".")),
					playerSrc = player.options_.sources[0].src.substring(0,player.options_.sources[0].src.lastIndexOf("."));
				isSource = (targetSrc == playerSrc);
			}
		return (isOpenVideojs && isVideo && isContainer && isSource && isNumber);
	},
	_sortByDate: function (annotations,type){
		var type = type || 'asc'; //asc => The value [0] will be the most recent date
		annotations.sort(function(a,b){
			a = new Date(typeof a.updated!='undefined'?createDateFromISO8601(a.updated):'');
			b = new Date(typeof b.updated!='undefined'?createDateFromISO8601(b.updated):'');
			if (type == 'asc')
				return b<a?-1:b>a?1:0;
			else
				return a<b?-1:a>b?1:0;
		});
	}
};




//----------------CREATE new Components for video-js----------------//

//--Charge the new Component into videojs
videojs.ControlBar.prototype.options_.children.ShowAnnotations={}; //Button to show Annotations
videojs.ControlBar.prototype.options_.children.NewAnnotation={}; //Button New Annotation
videojs.ControlBar.prototype.options_.children.BackAnDisplay={}; //Range Slider Time Bar
videojs.ControlBar.prototype.options_.children.BackAnDisplayScroll={}; //Range Slider Time Bar
videojs.options.children.BigNewAnnotation={}; //Big Button New Annotation



//-- Player--> BigNewAnnotation

/**
 * Create a New Annotation with big Button
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.BigNewAnnotation = videojs.Button.extend({
	/** @constructor */
	init: function(player, options){
		videojs.Button.call(this, player, options);
	}
});

videojs.BigNewAnnotation.prototype.init_ = function(){
	this.an = this.player_.annotations;
};

videojs.BigNewAnnotation.prototype.createEl = function(){
	return videojs.Button.prototype.createEl.call(this, 'div', {
		className: 'vjs-big-new-annotation vjs-menu-button vjs-control',
		innerHTML: '<div class="vjs-big-menu-button vjs-control">A</div>'
	});
};

videojs.BigNewAnnotation.prototype.onClick = function(){
	this.an.newan();
};



//-- Player--> ControlBar--> ShowAnnotations

/**
 * Button for show/hide the annotation panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */

videojs.ShowAnnotations = videojs.Button.extend({
  /** @constructor */
  init: function(player, options){
    videojs.Button.call(this, player, options);
  }
});

videojs.ShowAnnotations.prototype.init_ = function(){
	this.an = this.player_.annotations;
};

videojs.ShowAnnotations.prototype.createEl = function(){
  return videojs.Button.prototype.createEl.call(this, 'div', {
    className: 'vjs-showannotations-annotation vjs-menu-button vjs-control',
    innerHTML: '<div class="vjs-menu-button vjs-control">S</div>'
  });
};

videojs.ShowAnnotations.prototype.onClick = function(){
	if (!this.an.options.showDisplay) this.an.showDisplay();
	else this.an.hideDisplay();
};



//-- Player--> ControlBar--> NewAnnotation

/**
 * Create a New Annotation
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.NewAnnotation = videojs.Button.extend({
	/** @constructor */
	init: function(player, options){
		videojs.Button.call(this, player, options);
	}
});

videojs.NewAnnotation.prototype.init_ = function(){
	this.an = this.player_.annotations;
};

videojs.NewAnnotation.prototype.createEl = function(){
	return videojs.Button.prototype.createEl.call(this, 'div', {
		className: 'vjs-new-annotation vjs-menu-button vjs-control',
	});
};

videojs.NewAnnotation.prototype.onClick = function(){
	this.an.newan();
};



//-- Player--> ControlBar--> BackAnDisplay

/**
 * The background annotations panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.BackAnDisplay = videojs.Component.extend({
  /** @constructor */
  init: function(player, options){
    videojs.Component.call(this, player, options);
  }
});

videojs.BackAnDisplay.prototype.init_ = function(){
	this.an = this.player_.annotations
		self = this;
	//Fix error resizing the display panel. The scroll always went up.
	$(this.el_).watch('font-size', function(){
		self.an.backDSBarSel.setPosition(self.an.BackAnDisplayScroll.currentValue,false);
	});

};

videojs.BackAnDisplay.prototype.options_ = {
	children: {
		'RangeSelectorDisplay': {},
		'AnDisplay': {},
	}
};

videojs.BackAnDisplay.prototype.createEl = function(){
  return videojs.Component.prototype.createEl.call(this, 'div', {
    className: 'vjs-back-anpanel-annotation',
  });
};



//-- Player--> ControlBar--> BackAnDisplay--> RangeSelectorDisplay

/**
 * The selector to show the annotations in a time selection
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
 
videojs.RangeSelectorDisplay = videojs.Component.extend({
	/** @constructor */
	init: function(player, options){
	videojs.Component.call(this, player, options);
		this.on('mousedown', this.onMouseDown);
	}
});

videojs.RangeSelectorDisplay.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
	this.start = 0;
	this.end = this.an.player.duration();
};

videojs.RangeSelectorDisplay.prototype.options_ = {
	children: {
		'RangeSelectorLeft': {},
		'RangeSelectorRight': {},
		'RangeSelectorBar': {},
	}
};

videojs.RangeSelectorDisplay.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-rangeselector-anpanel-annotation',
	});
};

videojs.RangeSelectorDisplay.prototype.onMouseDown = function(event) {
	event.preventDefault();
	//videojs.blockTextSelection();
	
	videojs.on(document, "mousemove", videojs.bind(this,this.onMouseMove));
	videojs.on(document, "mouseup", videojs.bind(this,this.onMouseUp));
	
	videojs.removeClass(this.an.rsdb.el_,'disable');
};

videojs.RangeSelectorDisplay.prototype.onMouseUp = function(event) {
	videojs.off(document, "mousemove", this.onMouseMove, false);
	videojs.off(document, "mouseup", this.onMouseUp, false);
	
	videojs.addClass(this.an.rsdb.el_,'disable');
};

videojs.RangeSelectorDisplay.prototype.onMouseMove = function(event) {
	var left = this.calculateDistance(event);
	if (this.an.rsdl.pressed)
		this.setPosition(0,left);
	else if (this.an.rsdr.pressed)
		this.setPosition(1,left);
};

videojs.RangeSelectorDisplay.prototype.calculateDistance = function(event){
	var rstbX = this.getRSTBX();
	var rstbW = this.getRSTBWidth();
	var handleW = this.getWidth();

	// Adjusted X and Width, so handle doesn't go outside the bar
	rstbX = rstbX + (handleW / 2);
	rstbW = rstbW - handleW;

	// Percent that the click is through the adjusted area
	return Math.max(0, Math.min(1, (event.pageX - rstbX) / rstbW));
};

videojs.RangeSelectorDisplay.prototype.getRSTBWidth = function() {
	return this.el_.offsetWidth;
};
videojs.RangeSelectorDisplay.prototype.getRSTBX = function() {
	return videojs.findPosition(this.el_).left;
};
videojs.RangeSelectorDisplay.prototype.getWidth = function() {
	var arrow = $(this.an.rsdl.el_).find('.vjs-selector-arrow')[0];
	return arrow.offsetWidth;//does not matter left or right
};

videojs.RangeSelectorDisplay.prototype.setPosition = function(index,left) {
	//index = 0 for left side, index = 1 for right side
	var index = index || 0;

	// Check for invalid position
	if(isNaN(left)) 
		return false;
	
	// Check index between 0 and 1
	if(!(index === 0 || index === 1))
		return false;
	// Alias
	var ObjLeft = this.an.rsdl.el_,
		ObjRight = this.an.rsdr.el_,
		Obj = this.an[index === 0 ? 'rsdl' : 'rsdr'].el_;
	
	//Check if left arrow is over the right arrow
	if ((index === 0 ?this.updateLeft(left):this.updateRight(left))){
		if (index===1){//right
			Obj.style.left = (left * 100)+'%';
			Obj.style.width = ((1-left) * 100)+'%';
		}else{//left
			Obj.style.left = (left * 100)+'%';
			Obj.style.width = ((left) * 100)+'%';
		}
		
		this[index === 0 ? 'start' : 'end'] = this.rs._seconds(left);
	
		//Fix the problem  when you press the button and the two arrow are underhand
		//left.zIndex = 10 and right.zIndex=20. This is always less in this case:
		if (index === 0 && (left * 100) >= 90)
				$(ObjLeft).find('.vjs-selector-arrow')[0].style.zIndex = 25;
		else
				$(ObjLeft).find('.vjs-selector-arrow')[0].style.zIndex = 10;
		
		
		//-- Panel
		/*var MaxP,MinP,MaxDisP;
		MaxP = this.player_.isFullScreen?96:92;
		MinP = this.player_.isFullScreen?0.1:0.5;
		MaxDisP = this.player_.isFullScreen?3.75:7.5;*/
		var rsdbl = this.an.rsdbl.el_,
			rsdbr = this.an.rsdbr.el_,
			distance = parseFloat(ObjRight.style.left)-parseFloat(ObjLeft.style.left);
		if (index===0)
			rsdbl.children[0].innerHTML = videojs.formatTime(this.rs._seconds(left));
		else
			rsdbr.children[0].innerHTML = videojs.formatTime(this.rs._seconds(left));
		if (typeof distance!='undefined' && distance <= 12.5){
			if(parseFloat(ObjLeft.style.left)<7){
				rsdbl.style.top = (-1.5) + 'em';rsdbl.style.left = 1 + 'em';
			}else{
				rsdbl.style.left = (-2.5) + 'em';rsdbl.style.top = '';
			}
				
			if(parseFloat(ObjRight.style.left)>93){
				rsdbr.style.top = (-1.5) + 'em';rsdbr.style.right = 1 + 'em';
			}else{
				rsdbr.style.right = (-2.5) + 'em';rsdbr.style.top = '';
			}
		}else{
			rsdbl.style.left = 1 + 'em';
			rsdbr.style.right = 1 + 'em';
			rsdbl.style.top = '';
			rsdbr.style.top = '';
		}
		
		
		var start = this.rs._seconds(parseFloat(ObjLeft.style.left)/100),
			end = this.rs._seconds(parseFloat(ObjRight.style.left)/100);
			
		this.an.showBetween(start,end,this.an.rsdl.include,this.an.rsdr.include);
	}
	return true;
};

videojs.RangeSelectorDisplay.prototype.updateLeft = function(left) {
	var rightVal = this.an.rsdr.el_.style.left!=''?this.an.rsdr.el_.style.left:100;
	var right = parseFloat(rightVal) / 100,
		bar = this.an.rsdb.el_;
	
	var width = videojs.round((right - left),this.an.updatePrecision); //round necessary for not get 0.6e-7 for example that it's not able for the html css width
	//(right+0.00001) is to fix the precision of the css in html
	if(left <= (right+0.00001)) {
			bar.style.left = (left * 100) + '%';
			bar.style.width = (width * 100) + '%';
			return true;
	}
	return false;
};
		
videojs.RangeSelectorDisplay.prototype.updateRight = function(right) {
	var leftVal = this.an.rsdl.el_.style.left!=''?this.an.rsdl.el_.style.left:0;
	var left = parseFloat(leftVal) / 100,
		bar = this.an.rsdb.el_;
		
	var width = videojs.round((right - left),this.an.updatePrecision); //round necessary for not get 0.6e-7 for example that it's not able for the html css width
	
	//(right+0.00001) is to fix the precision of the css in html
	if((right+0.00001) >= left) {
		bar.style.width = (width * 100) + '%';
		bar.style.left = ((right  - width) * 100) + '%';
		return true;
	}
	return false;
};



//-- Player--> ControlBar--> BackAnDisplay--> RangeSelectorDisplay--> RangeSelectorLeft

/**
 * Left Time selector
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.RangeSelectorLeft = videojs.Component.extend({
	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
		this.on('mousedown', this.onMouseDown);
		this.on('dblclick', this.ondblclick);
		this.pressed = false;//to know when is mousedown
		this.include = true;//to know when we want to include the boundary time in the selection or not
	}
});

videojs.RangeSelectorLeft.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
	videojs.addClass(this.el_, 'include');
};

videojs.RangeSelectorLeft.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-leftselector-anpanel-annotation',
		innerHTML: '<div class="vjs-selector-arrow"></div><div class="vjs-leftselector-back"></div>'
	});
};


videojs.RangeSelectorLeft.prototype.onMouseDown = function(event) {
	event.preventDefault();
	//videojs.blockTextSelection();
	
	this.pressed = true;
	videojs.on(document, "mouseup", videojs.bind(this,this.onMouseUp));
	videojs.addClass(this.el_, 'active');
	videojs.addClass(this.el_.parentNode, 'active');
};

videojs.RangeSelectorLeft.prototype.onMouseUp = function(event) {
	videojs.off(document, "mouseup", this.onMouseUp, false);
	videojs.removeClass(this.el_, 'active');
	videojs.removeClass(this.el_.parentNode, 'active');
	this.pressed = false;
};

videojs.RangeSelectorLeft.prototype.ondblclick = function(event) {
	if (this.include){
		this.include = false;
		videojs.removeClass(this.el_, 'include');
	}else{
		this.include = true;
		videojs.addClass(this.el_, 'include');
	}
	var left = this.an.rsd.calculateDistance(event);
	this.an.rsd.setPosition(0,left);
};



//-- Player--> ControlBar--> BackAnDisplay--> RangeSelectorDisplay--> RangeSelectorRight

/**
 * Right Time selector
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.RangeSelectorRight = videojs.Component.extend({
	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
		this.on('mousedown', this.onMouseDown);
		this.on('dblclick', this.ondblclick);
		this.pressed = false;//to know when is mousedown
		this.include = true;//to know when we want to include the boundary time in the selection or not
	}
});

videojs.RangeSelectorRight.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
	videojs.addClass(this.el_, 'include');
};

videojs.RangeSelectorRight.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-rightselector-anpanel-annotation',
		innerHTML: '<div class="vjs-selector-arrow"></div><div class="vjs-rightselector-back"></div>'
	});
};

videojs.RangeSelectorRight.prototype.onMouseDown = function(event) {
	event.preventDefault();
	//videojs.blockTextSelection();
	
	this.pressed = true;
	videojs.on(document, "mouseup", videojs.bind(this,this.onMouseUp));
	videojs.addClass(this.el_, 'active');
	videojs.addClass(this.el_.parentNode, 'active');
};

videojs.RangeSelectorRight.prototype.onMouseUp = function(event) {
	videojs.off(document, "mouseup", this.onMouseUp, false);
	videojs.removeClass(this.el_, 'active');
	videojs.removeClass(this.el_.parentNode, 'active');
	this.pressed = false;
};

videojs.RangeSelectorRight.prototype.ondblclick = function(event) {
	if (this.include){
		this.include = false;
		videojs.removeClass(this.el_, 'include');
	}else{
		this.include = true;
		videojs.addClass(this.el_, 'include');
	}
	var left = this.an.rsd.calculateDistance(event);
	this.an.rsd.setPosition(1,left);
};



//-- Player--> ControlBar--> BackAnDisplay--> RangeSelectorDisplay--> RangeSelectorBar

/**
 * Bar to display the selected Time
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
 
videojs.RangeSelectorBar = videojs.Component.extend({
	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
	}
});

videojs.RangeSelectorBar.prototype.init_ = function(){
	videojs.addClass(this.el_,'disable');
};

videojs.RangeSelectorBar.prototype.options_ = {
	children: {
		'RangeSelectorBarL': {},
		'RangeSelectorBarR': {},
	}
};

videojs.RangeSelectorBar.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-barselector-anpanel-annotation',
	});
};



//-- Player--> ControlBar--> BackAnDisplay--> RangeSelectorDisplay--> RangeSelectorBar--> RangeSelectorBarL

/**
 * This is the left time panel for RangeSelectorBar
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.RangeSelectorBarL = videojs.Component.extend({
  /** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
	}
});

videojs.RangeSelectorBarL.prototype.init_ = function(){};

videojs.RangeSelectorBarL.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-barselector-left',
		innerHTML: '<span class="vjs-time-text">00:00</span>'
	});
};



//-- Player--> ControlBar--> BackAnDisplay--> RangeSelectorDisplay--> RangeSelectorBar--> RangeSelectorBarR
/**
 * This is the right time panel for RangeSelectorBar
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.RangeSelectorBarR = videojs.Component.extend({
  /** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
	}
});

videojs.RangeSelectorBarR.prototype.init_ = function(){};

videojs.RangeSelectorBarR.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-barselector-right',
		innerHTML: '<span class="vjs-time-text">00:00</span>'
	});
};



//-- Player--> ControlBar--> BackAnDisplay--> AnDisplay

/**
 * Show the annotations in a panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
 
videojs.AnDisplay = videojs.Component.extend({
	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
		this.on('mousedown', this.onMouseDown);
		this.on('mouseover', this.onMouseOver);
	}
});

videojs.AnDisplay.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
	this.transition = false;
};

videojs.AnDisplay.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-anpanel-annotation',
	});
};

videojs.AnDisplay.prototype.onMouseDown = function(event){
	var elem = $(event.target).parents('.annotator-hl').andSelf(),
		_self = this;
	if (elem.hasClass("annotator-hl")){
		videojs.on(document, "mouseup", videojs.bind(this,this.onMouseUp));
		//Clone the bar box to make the animation
		var boxup = document.createElement('div'),
			ElemTop = parseFloat(elem[1].style.top),
			ElemMargin = parseFloat(elem[1].style.marginTop),
			emtoPx = parseFloat($(elem[1]).css('height'));
			
		boxup.className = "boxup-dashed-line";
		boxup.style.left = elem[1].style.left;
		boxup.style.width = elem[1].style.width;
	
		boxup.style.top = (ElemTop+ElemMargin-this.el_.scrollTop/emtoPx)+'em';
		elem[0].parentNode.parentNode.appendChild(boxup);
	}
}

videojs.AnDisplay.prototype.onMouseUp = function(event){
	if (typeof this.lastelem == 'undefined')
		return false;
	var elem = this.lastelem,
		_self = this;
	if (elem.hasClass("annotator-hl")){
		var annotation = elem.map(function() {
			return $(this).data("annotation");
		})[0];
		var displayHeight = (-1)*parseFloat($(this.el_).parent()[0].style.top),
			emtoPx = parseFloat($(elem[1]).css('height'));
		if (typeof $(elem).parent().parent().find('.boxup-dashed-line')[0]!='undefined'){
			$(elem).parent().parent().find('.boxup-dashed-line')[0].style.top=(displayHeight-2)+'em';
		}
		
		this.an.player.pause();
		this.transition = true;
		window.setTimeout(function () {
			_self.an.showAnnotation(annotation);
			_self.transition = false;
			_self.onCloseViewer();
		}, 900);
	}
	videojs.off(document, "mouseup", this.onMouseUp, false);
};

videojs.AnDisplay.prototype.onMouseOver = function(event){
	if (!this.transition && !this.an.rsdl.pressed && !this.an.rsdr.pressed){
		var annotator = this.an.annotator;
		var elem = $(event.target).parents('.annotator-hl').andSelf();
	
		//if there is a opened annotation then show the new annotation mouse over
		if (typeof annotator!='undefined' && annotator.viewer.isShown() && elem.hasClass("annotator-hl")){
			//hide the last open viewer
			annotator.viewer.hide();
			//get the annotation over the mouse
			var annotations = elem.map(function() {
				return $(this).data("annotation");
			});
			//show the annotation in the viewer
			annotator.showViewer($.makeArray(annotations), Util.mousePosition(event, annotator.wrapper[0]));
		}
	
		//create dashed line
		elem.addClass('active');
		if (typeof elem != 'undefined' && $(elem[1]).hasClass('annotation')){
			//create dashed line under the bar
			var dashed = document.createElement('div'),
				boxdown = document.createElement('div'),
				DisplayHeight = parseFloat(this.an.BackAnDisplay.el_.style.height),
				ElemMarginTop = elem[1].style.marginTop!=''?parseFloat(elem[1].style.marginTop):0;
				ElemTop = parseFloat(elem[1].style.top)+ElemMarginTop,
				emtoPx = parseFloat($(elem[1]).css('height'));
			dashed.className = "dashed-line";
			boxdown.className = "box-dashed-line";
			dashed.style.left = boxdown.style.left = elem[1].style.left;
			dashed.style.width = boxdown.style.width = elem[1].style.width;
			dashed.style.top = ((ElemTop+1)-this.el_.scrollTop/emtoPx)+'em';
			dashed.style.height = ((DisplayHeight-ElemTop+1)+this.el_.scrollTop/emtoPx)+'em';//get the absolute value of the top to put in the height
			boxdown.style.top = (DisplayHeight+1)+'em';
			elem[0].parentNode.parentNode.appendChild(dashed);
			elem[0].parentNode.parentNode.appendChild(boxdown);
			
			$(this.player).find('.vjs-play-progress').css('z-index', 2);
			$(this.player).find('.vjs-seek-handle').css('z-index', 2);
		}
	
		//store the last selected item
		if (elem.hasClass("annotator-hl"))
			this.lastelem = elem;
	}
};

videojs.AnDisplay.prototype.onCloseViewer = function(){
	if (!this.transition){
		if (typeof this.lastelem != 'undefined')
			this.lastelem.removeClass('active');
		//remove dashed line
		if (typeof this.lastelem != 'undefined' && this.lastelem.hasClass("annotator-hl")){
			$(this.lastelem).parent().parent().find('.dashed-line').remove();
			$(this.lastelem).parent().parent().find('.box-dashed-line').remove();
			$(this.lastelem).parent().parent().find('.boxup-dashed-line').remove();
			$(this.player).find('.vjs-play-progress').css('z-index', "");
			$(this.player).find('.vjs-seek-handle').css('z-index', "");
		}
	}
};



//-- Player--> ControlBar--> BackAnDisplayScroll

/**
 * The background annotations panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
 
videojs.BackAnDisplayScroll = videojs.Component.extend({
  	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
		this.on('mousedown', this.onMouseDown);
		this.UpValue = 0.1;
		this.currentValue = 0;
	}
});

videojs.BackAnDisplayScroll.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
	this.mousedownID = -1;
	var self = this,
		direction;
		
	//Firefox
	$(this.an.AnDisplay.el_).bind('DOMMouseScroll', function(e){
		if(e.originalEvent.detail > 0)
			direction = self.UpValue;
		else 
			direction = -self.UpValue;
		self.an.backDSBarSel.setPosition(self.getPercentScroll()+direction);
		return false;
	});

	//IE, Opera, Safari
	$(this.an.AnDisplay.el_).bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) 
			direction = self.UpValue;
		else 
			direction = -self.UpValue;
		self.an.backDSBarSel.setPosition(self.getPercentScroll()+direction);
		return false;
	});
};

videojs.BackAnDisplayScroll.prototype.options_ = {
	children: {
		'BackAnDisplayScrollBar': {},
	}
};

videojs.BackAnDisplayScroll.prototype.createEl = function(){
  return videojs.Component.prototype.createEl.call(this, 'div', {
    className: 'vjs-scroll-anpanel-annotation',
    innerHTML: '<div class="vjs-up-scroll-annotation"></div><div class="vjs-down-scroll-annotation"></div>',
  });
};

videojs.BackAnDisplayScroll.prototype.onMouseDown = function(event){
	var self = this;
	if (event.target.className == 'vjs-scrollbar-anpanel-annotation'){
		//change position with a click in the scrollbar
		this.an.backDSBarSel.onMouseMove(event);
		return false;
	}else if (event.target.className == 'vjs-scrollbar-selector'){
		//change position with scrollbar
		//this event is controlled by this.an.backDSBarSel
		return false;
	}else{
		//change position with arrows
		var direction = event.target.className=='vjs-down-scroll-annotation'?this.UpValue:-this.UpValue;
		videojs.on(document, "mouseup", videojs.bind(this,this.onMouseUp));
		if(this.mousedownID==-1)  //Prevent multimple loops!
			this.mousedownID = setInterval(function () {
				self.an.backDSBarSel.setPosition(self.getPercentScroll()+direction);
			},100);
	}
};

videojs.BackAnDisplayScroll.prototype.onMouseUp = function(event){
	videojs.off(document, "mouseup", this.onMouseUp, false);
	var self = this;
	if(this.mousedownID!=-1) {  //Only stop if exists
		clearInterval(this.mousedownID);
		self.mousedownID=-1;
	}
};

videojs.BackAnDisplayScroll.prototype.getPercentScroll = function(){
	var scroll = this.an.AnDisplay.el_,
		maxscroll = scroll.scrollHeight-scroll.offsetHeight,
		currentValue = scroll.scrollTop;
	return Math.max(0, Math.min(1, maxscroll != 0 ?(currentValue / maxscroll):0));
};

videojs.BackAnDisplayScroll.prototype.setPercentScroll = function(percent){
	var scroll = this.an.AnDisplay.el_,
		maxscroll = scroll.scrollHeight-scroll.offsetHeight;
	percent = Math.max(0, Math.min(1, percent?percent:0));
	scroll.scrollTop = (maxscroll*percent);
};



//-- Player--> ControlBar--> BackAnDisplayScroll--> BackAnDisplayScrollBar

/**
 * The Scroll bar for the display
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
 
videojs.BackAnDisplayScrollBar = videojs.Component.extend({
  	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
	}
});

videojs.BackAnDisplayScrollBar.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
};

videojs.BackAnDisplayScrollBar.prototype.options_ = {
	children: {
		'ScrollBarSelector': {},
	}
};

videojs.BackAnDisplayScrollBar.prototype.createEl = function(){
  return videojs.Component.prototype.createEl.call(this, 'div', {
    className: 'vjs-scrollbar-anpanel-annotation',
  });
};



//-- Player--> ControlBar--> BackAnDisplayScroll--> BackAnDisplayScrollBar--> ScrollBarSelector

/**
 * The Scroll bar for the display
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
 
videojs.ScrollBarSelector = videojs.Component.extend({
  	/** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
		this.on('mousedown', this.onMouseDown);
	}
});

videojs.ScrollBarSelector.prototype.init_ = function(){
	this.rs = this.player_.rangeslider;
	this.an = this.player_.annotations;
	videojs.addClass(this.an.backDSBar.el_, 'disable');
};


videojs.ScrollBarSelector.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'div', {
		className: 'vjs-scrollbar-selector',
	});
};

videojs.ScrollBarSelector.prototype.onMouseDown = function(event){
	event.preventDefault();
	//videojs.blockTextSelection();
	videojs.on(document, "mousemove", videojs.bind(this,this.onMouseMove));
	videojs.on(document, "mouseup", videojs.bind(this,this.onMouseUp));
}

videojs.ScrollBarSelector.prototype.onMouseUp = function(event){
	videojs.off(document, "mousemove", this.onMouseMove, false);
	videojs.off(document, "mouseup", this.onMouseUp, false);
};

videojs.ScrollBarSelector.prototype.onMouseMove = function(event){
	var top = this.calculateDistance(event);
	top = this.parseMaxPercent(top); //set the max value fixing the height of the handle
	this.setPosition(top);
}

videojs.ScrollBarSelector.prototype.calculateDistance = function(event){
	var scrollY = this.getscrollY();
	var scrollH = this.getscrollHeight();
	var handleH = this.getHeight();
	
	// Adjusted X and Width, so handle doesn't go outside the bar
	scrollY = scrollY + (handleH);
	scrollH = scrollH - (handleH);
	// Adjusted X and Width, so handle doesn't go outside the bar
	// Percent that the click is through the adjusted area
	return Math.max(0, Math.min(1, (event.pageY - scrollY) / scrollH));
};

videojs.ScrollBarSelector.prototype.getscrollHeight = function() {
	return this.el_.parentNode.offsetHeight;
};
videojs.ScrollBarSelector.prototype.getscrollY = function() {
	return videojs.findPosition(this.el_.parentNode).top;
};
videojs.ScrollBarSelector.prototype.getHeight = function() {
	return this.el_.offsetHeight;
};
videojs.ScrollBarSelector.prototype.parseMaxHeight = function(top){
	var scrollH = this.getscrollHeight(),
		handleH = this.getHeight(),
		percent = handleH / scrollH;
	return Math.max(0,Math.min(1-percent, top));
};

videojs.ScrollBarSelector.prototype.parseMaxPercent = function(top){
	var scrollH = this.getscrollHeight(),
		handleH = this.getHeight(),
		percent = handleH / scrollH,
		newTop = top;
	if(top >= (1-percent))
		newTop = 1;
	return newTop;
};

videojs.ScrollBarSelector.prototype.setPosition = function(top,showBar){
	var showBar = typeof showBar != 'undefined'?showBar:true;
	
	// Check for invalid position
	if(isNaN(top)) 
		return false;
		
	// Show the Scrollbar
	if(showBar){
		videojs.removeClass(this.an.backDSBar.el_, 'disable')
	}
	
	// Alias
	var Obj = this.el_,
		scroll = this.an.BackAnDisplayScroll;
	
	Obj.style.top = (this.parseMaxHeight(top) * 100) + '%';
	scroll.setPercentScroll(top);
	
	//Hide the Scrollbar in 1 sec
	if(showBar){
		var _self = this;
		if (typeof this.Timeout!='undefined')
			clearTimeout(this.Timeout);
		this.Timeout = window.setTimeout(function () {
			videojs.addClass(_self.an.backDSBar.el_, 'disable');
		}, 1000);
	}
	
	//set current position
	this.an.BackAnDisplayScroll.currentValue = top;
	return true;
}



})();



//----------------Plugin for Annotator to setup for videojs----------------//

Annotator.Plugin.VideoJS = (function(_super) {
	__extends(VideoJS, _super);

	//constructor
	function VideoJS() {
		this.pluginSubmit = __bind(this.pluginSubmit, this);
		this.updateField = __bind(this.updateField, this);
		_ref = VideoJS.__super__.constructor.apply(this, arguments);
		this.__indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }
		return _ref;
	}

	VideoJS.prototype.field = null;
	VideoJS.prototype.input = null;

	VideoJS.prototype.pluginInit = function() {
		console.log("VideoJS-pluginInit");
		//Check that annotator is working
		if (!Annotator.supported()) {
			return;
		}
		
		//-- Editor
		this.field = this.annotator.editor.addField({
			id: 'vjs-input-rangeTime-annotations',
			type: 'input', //options (textarea,input,select,checkbox)
			//load: this.updateField, //function will load before open the Editor
			submit: this.pluginSubmit,
			EditVideoAn: this.EditVideoAn
		});
		
		//Modify the element created with annotator to be an invisible span
		var select = '<li><span id="vjs-input-rangeTime-annotations"></span></li>',
			newfield = Annotator.$(select);
		Annotator.$(this.field).replaceWith(newfield);
		this.field=newfield[0];
		
		//-- Viewer
		this.annotator.viewer.addField({
			load: this.updateViewer
		});
		
		//-- Listener for Open Video Annotator
		this.initListeners();
		
		return this.input = $(this.field).find(':input');
	};

	
	
	//-- Editor Methods
	VideoJS.prototype.updateField = function(field, annotation) {
		console.log("Plug-updateField");
	};
	

	// New JSON for the database
	VideoJS.prototype.pluginSubmit = function(field, annotation) {
		console.log("Plug-pluginSubmit");
		//Select the new JSON for the Object to save
		if (this.EditVideoAn()){
			var index = this.annotator.editor.VideoJS,
				player = this.annotator.mplayer[index],
				rs = player.rangeslider,
				time = rs.getValues(),
				ext;
			annotation.media = "video"; // - media
			annotation.target = annotation.target || {}; // - target
			annotation.target.container = player.id_ || ""; // - target.container
			annotation.target.src = player.options_.sources[0].src || ""; // - target.src (media source)
			ext = (player.options_.sources[0].src.substring(player.options_.sources[0].src.lastIndexOf("."))).toLowerCase(); 
			annotation.target.ext = ext || ""; // - target.ext (extension)
			annotation.rangeTime = 	annotation.rangeTime || {};	// - rangeTime
			annotation.rangeTime.start = time.start || 0; // - rangeTime.start
			annotation.rangeTime.end = time.end || 0; // - rangeTime.end
			annotation.updated = new Date().toISOString(); // - updated
			if (typeof annotation.created == 'undefined')
				annotation.created = new Date().toISOString(); // - created
		}else{
			if (typeof annotation.media == 'undefined')
				annotation.media = "text"; // - media
		}
		return annotation.media;
	};
	
	

	//-- Viewer Methods
	VideoJS.prototype.updateViewer = function(field, annotation) {
		console.log("Plug-updateViewer");
		
	};
	
	
	//------ Methods	------//
	//Detect if we are creating or editing a video-js annotation
	VideoJS.prototype.EditVideoAn =  function (){
		var wrapper = $('.annotator-wrapper').parent()[0],
			annotator = window.annotator = $.data(wrapper, 'annotator'),
			isOpenVideojs = (typeof annotator.mplayer != 'undefined'),
			VideoJS = annotator.editor.VideoJS;
		return (isOpenVideojs && typeof VideoJS!='undefined' && VideoJS!==-1);
	};
	
	
	//Detect if the annotation is a video-js annotation
	VideoJS.prototype.isVideoJS = function (an){
		var wrapper = $('.annotator-wrapper').parent()[0],
			annotator = window.annotator = $.data(wrapper, 'annotator'),
			rt = an.rangeTime,
			isOpenVideojs = (typeof annotator.mplayer != 'undefined'),
			isVideo = (typeof an.media!='undefined' && an.media=='video'),
			isNumber = (typeof rt!='undefined' && !isNaN(parseFloat(rt.start)) && isFinite(rt.start) && !isNaN(parseFloat(rt.end)) && isFinite(rt.end));
		return (isOpenVideojs && isVideo && isNumber);
	};
	
	//Delete Video Annotation
	VideoJS.prototype._deleteAnnotation = function(an){
		var target = an.target || {},
			container = target.container || {},
			annotator = this.annotator,
			player = annotator.mplayer[container],
			annotations = player.annotations,
			index;
		index = this.__indexOf.call(player.allannotations, an);
		if (index >= 0) {
			//Remove the annotation element from the display
			if (typeof player.allannotations[index] != 'undefined')
				delete player.allannotations[index]; //remove the object
			
			
			player.rangeslider.hide(); //Hide Range Slider
			annotations.refreshDisplay(); //Reload the display of annotation
		}
	};
	
	
	//--Listeners
	VideoJS.prototype.initListeners = function (){
		var wrapper = $('.annotator-wrapper').parent()[0],
			annotator = $.data(wrapper, 'annotator');
		var EditVideoAn = this.EditVideoAn,
			isVideoJS = this.isVideoJS,
			self = this;
		
			
		this.annotator
			//-- Editor
			.subscribe("annotationEditorShown", function (editor,annotation) {
				console.log("annotationEditorShown");
				for (var index in annotator.an){
					annotator.an[index].editAnnotation(annotation,editor);
				}
			})
			.subscribe("annotationEditorHidden", function (editor) {
				console.log("annotationEditorHidden");
				
				if (EditVideoAn()){
					var index = annotator.editor.VideoJS;
					annotator.mplayer[index].rangeslider.hide(); //Hide Range Slider
					annotator.an[index].refreshDisplay(); //Reload the display of annotations
				}

				annotator.editor.VideoJS=-1;
			})
			//-- Annotations
			.subscribe("annotationDeleted", function (annotation) {
				console.log("annotationDeleted");
				
				if (isVideoJS(annotation))
					self._deleteAnnotation(annotation);
			})
			//-- Viewer
			.subscribe("annotationViewerShown", function (viewer,annotations) {
				console.log("annotationViewerShown");
				
				var separation = viewer.element.hasClass(viewer.classes.invert.y)?5:-5,
					newpos = {
						top: parseFloat(viewer.element[0].style.top)+separation,
						left: parseFloat(viewer.element[0].style.left)
					};
				viewer.element.css(newpos);
				
				//Remove the time to wait until disapear, to be more faster that annotator by default
				viewer.element.find('.annotator-controls').removeClass(viewer.classes.showControls);
			});
			
		this.annotator.viewer
			.subscribe("hide", function (){
				for (var index in annotator.an){
					annotator.an[index].AnDisplay.onCloseViewer();
				}
			});
	};
	return VideoJS;

})(Annotator.Plugin);



//----------------PUBLIC OBJECT TO CONTROL THE ANNOTATIONS----------------//

//The name of the plugin that the user will write in the html
OpenVideoAnnotation = ("OpenVideoAnnotation" in window) ? OpenVideoAnnotation : {};

OpenVideoAnnotation.Annotator = function (element, options) {
	//local variables
	var $ = jQuery,
		options = options || {};
	options.optionsAnnotator = options.optionsAnnotator || {};
	options.optionsVideoJS = options.optionsVideoJS || {};
	options.optionsRS = options.optionsRS || {};
	options.optionsOVA = options.optionsOVA || {};
	
	
	//if there isn't store optinos it will create a uri and limit variables for the Back-end of Annotations 
	var store = options.optionsAnnotator.store;
	if (typeof store=='undefined')
		options.optionsAnnotator.store = {};
	if (typeof store.annotationData=='undefined')
		store.annotationData = {};
	if (typeof store.annotationData.uri=='undefined'){
		var uri = location.protocol + '//' + location.host + location.pathname;
		store.annotationData.store = {uri:uri};
	}
	if (typeof store.loadFromSearch=='undefined')
		store.loadFromSearch={};
	if (typeof store.loadFromSearch.uri=='undefined')
		store.loadFromSearch.uri = uri;
	if (typeof store.loadFromSearch.limit=='undefined')
		store.loadFromSearch.limit = 10000;
	
	//global variables
	this.currentUser = null;

	//-- Init all the classes --/
	//Annotator
	this.annotator = $(element).annotator().data('annotator');
	
	
	//Video-JS
	/*	
		mplayers -> Array with the html of all the video-js
		mplayer -> Array with all the video-js that will be in the plugin
	*/
    var mplayers = $(element).find('div .video-js').toArray();
    var mplayer = this.mplayer = {};
	for (var index in mplayers){
		var id = mplayers[index].id;
		var mplayer_ = videojs(mplayers[index],options.optionsVideoJS);
		//solve a problem with firefox. In Firefox the src() function is loaded before charge the optionsVideoJS, and the techOrder are not loaded
		if (vjs.IS_FIREFOX && typeof options.optionsVideoJS.techOrder !='undefined'){
			mplayer_.options_.techOrder = options.optionsVideoJS.techOrder;
			mplayer_.src(mplayer_.options_['sources']);
		}
    	this.mplayer[id] = mplayer_;
    }
	
	
	//Video-JS
	this.annotator.an = {}; //annotations video-js plugin to annotator
	for (var index in this.mplayer){
		//to be their own options is necessary to extend deeply the options with all the childrens
		this.mplayer[index].rangeslider($.extend(true, {}, options.optionsRS));
		this.mplayer[index].annotations($.extend(true, {}, options.optionsOVA));
		this.annotator.an[index]=this.mplayer[index].annotations;
	}

	
	//-- Experimental Global function for Open Video Annotator --//
	this.setCurrentUser = function (user) {
		this.currentUser = user;
		this.annotator.plugins["Permissions"].setUser(user);
	}
	
	//Local function to setup the keyboard listener
	var focusedPlayer = this.focusedPlayer = '',//variable to know the focused player
		lastfocusPlayer = this.lastfocusPlayer = ''; 
	
	function onKeyUp(e){
		//skip the text areas
		if (e.target.nodeName.toLowerCase()!='textarea')
			mplayer[focusedPlayer].annotations.pressedKey(e.which);
	};
	
	;(this._setupKeyboard = function(){
		$(document).mousedown(function(e) {
			focusedPlayer = '';
			
			//Detects if a player was click
			for (var index in mplayer){
				if($(mplayer[index].el_).find(e.target).length)
					focusedPlayer = mplayer[index].id_;
			}
			
			//Enter if we change the focus between player or go out of the player
			if(lastfocusPlayer != focusedPlayer){
				$(document).off("keyup", onKeyUp);//Remove the last listener
				//set the key listener
				if(focusedPlayer!='')
					$(document).on("keyup", onKeyUp);
			}
			
			lastfocusPlayer = focusedPlayer;
		});
		
	})(this);
	
	//-- Activate all the plugins --//
	// Annotator
	this.annotator.addPlugin("Permissions", options.optionsAnnotator.user);
	this.annotator.addPlugin("Store", options.optionsAnnotator.store);
	this.annotator.addPlugin("Tags");
	this.annotator.addPlugin("Share");
	this.annotator.addPlugin("VideoJS");
	//Will be add the player and the annotations plugin for video-js in the annotator
	this.annotator.mplayer = this.mplayer;
	this.annotator.editor.VideoJS=-1;
	
	return this;
}



//----------------Public Functions for Open Video Annotator----------------//

//Create a new video annotation
OpenVideoAnnotation.Annotator.prototype.newVideoAn = function(idElem){
	return this.mplayer[idElem].annotations.newan();
};

//Show the annotation display
OpenVideoAnnotation.Annotator.prototype.showDisplay = function(idElem){
	return this.mplayer[idElem].annotations.showDisplay();
};

//Hide the annotation display
OpenVideoAnnotation.Annotator.prototype.hideDisplay = function(idElem){
	return this.mplayer[idElem].annotations.hideDisplay();
};

//Refresh the annotation display
OpenVideoAnnotation.Annotator.prototype.refreshDisplay = function(idElem){
	return this.mplayer[idElem].annotations.hideDisplay();
};

//Set the position of the big new annotation button
OpenVideoAnnotation.Annotator.prototype.setposBigNew = function(idElem,position){
	return this.mplayer[idElem].annotations.setposBigNew(position);
};


