$(function() {
  // Setting initial values for carousel
  var panelHeight = $('.panel').height();
  var numCarouselSections = $('.home-section .panel--primary').length;
  var activePanel = 'panel-primary';
  var navHeight = $('.header-section').height();
  var footerHeight = $('.footer').height();
  var scrollDistance = panelHeight;
  var autoScrollInterval;
  var userScroll = false;
  var activePage = $('.page-active');

  // Initialize Autoscroll
  if($('body').is('.homepage')) {
    autoScrollInterval = setInterval(autoScrollCarousel, 2000);
  }

  // detect user scroll through mouse
  // Mozilla/Webkit
  if(window.addEventListener) {
    document.addEventListener('DOMMouseScroll', mouseEvent, false);
  }

  //for IE/OPERA etc
  document.onmousewheel = mouseEvent;

  function mouseEvent(e) {
    userScroll = true;
  }

  // Simulate Navigation (Deep Linking)
  navigateToPage();

  // Nav events
  $('.nav-collapse li').on('mouseenter', function() {
    var el = this.querySelector('a');

    activePage.removeClass('active');

    el.classList.add('active');
  });

  $('.nav-collapse li').on('mouseleave', function() {
    var el = this.querySelector('a');

    el.classList.remove('active');

    if ($('a.active').length === 0) {
      activePage.addClass('active');
    }
  });

  // Kill autoscroll on click or touch
  $(document).on('click touchstart', function() {
    clearInterval(autoScrollInterval);
  });

  /** SetTimeout for scrolling the main content automatically */
  function autoScrollCarousel() {
    try {
      window.performance.mark('GM_carousel_loaded');
    } catch (e) {
      console.log('Your browser does not support HTML5 UserTiming API!');
    }

    if (scrollDistance === (panelHeight * numCarouselSections)) {
      scrollDistance = 0;
      clearInterval(autoScrollInterval);
    }

    scrollCarousel(scrollDistance);
    scrollDistance += panelHeight;
  }

  /**
   * Scrolls the page
   * @param {integer} offset - pixes to scroll
   */
  function scrollCarousel(offset) {
    $('body').animate({scrollTop: offset}, 800, 'easeInOutQuart');
  }

  /**
   * Sets the active class on a panel
   * @param {object} panel - The jQuery panel el
   */
  function setActivePanel(panel) {
    $('.section-nav__radio-button').not(panel).removeClass('active');
    $(panel).addClass('active');
  }

  /**
   * Shows the case study full-screen modal
   * @param {string} caseStudyID
   */
  function showCaseStudy(caseStudyID) {
    if ($('.hamburger').hasClass('active')) {
      $('.hamburger').removeClass('active');
      $('.nav-collapse').slideToggle(300);
    }

    $('.container').removeClass('hidden');
    $('.section-nav').addClass('hidden');

    var caseStudy = $(caseStudyID);
    if (caseStudy.length) {
      caseStudy.addClass('active');

      setTimeout(function() {
        $('.container').not(caseStudy).addClass('hidden');
      }, 300);
      $('body').animate({scrollTop: 0}, 300);
    }

  }

  /** Responsive call for height of navbar */
  function checkNavHeight() {
    navHeight = $('.header-section').height();
    if (navHeight > 100) { navHeight = 0; }
  }

  // Navigate to requested page
  function navigateToPage() {
    var pageName = getPageName();
    if (pageName) {
      showCaseStudy('#' + pageName);
      clearInterval(autoScrollInterval);
    }
  }

  // Parse URL for page name
  function getPageName() {
    var pathName = window.location.href;
    var pageName;

    if (pathName.indexOf('#') != -1) {
      pageName = pathName.split('#').pop();
    }

    return pageName;
  }

  // Update URL silently
  function updateURL(link) {
    var deepLink = $(link).data('case');
    var pageName;

    if (deepLink) {
      pageName = deepLink;
    } else {
      pageName = '/';
    }

    window.history.pushState(null, '', pageName);
  }

  // Sets the active panel on page scroll
  $(window).scroll(function() {
    if (userScroll) {
      clearInterval(autoScrollInterval);
    }

    var windowPosition = $(this).scrollTop();
    checkNavHeight();

    $('.section-nav__radio-button').each(function(e) {
      var linkedPanelID = $(this).data('panel');
      var linkedPanelOffset = $('#' + linkedPanelID).offset().top - (panelHeight / 2);

      if (windowPosition >= linkedPanelOffset - navHeight) {
        setActivePanel(this);
      }
    });
  });

  // Carousel Click Handler
  $('.section-nav__radio-button').click(function() {
    var linkedPanelID = $(this).data('panel');
    var linkedPanelOffset = $('#' + linkedPanelID).offset().top;
    checkNavHeight();

    scrollCarousel(linkedPanelOffset - navHeight);
  });

  // Menu Click Handler
  $('.hamburger').on('touchstart click', function(e) {
    clearInterval(autoScrollInterval);
    e.preventDefault();
    e.stopPropagation();

    $('.nav-collapse').slideToggle(300);
    $('.hamburger').toggleClass('active');
  });

  // Close hamburger on blur
  $(document).on('touchstart click', function(event) {
    if (!$(event.target).closest('.nav-collapse').length) {
      if($('.hamburger').hasClass('active')) {
        $('.nav-collapse').slideToggle(300);
        $('.hamburger').removeClass('active');
      }
    }
  });

  // Case Study Click Handler
  $('.view-case-study').click(function(){
    var caseStudy = $(this).data('case');

    if ($(this).hasClass('redirect')) {
      window.location.href = ('/' + caseStudy);
    }

    showCaseStudy(caseStudy);
    updateURL(this);
  });

  // Close Case Study Click Handler
  $('.close-icon').click(function() {
    $('.container, .section-nav').removeClass('hidden');
    $('.case-study-section').removeClass('active');
    setActivePanel($('.section-nav__radio-button').first());

    updateURL(this);
  });

  try {
    window.performance.measure('domLoading to carousel init', 'domLoading', 'GM_carousel_loaded');
    console.log('domLoading to carousel init:', window.performance.getEntriesByName('domLoading to carousel init')[0]);
  } catch (e) {
    console.log('Your browser does not support HTML5 UserTiming API!');
  }

});
