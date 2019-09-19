var winHeight = "height:" + $(window).height() + "px;";
document.getElementById("box").style.height = 0.8 * winHeight + "px";
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = ".";
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
  return currentdate;
}

const Second = {
  data() {
    return {
      winHeight,
      time: getNowFormatDate(),
      name: userInfo.name
    };
  },
  template: `
        <div id="page2" class="page2" :style="winHeight" >
            <div id="box2" class="box2">
                <img src="img/title3.png" class="title2">
                <textarea id="myletter" placeholder="输入信的内容"></textarea>
                <div class="sign" id="name">{{name}}</div>
                <div class="sign" id="time">{{time}}</div>
                <div class="btn2" onclick="submitLetter()">提交</div>
                <div class="tip2"><span>信件内容一经提交无法修改</span></div>
            </div>
        </div>
    `
};

var localId = null;
var serverId = null;
var Playing = false;
var timer = null;
var clicked = false;
var num = 0;
var arr = ["img/mai1.png", "img/mai2.png", "img/mai3.png", "img/mai4.png"];
var START;
var END;
//////试听录音/////////////////////////
function CountDown() {
  this.totalTime = this.totalTime - 1;
}
//单击播放 再按停止
function Myvoice() {
  if (Playing == false) {
    Playing = true;
    Play();
  } else {
    wx.stopVoice({
      localId: localId,
      success: function() {
        Stop();
      }
    });
  }
}

function Play() {
  wx.playVoice({
    localId: localId,
    success: function() {
      timer = setInterval(function() {
        CountDown();
      }, 1000);
    }
  });
}

//////音量波纹/////////////////

function dance() {
  num++;
  if (num == arr.length) {
    num = 0;
  }
  $("#mai")[0].src = arr[num];
}

function recording() {
  timer = setInterval(dance, 500);
}

function Stop() {
  clearInterval(timer);
  Playing = false;
}
const Third = {
  data() {
    return {
      isRecorded: false,
      totalTime: 0
    };
  },
  methods: {
    //////返回重录/////////////////
    back() {
      this.$refs.record.style.display = "block";
      this.$refs.repeat.style.display = "none";
      this.$refs.continue.style.display = "none";
      localId = null;
      serverId = null;
      this.isRecorded = false;
      this.totalTime = 0;
    },
    submitVoice() {
      if (!clicked) {
        wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            // var serverId = res.serverId; // 返回音频的服务器端ID
            $.ajax({
              url: prefix + "sendTimeCapsule",
              type: "post",
              dataType: "json",
              data: JSON.stringify({
                type: sessionStorage.getItem("type"),
                message: sessionStorage.getItem("message"),
                time: sessionStorage.getItem("time"),
                file_id: res.serverId
              }),
              success: function(data) {
                checkInfo.voice = true;
                sessionStorage.setItem("checkInfo", JSON.stringify(checkInfo));
                window.location.href = "capsule-end.html";
                clicked = false;
              },
              error: function(err) {
                switch (err.errmsg) {
                  case 400:
                    console.log("没有获取到file_id或msg");
                  case 401:
                    Bindwx();
                    break;
                  case 404:
                    console.log("服务器上没有音频");
                    break;
                  case 405:
                    window.location.href = "info.html?capsule.html";
                    break;
                  case 406:
                    Subscribe();
                    break;
                  case 409:
                    console.log("已填写过");
                    break;
                }
                clicked = false;
              }
            });
          }
        });
      }
    }
  },
  mounted() {
    $.ajax({
      url: "https://hemc.100steps.net/2017/wechat/Home/Public/getJsApi",
      type: "post",
      dataType: "json",
      data: {
        url: location.href
      },
      success: arr => {
        t = this.$data;
        wx.config({
          debug: false,
          appId: arr.appId,
          timestamp: arr.timestamp,
          nonceStr: arr.nonceStr,
          signature: arr.signature,
          jsApiList: [
            "startRecord",
            "stopRecord",
            "onVoiceRecordEnd",
            "onVoicePlayEnd",
            "playVoice",
            "pauseVoice",
            "uploadVoice",
            "stopVoice"
          ]
        });
        wx.ready(() => {
          /////按住开始录音///////
          $("#talk").on("touchstart", event => {
            event.preventDefault();
            $("#talk").html("松开 结束");
            START = new Date().getTime();
            wx.startRecord({
              success: function() {
                recording();
              }
            });
          });

          function finishRecord() {
            clearInterval(timer);
            this.isRecorded = true;
            next.bind(this)();
          }
          /////松手结束录音////////////
          $("#talk").on("touchend", event => {
            event.preventDefault();
            $("#talk").html("按住 录音");
            END = new Date().getTime();
            if (END - START < 300) {
              //小于300ms，不录音
              END = 0;
              START = 0;
            } else {
              wx.stopRecord({
                success: res => {
                  localId = res.localId;
                  finishRecord.bind(this)();
                  this.totalTime = END - START;
                }
              });
            }
          });
          $("#talk").on("touchcancel", event => {
            event.preventDefault();
            $("#talk").html("按住 录音");
            END = new Date().getTime();
            if (END - START < 300) {
              //小于300ms，不录音
              END = 0;
              START = 0;
            } else {
              wx.stopRecord({
                success: res => {
                  localId = res.localId;
                  finishRecord.bind(this)();
                  this.totalTime = END - START;
                }
              });
            }
          });
          wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: res => {
              localId = res.localId;
              finishRecord.bind(this)();
              this.totalTime = 60;
            }
          });
          //////录完跳到//////////////////
          function next() {
            this.$refs.record.style.display = "none";
            this.$refs.repeat.style.display = "block";
            this.$refs.continue.style.display = "block";
          }

          wx.onVoicePlayEnd({
            success: function(res) {
              localId = res.localId; // 返回音频的本地ID
              Stop();
            }
          });
          ////////保存录音/////////////////
        });
      }
    });
  },
  template: `
      <div id="page3" class="page3">
          <div class="box3">
              <img src="img/title3.png" class="title3">
              <div class="line"></div>
              <div v-if="isRecorded" class="myvoice" onclick="Myvoice()">
                <div id="duration" class="duration">{{Math.ceil( totalTime / 1000 )}} "</div>
              </div>
              <img id="mai" class="mai" src="img/mai1.png" v-else>
              <div class="bottom" style="position: absolute;bottom: 10vw;top: auto; width: 80%; left: 10%; justify-content: space-around;">
                  <div id="talk" class="btn3" style="user-select:none; width: 100%;" ref="record" >按住 说话</div>
                  <div id="again"class="again" @click="back()" ref="repeat">重录</div>
                  <div id="continue"class="continue" @click="submitVoice()" ref="continue">继续</div>
              </div>
          </div>
      </div>
      `
};
const routes = [
  {
    path: "/letter",
    component: Second
  },
  {
    path: "/voice",
    component: Third
  }
];
const router = new VueRouter({
  routes
});
const app = new Vue({
  router,
  data: {
    showChooseType: true
  },
  mounted() {
    if (
      ~this.$route.path.indexOf("voice") ||
      ~this.$route.path.indexOf("letter")
    )
      this.showChooseType = false;
  }
}).$mount("#app");

function yes1() {
  $("#yes1").removeClass("hidden");
  $("#yes2").addClass("hidden");
}

function yes2() {
  $("#yes2").removeClass("hidden");
  $("#yes1").addClass("hidden");
}

function next() {
  let { text: p1, voice: p2 } = checkInfo;
  let type = $("#yes1").hasClass("hidden") ? "voice" : "text";

  if (p1 && !p2 && type === "text") {
    sessionStorage.setItem("err", 1);
    window.location.href = "sorry.html";
    return;
  } else if (!p1 && p2 && type === "voice") {
    sessionStorage.setItem("err", 2);
    window.location.href = "sorry.html";
    return;
  } else if (p1 && p2) {
    window.location.href = "conclusion.html";
    return;
  }
  var gradute = $("#graduate option:selected").val();
  sessionStorage.setItem("time", gradute);

  if (type === "voice") {
    sessionStorage.setItem("type", "voice");
    router.push("voice");
  } else {
    sessionStorage.setItem("type", "text");
    router.push("letter");
  }
}

function submitLetter() {
  let message = $("#myletter").val();
  if (message == "") {
    alert("信件内容不能为空");
  } else {
    sessionStorage.setItem("message", message);
    window.location.href = "ask.html";
  }
}
