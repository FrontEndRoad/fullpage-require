requirejs.config({
	baseUrl:'./js',
	paths: {
		zepto: 'zepto.min',
		touch: 'touch',
		fullpage: 'gx.fullpage'
	},
	shim: {}
})

require(['zepto','touch','fullpage'],function(zepto){
	$('.page').fullpage({
		horiNav: true,    //水平导航
		loop: {			  //循环
			h: false,      //水平
			v: true      //垂直
		},
		orient: true,
		music: true,
		musicSrc: 'music/1.mp3'
	})
})