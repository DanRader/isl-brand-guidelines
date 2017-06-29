/**
 * Use Web Font Loader instead of stock TypeKit loader
 *
 * See: https://github.com/typekit/webfontloader
 */
/* global typekitId */

import $ from 'jquery'
import WebFont from 'webfontloader'

// configure the font loader
window.WebFontConfig = {
  active: () => {
    // force a repaint of goo buttons to stop a weird render bug
    const $gooButton = $('.button--goo')
    let gooTime

    if ($gooButton.length) {
      $gooButton.css('opacity', 0)

      gooTime = setTimeout(() => {
        $gooButton.css('opacity', 1)
        clearTimeout(gooTime)
      }, 200)
    }
  },
  custom: {
    families: ['icon-font', 'noe-display', 'copy'],
    urls: [
      '/wp-content/themes/isl/static/css/v1/icon-font.css',
      '/wp-content/themes/isl/static/css/v1/fonts.css'
    ]
  }
}

// add TypeKit fonts if typekitId is defined
if (typeof typekitId === 'undefined' || !typekitId) {
  console.error('typekitId undefined, TypeKit fonts not loaded')
} else {
  $.extend(window.WebFontConfig, {
    typekit: {
      id: typekitId
    }
  })
}

// load the fonts
const loadFonts = () => {
  WebFont.load(window.WebFontConfig)
}

export { loadFonts }
