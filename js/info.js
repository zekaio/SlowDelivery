var winHeight = $(window).height();
document.body.style.backgroundSize = "100vw " + winHeight + "px";
document.getElementById("box").style.height = 0.6 * winHeight + "px";
document.getElementById("box").style.paddingTop = 0.1 * winHeight + "px";
document.getElementById("btn").style.top = 0.01 * winHeight + "px";
if ($(window).height() <= 500) {
  document.body.style.backgroundImage = "url('./img/bg3.png')";
}

function toGoalLink() {
  let goal = !~window.location.search.indexOf("?")
    ? "intro.html"
    : window.location.search
        .match(/([^?=&]+)(=([^&]*))/g)
        .reduce(
          (a, v) => (
            (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
          ),
          {}
        )["from"] || "intro.html";
  window.location.replace(goal);
}

if (userInfo) toGoalLink();
else
  axios
    .get(prefix + "getInfo")
    .then(function(res) {
      if (res.data.record) {
        userInfo = { name: res.data.name, tel: res.data.tel };
        checkInfo = {
          flag: res.data.check_flag,
          text: res.data.check_text,
          voice: res.data.check_voice
        };
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("checkInfo", JSON.stringify(checkInfo));
        toGoalLink();
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
      } else {
        alert("请求发送失败，请稍后再试");
      }
    });

function judge(num) {
  if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(num)) {
    return false;
  } else {
    return true;
  }
}

var clicked = false;

function submit() {
  let name = $("#name").val();
  let phone = $("#phone").val();
  if (name == "") {
    $("#err1").html("昵称不能为空");
    $("#err1").removeClass("hidden");
  } else {
    $("#err1").addClass("hidden");
  }
  if (phone == "") {
    $("#err2").html("手机号不能为空");
    $("#err2").removeClass("hidden");
  } else if (!judge(phone)) {
    $("#err2").html("手机号格式错误");
    $("#err2").removeClass("hidden");
  } else {
    $("#err2").addClass("hidden");
  }
  if ($("#err1").hasClass("hidden") && $("#err2").hasClass("hidden")) {
    if (!clicked) {
      clicked = true;
      axios
        .post(prefix + "updateInfo", {
          name: name,
          tel: phone
        })
        .then(function(res) {
          // sessionStorage.setItem("name", name);
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify({ name, tel: phone })
          );
          sessionStorage.setItem(
            "checkInfo",
            JSON.stringify({ text: false, flag: false, voice: false })
          );
          toGoalLink();
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
              case 409:
                alert("已填写过信息");
                window.location.replace("intro.html");
                break;
            }
          }
          clicked = false;
        });
    }
  }
}
