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
                <router-link
                  v-for="(menu, index) in menus"
                  :to="menu.path"
                  :key="index"
                >
                  <div class="menu-list" :class="{selectd: $route.path == menu.path,}">
                    {{ menu.name }}
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
  import MainLayout from '@/views/layout/MainLayout'
  import GroupLaunch from '@/components/group/GroupLaunch'
  import UserSearch from '@/components/user/UserSearch'
  import { toTalk } from '@/utils/talk'
  import { GetAddressBooksApi } from '@/api/address-book'
  
  export default {
    name: 'AddressBooksPage',
    components: {
      MainLayout,
      GroupLaunch,
      UserSearch,
    },
    data() {
      return {
        launchGroupShow: false,
  
        // 查询关键词
        input: '',
  
        submenu: false,
        menus: [
          {
            name: '组织架构',
            path: '/address/books/organization',
          },
          {
            name: '我的群组',
            path: '/address/books/groups',
          },
        ],
      }
    },
    watch: {

    },
    computed: {

    },
    created() {
      GetAddressBooksApi().then(res => {
        if (res.code == '200') {
          let { departments } = res.data
          this.findDepartment(departments);
        }
      })
    },
    methods: {
      // 查找所在部门
      findDepartment(departments) {
        for(let dept of departments) {
          for(let user of dept.users) {
            if(user.id == this.$store.state.user.uid) {
              this.menus.splice(1, 0, {
                name: dept.name,
                path: '/address/books/team/members'
              })
              return;
            }
          }
          this.findDepartment(dept.departments)
        }
      },
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
  