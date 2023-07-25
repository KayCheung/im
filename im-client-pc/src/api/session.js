/**
 * 聊天会话接口
 */
import { post, get } from '@/utils/request'

// 获取会话列表服务接口
export const GetChatSessionApi = data => {
  return get('/im/sessions', data)
}