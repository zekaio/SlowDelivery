var winHeight = $(window).height();
document.body.style.backgroundSize = "100vw " + winHeight + "px";
document.getElementById("box").style.height = 0.6 * winHeight + "px";
if ($(window).height()<=500) {
  document.body.style.backgroundImage="url('./img/bg3.png')";
}

function judge(num){
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(num))) {return false}
    else {return true}
}

var clicked=false;
function submit(){
    if (!clicked){
    clicked=true;
    let name = $("#name").val();
    let phone = $("#phone").val();
    if (name == "" ){
       $("#err1").html("昵称不能为空");
       $("#err1").removeClass("hidden");
    }
     else{
       $("#err1").addClass("hidden"); 
     }
    if (phone == "" ){
        $("#err2").html("手机号不能为空");
        $("#err2").removeClass("hidden");
     }else if (!judge(phone)){
        $("#err2").html("手机号格式错误");
        $("#err2").removeClass("hidden");
     }else{
        $("#err2").addClass("hidden"); 
     }
    if (($("#err1").hasClass("hidden")) && ($("#err2").hasClass("hidden"))){
      axios.post(prefix + 'updateInfo', {
        name: JSON.stringify(name),
        tel: JSON.stringify(phone)
      })
      .then(function (res) {
        window.location.href="intro.html"
      })
      .catch(function (err) {
        if (err.response) {
            switch (err.response.status) {
                case 401:
                    Bindwx();
                    break;
                case 407:
                    Subscribe();
                    break;
                case 409:
                    console.log("已填写过信息");
                    window.location.href="intro.html"
                    break;
            }
        } else {
            alert("请求发送失败，请稍后再试");
        }
        clicked = false;
      })
    }
    }
}
