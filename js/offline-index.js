let section = [
  "欢迎参加开学季木棉邮局——毕业慢递！为了将来信件能顺利寄出，请认真填写以下信息！"
];
const real_url = window.location.href.split("?")[0];

function refresh() {
  window.location.href = real_url + "?t=" + new Date().getTime();
}

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
initChangeHandle("content", () => {
  window.location.href = "offline-info.html";
});
function next() {
  mySwiper.slideNext();
  change();
}
