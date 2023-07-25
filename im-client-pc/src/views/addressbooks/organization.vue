<!-- TODO 待删除，新的页面 /views/addressbooks/* -->
<template>
    <div class="panel">
        <el-container class="full-height">
            <el-header height="70px" class="header no-select border">
                <p>组织架构</p>
            </el-header>
            <el-main class="panel-body no-padding lum-scrollbar">
                <template v-if="status == 0">
                    <Loading />
                </template>
                <template v-if="status == 1">
                    <div class="navigation">
                        <div v-for="(dept, index) in deptNavs">
                            <el-button type="text" size="mini" :disabled="index == deptNavs.length - 1" 
                                @click="changeDepartment(dept, index)">{{ dept.name}}</el-button>
                            <span v-if="index < deptNavs.length - 1" class="el-icon-arrow-right"/>
                        </div>
                    </div>
                    <div v-for="(dept, index) in department.departments" :key="dept.id" class="data-item"
                        @click="loadSubordinate(dept)">
                        <el-avatar class="avatar" shape="square" :size="35" :src="dept.avatar">
                            {{ dept.name.substr(0, 1) }}
                        </el-avatar>
                        <div class="title">
                            <span>
                                {{ dept.name }}({{ dept.user_count }})
                            </span>
                        </div>
                        <div class="subordinate">
                            <el-button type="text" size="mini">下级</el-button>
                        </div>
                    </div>
                    <div v-for="(user, index) in department.users" :key="user.id" class="data-item"
                        @click="touser(user, index)">
                        <el-avatar class="avatar" shape="square" :size="35" :src="user.avatar">
                            {{ user.name.substr(user.name.length - 2, user.name.length) }}
                        </el-avatar>
                        <div class="title">
                            <span>
                                {{ user.name }}
                            </span>
                        </div>
                    </div>
                </template>
            </el-main>
        </el-container>
    </div>
</template>
  
<script>
import { GetAddressBooksApi } from '@/api/address-book'
import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'
import { toTalk } from '@/utils/talk'

export default {
    components: {
        Empty,
        Loading,
    },
    data() {
        return {
            deptNavs: [],
            department: {},
            status: 0,
        }
    },
    created() {
        this.loadOrganization()
    },
    methods: {
        // 加载好友列表
        loadOrganization() {
            GetAddressBooksApi().then(res => {
                if (res.code == '200') {
                    this.department = res.data
                    this.deptNavs.push(this.department)
                    this.status = 1
                }
            })
        },

        loadSubordinate(dept) {
            this.deptNavs.push(dept)
            this.department = dept
        },

        changeDepartment(dept, index) {
            console.log(index)
            this.deptNavs.splice(index + 1);
            this.department = dept
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
  