<template>
    <div class="loginContainerCon">
        <div class="loginMain">
            <div class="loginLeft">
                <img src="~@/assets/image/bailing.png" class="logo" />
                <div class="middle">
                    <h1>一体化金融科技管理平台</h1>
                    <img src="~@/assets/image/login-bg.png" class="frame" />
                </div>
                <div class="copyright" v-html="$store.state.copyright"></div>
            </div>
            <div class="loginRight">
                <div class="loginBox">
                    <div class="loginContainer">
                        <div class="titleHeader"> Hi, 请登录 </div>
                        <el-tabs v-model="loginMethod" @tab-click="handleClick" stretch>
                            <el-tab-pane label="密码登录" name="loginForPwd">
                                <LoginPwd />
                            </el-tab-pane>
                            <el-tab-pane label="手机号登录" name="loginForSms">
                                <LoginSms />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LoginPwd from '@/views/auth/loginPwd.vue'
import LoginSms from '@/views/auth/loginSms.vue'
import Vue from 'vue'
import { Tabs, TabPane, Form } from 'element-ui'

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)

export default {
    name: "login",
    components: {
        LoginPwd,
        LoginSms
    },
    data() {
        return {
            loginMethod: 'loginForPwd'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/page/auth.less';
</style>
  