var winHeight = $(window).height();
document.getElementById("box").style.height = 0.8 * winHeight + "px";
const Second = {
  template: `
        <div id="page2" class="page2">
            <div id="box2" class="box2" style="height=${0.8 * winHeight +
              "px"};">
                <img src="img/title3.png" class="title2">
                <textarea id="myletter" placeholder="输入信的内容"></textarea>
                <div class="sign" id="name"></div>
                <div class="sign" id="time"></div>
                <div class="btn2" onclick="submitLetter()">提交</div>
                <div class="tip2"><span>信件内容一经提交无法修改</span></div>
            </div>
        </div>
        <router-view></router-view>
        <script>
            var winHeight = $(window).height();
            document.getElementById("box2").style.height = 0.8 * winHeight + "px";
        </script>//?
    `
};
const Third = {
  data: {
    isRecorded: false
  },
  template: `
        <div id="page3" class="page3">
            <div class="box3">
                <img src="img/title3.png" class="title3">
                <div class="line"><hr></div>
                <div v-if="isRecorded==true" class="myvoice" onclick="Myvoice()"><div id="duration" class="duration">{{x}}"</div></div>
                <img id="mai" class="mai" src="img/mai1.png">
                <div class="bottom">
                    <div id="talk" class="btn3">按住说话</div>
                    <div id="again"class="again" onclick="back()">重录</div>
                    <div id="continue"class="continue" onclick="submitVoice()">继续</div>
                </div>
            </div>
      </div>
      <router-view></router-view>
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
  router
}).$mount("#app");

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
$("#time").html(getNowFormatDate());
$.ajax({
  url: prefix + "getInfo",
  type: "post",
  dataType: "json",
  success: function(res) {
    $("#name").html(res.name);
  },
  error: function(err) {
    if (err.errmsg == 406) {
      Subscribe();
    }
    if (err.errmsg == 401) {
      Bindwx();
    }
  }
});

function yes1() {
  $("#yes1").removeClass("hidden");
  $("#yes2").addClass("hidden");
}

function yes2() {
  $("#yes2").removeClass("hidden");
  $("#yes1").addClass("hidden");
}

function checkTimeCapsule() {
  $.ajax({
    url: prefix + "checkTimeCapsule",
    type: "get",
    success: function(res) {
      if (!res.check_text) {
        sessionStorage.setItem("err", 1);
        window.location.href = "sorry.html";
      } else if (!res.check_voice) {
        sessionStorage.setItem("err", 2);
        window.location.href = "sorry.html";
      } else {
        window.location.href = "conclusion.html";
      }
    },
    error: function(err) {
      if (err.response.status == 401) {
        Bindwx();
      }
      if (err.response.status == 406) {
        Subscribe();
      }
    }
  });
}

function next() {
  checkCapsule();
  var gradute = $("#graduate option:selected").val();
  sessionStorage.setItem("time", gradute);
  if ($("#yes1").hasClass("hidden")) {
    sessionStorage.setItem("type", "voice");
    router.push("voice");
  }
  if ($("#yes2").hasClass("hidden")) {
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
var localId = null;
var serverId = null;
var isRecorded = 0;
var Playing = false;
var timer = null;
var totalTime = 0;
$.ajax({
  url: "https://hemc.100steps.net/2017/wechat/Home/Public/getJsApi",
  type: "post",
  dataType: "json",
  data: {
    url: location.href
  },
  success: function(arr) {
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
    wx.ready(function() {
      /////按住开始录音//////////
      $("#talk").on("touchstart", function(event) {
        event.preventDefault();
        $("#talk").html("松开结束");
        START = new Date().getTime();
        wx.startRecord({
          success: function() {
            recording();
          }
        });
      });
      //////音量波纹/////////////////
      var arr = [
        "img/mai1.png",
        "img/mai2.png",
        "img/mai3.png",
        "img/mai4.png"
      ];
      var num = 0;

      function dance() {
        num++;
        if (num == arr.length) {
          num = 0;
        }
        $("#mai").src = arr[num];
      }

      function recording() {
        timer = setInterval(function() {
          dance();
        }, 500);
      }

      function finishRecord() {
        clearInterval(timer);
        this.isRecorded = 1;
        next();
      }
      /////松手结束录音////////////
      $("#talk").on("touchend", function(event) {
        event.preventDefault();
        $("#talk").html("按住录音");
        END = new Date().getTime();
        if (END - START < 300) {
          //小于300ms，不录音
          END = 0;
          START = 0;
        } else {
          wx.stopRecord({
            success: function(res) {
              localId = res.localId;
              finishRecord();
              totalTime = END - START;
            }
          });
        }
      });
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function(res) {
          window.localId = res.localId;
          finishRecord();
          totalTime = 60;
        }
      });
      //////录完跳到//////////////////
      function next() {
        $("#talk").style.display = "none";
        $("#again").style.display = "block";
        $("#continue").style.display = "block";
      }
      //////返回重录/////////////////
      function back() {
        $("#talk").style.display = "block";
        $("#again").style.display = "none";
        $("#continue").style.display = "none";
        localId = null;
        serverId = null;
        isRecorded = 0;
        totalTime = 0;
      }
      //////试听录音/////////////////////////
      function CountDown() {
        let nowT = $("#duration").html();
        nowT--;
        $("#duration").html(nowT);
      }

      function Myvoice() {
        if (Playing == false) {
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

      function Stop() {
        clearInterval(timer);
        $("#duration").html(totalTime);
      }
      wx.onVoicePlayEnd({
        success: function(res) {
          window.localId = res.localId; // 返回音频的本地ID
          Stop();
        }
      });
      ////////保存录音/////////////////
      var clicked = false;

      function submitVoice() {
        if (!clicked) {
          $.ajax({
            url: prefix + "sendTimeCapsule",
            type: "post",
            dataType: "json",
            data: JSON.stringify({
              type: sessionStorage.getItem("type"),
              message: sessionStorage.getItem("message"),
              time: sessionStorage.getItem("time"),
              file_id: localId
            }),
            success: function(data) {
              window.location.href = "capsule-end.html";
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
                  window.location.href = "info.html";
                  break;
                case 406:
                  Subscribe();
                  break;
                case 409:
                  console.log("已填写过");
                  break;
              }
            }
          });
          clicked = false;
        }
      }
    });
  }
});
