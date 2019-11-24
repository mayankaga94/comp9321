$( document ).ready(function() {
// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();
 // for form validation

   function validateForm() {
var name =  document.getElementById('name').value;
console.log(name)
if (name == "") {
    document.getElementById('status').innerHTML = "Name cannot be empty";
    return false;
}
var email =  document.getElementById('email').value;
if (email == "") {
    document.getElementById('status').innerHTML = "Email cannot be empty";
    return false;
} else {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)){
        document.getElementById('status').innerHTML = "Email format invalid";
        return false;
    }
}
var subject =  document.getElementById('subject').value;
if (subject == "") {
    document.getElementById('status').innerHTML = "Subject cannot be empty";
    return false;
}
var message =  document.getElementById('message').value;
if (message == "") {
    document.getElementById('status').innerHTML = "Message cannot be empty";
    return false;
}
document.getElementById('status').innerHTML = "Sending...";
document.getElementById('contact-form').submit();

}
   // 
setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
    }
    
    lastScrollTop = st;
}

if ($(window).width() < 768) {
        $('#myCarousel').carousel({
      interval: 3000
    });

    $('#myCarousel').carousel('next');
    // $("#myCarousel .carousel-inner > .item").css("display","block");
    
    $(window).scroll(function(e){ 
      var $el = $('.fixedElement'); 
      var isPositionFixed = ($el.css('position') == 'fixed');
      if ($(this).scrollTop() > 200 && !isPositionFixed){ 
        $el.css({'position': 'fixed', 'top': '100px'}); 
        $(".prd_right").css({'margin-top':'300px'});
      }
      if ($(this).scrollTop() < 200 && isPositionFixed){
        $el.css({'position': 'relative', 'top': '10px'}); 
        $(".prd_right").css({'margin-top':'100px'});
      } 
    });
}
	$("#accordion h2").click(function (e) {
    $('html, body').animate({
        scrollTop: $("#accordion h2").offset().top-200
    }, 'slow');
});
$('.tab_footer').on("click",function(){
 
      $(window).scrollTop(0);
});
$(function() {
    $('#accordion .content').hide();
    $('#accordion h2:first').addClass('active').next().slideDown('slow');
    $('#accordion h2').click(function() {
        if($(this).next().is(':hidden')) {
    		  $('#accordion h2').removeClass('active').removeClass('show').next().slideUp('slow');
    		   $(this).toggleClass('active').addClass('show').next().slideDown('slow');
    		}
    });
});
$('.right_img').on("click",function(){
      $(window).scrollTop(0);
});
$('.right_img.nuts').on("click",function(){
  $('prd_right_inner_wrap.nuts').show();
  });
$('.left_img').on("click",function(){
 
      $(window).scrollTop(0);
});
$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});
$('.nav-link').on("click",function(){
       $('.navbar-collapse').addClass("disp_none");
       if ( $( ".navbar-collapse" ).is( ".disp_none" ) ) {
     setTimeout(function(){
         $('.navbar-collapse').removeClass("disp_none");
 },2000);
}
});
$('.navbar-toggle').on("click",function(){
   $('.navbar-collapse').removeClass("disp_none");
       // $('.navbar-collapse').show();
});
$(function() {
    var $el, leftPos, newWidth;
    $mainNav=$("#example-one");
    $mainNav.append("<li id='magic-line'></li>");
    var $magicLine = $("#magic-line");
    $magicLine
        .width($(".current_page_item").width())
        .css("left", $(".current_page_item a").position().left)
        .data("origLeft", $magicLine.position().left)
        .data("origWidth", $magicLine.width());
        
    $("#example-one li a" ).click(function() {
        $el = $(this);
        leftPos = $el.position().left;
        newWidth = $el.parent().width();
        $magicLine.stop().animate({
            left: leftPos,
            width: newWidth
        });
    
});
            $(".view_prd" ).click(function() {
        $el = $("#example-one li:nth-child(3)");
        leftPos = $el.position().left;
        newWidth = $el.width();     
        $magicLine.stop().animate({
            left: leftPos,
            width: newWidth
        });
});
        $(".right_img,.left_img" ).click(function() {
          $el = $("#example-one li:nth-child(3)");
          leftPos = $el.position().left;
          newWidth = $el.width();
          $magicLine.stop().animate({
            left: leftPos,
            width: newWidth
            });
        });
          $(".slide_img" ).click(function() {
          $el = $("#example-one li:nth-child(1)");
          leftPos = $el.position().left;
          newWidth = $el.width();
          $magicLine.stop().animate({
            left: leftPos,
            width: newWidth
            });
        });
        $(".view_prd").click(function() {
          $el = $("#example-one li:nth-child(3)");
          leftPos = $el.position().left;
          newWidth = $el.width();
          $magicLine.stop().animate({
            left: leftPos,
            width: newWidth
         });
      });
});
// -----for product display------//
$(".cmn_link").click(function() {
    // $(".prd_right_inner_wrap.seaweed,.prd_right_inner_wrap.popcorn,.prd_right_inner_wrap.chesenuts").hide();
 var myClass1 = this.className.split(' ')[2];
   if (myClass1){
    $(".prd_right_inner_wrap." + myClass1).show();
   }
});
$(".classlist").click(function() {
    $(".prd_right_inner_wrap.seaweed,.prd_right_inner_wrap.popcorn,.prd_right_inner_wrap.chesenuts,.prd_right_inner_wrap.nuts,prd_right_inner_wrap.nuts,.prd_right_inner_wrap.potato,.prd_right_inner_wrap.driedfruits").hide();
     $('html, body').animate({
        scrollTop: $(".prd_right_inner_wrap").offset().top-600
    }, 'slow');
 var myClass = this.className.split(' ')[2];
   if (myClass){
    $(".prd_right_inner_wrap." + myClass).show();
   }
});
//------------------------//
	$(".slid_li").click(function(){
	$("html, body").animate({
	      scrollTop: 0
	    }, {
	      easing: "easeInCirc",
	      duration: 0
	    });
});
      $('a[href^="#page"]').on('click', function() {
        event.preventDefault();
        // Horizontal Scroll
        let currentMargin = $('.main').css('margin-left').replace('px', '');
        let targetOffset = $($(this).attr('href')).offset().left;
        let current_id= $(this).attr("href");
        $(current_id).css('height','auto');
        if(current_id != '#page1'){
          $("#page1").css('height','50px');
          // $("#tab1").css('height','50px');
        }
                if(current_id != '#page2'){
          $("#page2").css('height','50px');
          // $("#tab1").css('height','50px');
        }
                if(current_id != '#page2'){
          $("#page2").css('height','100px');
          // $("#tab1").css('height','50px');
        }
                if(current_id != '#page3'){
          $("#page3").css('height','50px');
          // $("#tab1").css('height','50px');
        }
          if(current_id != '#page4'){
          $("#page4").css('height','50px');
          // $("#tab1").css('height','50px');
        }
                if(current_id != '#page5'){
          $("#page5").css('height','50px');
          // $("#tab1").css('height','50px');
        }
        $('.main').animate({
          marginLeft: currentMargin - targetOffset
        }, 1000);
      });

$(".right_img.nuts").click(function() {
  $(".prd_right_inner_wrap.nuts").show();
  $(".prd_right_inner_wrap.sunflower").hide();
      $(".prd_right_inner_wrap.driedfruits").hide();
            $(".prd_right_inner_wrap.cheesenuts").hide();

});
$("#slideshow > div:gt(0)").hide();

setInterval(function() { 
  $('#slideshow .slid_car:first')
    .fadeOut(3000)
    .next()
    .fadeIn(3000)
    .end()
    .appendTo('#slideshow');
},  6000);
$(".left_inner_img.seeds").click(function() {
  $(".prd_right_inner_wrap.nuts").hide();
   $(".prd_right_inner_wrap.cheesenuts").hide();
  $(".prd_right_inner_wrap.sunflower").show();
      $(".prd_right_inner_wrap.driedfruits").hide();

});
$(".left_inner_img.driedfruits").click(function() {
  $(".prd_right_inner_wrap.nuts").hide();
  $(".prd_right_inner_wrap.sunflower").hide();
    $(".prd_right_inner_wrap.driedfruits").show();
     $(".prd_right_inner_wrap.cheesenuts").hide();
});
$(".left_inner_img.chesenuts").click(function() {
  $(".prd_right_inner_wrap.nuts").hide();
  $(".prd_right_inner_wrap.sunflower").hide();
  $(".prd_right_inner_wrap.driedfruits").hide();
  $(".prd_right_inner_wrap.chesenuts").show();
});
  $(".left_inner_img.potatostics").click(function() {
    $(".prd_right_inner_wrap.nuts").hide();
    $(".prd_right_inner_wrap.potato").show();
    $(".prd_right_inner_wrap.cheesenuts").hide();

  });
  $(".left_inner_img.potatostics").click(function() {
    $(".prd_right_inner_wrap.nuts").hide();
    $(".prd_right_inner_wrap.potato").show();
   $(".prd_right_inner_wrap.cheesenuts").hide();

  });
  $(".left_inner_img.driedfruits").click(function() {
    $(".prd_right_inner_wrap.nuts").hide();
    $(".prd_right_inner_wrap.driedfruits").show();
    $(".prd_right_inner_wrap.cheesenuts").hide();

  });
});