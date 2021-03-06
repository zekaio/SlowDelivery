//如果两种信都写了 直接去总结页面（若flag没写也可以从总结页面进入填写）
// axios
//   .get(prefix + "checkTimeCapsule")
//   .then(function(res) {
//     let p1 = res.data.check_text;
//     let p2 = res.data.check_voice;
//     if (p1 && p2) {
//       window.location.href = "conclusion.html";
//     }
//   })
//   .catch(function(err) {
//     if (err.response) {
//       switch (err.response.status) {
//         case 401:
//           Bindwx();
//           break;
//         case 406:
//           Subscribe();
//           break;
//       }
//     }
//   });
const real_url=window.location.href.split('?')[0];

function refresh() {
  window.location.href = real_url+"?t="+new Date().getTime();
}

let section = [
  "欢迎光临木棉邮局，这里是毕业慢递专栏",
  "我们为您的理想和初心提供了寄存慢递服务，以岁月为报，以时光为酬，也帮助你插上前行的路标",
  "在此之前，请先在这份清单署上你的名字，订立你与未来的契约吧~"
];

axios
  .get(prefix + "getInfo")
  .then(function(res) {
    let record;
    if (res.data && res.data.hasOwnProperty("record")) record = res.data.record;
    else record = null;
    if (record) {
      userInfo = { name: res.data.name, tel: res.data.tel };
      checkInfo = {
        flag: res.data.check_flag,
        text: res.data.check_text,
        voice: res.data.check_voice
      };
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      sessionStorage.setItem("checkInfo", JSON.stringify(checkInfo));
      if (checkInfo) {
        if (checkInfo.text && checkInfo.voice) {
          window.location.href = "conclusion.html";
          return;
        }
      }
      section.splice(2, 1);
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

var mySwiper = new Swiper(".swiper-container", {
  direction: "vertical",
  loop: false,
  lazy: {
    loadPreNext: true,
    loadOnTransitionStart: true
  },
  on: {
    transitionEnd: function() {
      change();
    }
  }
});

var status = 0; //第几段话
var infoCompleted = false;
var firstQueryInfo = true;
initChangeHandle("content", () => {
  if (!userInfo) window.location.href = "info.html";
  else window.location.href = "intro.html";
});

function next() {
  mySwiper.slideNext();
  // setTimeout(change, 300);
}
