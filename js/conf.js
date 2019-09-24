const prefix = "/2019/future-mail/api/";
const bbt = "https://hemc.100steps.net/2017/wechat/Home/Index/index?state=";
const bbtPublic =
  "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NDA4NzM4MA==&scene=124#wechat_redirect";

const shareLink = "https://hemc.100steps.net/2019/future-mail/index.html";
const pictureurl = "https://hemc.100steps.net/2019/future-mail/img/poster.jpg";

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
  if (bbt_layer) {
    bbt_layer.style.display = "block";
  } else {
    location.href = shareLink;
  }
  /*
  alert("要先关注百步梯公众号哦~");
  location.href = bbtPublic + encodeURIComponent(location.href);
  */
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
      jsApiList: ["updateTimelineShareData", "updateAppMessageShareData"]
    });
    wx.ready(function() {
      wx.updateTimelineShareData({
        title: "木棉邮局——毕业慢递",
        link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: pictureurl,
        success: function() {
          console.log("success");
          // 设置成功
        }
      });
      wx.updateAppMessageShareData({
        title: "木棉邮局——毕业慢递", // 分享标题
        desc: "", // 分享描述
        link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: pictureurl, // 分享图标
        success: function() {
          console.log("success");
          // 设置成功
        }
      });
    });
  }
});

let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
let checkInfo = JSON.parse(sessionStorage.getItem("checkInfo"));

function updateInfo(callback) {
  if ((!userInfo || !checkInfo) && !~window.location.href.indexOf("info.html"))
    $.ajax({
      url: prefix + "getInfo",
      type: "get",
      dataType: "json",
      success: function(res) {
        let record;
        if (res.data && res.data.hasOwnProperty("record"))
          record = res.data.record;
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
          if (updateInfoCallback) callback(userInfo, checkInfo);
        } else {
          // enter from home page
          if (window.location.href.match(/future-mail\/(index.html)?$/)) return;
          window.location.href = "info.html?from=" + window.location.href;
        }
      },
      error(err) {
        if (err.status == 401) {
          Bindwx();
        }
        if (err.status == 406 && ~location.href.indexOf("offline-index.html"))
          Subscribe();
      }
    });
}

// 当且仅当不是个人信息页面， 才判断是否已经填写信息
if (!~window.location.href.indexOf("/info.html"))
  updateInfo((updateInfoCallback = null));
