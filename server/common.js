
/**
 * 通信格式
 * @param {*} type 
 * @param {*} msg 
 * @param {*} status 
 * @param {*} data 
 * @returns 
 */
export function getMsg(type, msg, status = 200, data = null) {
  return { type, msg, status, data }
}

/**
 * 解析 url 参数
 * @param {*} url 
 * @param {*} queryName 
 */
export function getParams(url, queryName) {
  let query = decodeURI(url.split('?')[1])
  let vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === queryName) {
      return pair[1];
    }
  }
  return null;
}

export default {
  getMsg,
  getParams
}
