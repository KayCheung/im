<template>
    <el-form class="tpibox" ref="loginSmsForm" :model="loginSmsForm" :rules="rules">
        <div class="messageBox mTop5">
            <div class="mesDiv">
                <div class="mesTit">手机号码</div>
                <el-form-item prop="phoneNumber">
                    <el-input v-model="loginSmsForm.phoneNumber" placeholder="手机号码" maxlength="11"
                        oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="onSubmit()" />
                </el-form-item>
            </div>
            <div class="mesDiv">
                <div class="mesTit">验证码</div>
                <el-form-item prop="smsCode">
                    <el-input v-model="loginSmsForm.smsCode" placeholder="验证码" maxlength="6"
                        oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="onSubmit()" />
                </el-form-item>
                <div v-if="smsLock" class="smsbtn disabled">正在发送 ...</div>
                <div v-else-if="smsLock == false && smsLockObj.time == null" class="smsbtn" @click="sendSms">
                    发验证码
                </div>
                <div v-else class="smsbtn disabled">
                    ({{ smsLockObj.time }}s)重发
                </div>
            </div>
            <el-form-item>
                <el-button type="primary" class="btnForLogin Hand" :loading="loginLoading" @click="onSubmit()"> 登 录
                </el-button>
            </el-form-item>

        </div>
    </el-form>
</template>
<script>
import { isMobile } from '@/utils/validate'
import SmsLock from '@/plugins/sms-lock'
import { loginPostProcessor } from '@/utils/auth'
import { SendLoginSmsCodeApi, LoginApi } from '@/api/auth'

export default {
    data() {
        return {
            loginLoading: false,
            smsLock: false,
            smsLockObj: null,
            loginSmsForm: {
                phoneNumber: '',
                smsCode: '',
            },
            rules: {
                phoneNumber: [
                    {
                        required: true,
                        message: '手机号码不能为空！',
                        trigger: 'blur',
                    },
                    {

                        len: 11,
                        message: '请输入正确的手机号码！',
                        trigger: 'blur'
                    }
                ],
                smsCode: [
                    {
                        required: true,
                        message: '验证码不能为空！',
                        trigger: 'blur'
                    },
                    {
                        len: 6,
                        message: '请输入正确的验证码！',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.smsLockObj = new SmsLock('PHONE_LOGIN_SMS', 60)
    },
    destroyed() {
        this.smsLockObj.clearInterval()
    },
    methods: {
        sendSms() {
            if (!isMobile(this.loginSmsForm.phoneNumber)) {
                this.$refs.loginSmsForm.validateField('phoneNumber')
                return false
            }

            this.smsLock = true
            SendLoginSmsCodeApi({
                phoneNumber: this.loginSmsForm.phoneNumber,
                templateCode: 1001,
            }).then(res => {
                if (res.code == 200) {
                    this.smsLockObj.start()
                } else {
                    this.$message.error(res.msg);
                }
            }).catch(() => {
                this.$message.error('验证码发送失败');
            }).finally(() => {
                this.smsLock = false
            })
        },
        onSubmit() {
            if (this.loginLoading) return false

            this.$refs.loginSmsForm.validate(valid => {
                if (!valid) return false
                this.loginLoading = true
                this.login()
            })
        },
        login() {
            LoginApi({
                businessType: "oa",
                loginName: this.loginSmsForm.phoneNumber,
                loginType: "002",
                verificationCode: this.loginSmsForm.smsCode
            }).then(res => {
                if (res.code == 200) {
                    // 登录后置处理
                    loginPostProcessor(res.data, () => this.loginLoading = false)
                } else {
                    this.loginLoading = false
                    this.$message.error(res.msg);
                }
            }).catch(() => {
                this.loginLoading = false
                this.$message.error('验证码发送失败');
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/page/auth.less';
</style>