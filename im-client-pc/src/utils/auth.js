import store from '@/store'
import router from '@/router'
import JsBase64 from 'js-base64'
import { ServerUserInfo } from '@/api/user'
import SocketInstance from '@/im-server/socket-instance'
import { Message } from 'element-ui';

const USER_TOKEN = 'LUMNEIM-TOKEN'
const USER_INFO = 'LUMNEIM-USERINFO'
const USER_SETTING = 'LUMENIM_SETTING'

/**
 * 登录后置处理
 * 
 * @param {Object} loginInfo 
 * @param {Function} callback 
 */
export function loginPostProcessor(loginInfo, callback) {
  // 获取用户信息
  ServerUserInfo({},{
    headers: { 'ticket': loginInfo.homeLoanTicket }
  }).then(res => {
    if (res.code == 200) {
      // 保存授权信息到本地缓存
      setToken(loginInfo.homeLoanTicket, 2592000)
      // 更新用户信息 and 登录态
      let { account } = res.data
      console.log('登录信息：', account)
      store.commit('UPDATE_USER_INFO', {
        uid: account.id,
        avatar: account.avatar,
        nickname: account.name,
        email: account.email,
        jobNo: account.jobNumber,
        mobile: account.mobile,
        // deptId: account.departmentInfos[0].id,
        // deptName: account.departmentInfos[0].name,
        // jobTitle: account.jobInfos[0].name,
      })
      store.commit('UPDATE_LOGIN_STATUS')
      store.dispatch('LOAD_TALK_ITEMS')

      // 登录成功后连接 WebSocket 服务器
      SocketInstance.connect()

      router.push({
        path: '/',
      })

    } else {
      removeAuth()
      Message.error(res.msg)
    }
  }).catch((e) => {
    console.log(e)
    removeAuth()
    Message.error('登录失败')
  }).finally(() => {
    callback()
  })
}

/**
 * 设置用户授权token
 *
 * @param {String} token
 * @param {Number} expires
 */
export function setToken(token, expires) {
  expires = new Date().getTime() + expires * 1000 - 100 * 1000

  return localStorage.setItem(
    USER_TOKEN,
    JSON.stringify({
      token,
      expires,
    })
  )
}

/**
 * 获取授权token
 */
export function getToken() {
  const result = JSON.parse(
    localStorage.getItem(USER_TOKEN) ||
    JSON.stringify({
      token: '',
      expires: 0,
    })
  )

  let t = new Date().getTime()

  if (result.expires <= t) {
    localStorage.removeItem(USER_TOKEN)
    return ''
  }

  return result.token
}

/**
 * 设置用户信息
 *
 * @param {Object} data
 */
export function setUserInfo(data) {
  localStorage.setItem(USER_INFO, JsBase64.Base64.encode(JSON.stringify(data)))
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  const data = JsBase64.Base64.decode(localStorage.getItem(USER_INFO) || '')
  return data ? JSON.parse(data) : {}
}

/**
 * 获取用户本地缓存的设置信息
 */
export function getUserSettingCache() {
  const data = localStorage.getItem(USER_SETTING)
  return data ? JSON.parse(data) : {}
}

/**
 * 用户设置保存到浏览器缓存中
 *
 * @param {Object} state 用户设置相关信息
 */
export function setUserSettingCache(state) {
  localStorage.setItem(USER_SETTING, JSON.stringify(state))
}

/**
 * 删除用户相关缓存信息
 */
export function removeAll() {
  localStorage.removeItem(USER_TOKEN)
  localStorage.removeItem(USER_INFO)
  localStorage.removeItem(USER_SETTING)
}

/**
 * 删除用户认证信息
 */
export function removeAuth() {
  localStorage.removeItem(USER_TOKEN)
  localStorage.removeItem(USER_INFO)
}
