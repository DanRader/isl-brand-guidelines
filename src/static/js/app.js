import $ from 'jquery'

/*  ====================================================================================================================

   FIXED SINGLEPAGE SMOOTH SCROLLER
   ------
   NOTE, if you're using jQuery before 3.0, animate() may causes performance issues because it doesn't use
   requestAnimationFrame. If that's the case I highly reccomend you check out velocityjs -- exact same syntax, just
   better performance.  Link: velocityjs.org
*/
jQuery(document).ready(function ($) {

    /* -----------------------------------
    Global Config Variables
    -----------------------------------*/
    // - nav
    var navID               = 'js-nav' // the main navigation wrapper eg: <nav id="js-nav"></nav>
    var navItemClass        = 'js-smooth-scroll' // the link you're targeting
    var navOffsetSpacer     = 0
    var fixedClass          = 'fixed' // what class are you added fixed styles with?
    var activeClass         = 'active' // if you want active nav to have custom styles
    // - scrolling
    var scrollToOffet       = 0 // how far from top of the browser should the smooth scroll stop? 0 if you do it via CSS
    var scrollToEasing      = "easeInOutQuart" // must be one of these options http://easings.net/
    var scrollDuration      = 700  // duration of smooth scroll in miliseconds
    var titlePrefix         = "ISL Brand | " // What is the title of your page before section ID?
    // - content
    var contentSectionClass = 'Guideline' //
    // - cache jQuery elements
    var $w                  = $(window)
    var $nav                = $('#' + navID)
    var $navItem            = $('.' + navItemClass) // the link you're targeting
    var navTopOffset        = $nav.offset().top; // how far is nav from top of screen?
    // - state variables
    var isAnimating         = 0
    var latestKnownScrollY  = 0
    var ticking             = false
    var scrollUp            = 0

    var contentSections = []; // this is our awesome array, we use it alot.  it has the keys: id, percentVisible, imagesLoaded
    var sectionVisibility;


    /* -----------------------------------
    Init Functions
    -----------------------------------*/
    affixMenu(); // we call once on load incase the user lands on page at anchor point below the header
    constructContentList(); // inventory the page sections for use in scrolling/nav state functions

    /* -----------------------------------
    Event Handlers
    -----------------------------------*/
     $w.scroll(function(){ // event handler only
        onScroll();
    })

    /* -----------------------------------
    Handle Nav Link Clicks
    -----------------------------------*/
    $navItem.click(function() { // event handler
        // --
        // get the link target
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
            || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[href=' + this.hash.slice(1) +']');
        // --
            if (target.length) { // make sure it actually exists on page
                smoothScroll(target,$(this)); // fly away little birdy!
                return false;
            }
        }
        setActiveNavItem(); // set the active nav Item
    });

    /* -----------------------------------
    Execute Smooth Scroll Behavior
    -----------------------------------*/
    function smoothScroll(target,$link) { // this is where we actually dooooo the smooth scrolling
        isAnimating = 1;
        //console.log(target);
        $('body').animate({
            scrollTop: target.offset().top - scrollToOffet,
            easing:    scrollToEasing
        }, scrollDuration, function(){  // after the scroll is complete:
            updateURL(target[0].id); // update the URL so users can share
            setActiveNavItem($link);
            isAnimating = 0; // resent state for scroll visibility functions
        });
    }

    /* -----------------------------------
    Make sure the Browser's Hash Reflects Current Locaton
    -----------------------------------*/
    function updateURL(targetID) {
        /*  This function handles a string from ID
            Location.hash causes a slight unavoidable jump in
            Firefox.  Let's use HistoryAPI (IE 9+) instead.
            http://lea.verou.me/2011/05/change-url-hash-without-page-jump/ */
         if(history.pushState) {
                history.pushState(null, null, '#' + targetID);
                document.title = titlePrefix + targetID.charAt(0).toUpperCase() + targetID.slice(1);
                   // update page title so history makes sense, capitalize the first character so it looks nice
            }
            else {
                location.hash = '#' + targetID; // for old browsers
            }
    }

    /* -----------------------------------
    Make sure the Browser's Hash Reflects Current Locaton
    -----------------------------------*/
    function onScroll() { // update our
        latestKnownScrollY = window.scrollY;
        if (window.scrollY < latestKnownScrollY) {
                scrollUp = 1;
            } else if (window.scrollY > latestKnownScrollY) {
                scrollUp = 0;
            }
        requestTick();
    }

    /* -----------------------------------
    Can we update our view
    We're debouncing the scroll for performance, https://www.html5rocks.com/en/tutorials/speed/animations/
    -----------------------------------*/
    function requestTick() {
        if(!ticking) {
            requestAnimationFrame(scrolledUpdate);
        }
        ticking = true;
    }

    /* -----------------------------------
    Update User's View After a Scroll
    -----------------------------------*/
    function scrolledUpdate() { // this is all the stuff we want to update after we scroll
        ticking = false; // reset the tick so we can capture the next onScroll
        var currentScrollY = latestKnownScrollY; // for next time around ;-)
        // ---
        // This is our actual unique scroll functionality
        affixMenu();
        if (isAnimating === 0) {
            checkVisibility();
            navState();
        }
        // ---
    }

    /* -----------------------------------
    Fix Nav Menu if it's in View
    -----------------------------------*/
    function affixMenu() {
        //console.log('current scroll position: ' + $(window).scrollTop());
        //console.log('menu offset: ' + navTopOffset);
        if($w.scrollTop() >= (navTopOffset  - 58)){
            $nav.addClass(fixedClass);
        }
        if(($w.scrollTop() < (navTopOffset  - 28))){
            $nav.removeClass(fixedClass);
        }
    }
    // end scroll behavior

    /* -----------------------------------
    Set the Active Menu Item on Demand
    -----------------------------------*/
    function setActiveNavItem($thisNavItem){ // handles a jQuery el
         $navItem.removeClass(activeClass);
         $thisNavItem.addClass(activeClass);
    };

     /* -----------------------------------
    Check If Our
    -----------------------------------*/
    function checkVisibility() { // update our contentSections object with percentages of how visible each section is
            for (var i = contentSections.length - 1; i >= 0; i--) // check each section
            {
                sectionVisibility = howMuchVisible($('#' + contentSections[i].id)); // use howMuchVisable to determine this section's visibility
                contentSections[i].percentVisible = sectionVisibility.percent;
                console.log(contentSections[i].id + " " + contentSections[i].percentVisible);
            }
        };

     /* -----------------------------------
    Cache Content Sections for Meta-Manupulation Later
    -----------------------------------*/
    function constructContentList() { // constructNodeList caches the sections with content. We'll use this throughout the js (load/unload, navstate, etc)
            var contentSectionElements = document.getElementsByClassName(contentSectionClass);
            //console.log(contentSectionElements);
            for (var i = contentSectionElements.length - 1; i >= 0; i--) {
               // console.log(contentSectionElements[i]);
                    contentSections.push({ // add parent to our contentList because Childless parent = content
                        id: contentSectionElements[i].id, // section id (#) attr
                        percentVisible: 0, // we'll use an interval function to update this
                        numLoadedImages: 0,
                        imagesLoaded: false, // ditto
                    });

            };
            console.table(contentSections);
        };

    /* -----------------------------------
    Make sure the Browser's Hash Reflects Current Locaton
    -----------------------------------*/
    function howMuchVisible(el) { // Checks how much of an element is visible by checking its position and height compared to window height.
            // Get dimensions
            var windowHeight = $w.height(),
                scrollTop = $w.scrollTop(),
                elHeight = el.outerHeight(),
                elOffset = el.offset().top,
                elFromTop = (elOffset - scrollTop),
                elFromBottom = windowHeight - (elFromTop + elHeight);
            // console.table([{windowHeight:windowHeight, scrollTop:scrollTop, elHeight:elHeight, elOffset:elOffset, elFromTop:elFromTop, elFromBottom:elFromBottom}]);
            // Check if the item is at all visible
            if (
                (elFromTop <= windowHeight && elFromTop >= 0) || (elFromBottom <= windowHeight && elFromBottom >= 0) || (elFromTop <= 0 && elFromBottom <= 0 && elHeight >= windowHeight)) {
                // console.log('Item is in view.');
                // If full element is visible...
                if (elFromTop >= 0 && elFromBottom >= 0) {
                    var o = {
                        pixels: elHeight, // Height of element that is visible (pixels), in this case = to elHeight since the whole thing is visible
                        percent: (elHeight / windowHeight) * 100 // Percent of window height element takes up.
                    };
                    return o; // Return the height of the element
                }
                // If only the TOP of the element is visible...
                else if (elFromTop >= 0 && elFromBottom < 0) {
                    var o = {
                        pixels: windowHeight - elFromTop, // Height of element that is visible (pixels)
                        percent: ((windowHeight - elFromTop) / windowHeight) * 100 // Percent of window height element takes up.
                    };
                    return o;
                }
                // If only the BOTTOM of the element is visible...
                else if (elFromTop < 0 && elFromBottom >= 0) {
                    var o = {
                        pixels: windowHeight - elFromBottom, // Height of element that is visible (pixels)
                        percent: ((windowHeight - elFromBottom) / windowHeight) * 100 // Percent of window height element takes up.
                    };
                    return o;
                }
                // If the element is bigger than the window and only a portion of it is being shown...
                else if (elFromTop <= 0 && elFromBottom <= 0 && elHeight >= windowHeight) {
                    var o = {
                        pixels: windowHeight, // Height of element that is visible (pixels)
                        percent: 100 // Percent of window height element takes up. 100 b/c it's covering the window.
                    };
                    return o;
                }
            } else {
                // console.log('Item is NOT in view.');
                var o = { // Item isn't visible, so return 0 for both values.
                    pixels: 0,
                    percent: 0
                };
                return o;
            }
    };

    /* -----------------------------------
    Update the nav state
    -----------------------------------*/
    function navState() { // navState() determines which navigation item should be active
            // Fetch an array of main content sections with their respective percentage of viewport real estate
            // then sort array based on percent value.
            var arr = contentSections;
            arr.sort(function(a, b) { // sort by % visible
                return parseFloat(a.percentVisible) - parseFloat(b.percentVisible)
            });
            var currentNav = { // Determine current nav item, which is the one at the end of the list with the highest %
                id: arr[arr.length - 1].id
            }

            //console.log(currentNav);
           $navItem.removeClass(activeClass); // remove active
            //console.log($('.' + navItemClass + ' .' + activeClass));
            // set the current section as active based on % visibile w/in scroll
            $("." + navItemClass + "[href*=" + currentNav.id + "]").addClass(activeClass);

        };

})



