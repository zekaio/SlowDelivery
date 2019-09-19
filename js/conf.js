const prefix = "/2019/future-mail/api/";
const bbt = "https://hemc.100steps.net/2017/wechat/Home/Index/index?state=";
const bbtPublic =
  "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NDA4NzM4MA==&scene=124#wechat_redirect";

//活动起止
$.ajax({
  url: prefix + "isOngoing",
  type: "get",
  dataType: "json",
  success: function(data) {
    if (data.status == 1) {
      alert("活动已经结束，感谢关注");
      window.location.href = "blank.html";
    }
    if (data.status == -1) {
      alert("活动还未开始，敬请期待");
      window.location.href = "blank.html";
    }
  }
});

//微信bind
function Bindwx() {
  location.href = bbt + encodeURIComponent(location.href);
}
//关注公众号
function Subscribe() {
  alert("要先关注百步梯公众号哦~");
  location.href = bbtPublic + encodeURIComponent(location.href);
}
//分享到朋友圈
$.ajax({
  url: "https://hemc.100steps.net/2017/wechat/Home/Public/getJsApi",
  type: "post",
  dataType: "json",
  data: { url: location.href },
  success: function(arr) {
    wx.config({
      debug: false,
      appId: arr.appId,
      timestamp: arr.timestamp,
      nonceStr: arr.nonceStr,
      signature: arr.signature,
      jsApiList: [
        "checkJsApi", //判断当前客户端版本是否支持指定JS接口
        "onMenuShareTimeline", //分享给好友
        "onMenuShareAppMessage" //分享到朋友圈
      ]
    });
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: "木棉邮局——毕业慢递", // 分享标题
        link: "https://hemc.100steps.net/2019/future-mail/index.html", // 分享链接
        imgUrl: "../img/logo2.png", // 分享图标
        success: function() {}, // 用户确认分享后执行的回调函数
        cancel: function() {}, // 用户取消分享后执行的回调函数
        fail: function(res) {
          alert("分享失败，请重新尝试");
        }
      });
    });
  }
});

let userInfo = JSON.parse(localStorage.getItem("userInfo"));
let checkInfo = JSON.parse(localStorage.getItem("checkInfo"));

function updateInfo(callback) {
  if ((!userInfo || !checkInfo) && !~window.location.href.indexOf("info.html"))
    $.ajax({
      url: prefix + "getInfo",
      type: "get",
      dataType: "json",
      success: function(res) {
        let { record } = res.data;
        if (record) {
          userInfo = { name: res.data.name, tel: res.data.tel };
          checkInfo = {
            flag: res.data.check_flag,
            text: res.data.check_text,
            voice: res.data.check_voice
          };
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          localStorage.setItem("checkInfo", JSON.stringify(checkInfo));
          if (updateInfoCallback) callback(userInfo, checkInfo);
        } else {
          // enter from home page
          if (window.location.href.match(/future-mail\/(index.html)?$/)) return;
          window.location.href = "info.html?from=" + window.location.href;
        }
      }
    });
}

// 当且仅当不是首页或者个人信息页面， 才判断是否已经填写信息
if (
  !~window.location.href.indexOf("info.html") &&
  !~window.location.href.indexOf("index.html")
)
  updateInfo((updateInfoCallback = null));
