<template>
    <el-form class="tpibox" ref="loginPwdForm" :model="loginPwdForm" :rules="rules">
        <div class="messageBox mTop5">
            <div class="mesDiv">
                <div class="mesTit">账号</div>
                <el-form-item prop="account">
                    <el-input v-model="loginPwdForm.account" @keyup.enter.native="onSubmit('loginPwdForm')"
                        placeholder="公司邮箱或手机号"></el-input>
                </el-form-item>
            </div>
            <div class="mesDiv">
                <div class="mesTit">密码</div>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginPwdForm.password" @keyup.enter.native="onSubmit('loginPwdForm')"
                        placeholder="密码"></el-input>
                </el-form-item>
            </div>
            <el-button type="primary" class="btnForLogin Hand" :loading="loginLoading" @click="onSubmit('loginPwdForm')"> 登
                录
            </el-button>
            <div class="forget">忘记密码</div>
        </div>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            loginLoading: false,
            loginPwdForm: {
                account: '',
                password: '',
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: '邮箱或手机号不能为空！',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
                        message: '请输入正确的邮箱或手机号！',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空！',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        onSubmit(formName) {
            if (this.loginLoading) return false

            this.$refs[formName].validate(valid => {
                if (!valid) return false
                this.loginLoading = true
                this.login()
            })
        },

        login() {
            // ServerSendLoginSmsCode({
//                 businessType: "oa"
// captchaType: 1
// isCookie: false
// loginName: "11111111111"
// loginType: "001"
// password: "111111111"
            // })
            this.loginLoading = false
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/page/auth.less';
</style>
