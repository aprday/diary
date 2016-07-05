function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        return !!element.className.match(reg);
    }
}

function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else if (!hasClass(element, className)) {
        element.className += " " + className;
    }
}

function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else if (hasClass(element, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        element.className = element.className.replace(reg, ' ');
    }
}
function delegateEvent(eventType, targetElement, callback, params){
  var node = document.body;
  // 获得父元素DIV, 添加监听器...
  node.addEventListener(eventType,function(e) {
    var self = this;
    // 处理浏览器兼容
    e = e || window.event;
    var targetNode = e.target || e.srcElement;
    // 测试如果点击的是TR就触发
    if (targetNode.nodeName.toLowerCase() === targetElement.nodeName.toLowerCase()) {
        var classNameStr = targetElement.className.split(' ');
        var className = targetNode.className;
        className = className.split(' ');
        // 选择包含 class 的元素
        for (var j = 0, name; name = className[j]; j++) {
            if (classNameStr.indexOf('' + name + '') === -1) {
                break;
            }else {
                callback(params);
            }
        }
    }
  });
}

module.exports = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    delegateEvent:delegateEvent
}
