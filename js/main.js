$(function() {
  // Setting initial values for carousel
  var panelHeight = $('.panel').height();
  var activePanel = 'panel-primary';
  var navHeight = $('.header-section').height();
  var footerHeight = $('.footer').height();
  var scrollDistance = panelHeight;
  var autoScrollInterval;
  var userScroll = false;

  // detect user scroll through mouse
  // Mozilla/Webkit
  if(window.addEventListener) {
    document.addEventListener('DOMMouseScroll', mouseEvent, false);
  }

  //for IE/OPERA etc
  document.onmousewheel = mouseEvent;

  // Simulate Navigation (Deep Linking)
  navigateToPage();

  // Initialize Autoscroll
  if($('body').is('.homepage')) {
    autoScrollInterval = setInterval(autoScrollCarousel, 4000);
  }

  function mouseEvent(e) {
    userScroll = true;
  }

  // Reset Autoscroll on click
  $(document).click(function() {
    clearInterval(autoScrollInterval);
  });

  /** SetTimeout for scrolling the main content automatically */
  function autoScrollCarousel() {
    try {
      window.performance.mark('GM_carousel_loaded');
    } catch (e) {
      console.log('Your browser does not support HTML5 UserTiming API!');
    }

    if (scrollDistance === (panelHeight * 3)) {
      scrollDistance = 0;
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
    caseStudy.addClass('active');

    setTimeout(function() {
      $('.container').not(caseStudy).addClass('hidden');
    }, 300);
    $('body').animate({scrollTop: 0}, 300);
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
      clearInterval(autoScrollInterval);
      showCaseStudy('#' + pageName);
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
      autoScrollInterval = setInterval(autoScrollCarousel, 4000);
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
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(autoScrollCarousel, 4000);

    var linkedPanelID = $(this).data('panel');
    var linkedPanelOffset = $('#' + linkedPanelID).offset().top;
    checkNavHeight();

    scrollCarousel(linkedPanelOffset - navHeight);
  });

  // Menu Click Handler
  $('.hamburger').click(function(e) {
    e.preventDefault();

    $('.nav-collapse').slideToggle(300);
    $('.hamburger').toggleClass('active');
  });

  // Case Study Click Handler
  $('.view-case-study').click(function(){
    clearInterval(autoScrollInterval);
    var caseStudy = $(this).data('case');

    showCaseStudy(caseStudy);
    updateURL(this);
  });

  // Close Case Study Click Handler
  $('.close-icon').click(function() {
    $('.container, .section-nav').removeClass('hidden');
    $('.case-study-section').removeClass('active');
    setActivePanel($('.section-nav__radio-button').first());

    updateURL(this);

    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(autoScrollCarousel, 4000);
  });

  try {
    window.performance.measure('domLoading to carousel init', 'domLoading', 'GM_carousel_loaded');
    console.log('domLoading to carousel init:', window.performance.getEntriesByName('domLoading to carousel init')[0]);
  } catch (e) {
    console.log('Your browser does not support HTML5 UserTiming API!');
  }

});
