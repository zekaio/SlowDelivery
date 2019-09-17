//如果两种信都写了 直接去总结页面（若flag没写也可以从总结页面进入填写）
axios
  .get(prefix + "checkTimeCapsule")
  .then(function(res) {
    let p1 = res.data.check_text;
    let p2 = res.data.check_voice;
    if (p1 && p2) {
      window.location.href = "conclusion.html";
    }
  })
  .catch(function(err) {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          Bindwx();
          break;
        case 406:
          Subscribe();
          break;
      }
    }
  });

var tt = 0; //记录说话时间
var k = 0; //第二次及以后下滑不再重新执行动画
var mySwiper = new Swiper(".swiper-container", {
  direction: "vertical",
  loop: false,
  lazy: {
    loadPreNext: true,
    loadOnTransitionStart: true
  },
  on: {
    transitionEnd: function() {
      k++;
      if (k == 1) {
        $("#w1").html("欢迎光临木棉邮局，这里是毕业慢递专栏");
        $("#w1").addClass("word ty");
        clock = setInterval("count()", 1000);
      }
    }
  }
});

function count() {
  tt++;
}
var status = 0; //第几段话
var infoCompleted = false;
function change() {
  if (status == 0 && tt >= 2) {
    clearInterval(clock);
    tt = 0;
    clock = setInterval("count()", 1000);
    $("#w1").removeClass("word ty");
    $("#w1").html("我们为您的理想和初心提供了寄存慢递服务,");
    $("#w2").html("以岁月为报，以时光为酬，也帮助你插上前");
    $("#w3").html("行的路标");
    setTimeout(function() {
      $("#w1").addClass("word ty");
      $("#w2").addClass("word ty ty2");
      $("#w3").addClass("word ty ty3");
    }, 1);
    status = 1;
  }
  axios.get(prefix + "getInfo").then(function(res) {
    if (res.data.record) infoCompleted = true;
  });
  if (status == 1 && tt >= 5) {
    clearInterval(clock);
    tt = 0;
    clock = setInterval("count()", 1000);
    $("#w1").removeClass("word ty");
    $("#w2").removeClass("word ty ty2");
    $("#w1").html("在此之前，请先在这份清单署上你的名字，");
    $("#w2").html("订立你与未来的契约吧~");
    $("#w3").html("");
    $("#w4").html("");
    setTimeout(function() {
      $("#w1").addClass("word ty");
      $("#w2").addClass("word ty ty2");
    }, 1);
    status = 2;
  }
  if (status == 2 && tt >= 3) {
    clearInterval(clock);
    tt = 0;
    if (infoCompleted) window.location.href = "intro.html";
    window.location.href = "info.html";
  }
}

function next() {
  mySwiper.slideNext();
}
