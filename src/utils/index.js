
export function formatDate(number, format) { // formatDate('Y/M/D h:m:s')
  if(!number){
    return ;
  }
  if (typeof number === 'string') number = Number(number)
  let formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var formateArr  = ['Y','M','D','h','m','s']
  var returnArr   = []
  
  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))
  
  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))
  
  for (var i in returnArr)  
  {  
    format = format.replace(formateArr[i], returnArr[i])
  }  
  return format
}

export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

export function uniqueArrByKey(arr, key) {
  let obj = {}
  let result = []
  result = arr.reduce((cur, next) => {
    obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next)
    return cur
  }, [])
  return result
}

export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}

export function wrapText(val) {
  return val.replace(/\r\n/g, '<br />')
}

export function getUrlParam(url, key) {
  return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
}

export function checkEmail(email) {
  let reg = /^([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return reg.test(email)
}

export function checkMobile(mobile) { // 1开头，11位
  let reg = /^1\d{10}$/
  return reg.test(mobile)
}

