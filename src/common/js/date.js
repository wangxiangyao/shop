export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, myPadStart(str, 2, '0'));
    }
  }
  return fmt;
};
// str.padStart()用不了，太新了
function myPadStart (str, padNum, padValue) {
  let arr = str.split('');
  let len = arr.length;
  if (len > padNum) {
    return str;
  }
  while (arr.length < padNum) {
    arr.unshift(padValue);
  }
  return arr.join('');
}
