let charSpendTime = 70;
let animTimer = null;
let dom = null;
let changeDialogueCallback = null;

function change() {
  // 仅当动画还在继续时
  if (animTimer) {
    clearInterval(animTimer);
    animTimer = null;
    dom.innerText += section[0];
    section.shift();
    return;
  }
  // 当对话结束后
  if (section.length === 0) {
    changeDialogueCallback();
    return;
  }

  dom.innerText = "";
  var preChar = "";
  animTimer = setInterval(() => {
    if (preChar === " ") dom.innerText += " " + section[0][0];
    else dom.innerText += section[0][0];
    preChar = section[0][0];
    section[0] = section[0].substr(1);
    if (section[0].length === 0) {
      section.shift();
      clearInterval(animTimer);
      animTimer = null;
    }
  }, charSpendTime);
}

/**
 * @param {string} domIdName - the id name of dom
 */

function initChangeHandle(id, callback) {
  dom = document.getElementById(id);
  console.log(dom);
  changeDialogueCallback = callback;
}
