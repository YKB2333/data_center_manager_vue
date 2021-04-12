import http from '@/utils/http'
import { Base64 } from 'js-base64'

// 登录
export const login = (account, pwd) => http.post(`/login`, { loginAcount: account, loginPassword: Base64.encode(pwd) })

// 退出登录
export const logout = () => http.put(`/logout`)

// 修改密码
export const modifyPwd = (id, newPassword, oldPassword) => http.post(`/user/updateLoginPassword`, { id, newPassword: Base64.encode(newPassword), oldPassword: Base64.encode(oldPassword) })

// 重置密码-邮箱方式
export const verifyEmailTokenAndModifyPwd = (token, newPwd) => http.post(`/account/verifyEmailTokenAndModifyPwd`, { token, newPwd: Base64.encode(newPwd) })

// 重置密码-手机方式
export const verifyFindCodeAndModifyPwd = (code, mobile, newPwd) => http.post(`/account/verifyEmailTokenAndModifyPwd`, { code, mobile, newPwd: Base64.encode(newPwd) })

// 发送短信验证码
export const sendFindPwdSms = (mobile) => http.put(`/account/sendFindPwdSms?mobile=${mobile}`)

// 发送邮件
export const sendFindPwdEmail = (email) => http.put(`/account/sendFindPwdEmail?email=${email}`)


