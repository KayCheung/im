import { getSort, getMutipSort } from '@/utils/functions'
import { GetChatSessionApi } from '@/api/session'
import { formateTalkItem } from '@/utils/session'

const Session = {
    state: {
      loadStatus: 1, // 加载状态[1:未加载;2:加载中;3:加载完成;4:加载失败;]
  
      // 会话列表
      sessions: [],
  
      // 最后一条消息
      unreadMessage: {
        num: 0,
        nickname: '未知',
        content: '...',
      },
    },
    getters: {
      // 过滤所有置顶对话列表
      topSessions: state => {
        return state.sessions.filter(session => session.isTop == 1)
      },
      sessions: state => {
        return state.sessions.sort(
          getMutipSort([getSort((a, b) => a.sendTime > b.sendTime)])
        )
      },
      // 消息未读数总计
      unreadTotal: state => {
        return state.sessions.reduce((total, session) => {
          return total + parseInt(session.unread)
        }, 0)
      },
      sessionTotal: state => state.sessions.length,
    },
    mutations: {
      SET_LOAD_STATUS(state, status) {
        state.loadStatus = status
      },
  
      // 设置会话列表
      SET_SESSIONS(state, sessions) {
        state.sessions = sessions
      },
  
      // 更新对话节点
      UPDATE_TALK_ITEM(state, resource) {
        for (const iterator of state.sessions) {
          if (iterator.index_name === resource.index_name) {
            Object.assign(iterator, resource)
            break
          }
        }
      },
  
      // 新增对话节点
      PUSH_TALK_ITEM(state, resource) {
        state.items.push(resource)
      },
  
      // 移除对话节点
      REMOVE_TALK_ITEM(state, index_name) {
        for (let i in state.sessions) {
          if (state.sessions[i].index_name === index_name) {
            state.sessions.splice(i, 1)
            break
          }
        }
      },
  
      // 更新对话消息
      UPDATE_TALK_MESSAGE(state, resource) {
        for (const iterator of state.sessions) {
          if (iterator.index_name !== resource.index_name) {
            continue
          }
  
          iterator.unread_num++
          iterator.msg_text = resource.msg_text
          iterator.updated_at = resource.updated_at
          break
        }
      },
  
      SET_TLAK_UNREAD_MESSAGE(state, resource) {
        state.unreadMessage.num++
        state.unreadMessage.nickname = resource.nickname
        state.unreadMessage.content = resource.content
      },
  
      // 清除最后一条未读消息
      CLEAR_TLAK_UNREAD_MESSAGE(state) {
        state.unreadMessage = {
          num: 0,
          nickname: '未知',
          content: '...',
        }
      },
    },
    actions: {
      // 加载会话列表 LOAD_TALK_ITEMS
      LOAD_SESSIONS(context) {
        context.commit('SET_LOAD_STATUS', 2)
  
        GetChatSessionApi()
          .then(({ code, data }) => {
            if (code !== '200') return
            context.commit('SET_SESSIONS', data)
            
            context.commit('SET_LOAD_STATUS', 3)
          })
          .catch(() => {
            context.commit('SET_LOAD_STATUS', 4)
          })
      },
    },
  }
  
  export default Session