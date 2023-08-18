<template>
  <div>
    <MainLayout :idx="1">
      <el-container slot="container" class="full-height">
        <!-- 左侧侧边栏 -->
        <el-aside width="250px" class="aside-box">
          <el-container class="full-height" direction="vertical">
            <!-- 搜索栏 -->
            <el-header height="70px" class="no-padding header">
              通讯录
            </el-header>

            <!-- 对话列表栏 -->
            <el-main class="no-padding no-select">
              <router-link v-if="loadStatus" to="/address/books/organization">
                <div class="menu-list" :class="{ selectd: $route.path == '/address/books/organization', }">
                  组织架构
                </div>
              </router-link>
              <router-link v-if="loadStatus" to="/address/books/team/members">
                <div class="menu-list" :class="{ selectd: $route.path == '/address/books/team/members', }">
                  {{ teamDepartment.name }}
                </div>
              </router-link>
              <router-link to="/address/books/groups">
                <div class="menu-list" :class="{ selectd: $route.path == '/address/books/groups', }">
                  我的群组
                </div>
              </router-link>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 聊天面板容器 -->
        <el-main class="no-padding ov-hidden">
          <router-view />
        </el-main>
      </el-container>
    </MainLayout>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import MainLayout from '@/views/layout/MainLayout'
import GroupLaunch from '@/components/group/GroupLaunch'
import UserSearch from '@/components/user/UserSearch'
import { toTalk } from '@/utils/talk'
import { GetAddressBooksApi } from '@/api/address-book'
import router from '@/router/index'

export default {
  name: 'AddressBooksPage',
  components: {
    MainLayout,
    GroupLaunch,
    UserSearch,
    router
  },
  computed: {
    ...mapState({
      loadStatus: state => state.organization.loadStatus,
      teamDepartment: state => state.organization.teamDepartment,
    })
  },
  created() {
    GetAddressBooksApi().then(res => {
      if (res.code == '200') {
        this.$store.commit('UPDATE_DEPARTMENT_INFO', res.data);
      }
    })
  },
}
</script>
<style scoped lang="less">
.menu-list {
  height: 42px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  cursor: pointer;
  border-left: 3px solid white;
  position: relative;
  transition: 0.2s ease-in;
  font-size: 14px;
  color: black;

  &:hover {
    background-color: #eff0f1;
    border-color: #eff0f1;
  }

  &.selectd {
    border-color: #3370ff !important;
    background-color: #eff0f1;
  }
}

@import '~@/assets/css/page/addressbooks.less';
</style>
  