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

let section = [
  "欢迎光临木棉邮局，这里是毕业慢递专栏",
  "我们为您的理想和初心提供了寄存慢递服务，以岁月为报，以时光为酬，也帮助你插上前行的路标",
  "在此之前，请先在这份清单署上你的名字，订立你与未来的契约吧~"
];
var mySwiper = new Swiper(".swiper-container", {
  direction: "vertical",
  loop: false,
  lazy: {
    loadPreNext: true,
    loadOnTransitionStart: true
  },
  on: {}
});

var status = 0; //第几段话
var infoCompleted = false;
var firstQueryInfo = true;
initChangeHandle("content", () => {});

function next() {
  mySwiper.slideNext();
  setTimeout(change, 300);
}
