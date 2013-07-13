var css = document.createElement("link");
css.rel = "stylesheet";
css.type = "text/css";
css.href = chrome.extension.getURL("css/mod.css");
document.head.appendChild(css)

var src = document.createElement("script");
src.type = "text/javascript";
src.src = chrome.extension.getURL("inject.js");
document.head.appendChild(src)


