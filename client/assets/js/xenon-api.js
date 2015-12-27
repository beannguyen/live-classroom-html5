/**
 *	Xenon API Functions
 *
 *	Theme by: www.laborator.co
 **/


function rtl() // checks whether the content is in RTL mode
{
	if(typeof window.isRTL == 'boolean')
		return window.isRTL;
		
	window.isRTL = jQuery("html").get(0).dir == 'rtl' ? true : false;
	
	return window.isRTL;
}



// Page Loader
function show_loading_bar(options)
{
	var defaults = {
		pct: 0, 
		delay: 1.3, 
		wait: 0,
		before: function(){},
		finish: function(){},
		resetOnEnd: true
	};
	
	if(typeof options == 'object')
		defaults = jQuery.extend(defaults, options);
	else
	if(typeof options == 'number')
		defaults.pct = options;
		
	
	if(defaults.pct > 100)
		defaults.pct = 100;
	else
	if(defaults.pct < 0)
		defaults.pct = 0;
	
	var $ = jQuery,
		$loading_bar = $(".xenon-loading-bar");
	
	if($loading_bar.length == 0)
	{
		$loading_bar = $('<div class="xenon-loading-bar progress-is-hidden"><span data-pct="0"></span></div>');
		public_vars.$body.append( $loading_bar );
	}
	
	var $pct = $loading_bar.find('span'),
		current_pct = $pct.data('pct'),
		is_regress = current_pct > defaults.pct;
	
	
	defaults.before(current_pct);
	
	TweenMax.to($pct, defaults.delay, {css: {width: defaults.pct + '%'}, delay: defaults.wait, ease: is_regress ? Expo.easeOut : Expo.easeIn,
	onStart: function()
	{
		$loading_bar.removeClass('progress-is-hidden');
	},
	onComplete: function()
	{
		var pct = $pct.data('pct');
		
		if(pct == 100 && defaults.resetOnEnd)
		{
			hide_loading_bar();
		}
		
		defaults.finish(pct);
	}, 
	onUpdate: function()
	{
		$pct.data('pct', parseInt($pct.get(0).style.width, 10));
	}});
}

function hide_loading_bar()
{
	var $ = jQuery,
		$loading_bar = $(".xenon-loading-bar"),
		$pct = $loading_bar.find('span');
	
	$loading_bar.addClass('progress-is-hidden');
	$pct.width(0).data('pct', 0);
}

function initSlimScroll (el, ops) {
    $(el).each(function() {
        if ($(this).attr("data-initialized")) {
            return; // exit
        }

        var height;

        if ($(this).attr("data-height")) {
            height = $(this).attr("data-height");
        } else {
            height = $(this).css('height');
        }
        $(this).slimScroll({
            allowPageScroll: false, // allow page scroll when the element scroll is ended
            size: '7px',
            color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
            wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
            railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
            position: 'right',
            height: height,
            alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
            railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
            disableFadeOut: true
        });

        $(this).attr("data-initialized", "1");
    });
}