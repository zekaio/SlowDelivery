let section = [
  "欢迎参加开学季木棉邮局——毕业慢递！为了将来信件能顺利寄出，请认真填写以下信息！"
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
initChangeHandle("content", () => {
  window.location.href = "offline-info.html";
});
function next() {
  mySwiper.slideNext();
  change();
}
