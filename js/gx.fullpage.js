/*
* @ Name:      移动全屏滑动效果（水平、垂直、导航、设置循环等），附加图片预加载，横竖屏判断，背景音乐
* @ Author:    繁花落尽
* @ Time:      2015/4/20
* @ CopyRight: 最终版权归国信所有

调用方法：
$('.page').fullpage({
	horiNav: true,    //水平导航  true有  false无
	loop: {			  //循环       
		h: false,      //水平     true有  false无
		v: true        //垂直     true有  false无
	},
	orient: true,                 //true有  false无
	music: true,                  //true有  false无
	musicSrc: 'music/1.mp3'       //背景音乐
})
*/
if(typeof Zepto == 'undefined'){
	throw new Error('gx.fullpage.js\'s script requires Zepto');
}
(function($) {
	"use strict";
	$.fn.fullpage = function(options){
		var pg = $(this);
		var maxRow = pg.eq(pg.length-1).attr('class').split('page-')[1].split(' hide')[0].split('-')[0];            //纵向数目 
		var cols = [];
		pg.each(function(i){
			var cla = $(this).attr('class');
			cols.push(cla.split('page-')[1].split(' hide')[0].split('-')[1]);
		})

		var newCol = [];                      //横向数目 
		for(var i=0; i<cols.length; i++){
			if(cols[i]==1 && i!=0){
				newCol.push(cols[i-1]);
			}
		}
		newCol.push(cols[cols.length-1])


		var opt = $.extend({}, options),     //$.extend 通过源对象扩展目标对象属性
			loop_h = opt.loop.h,
			loop_v = opt.loop.v,
			nav = opt.horiNav,
			orient = opt.orient,
			music = opt.music,
			musicSrc = opt.musicSrc,
			r = maxRow || 3,
			c = newCol || 1,
			now_row = 1,
			now_col = 1,
			last_row = 0,
			last_col = 0,
			up = 1,
			right = 2,
			down = 3,
			left = 4;

		var message = {
			isAnimating: false,
			outClass: null,
			inClass: null,
			nowPage: null,
			lastPage: null,
			et: null,
			init: function(){
				var imgs = $('img');
				if(imgs.length!=0){
					this.loading(imgs, this.main());
				}else{
					this.main()
				}
			},
			main: function(){
				var ths = this;

				this.orientChange();

				var horiRow = c[now_row-1];
				if(horiRow>1){
					this.navi(horiRow, 0);
				}

				this.arr(now_row);

				this.bgMusic();

				$(document).on('touchmove',function(event){
					var event = window.event || event;
					event.preventDefault();
				})

				$(document).on('swipeUp',function(){
					ths.swipeUp();
				})

				$(document).on('swipeDown',function(){
					ths.swipeDown();
				})

				$(document).on('swipeLeft',function(){
					ths.swipeLeft();
				})

				$(document).on('swipeRight',function(){
					ths.swipeRight();
				})
			},
			swipeUp: function(){
				if (this.isAnimating) return;
				last_row = now_row;
				last_col = now_col;

				console.log('up:'+last_row)

				if(last_row == r){
					if(loop_v){
						now_row = 1;
						now_col = 1;

						this.navi(c[now_row-1], 0);
						this.pageMove(up);
					}
				}else{
					now_row = last_row + 1;
					now_col = 1;

					this.arr(now_row);
					this.navi(c[now_row-1], 0);
					this.pageMove(up);
				}
			},
			swipeDown: function(){
				if (this.isAnimating) return;
				last_row = now_row;
				last_col = now_col;
				
				console.log('down:'+last_row)

				if (last_row == 1){
					if(loop_v){
						now_row = r;
						last_row = 1;
						now_col = 1;
						
						this.navi(c[now_row-1], 0);
						this.pageMove(down);
					}
				}else{
					now_row = last_row - 1;
					now_col = 1;

					this.navi(c[now_row-1], 0);
					this.pageMove(down);
				}
				this.arr(now_row);
			},
			swipeLeft: function(){
				if (this.isAnimating) return;
				last_row = now_row;
				last_col = now_col;

				//console.log('left_c:'+this.c)
				var horiRow = c[now_row-1];

				if(now_col == horiRow){
					if(loop_h){
						console.log('left loop')
						now_col = 1;

						this.navi(horiRow, now_col-1);

						if(horiRow>1){
							this.pageMove(left);	
						}	
					}
				}else{
					now_col = last_col+1;

					this.navi(horiRow, now_col-1);
					this.pageMove(left);				
				}
			},
			swipeRight: function(){
				if (this.isAnimating) return;
				last_row = now_row;
				last_col = now_col;

				var horiRow = c[now_row-1];
				if(now_col == 1){
					if(loop_h){
						console.log('right loop')
						now_col = horiRow;

						this.navi(horiRow, now_col-1);

						if(horiRow>1){
							this.pageMove(right);	
						}
					}
				}else{
					now_col = last_col-1;

					this.navi(horiRow, now_col-1);
					this.pageMove(right);
				}
			},
			pageMove: function(tw,n){
				var ths = this;
				var outClass = this.outClass;
				var inClass = this.inClass;
				var nowPage = this.nowPage;
				var lastPage = this.lastPage;

				nowPage = ".page-" + now_row + "-" + now_col;
				lastPage = ".page-" + last_row + "-" + last_col;
				switch (tw) {
					case up:
						outClass = 'pt-page-rotateCubeTopOut';
						inClass = 'pt-page-rotateCubeTopIn';
						break;
					case right:
						outClass = 'pt-page-moveToRight';
						inClass = 'pt-page-moveFromLeft';
						break;
					case down:
						outClass = 'pt-page-rotateCubeBottomOut';
						inClass = 'pt-page-rotateCubeBottomIn';
						break;
					case left:
						outClass = 'pt-page-moveToLeft';
						inClass = 'pt-page-moveFromRight';
						break;
				}
				this.isAnimating = true;

				$(nowPage).removeClass("hide").addClass(inClass);
				$(lastPage).addClass(outClass);

				setTimeout(function() {
					$(lastPage).removeClass('page-current');
					$(lastPage).removeClass(outClass);
					$(lastPage).addClass("hide");
					$(lastPage).find("img").addClass("hide");

					$(nowPage).addClass('page-current');
					$(nowPage).removeClass(inClass);
					$(nowPage).find("img").removeClass("hide");

					ths.isAnimating = false;
				}, 600);
			},
			navi: function(num,n){
				if(nav){
					var hori = '<ul class="horiNav"></ul>';
					var htm = '';
					if(num>1){
						for(var i=0; i<num; i++){
							htm += '<li></li>';
						}
					}

				
					if($('.horiNav').length==0){
						$('body').append(hori)
					}
					$('.horiNav').html(htm)
				}
				$('.horiNav li').eq(n).addClass('on');
			},
			arr: function(n){
				var htm = '<img src="images/icon_up.png" alt="" class="arrTop pt-page-moveIconUp">';
				if($('.arrTop').length==0){
					$('body').append(htm);	
				}
				if(n == r){
					if(!loop_v) {
						$('.arrTop').remove();
					}
				}
			},
			loading: function(imgArr,callback){
				var ths = this;
				var load = '<div class="loading"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>';
				$('body').append(load);
				var n = 0;
				var temp  = [];
				for(var i=0; i<imgArr.length; i++){
					temp[i] = imgArr[i];
					temp[i].src = imgArr.eq(i).attr('src');
					if(imgArr[i].complete){
						n++;
					}else{
						imgArr[i].onload = function(){
							n++;
						}
					}

					if(ths.et==null){
						ths.et = setInterval(function(){
							if(n==imgArr.length){
								clearInterval(ths.et);
								ths.et = null;
								$('.loading').hide();
								callback;
							}
						},1000)
					}
				}
			},
			checkDirect: function(){
				var orient = '<div class="orient">请竖屏浏览，效果更侍</div>';
				if($('.orient').length==0){
					$('body').append(orient);
				}
				if($(window).height() < $(window).width()){
					$('.orient').show();
				}else{
					$('.orient').hide();
				}
			},
			orientChange: function(){
				var ths = this;
				if(this.orient){
					ths.checkDirect();
					window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
				    	ths.checkDirect();
				    }, false);
				}
			},
			bgMusic: function(){
				var flag = true;
				var isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i);
				var htm = '<div id="music" class="music" data-play="play"><img src="images/open.png" alt="" class="mIco"><audio class="aud" id="aud" src="'+musicSrc+'" controls loop preload autoplay></audio></div>';

				if(music){
					if($('#music').length==0){
						$('body').append(htm);
					}
				}


				$('#aud')[0].play();
				$('.mIco').attr('src','images/open.png');
				$('#music').attr('data-play','play');

				if(isIos){
					$(document).on('tap',function(){
						console.log('IOS swipe')
						$('#aud')[0].play();
						$('.mIco').attr('src','images/open.png');
						$('#music').attr('data-play','play');
					})
				}else{
					console.log('Aniroid')
				}

				$('.mIco').on('tap',function(){
					var ths = $(this);
					var par = ths.parent('#music');
					var plays = par.attr('data-play');
					if(plays=='play'){
						$('#aud')[0].pause();
						ths.attr('src','images/close.png');
						par.attr('data-play','stop')
					}else if(plays=='stop'){
						$('#aud')[0].play();
						ths.attr('src','images/open.png');
						par.attr('data-play','play')
					}
				})
			}
		}

		message.init();
	}
})(Zepto);

