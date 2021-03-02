var num = 6;
function redirect() {
    num--;
    document.getElementById("num").innerHTML = num;
    if (num < 0) {
        document.getElementById("num").innerHTML = 0;
         window.top.location.href = "/index/index";
    }
}
setInterval("redirect()", 1000);