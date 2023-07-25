import SocketInstance from '@/im-server/socket-instance'
import { ServerUserInfo } from '@/api/user'

export default {
  created() {
    // 判断用户是否登录
    if (this.$store.getters.loginStatus) {
      this.initialize()
      // TODO 待删除
      // this.$store.dispatch('LOAD_TALK_ITEMS')
      this.$store.dispatch('LOAD_SESSIONS')
    }
  },
  methods: {
    // 页面初始化设置
    initialize() {
      SocketInstance.connect()
      this.loadUserSetting()
    },

    // 加载用户相关设置信息，更新本地缓存
    loadUserSetting() {
      // 获取用户信息 TODO IM服务器需提供一个用户设置信息的接口
      ServerUserInfo().then(res => {
        if (res.code == 200) {
          let { account } = res.data
          this.$store.commit('UPDATE_USER_INFO', {
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
        }
      })
    },

    reload() {
      this.$root.$children[0].refreshView()
    },
  },
}
