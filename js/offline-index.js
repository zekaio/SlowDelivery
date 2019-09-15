var tt=0;  
var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    loop: false,
    lazy:{
        loadPreNext:true,
        loadOnTransitionStart: true,
    },
    on:{
        transitionEnd:function(){
            $("#w1").html("欢迎参加开学季木棉邮局——毕业慢递！");
            $("#w2").html("为了将来信件能顺利寄出，");
            $("#w3").html("请认真填写以下信息！");
            $("#w1").addClass("word ty");
            $("#w2").addClass("word ty ty2");
            $("#w3").addClass("word ty ty3");
            clock=setInterval("count()",1000);
        }
    }
});
function count(){
    tt++;
    console.log(tt);
}
function change(){
    if (tt>=5){
        clearInterval(clock);tt=0;
        window.location.href="offline-info.html";
    }
}