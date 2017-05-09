import $ from 'jquery'

// FIXED SINGLEPAGE SMOOTH SCROLLER
// ------
/* NOTE, if you're using jQuery before 3.0, animate() may causes performance issues because it doesn't use
   requestAnimationFrame. If that's the case I highly reccomend you check out velocityjs -- exact same syntex, just
   better performance.  Link: velocityjs.org
*/
jQuery(document).ready(function ($) {

    // -----------------------------------
    // Global Config Variables
    // ------------------------------------
    // - nav
    var $nav             = $('#js-nav'); // the main navigation wrapper
    var $navItem         = $('.js-smooth-scroll'); // the link you're targeting
    var navOffsetSpacer  = 0;
    var fixedClass       = 'fixed'; // what class are you added fixed styles with?
    var activeClass      = 'active'; // if you want active nav to have custom styles
    // - scrolling
    var scrollToOffet    = 0; // how far from top of the browser should the smooth scroll stop? 0 if you do it via CSS
    var scrollToEasing   = "easeInOutQuart"; // must be one of these options http://easings.net/
    var scrollDuration   = 700;  // duration of smooth scroll in miliseconds
    var titlePrefix      = "ISL Brand | "; // What is the title of your page before section ID?

    // ------------------------------------
    // Handle Link Clicks
    // ------------------------------------
    $navItem.click(function() { // event handler
        // --
        // get the link target
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
            || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[href=' + this.hash.slice(1) +']');
        // --
            if (target.length) { // make sure it actually exists on page
                smoothScroll(target); // fly away little birdy!
                return false;
            }
        }
        setActiveNavItem(); // set the active nav Item
    });


    function smoothScroll(target) { // this is where we actually dooooo the smooth scrolling
        $('html,body').animate({
            scrollTop: target.offset().top - scrollToOffet,
            easing:    scrollToEasing
        }, scrollDuration, function(){  // after the scroll is complete:
            /* update the URL hash for sharing purposes.  Location.hash causes a slight unavoidable jump in
            Firefox.  Let's use HistoryAPI (IE 9+) instead.
            http://lea.verou.me/2011/05/change-url-hash-without-page-jump/ */
            var targetID = target[0].id;
            if(history.pushState) {
                history.pushState(null, null, '#' + targetID);
                document.title = 'ISL Brand | ' + targetID.charAt(0).toUpperCase() + targetID.slice(1);
                   // update page title so history makes sense, capitalize the first character so it looks nice
            }
            else {
                location.hash = '#' + target[0].id; // for old browsers
            }
            setActiveNavItem();
        });
    }



    // ------------------------------------
    // Do Stuff on Scroll!!
    // we're debouncing the scroll for performance, https://www.html5rocks.com/en/tutorials/speed/animations/
    // ------------------------------------
    var latestKnownScrollY = 0,
    ticking = false;

    $(window).scroll(function(){ // event handler only
        onScroll();
    })

    var lastScrollY = 0;
    var scrollUp = 0;
    function onScroll() { // update our
        console.log()
        latestKnownScrollY = window.scrollY;
        if (window.scrollY < latestKnownScrollY) {
                scrollUp = 1;
            } else if (window.scrollY > latestKnownScrollY) {
                scrollUp = 0;
            }
        requestTick();
    }

    function requestTick() {
        if(!ticking) {
            requestAnimationFrame(scrolledUpdate);
        }
        ticking = true;
    }

    function scrolledUpdate() { // this is all the stuff we want to update after we scroll
        ticking = false; // reset the tick so we can capture the next onScroll
        var currentScrollY = latestKnownScrollY; // for next time around ;-)
        // ---
        // This is our actual unique scroll functionality
        affixMenu();
        // ---
    }
    var navTopOffset     = $nav.offset().top; // how far is nav from top of screen?
    function affixMenu() {
        console.log('current scroll position: ' + $(window).scrollTop());
        console.log('menu offset: ' + navTopOffset);
        if($(window).scrollTop() >= (navTopOffset  - 58)){
            $nav.addClass(fixedClass);
        }
        if(($(window).scrollTop() < (navTopOffset  - 28))){
            $nav.removeClass(fixedClass);
        }
    }
    affixMenu(); // we call once on load incase the user lands on page at anchor point below the header
    // end scroll behavior

  // -----
  // Set the active nav item so it gets custom styles
  // -----
  function setActiveNavItem(){
         $navItem.removeClass(activeClass);
         $(this).addClass(activeClass);
  };
})



