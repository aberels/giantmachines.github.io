$(function() {
  // Setting initial values for carousel
  var panelHeight = $('.panel').height();
  var activePanel = 'panel-primary';
  var awatingInteraction = true;
  var navHeight = $('.header-section').height();
  var footerHeight = $('.footer').height();

  // Initialize
  if($('body').is('.homepage')) {
    // autoScrollCarousel();
  }

  // Kill Autoscroll on user interaction
  $(document).click(function() {
    awatingInteraction = false;
  });

  /** Responsive call for height of navbar */
  function checkNavHeight() {
    navHeight = $('.header-section').height();
    if (navHeight > 100) { navHeight = 0; }
  }

  /** SetTimeout for scrolling the main content automatically */
  function autoScrollCarousel() {
    var scrollDistance = panelHeight;
    setInterval(function(){
      if (awatingInteraction) {
        if (scrollDistance === (panelHeight * 4)) { scrollDistance = 0; }
        scrollCarousel(scrollDistance);
        scrollDistance += panelHeight;
      }
    }, 4000);
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
   * Scrolls the page
   * @param {integer} offset - pixes to scroll
   */
  function scrollCarousel(offset) {
    $('body').animate({scrollTop: offset}, 1000, 'easeInOutQuart');
  }

  // Sets the active panel on page scroll
  $(window).scroll(function() {
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
  $('.hamburger').click(function(e) {
    e.preventDefault();

    $('.nav-collapse').slideToggle(300);
    $('.hamburger').toggleClass('active');
  });

  // Case Study Click Handler
  $('.view-case-study').click(function(){
    if ($('.hamburger').hasClass('active')) {
      $('.hamburger').removeClass('active');
      $('.nav-collapse').slideToggle(300);
    }

    $('.container').removeClass('hidden');
    $('.section-nav').addClass('hidden');
    var caseStudy = $($(this).data('case'));
    caseStudy.addClass('active');

    setTimeout(function() {
      $('.container').not(caseStudy).addClass('hidden');
    }, 300);
    $('body').animate({scrollTop: 0}, 300);
  });

  // Close Case Study Click Handler
  $('.close-icon').click(function() {
    $('.container, .section-nav').removeClass('hidden');
    $('.case-study-section').removeClass('active');
    setActivePanel($('.section-nav__radio-button').first());
  });

  // Next Case Study Click Handler
  $('.button-next').click(function() {
    $('.case-study').hide();
    $($(this).data('case-study')).show();
    $('body').scrollTop(0);
  });
});
