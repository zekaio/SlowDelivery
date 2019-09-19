let section = [
  "您好，我们邮局还为您的flag清单和信件提此项服务，请提供您的线下地址"
];

// 默认选择提供线下地址
let status = true;

initChangeHandle("content", () => {
  $("#bottom").removeClass("hidden");
});
change();

function no() {
  axios
    .post(prefix + "sendTimeCapsule", {
      type: sessionStorage.getItem("type"),
      message: sessionStorage.getItem("message"),
      time: sessionStorage.getItem("time"),
      send_offline: false
    })
    .then(function(res) {
      let checkInfo = JSON.parse(localStorage.getItem("checkInfo"));
      checkInfo.text = true;
      localStorage.setItem("checkInfo", JSON.stringify(checkInfo));
      section.push(
        "感谢您的选择，我们将会在毕业之时，发短信提醒您在线上查收信件与 flag 清单，请不用担心忘记查收。"
      );
      change();
      status = false;
      document.getElementsByClassName("reject")[0].style.display = "none";
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
            window.location.href = "info.html?from=ask.html";
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
  if (status) window.location.replace("address.html");
  else window.location.replace("capsule-end.html");
}
