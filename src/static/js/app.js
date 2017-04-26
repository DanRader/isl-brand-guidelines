import $ from 'jquery'
import 'foundation'
import 'foundation-mediaquery'
import 'gumshoe'
//import 'cferdinandi/smooth-scroll'


// initialize foundation
$(document).foundation()

// smooth scrolling
//smoothScroll.init()
gumshoe.init({
    selector: '[data-gumshoe] a', // Default link selector (must use a valid CSS selector)
    selectorHeader: '[data-gumshoe-header]', // Fixed header selector (must use a valid CSS selector)
    container: window, // The element to spy on scrolling in (must be a valid DOM Node)
    offset: 0, // Distance in pixels to offset calculations
    activeClass: 'active', // Class to apply to active navigation link and its parent list item
    scrollDelay: false, // Wait until scrolling has stopped before updating the navigation
    callback: function (nav) {} // Callback to run after setting active link
})

// example
const dateDisplayEl = document.createElement('div')
dateDisplayEl.innerHTML = new Date()
//document.body.appendChild(dateDisplayEl)
