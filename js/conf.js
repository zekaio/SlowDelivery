const prefix = "'http://193.112.103.197/SlowDelivery/api/";
const bbt ="https://hemc.100steps.net/2017/wechat/Home/Index/index?state=";
const bbtPublic="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NDA4NzM4MA==&scene=124#wechat_redirect";
function getNowFormatDate(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return(currentdate);
}
//活动起止
$.ajax({
    url:prefix+"isOngoing",
    type:"get",
    dataType:"json",
    success:function(data){
        if (data.status==1) {
            alert("活动已经结束，感谢关注");
            window.location.href="blank.html";
        }
        if (data.status==-1) {
            alert("活动还未开始，敬请期待");
            window.location.href="blank.html";
        }
    },
})
//微信bind 
function Bindwx(){
    location.href=bbt+encodeURIComponent(location.href);
}
//关注公众号
function Subscribe(){
    location.href=bbtPublic+encodeURIComponent(location.href);
}
//分享到朋友圈
$.ajax({
    url:"https://hemc.100steps.net/2017/wechat/Home/Public/getJsApi",
    type:"post",
    dataType:"json",
    data:{url:location.href},
    success:function(arr){
        wx.config({
            debug:false, 
            appId:arr.appId, 
            timestamp: arr.timestamp, 
            nonceStr: arr.nonceStr, 
            signature: arr.signature,
            jsApiList: ['startRecord','stopRecord','onVoiceRecordEnd','onVoicePlayEnd','playVoice','pauseVoice','uploadVoice','stopVoice'] 
        });
        wx.ready(function(){
            wx.onMenuShareTimeline({
                title: '木棉邮局——毕业慢递',// 分享标题 
                link: 'https://hemc.100steps.net/2019/future-mail/index.html',// 分享链接 
                imgUrl: '../img/logo2.png',// 分享图标
                success: function() {},// 用户确认分享后执行的回调函数 
                cancel: function() {},// 用户取消分享后执行的回调函数 
                fail: function(res) { 
                    alert("分享失败，请重新尝试"); 
                }
            });
        })
    }
})
