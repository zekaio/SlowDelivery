var tt = 0;
$("#w1").html("您好，我们邮局还为您的flag清单和信件提");
$("#w2").html("供打印的附加服务，届时线下寄出。若需要");
$("#w3").html("此项服务，请提供您的线下地址");
$("#w1").addClass("word ty");
$("#w2").addClass("word ty ty2");
$("#w3").addClass("word ty ty3");
clock = setInterval("count()", 1000);

function count() {
  tt++;
  console.log(tt);
}
var status = 0;

function change() {
  if (status == 0 && tt >= 5) {
    clearInterval(clock);
    $("#bottom").removeClass("hidden");
  }
}

function no() {
  axios
    .post(prefix + "sendTimeCapsule", {
      type: sessionStorage.getItem("type"),
      message: sessionStorage.getItem("message"),
      time: sessionStorage.getItem("time"),
      send_offline: false
    })
    .then(function(res) {
      window.location.href = "capsule-end.html";
    })
    .catch(function(err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            console.log("没有获取到file_id或msg");
            break;
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
      } else {
        alert("请求发送失败，请稍后再试");
      }
      clicked = false;
    });
}

function yes() {
  window.location.href = "address.html";
}
