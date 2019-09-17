window.onload = function() {
  if ($(window).height() <= 500) {
    $("#box").css("height", 1.2 * $(window).height());
  } else if ($(window).height() >= 800) {
    $("#box").css("height", 0.9 * $(window).height());
  } else {
    $("#box").css("height", $(window).height());
  }
  document.body.style.backgroundSize = "100vw " + $(window).height() + "px";
  fetch(prefix + "setSession", {
    method: "get"
  });
};

function judge(num) {
  if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(num)) {
    return false;
  } else {
    return true;
  }
}

function check() {
  pre = "err";
  for (var i = 1; i <= 6; i++) {
    str = "#" + pre + String(i);
    if ($(str).hasClass("hidden") == false) {
      return false;
    }
  }
  return true;
}

function submit() {
  let sendpeople = $("#sendpeople").val();
  let sendphone = $("#sendphone").val();
  let receivepeople = $("#receivepeople").val();
  let receivephone = $("#receivephone").val();
  let address = $("#address").val();
  let code = $("#code").val();
  let time = $("#time option:selected").val();
  if (sendpeople == "") {
    $("#err1").html("姓名不能为空");
    $("#err1").removeClass("hidden");
  } else {
    $("#err1").addClass("hidden");
  }
  //
  if (sendphone == "") {
    $("#err2").html("手机号不能为空");
    $("#err2").removeClass("hidden");
  } else if (!judge(sendphone)) {
    $("#err2").html("手机号格式错误");
    $("#err2").removeClass("hidden");
  } else {
    $("#err2").addClass("hidden");
  }
  //
  if (receivepeople == "") {
    $("#err3").html("姓名不能为空");
    $("#err3").removeClass("hidden");
  } else {
    $("#err3").addClass("hidden");
  }
  //
  if (receivephone == "") {
    $("#err4").html("手机号不能为空");
    $("#err4").removeClass("hidden");
  } else if (!judge(receivephone)) {
    $("#err4").html("手机号格式错误");
    $("#err4").removeClass("hidden");
  } else {
    $("#err4").addClass("hidden");
  }
  //
  if (address == "") {
    $("#err5").html("地址不能为空");
    $("#err5").removeClass("hidden");
  } else {
    $("#err5").addClass("hidden");
  }
  if (code == "") {
    $("#err6").html("取信码不能为空");
    $("#err6").removeClass("hidden");
  } else {
    $("#err6").addClass("hidden");
  }
  //
  if (check()) {
    $.ajax({
      url: prefix + "sendOfflineCapsule",
      type: "post",
      dataType: "json",
      data: JSON.stringify({
        sender_name: sendpeople,
        sender_tel: sendphone,
        receiver_name: receivepeople,
        receiver_tel: receivephone,
        receiver_addr: address,
        capsule_tag: code,
        time: time
      }),
      success: function() {
        sessionStorage.setItem("name", sendpeople);
        window.location.href = "offline-end.html";
      },
      error: function(err) {
        if (err.errmsg == 401) {
          Bindwx();
        }
        if (err.errcode == 404) {
          $("#err6").html("取信码不存在");
          $("#err6").removeClass("hidden");
        }
        if (err.errcode == 409) {
          $("#err6").html("取信码已被使用");
          $("#err6").removeClass("hidden");
        }
        if (err.errmsg == 406) {
          Subscribe();
        }
      }
    });
  }
}
