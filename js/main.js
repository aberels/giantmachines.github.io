$(function() {
  // Setting initial values for carousel
  var panelHeight = $('.panel').height();
  var activePanel = 'panel-primary';
  var awatingInteraction = true;
  var navHeight = $('.nav-header').height();
  var footerHeight = $('.footer').height();

  // Auto-scroll
  // autoScrollCarousel()

  /** Responsive call for height of navbar */
  function checkNavHeight() {
    navHeight = $('.nav-header').height();
    if (navHeight > 100) { navHeight = 0 };
  }

  /** SetTimeout for scrolling the main content automatically */
  function autoScrollCarousel() {
    var scrollDistance = panelHeight;
    setInterval(function(){
      if (awatingInteraction) {
        if (scrollDistance === (panelHeight * 4)) { scrollDistance = 0 }
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
    $('.link').not(panel).removeClass('active');
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

    $('.link').each(function(e) {
      var linkedPanelClass = $(this).data('panel');
      var linkedPanelOffset = $('.' + linkedPanelClass).offset().top;

      if (windowPosition >= linkedPanelOffset - navHeight) {
        setActivePanel(this);
      }
    });
  });

  // Carousel Click Handler
  $('.link').click(function() {
    awatingInteraction = false;
    var linkedPanelClass = $(this).data('panel');
    var linkedPanelOffset = $('.' + linkedPanelClass).offset().top;
    checkNavHeight();

    scrollCarousel(linkedPanelOffset - navHeight);
  });

  // Menu Click Handler
  $('.nav-control').click(function() {
    $('.nav-collapse').slideToggle(300);
    $('.nav-icon').toggleClass('active', 300);
  });

});
