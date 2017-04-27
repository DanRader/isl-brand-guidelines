import $ from 'jquery'
import 'foundation'
import 'foundation-mediaquery'

// ----------------------------------------------
// Scroll Spy Module
// ----------------------------------------------
var scrollSpy = ( function( window, undefined ) {

    // --------------------------------------------------------
    // Module Config
    var $navEl             = $('#js-nav');
    var menuY              = $navEl.offset().top;
    var latestKnownScrollY = 0;
    var ticking            = false;
    var $navLinkEl         = $('.Nav-item a');

    // Module Init -- event handlers and kick off functions
    function init() {
        // event handlers
        window.addEventListener('scroll', onScroll, false);
        $navLinkEl.click(function(e){smoothScroll($(this),e)});

        //
    }
    // --------------------------------------------------------


    // Set the
    function onScroll() {
        //console.log('scroll');
        latestKnownScrollY = window.scrollY;
        requestTick();
    }

    //
    function requestTick() {
        if(!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }

    function update() {
        ticking = false;
        var currentScrollY = latestKnownScrollY;
        //console.log(currentScrollY)

        if (currentScrollY > menuY) {
            $navEl.addClass('fixed');
        } else {
            $navEl.removeClass('fixed');
        }
    }

    function smoothScroll($link,e){

       //console.log($link.attr('href'));
        var navLinkTarget = $link.attr('href');
        var $navLinkTargetEl = $(navLinkTarget);
        if($navLinkTargetEl) {
            e.preventDefault();
            var scrollToY = $(navLinkTarget).offset().top;
            console.log(scrollToY);
            $('html, body').animate({scrollTop: scrollToY - 40 }, 'slow');

        }
    }

  // explicitly return public methods when this object is instantiated
  return {
    init : init,
   // onScroll : onScroll,
    //someOtherMethod : myOtherMethod
  };

} )( window );

scrollSpy.init();

//--------------

