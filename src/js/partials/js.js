
$(window).load(function() {

    var current_width = $(window).width();
    //do something with the width value here!
    if(current_width < 481)
        $('html').addClass("m320").removeClass("m768").removeClass("desktop").removeClass("m480");

    else if(current_width < 739)
        $('html').addClass("m768").removeClass("desktop").removeClass("m320").removeClass("tablet");

    else if (current_width < 970)
        $('html').addClass("tablet").removeClass("desktop").removeClass("m320").removeClass("m768");

    else if (current_width > 971)
        $('html').addClass("desktop").removeClass("m320").removeClass("m768").removeClass("tablet");

    if(current_width < 650)
        $('html').addClass("mobile-menu").removeClass("desktop-menu");

    if(current_width > 651)
        $('html').addClass("desktop-menu").removeClass("mobile-menu");

});

//update the width value when the browser is resized (useful for devices which switch from portrait to landscape)
$(window).resize(function(){
    var current_width = $(window).width();
    //do something with the width value here!
    if(current_width < 481)
        $('html').addClass("m320").removeClass("m768").removeClass("desktop").removeClass("tablet");

    else if(current_width < 669)
        $('html').addClass("m768").removeClass("desktop").removeClass("m320").removeClass("tablet");

    else if (current_width < 970)
        $('html').addClass("tablet").removeClass("desktop").removeClass("m320").removeClass("m768");

    else if (current_width > 971)
        $('html').addClass("desktop").removeClass("m320").removeClass("m768").removeClass("tablet");

    if(current_width < 650)
        $('html').addClass("mobile-menu").removeClass("desktop-menu");

    if(current_width > 651)
        $('html').addClass("desktop-menu").removeClass("mobile-menu");


});


$(document).ready(function() {

// Эквивалентно:
    $('.disabled').on('click', function (/** $.Event */evt) {
        evt.preventDefault(); // отменить действие по умолчанию
        evt.stopPropagation(); // остановить всплытие события
    });


    $('.feedback_footer').click(function(){
        $(document).find(".pop-up-2").css({"width":$(window).width()+"px","height":$(window).height()+"px"}).show();
        $(document).find(".feedabck-box").css({"left":$(window).width()/2-240,"top":$(window).height()/2-180});  /* ,"top":$(window).height()/2-height */
        return false;
    });

    $('.pop-up-2 .close-btn').click(function() {
        $(document).find(".pop-up-2").hide();
    });


    $('.tel').mask('+0(000)-000-00-00');
    centerModals();
});




/* center modal */
function centerModals(){
    $('.modal').each(function(i){
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}

function trustTumble(){
    var item = $('.trust_us  .item'),
        close = $('.trust_us .detail-side .close-button');

    item.click(function(){
        $('.preview-logos').hide();
        $('.detail-side').show();
        return false;
    });


    close.click(function(){
        $('.preview-logos').show();
        $('.detail-side').hide();
    })

}

// = Вешаем событие прокрутки к нужному месту
//   на все ссылки якорь которых начинается на #
$('header a[href^="#"]').bind('click.smoothscroll',function (e) {
    e.preventDefault();
    var target = this.hash,
        $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
    });
});





$('.modal').on('show.bs.modal', centerModals);
$(window).on('resize', centerModals);



$(window).resize(function(){

});


function add_active_class (){
    var body_tag = $("body");
    var menu = $("header nav ul");

    if ( body_tag.hasClass('about-us') ) {
        menu.find("li:nth-of-type(2)").addClass("active_li");

    } else if (body_tag.hasClass('zal-page') ) {
        menu.find("li:nth-of-type(3)").addClass("active_li");
    }
}


