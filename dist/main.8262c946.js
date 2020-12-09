// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.lastLi');
var dataUrl = localStorage.getItem('dataUrl');
dataUrl = JSON.parse(dataUrl);
var hashMap = dataUrl || [{
  url: 'https://github.com/',
  name: 'GitHub'
}, {
  url: 'https://nodejs.org/en/',
  name: 'Node'
}, {
  url: 'https://react.docschina.org/',
  name: 'React'
}, {
  url: 'https://cn.vuejs.org/',
  name: 'Vue'
}, {
  url: 'https://www.zhihu.com/',
  name: '知乎'
}, {
  url: 'https://www.bilibili.com/',
  name: '哔哩哔哩'
}];

var simplify = function simplify(url) {
  return url.replace('http://', '').replace('https://', '').replace('www.', '').replace(/\/.*/, ''); // 删除 / 后边的内容
};

var findIcon = function findIcon(url) {
  return "https://www.google.com/s2/favicons?domain=" + url + "";
};

var render = function render() {
  $siteList.find('li:not(.lastLi)').remove();
  hashMap.forEach(function (item, index) {
    var $li = $("\n    <li>\n     <div class=\"site\">\n       <div class=\"logo\">\n          <img src=\" ".concat(findIcon(item.url), "\" alt=\"\"> \n       </div>\n       <div class=\"close\">\n           <svg class=\"icon\">\n               <use xlink:href=\"#icon-close\"></use>\n            </svg>\n        </div>\n       <span class=\"siteName\">").concat(item.name, "</span></span>\n     </div> \n   </li>\n    ")).insertBefore($lastLi); // console.log(simplify(item.url)[0])

    var $close = $li.find('.close'); // 定义PC端定时器

    var tigger = null; // 定义移动端定时器

    var timeOutEvent = null; // 定义长按 ， 用来判断是否为长按事件
    // 不定义会出现BUG：无论点击或者长按，都会执行touched内的方法，即长按点击都会去跳转页面。

    var longClick = null; // 删除站点

    var deleteLi = function deleteLi(e) {
      e.stopPropagation();
      hashMap.splice(index, 1);
      render();
    };

    $li.on('click', function () {
      window.open(item.url);
    }); // PC端 显示隐藏删除按钮

    $li.on('click', '.close', deleteLi);
    $li.hover(function () {
      tigger = setTimeout(function () {
        $close.show(500);
      }, 300);
    }, function () {
      clearTimeout(tigger);
      $close.hide(300);
    }); // 移动端删除操作

    $li.on({
      // 手指开始触摸时，设置定时器。
      touchstart: function touchstart(e) {
        longClick = 0;
        timeOutEvent = setTimeout(function () {
          $close.show(500);
          $li.on('click', '.close', deleteLi);
          longClick = 1;
        }, 500);
      },
      // 如果手指滑动只是说明用户不想长按只想滑动。 所以要取消定时器并还原。
      // 如果不还原，返回的定时器的值是不同的。
      touchmove: function touchmove(e) {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
        e.preventDefault();
      },
      // 如果长按没有超过500ms ，手指离开就取消定时器，执行点击事件。
      touchend: function touchend(e) {
        clearTimeout(timeOutEvent);

        if (timeOutEvent !== 0 && longClick === 0) {
          $li.on('click', '.close', deleteLi);
        }
      }
    });
  });
};

render();
$('.addButton').on('click', function () {
  var url = window.prompt('请添加你想要的网址');
  var name = window.prompt('请输入添加网址的名字');

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url.trim();
  } // console.log(url);


  hashMap.push({
    url: url,
    name: name
  });
  render();
});

window.onbeforeunload = function () {
  console.log('页面离开了'); // 因为localStorage只能存字符串

  var string = JSON.stringify(hashMap);
  localStorage.setItem('dataUrl', string);
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.8262c946.js.map