import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { baseURL, headersTokenKey } from '@/config'
import { getToken } from '@/utils/auth'

const http = axios.create({
  baseURL: baseURL
})

const handleExpire = () => {
  // Message.error('登录过期，请重新登录')
  MessageBox({
    message: 'token过期，请重新登录',
    showClose: false,
    showCancelButton: false,
    callback: () => {
      store.dispatch('clearUser').then(() => {
        location.reload()
      })
    }
  })
}

// request interceptor
http.interceptors.request.use(
  config => {
    if (getToken()) {
      // 请求时携带token
      config.headers[headersTokenKey] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error)
    Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  response => {
    // console.log('response', response)
    let token = response.headers[headersTokenKey.toLowerCase()] || ''
    if (token) {
      // console.info(token)
      store.commit('SET_TOKEN', token)
    }
    if (response.status === 200) {
      if (response.config.responseType === 'blob' || response.data.success) {
        return response.data
      } else {
        if (response.data.message) {
          if (response.data.message === '登录已过期') {
            handleExpire()
          } else {
            Message({
              type: 'error',
              customClass: 'white_space_wrap',
              message: response.data.message
            })
          }
        } else {
          Message.error('请求失败，请联系管理员')
        }
        return Promise.reject(response.data)
      }
    } else {
      Message.error(response.status)
      return Promise.reject(response.status)
    }
  },
  error => {
    console.log('error=>', error.response) // for debug
    let errorMsg = ''
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      errorMsg = '请求超时，请重试'
    } else {
      if (error.response) {
        if (error.response.status === 401) {
          handleExpire()
          return Promise.reject('401')
        } else if (error.response.status === 500) {
          errorMsg = '500 Internal Server Error'
        } else {
          if (error.response.data.message) {
            errorMsg = error.response.data.message
            if (errorMsg.includes('Subject does not have permission')) {
              errorMsg = `未授权${errorMsg.match(/\[.+\]/g)}`
            }
          } else if (error.response.config.responseType && error.response.config.responseType === 'blob') {
            errorMsg = '未授权下载'
          } else {
            errorMsg = error.response.status.toString()
          }
        }
      } else {
        errorMsg = '网络连接失败，，请重试'
      }
    }
    Message.error(errorMsg)
    return Promise.reject(errorMsg)
  }
)

export default http
