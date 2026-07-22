/*

Template: Zitec - Construction Business HTML5 Template
Author: potenzaglobalsolutions.com
Version: 2.0.1
Design and Developed by: potenzaglobalsolutions.com

NOTE:

*/



/*================================================
[  Table of contents  ]
================================================

:: Predefined Variables
:: Preloader
:: Mega menu
:: Search Bar
:: Owl carousel
:: Counter
:: Slider range
:: Progress Bar
:: Countdown
:: Tabs
:: Accordion
:: List group item
:: Slick slider
:: Mgnific Popup
:: PHP contact form
:: Placeholder
:: Isotope
:: Scroll to Top
:: POTENZA Window load and functions

======================================
[ End table content ]
======================================*/

//POTENZA var
(function ($) {
  "use strict";
  var POTENZA = {};

/*************************
  Predefined Variables
*************************/
  var $window = $(window),
    $document = $(document),
    $body = $('body'),
    $progressBar = $('.progress-bar'),
    $countdownTimer = $('.countdown'),
    $counter = $('.counter');
  //Check if function exists
  $.fn.exists = function () {
    return this.length > 0;
  };


/*************************
        Preloader
*************************/
  POTENZA.preloader = function () {
       $("#load").fadeOut();
       $('#preloader').delay(0).fadeOut('slow');
   };

  /*************************
       Tooltip
  *************************/
  POTENZA.Tooltip = function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }

  /*************************
        Popover
  *************************/
  POTENZA.Popover = function() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
  }


/*************************
       Counter
*************************/
  POTENZA.counters = function () {
    var counter = jQuery(".counter");
    if (counter.length > 0) {
      $counter.each(function () {
        var $elem = $(this);
        $elem.appear(function () {
          $elem.find('.timer').countTo();
        });
      });
    }
  };

/*************************
       Owl Carousel
*************************/
  POTENZA.carousel = function () {
    var owlslider = jQuery("div.owl-carousel");
    if (owlslider.length > 0) {
      owlslider.each(function () {
        var $this = $(this),
          $items = ($this.data('items')) ? $this.data('items') : 1,
          $loop = ($this.attr('data-loop')) ? $this.data('loop') : true,
          $navdots = ($this.data('nav-dots')) ? $this.data('nav-dots') : false,
          $navarrow = ($this.data('nav-arrow')) ? $this.data('nav-arrow') : false,
          $autoplay = ($this.attr('data-autoplay')) ? $this.data('autoplay') : true,
          $autospeed = ($this.attr('data-autospeed')) ? $this.data('autospeed') : 5000,
          $smartspeed = ($this.attr('data-smartspeed')) ? $this.data('smartspeed') : 1000,
          $autohgt = ($this.data('autoheight')) ? $this.data('autoheight') : false,
          $space = ($this.attr('data-space')) ? $this.data('space') : 30,
          $animateOut = ($this.attr('data-animateOut')) ? $this.data('animateOut') : false;

        $(this).owlCarousel({
          loop: $loop,
          items: $items,
          responsive: {
            0: {
              items: $this.data('xx-items') ? $this.data('xx-items') : 1
            },
            480: {
              items: $this.data('xs-items') ? $this.data('xs-items') : 1
            },
            768: {
              items: $this.data('sm-items') ? $this.data('sm-items') : 2
            },
            980: {
              items: $this.data('md-items') ? $this.data('md-items') : 3
            },
            1200: {
              items: $items
            }
          },
          dots: $navdots,
          autoplayTimeout: $autospeed,
          smartSpeed: $smartspeed,
          autoHeight: $autohgt,
          margin: $space,
          nav: $navarrow,
          navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
          autoplay: $autoplay,
          autoplayHoverPause: true
        });
      });
    }
  }

  /*************************
      Magnific Popup
  *************************/
  POTENZA.mediaPopups = function () {
    if ($(".popup-single").exists() || $(".popup-gallery").exists() || $('.modal-onload').exists() || $(".popup-youtube, .popup-vimeo, .popup-gmaps").exists()) {
      if ($(".popup-single").exists()) {
        $('.popup-single').magnificPopup({
          type: 'image'
        });
      }
      if ($(".popup-gallery").exists()) {
        $('.popup-gallery').magnificPopup({
          delegate: 'a.popup-img',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
          }
        });
      }
      if ($(".popup-youtube, .popup-vimeo, .popup-gmaps").exists()) {
        $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
          disableOn: 700,
          type: 'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: false,
          fixedContentPos: false
        });
      }
      var $modal = $('.modal-onload');
      if ($modal.length > 0) {
        $('.popup-modal').magnificPopup({
          type: 'inline'
        });
        $(document).on('click', '.popup-modal-dismiss', function (e) {
          e.preventDefault();
          $.magnificPopup.close();
        });
        var elementTarget = $modal.attr('data-target');
        setTimeout(function () {
          $.magnificPopup.open({
            items: {
              src: elementTarget
            },
            type: "inline",
            mainClass: "mfp-no-margins mfp-fade",
            closeBtnInside: !0,
            fixedContentPos: !0,
            removalDelay: 500
          }, 0)
        }, 1500);
      }
    }
  }

/*************************
       Countdown
*************************/
  POTENZA.countdownTimer = function () {
    if ($countdownTimer.exists()) {
      $countdownTimer.downCount({
        date: '12/25/2022 12:00:00', // Month/Date/Year HH:MM:SS
        offset: -4
      });
    }
  }

/*************************
       Progressbar
*************************/
    POTENZA.progressBar = function () {

        if ($progressBar.exists()) {
            $progressBar.each(function (i, elem) {
                var $elem = $(this),
                    percent = $elem.attr('data-percent') || "100",
                    delay = $elem.attr('data-delay') || "100",
                    type = $elem.attr('data-type') || "%";

                if (!$elem.hasClass('progress-animated')) {
                    $elem.css({
                        'width': '0%'
                    });
                }
                var progressBarRun = function () {
                    $elem.animate({
                        'width': percent + '%'
                    }, 'easeInOutCirc').addClass('progress-animated');

                    $elem.delay(delay).append('<span class="progress-type animated fadeIn">' + type + '</span><span class="progress-number animated fadeIn">' + percent + '</span>');
                };
                    $(elem).appear(function () {
                        setTimeout(function () {
                            progressBarRun();
                        }, delay);
                    });
            });
        }
    };

/*************************
       Mega menu
*************************/
 POTENZA.megaMenu = function () {
      $('#menu').megaMenu({
               // DESKTOP MODE SETTINGS
              logo_align          : 'left',         // align the logo left or right. options (left) or (right)
              links_align         : 'left',        // align the links left or right. options (left) or (right)
              socialBar_align     : 'left',    // align the socialBar left or right. options (left) or (right)
              searchBar_align     : 'right',   // align the search bar left or right. options (left) or (right)
              trigger             : 'hover',           // show drop down using click or hover. options (hover) or (click)
              effect              : 'fade',             // drop down effects. options (fade), (scale), (expand-top), (expand-bottom), (expand-left), (expand-right)
              effect_speed        : 400,          // drop down show speed in milliseconds
              sibling             : true,              // hide the others showing drop downs if this option true. this option works on if the trigger option is "click". options (true) or (false)
              outside_click_close : true,  // hide the showing drop downs when user click outside the menu. this option works if the trigger option is "click". options (true) or (false)
              top_fixed           : false,           // fixed the menu top of the screen. options (true) or (false)
              sticky_header       : true,       // menu fixed on top when scroll down down. options (true) or (false)
              sticky_header_height: 250,  // sticky header height top of the screen. activate sticky header when meet the height. option change the height in px value.
              menu_position       : 'horizontal',    // change the menu position. options (horizontal), (vertical-left) or (vertical-right)
              full_width          : false,           // make menu full width. options (true) or (false)
             // MOBILE MODE SETTINGS
              mobile_settings     : {
                collapse            : true,    // collapse the menu on click. options (true) or (false)
                sibling             : true,      // hide the others showing drop downs when click on current drop down. options (true) or (false)
                scrollBar           : true,    // enable the scroll bar. options (true) or (false)
                scrollBar_height    : 400,  // scroll bar height in px value. this option works if the scrollBar option true.
                top_fixed           : false,       // fixed menu top of the screen. options (true) or (false)
                sticky_header       : false,   // menu fixed on top when scroll down down. options (true) or (false)
                sticky_header_height: 200   // sticky header height top of the screen. activate sticky header when meet the height. option change the height in px value.
             }
      });
  }

/*************************
     parallax
*************************/
POTENZA.Parallax = function () {
  var $parallaxdiv = $('.parallax'),
     parallax = document.querySelectorAll(".parallax"),speed = 0.5;
    if ($parallaxdiv.exists()) {
                window.onscroll = function(){
                [].slice.call(parallax).forEach(function(el,i){
                var windowYOffset = window.pageYOffset,
                    elBackgrounPos = "0 " + (windowYOffset * speed) + "px";
                    el.style.backgroundPosition = elBackgrounPos;

                });
                };
  }
}

/*************************
         Isotope
*************************/
POTENZA.Isotope = function () {
      var $isotope = $(".isotope"),
          $itemElement = '.grid-item',
          $filters = $('.isotope-filters');
        if ($isotope.exists()) {
            $isotope.isotope({
            resizable: true,
            itemSelector: $itemElement,
              masonry: {
                gutterWidth: 10
              }
            });
       $filters.on( 'click', 'button', function() {
         var $val = $(this).attr('data-filter');
             $isotope.isotope({ filter: $val });
             $filters.find('.active').removeClass('active');
             $(this).addClass('active');
      });
    }
}

 // masonry
POTENZA.masonry = function () {
    var $masonry = $('.masonry-main .masonry'),
      $itemElement = '.masonry-main .masonry-item';
      if ($masonry.exists()) {
      $masonry.isotope({
        resizable: true,
        itemSelector: $itemElement,
        masonry: {
        gutterWidth: 10
        }
      });
     }
}

/*************************
     Back to top
*************************/
  POTENZA.goToTop = function () {
    var $goToTop = $('#back-to-top');
    $goToTop.hide();
    $window.scroll(function () {
      if ($window.scrollTop() > 100) $goToTop.fadeIn();
      else $goToTop.fadeOut();
    });
    $goToTop.on("click", function () {
      $('body,html').animate({
        scrollTop: 0
      }, 1000);
      return false;
    });
  }


/****************************************************
     POTENZA Window load and functions
****************************************************/

  //Window load functions
  $window.on("load", function () {
   POTENZA.Isotope(),
   POTENZA.masonry(),
   POTENZA.progressBar();

  });

  //Document ready functions
  $document.ready(function () {
    POTENZA.megaMenu(),
    POTENZA.counters(),
    POTENZA.goToTop(),
    POTENZA.countdownTimer(),
    POTENZA.mediaPopups(),
    POTENZA.Tooltip(),
    POTENZA.Popover(),
    POTENZA.carousel(),
    POTENZA.Parallax();
  });

})(jQuery);
