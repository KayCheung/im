<!-- TODO 待删除，新的页面 /views/addressbooks/* -->
<template>
    <div class="panel">
        <el-container class="full-height">
            <el-header height="70px" class="header no-select border">
                <p>组织架构</p>
            </el-header>
            <el-main class="panel-body no-padding lum-scrollbar">
                <template v-if="loadStatus && deptNavs.length > 0">
                    <div class="navigation">
                        <div v-for="(dept, index) in deptNavs">
                            <el-button type="text" size="mini" :disabled="index == deptNavs.length - 1"
                                @click="changeDepartment(dept, index)">{{ dept.name }}</el-button>
                            <span v-if="index < deptNavs.length - 1" class="el-icon-arrow-right" />
                        </div>
                    </div>
                    <div v-for="(dept, index) in deptNavs[deptNavs.length - 1].departments" :key="dept.id" class="data-item"
                        @click="loadSubordinate(dept)">
                        <el-avatar class="avatar" shape="square" :size="35" :src="dept.avatar">
                            {{ dept.name.substr(0, 1) }}
                        </el-avatar>
                        <div class="title">
                            <span>
                                {{ dept.name }}({{ dept.staffCount }})
                            </span>
                        </div>
                        <div class="subordinate">
                            <el-button type="text" size="mini">下级</el-button>
                        </div>
                    </div>
                    <div v-for="(staff, index) in deptNavs[deptNavs.length - 1].staffs" :key="staff.id" class="data-item"
                        @click="touser(staff, index)">
                        <el-avatar class="avatar" shape="square" :size="35" :src="staff.avatar">
                            {{ staff.name.substr(staff.name.length - 2, staff.name.length) }}
                        </el-avatar>
                        <div class="title">
                            <span>
                                {{ staff.name }}
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else-if="loadStatus && deptNavs.length == 0">
                    <Empty />
                </template>
                <template v-else>
                    <Loading />
                </template>
            </el-main>
        </el-container>
    </div>
</template>
  
<script>
import { mapState } from 'vuex'
import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'
import { toTalk } from '@/utils/talk'

export default {
    components: {
        Empty,
        Loading,
    },
    computed: {
        ...mapState({
            loadStatus: state => state.organization.loadStatus,
            deptNavs: state => state.organization.deptNavs,
        })
    },
    methods: {

        loadSubordinate(dept) {
            this.$store.commit('ADD_DEPT_NAVS', dept)
        },

        changeDepartment(dept, index) {
            this.$store.commit('DEL_DEPT_NAVS', index);
            if (this.$route.path == '/address/books/team/members') {
                this.$router.push({
                    path: '/address/books/organization',
                })
            }
        },

        // 查看用户名片
        touser(item, index) {
            this.$user(item.id, {
                editRemarkCallbak: data => {
                    this.items[index].friend_remark = data.remarks
                },
            })
        },

        // 跳转聊天页面
        toTalk(talk_type, receiver_id) {
            toTalk(talk_type, receiver_id)
        },
    },
}
</script>
<style scoped lang="less">
@import '~@/assets/css/page/addressbooks.less';
</style>
  