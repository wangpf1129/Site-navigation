const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.lastLi')
let dataUrl = localStorage.getItem('dataUrl')
dataUrl = JSON.parse(dataUrl)
const hashMap = dataUrl || [{
  url: 'https://github.com/',
  name: 'GitHub'
},
  {
    url: 'https://nodejs.org/en/',
    name: 'Node'

  },
  {
    url: 'https://react.docschina.org/',
    name: 'React'
  },
  {
    url: 'https://cn.vuejs.org/',
    name: 'Vue'
  },
  {
    url: 'https://www.zhihu.com/',
    name: '知乎'
  },
  {
    url: 'https://www.bilibili.com/',
    name: '哔哩哔哩'
  }
]
const simplify = (url) => {
  return url.replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .replace(/\/.*/, '') // 删除 / 后边的内容
}


const render = () => {
  $siteList.find('li:not(.lastLi)').remove()
  hashMap.forEach((item, index) => {
    const $li = $(`
    <li>
     <div class="site">
       <div class="logo">
         <svg class="icon">
           <use xlink:href="#icon-${simplify(item.url)[0]}"></use>
         </svg>
       </div>
       <div class="close">
           <svg class="icon">
               <use xlink:href="#icon-close"></use>
            </svg>
        </div>
       <span class="siteName">${item.name}</span></span>
     </div> 
   </li>
    `).insertBefore($lastLi)
    // console.log(simplify(item.url)[0])
    const $close = $li.find('.close')
    // 定义PC端定时器
    let tigger = null
    // 定义移动端定时器
    let timeOutEvent = null
    // 定义长按 ， 用来判断是否为长按事件
    // 不定义会出现BUG：无论点击或者长按，都会执行touched内的方法，即长按点击都会去跳转页面。
    let longClick = null
    // 删除站点
    let deleteLi = function (e) {
      e.stopPropagation()
      hashMap.splice(index, 1)
      render()
    }
    $li.on('click', () => {
      window.open(item.url)
    })

    // PC端 显示隐藏删除按钮
    $li.on('click', '.close', deleteLi)
    $li.hover(() => {
      tigger = setTimeout(() => {
        $close.show(500)
      }, 300)
    }, () => {
      clearTimeout(tigger)
      $close.hide(300)
    })

    // 移动端删除操作
    $li.on({
      // 手指开始触摸时，设置定时器。
      touchstart: function (e) {
        longClick = 0
        timeOutEvent = setTimeout(() => {
          $close.show(500)
          $li.on('click', '.close', deleteLi)
          longClick = 1
        }, 500)
      },
      // 如果手指滑动只是说明用户不想长按只想滑动。 所以要取消定时器并还原。
      // 如果不还原，返回的定时器的值是不同的。
      touchmove: function (e) {
        clearTimeout(timeOutEvent)
        timeOutEvent = 0
        e.preventDefault()
      },
      // 如果长按没有超过500ms ，手指离开就取消定时器，执行点击事件。
      touchend: function (e) {
        clearTimeout(timeOutEvent)
        if (timeOutEvent !== 0 && longClick === 0) {
          $li.on('click', '.close', deleteLi)
        }
      }
    })
  })
}

render()


$('.addButton')
  .on('click', () => {
    let url = window.prompt('请添加你想要的网址')
    let name = window.prompt('请输入添加网址的名字')
    if (url.indexOf('http') !== 0) {
      url = 'https://' + url.trim()
    }
    // console.log(url);
    hashMap.push({
      url: url,
      name: name
    })
    render()
  })


window.onbeforeunload = () => {
  console.log('页面离开了');
  // 因为localStorage只能存字符串

  const string = JSON.stringify(hashMap)
  localStorage.setItem('dataUrl', string)
}