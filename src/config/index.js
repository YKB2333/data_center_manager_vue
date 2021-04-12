
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  projectName: '数据决策中心',
  // 自定义请求携带token的字段名
  headersTokenKey: 'Authorization',
  // cookie过期时间
  cookieExpires: 0.5
}