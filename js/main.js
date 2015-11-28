$(function() {
  // Setting initial values for carousel
  var panelHeight = $('.panel').height();
  var activePanel = 'panel-primary';
  var awatingInteraction = true;

  function setActivePanel(panel) {
    $('.link').not(panel).removeClass('active');
    $(panel).addClass('active');
  }

  // Autoscrolling when users has not yet clicked
  function autoScrollCarousel() {
    var scrollDistance = panelHeight;
    setInterval(function(){
      if (awatingInteraction) {
        scrollDistance > $('body').height() ? scrollDistance = 0 : true
        scrollCarousel(scrollDistance);
        scrollDistance += panelHeight;
      }
    }, 1000);
  }

  // Scrolls window to active panel
  function scrollCarousel(offset) {
    $('body').animate({
      scrollTop: offset
    }, 500)
  }

  // Trigger autoscroll
  // autoScrollCarousel()

  // While scrolling, set the active panel
  $(window).scroll(function() {
    var windowPosition = $(this).scrollTop();

    $('.link').each(function(e) {
      var linkedPanelClass = $(this).data('panel');
      var linkedPanelOffset = $('.' + linkedPanelClass).offset().top;

      if (windowPosition >= linkedPanelOffset) {
        setActivePanel(this);
      }
    });
  });

  // Click handler for carousel
  $('.link').click(function() {
    awatingInteraction = false;
    var linkedPanelClass = $(this).data('panel');
    var linkedPanelOffset = $('.' + linkedPanelClass).offset().top;

    scrollCarousel(linkedPanelOffset);
  });

});
