import { v4 as uuidv4 } from 'uuid'
import { getUserInfo, getToken, removeAll } from '@/utils/auth'
import { Notification } from 'element-ui'

class WsSocket {
  /**
   * Websocket 连接
   *
   * @var Websocket
   */
  connect = null

  /**
   * 配置信息
   *
   * @var Object
   */
  config = {
    heartbeat: {
      setInterval: null,
      pingInterval: 20000,
      pingTimeout: 60000,
    },
    reconnect: {
      lockReconnect: false,
      setTimeout: null, // 计时器对象
      time: 5000, // 重连间隔时间
      number: 1000, // 重连次数
    },
  }

  // 最后心跳时间
  lastTime = 0

  /**
   * 自定义绑定消息事件
   *
   * @var Array
   */
  onCallBacks = []

  defaultEvent = {
    onError: evt => { },
    onOpen: evt => { },
    onClose: evt => { },
  }

  /**
   * 创建 WsSocket 的实例
   *
   * @param {Function} urlCallBack url闭包函数
   * @param {Object} events 原生 WebSocket 绑定事件
   */
  constructor(urlCallBack, events) {
    this.urlCallBack = urlCallBack

    // 定义 WebSocket 原生方法
    this.events = Object.assign({}, this.defaultEvent, events)

    this.on('connect', data => {
      this.config.heartbeat.pingInterval = data.ping_interval * 1000
      this.config.heartbeat.pingTimeout = data.ping_timeout * 1000
    })
  }

  /**
   * 事件绑定
   *
   * @param {String} event 事件名
   * @param {Function} callBack 回调方法
   */
  on(event, callBack) {
    this.onCallBacks[event] = callBack

    return this
  }

  /**
   * 加载 WebSocket
   */
  loadSocket() {
    const url = this.urlCallBack()

    const connect = new WebSocket(url)
    connect.onerror = this.onError.bind(this)
    connect.onopen = this.onOpen.bind(this)
    connect.onmessage = this.onMessage.bind(this)
    connect.onclose = this.onClose.bind(this)

    this.connect = connect
  }

  /**
   * 连接 Websocket
   */
  connection() {
    this.connect == null && this.loadSocket()
  }

  /**
   * 掉线重连 Websocket
   */
  reconnect() {
    // 没连接上会一直重连，设置延迟避免请求过多
    clearTimeout(this.config.reconnect.setTimeout)

    this.config.reconnect.setTimeout = setTimeout(() => {
      this.connection()

      console.log(`网络连接已断开，正在尝试重新连接...`)
    }, this.config.reconnect.time)
  }

  /**
   * 创建发送协议包
   * @param {int} type 
   * @param {String} data 
   * @param {String} to 
   * @param {int} typeu 
   */
  onCreate(type, data, to, typeu) {
    let { uid } = getUserInfo()
    return {
      bridge: false,
      type: type,
      dataContent: data,
      from: uid,
      to: to,
      fp: uuidv4(),
      QoS: true,
      typeu: typeu
    }
  }

  /**
   * 解析接受的消息
   *
   * @param {Object} evt Websocket 消息
   */
  onParse(evt) {
    console.log('IM 服务器响应报文：', evt)
    let protocolData = JSON.parse(evt.data)
    if (protocolData.QoS) {
      if (protocolData.type == 50) {
        let loginResponse = JSON.parse(protocolData.dataContent)
        if (loginResponse.code != 0) {
          console.warn('登录验证失败')
        }
      } else {
        // 发送ACK
      }
    }

    return protocolData
  }

  /**
   * 打开连接
   *
   * @param {Object} evt Websocket 消息
   */
  onOpen(evt) {
    this.lastTime = new Date().getTime()

    this.events.onOpen(evt)

    this.login()
  }

  /**
   * 关闭连接
   *
   * @param {Object} evt Websocket 消息
   */
  onClose(evt) {
    this.events.onClose(evt)

    this.connect.close()

    this.connect = null

    evt.code == 1006 && this.reconnect()
  }

  /**
   * 连接错误
   *
   * @param {Object} evt Websocket 消息
   */
  onError(evt) {
    this.events.onError(evt)
    this.connect.close()
    this.connect = null
    this.reconnect()
  }

  /**
   * 接收消息
   *
   * @param {Object} evt Websocket 消息
   */
  onMessage(evt) {
    this.lastTime = new Date().getTime()

    let result = this.onParse(evt)

    switch (result.type) {
      case 2: /* 处理公共消息 */ break
      case 4: /* 处理ACK消息 */ break
      case 50:
        // 处理服务端登录返回结果
        let loginResponse = JSON.parse(result.dataContent)
        if (loginResponse.code == 0) {
          this.heartbeat()
          // 保存首次登录时间
        } else {
          if (loginResponse.code == 1025) {
            Notification({
              title: '友情提示',
              message: '登录已失效',
              type: 'warning',
            })
          } else if (loginResponse.code == 1026) {
            Notification({
              title: '友情提示',
              message: '登录失败',
              type: 'warning',
            })
          }
          // 登录验证失败关闭连接
          this.close()
          removeAll()
          window.location.reload()
        }
        break
      case 51: /* 处理心跳消息 */ break
      case 52: /* 处理错误消息 */ break
      case 54: /* 处理被踢出消息 */ break
      default: console.warn(`收到的服务端消息类型：${result.type}，但目前该类型客户端不支持解析和处理！`)
    }
  }

  /**
   * WebSocket 心跳检测
   */
  heartbeat() {
    this.config.heartbeat.setInterval = setInterval(() => {
      let t = new Date().getTime()

      if (t - this.lastTime > this.config.heartbeat.pingTimeout) {

        if (this.connect) {
          this.connect.close()
        }

        this.reconnect()
      } else {
        this.ping()
      }
    }, this.config.heartbeat.pingInterval)
  }

  ping() {
    this.connect.send(JSON.stringify(this.onCreate(1, null, "0", -1)))
  }

  /**
   * WebSocket 登录
   */
  login() {
    let token = getToken()
    let { uid } = getUserInfo()
    let loginInfo = `{"loginUserId":${uid},"loginToken":${token},"extra":"{'platform':'pc'}","firstLoginTime":0}`;
    this.send(this.onCreate(0, loginInfo, "0", -1))
  }

  /**
   * 聊天发送数据
   *
   * @param {Object} mesage
   */
  send(mesage) {
    this.connect.send(JSON.stringify(mesage))
  }

  /**
   * 关闭连接
   */
  close() {
    this.connect.close()
  }

  /**
   * 推送消息
   *
   * @param {String} event 事件名
   * @param {Object} data 数据
   */
  emit(event, data) {
    const content = JSON.stringify({ event, data })

    if (this.connect && this.connect.readyState === 1) {
      this.connect.send(content)
    } else {
      alert('WebSocket 连接已关闭...')
      console.error('WebSocket 连接已关闭...', this.connect)
    }
  }
}

export default WsSocket
