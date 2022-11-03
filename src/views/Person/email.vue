<template>
    <div>
        <el-steps :active="index" align-center>
            <el-step title="步骤1" description="获取旧邮箱验证码"></el-step>
            <el-step title="步骤2" description="输入旧邮箱验证码"></el-step>
            <el-step title="步骤3" description="输入新邮箱地址"></el-step>
            <el-step title="步骤4" description="输入新邮箱验证码"></el-step>
        </el-steps>
        <div class="changeemail">
            <div class="bbbbb">
                <el-input v-model="changeEmail.oldemail" placeholder="请输入旧邮箱地址" style="width: 400px; "></el-input>
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain @click="oldreq">发送验证码</el-button>
            </div>
            <div class="bbbbb">
                <el-input v-model="changeEmail.oldecode" placeholder="请输入旧邮箱的验证码" style="width: 400px; "></el-input>
                <el-button type="primary" style="height: 35px;margin-left: 10px;" plain @click="submitOldcode">提交验证码</el-button>
            </div>
            <div class="bbbbb">
                <el-input v-model="changeEmail.newemail" placeholder="请输入新邮箱" style="width: 400px; "></el-input>
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain @click="newaddress">获取验证码</el-button>
            </div>
            <div class="bbbbb">
                <el-input v-model="changeEmail.newecode" placeholder="请输入新邮箱的验证码" style="width: 400px; "></el-input>
                <el-button type="primary" style="height: 35px;margin-left: 10px;" plain @click="submitNewcode">提交验证码</el-button>
            </div>
            <div class="button_count">
                <el-button type="primary" plain @click="ok">确定</el-button>
                <el-button type="info" plain @click="no">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            changeEmail: {
                oldemail: '',
                oldecode: '',
                newemail: '',
                newecode: ''
            },
            index:0
        }
    },
    created(){
        this.oldemail = this.$store.state.user.email;
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        //旧邮箱发验证码
        oldreq() {
            console.log(this.oldemail)
            console.log(this.changeEmail.oldemail)
            if (this.oldemail == !this.changeEmail.oldemail) {
                this.$message({
                    message: "旧邮箱地址错误请重新输入"
                }),
                    this.changeEmail.oldemail = ""
            } else {
                this.$http({
                    method: "POST",
                    url: "api/superchangeemail",
                }).then(response => {
                    let res = response.data;
                    if (res.status == 'error') {
                        this.$message.error(res.msg)
                    } else {
                        this.$message({
                            type: "success",
                            message: `验证码已发送，有效期为两分钟，请及时查收'`
                        })
                        this.index = 1
                    }
                })
            }
        },
        //验证旧邮箱验证码
        submitOldcode(){
            this.$http({
                method:"PUT",
                url:"api/superchangeemail",
                data:`text=${this.changeEmail.oldecode}`
            }).then(response => {
                    let res = response.data;
                    if (res.status == 'error') {
                        this.$message.error(res.msg)
                    } else {
                        this.$message({
                            type: "success",
                            message: res.msg
                        })
                        this.index = 2
                    }
                })
        },
        //绑定新邮箱
        newaddress() {
            this.$http({
                method: "POST",
                url: "api/superbindnewemail",
                data: `email1=${this.changeEmail.newemail}&email2=${this.changeEmail.newemail}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                let res = response.data;
                if (res.status == 'error') {
                    this.$message.error(res.msg)
                } else {
                    this.$message({
                        type: "success",
                        message: res.msg
                    })
                    this.index = 3
                }
            })
        },
        //新邮箱绑定验证码
        submitNewcode(){
            // if(){
                this.$http({
                method: "PUT",
                url: "api/superbindnewemail",
                data:`text=${this.changeEmail.newecode}`,
                headers:{
                'Content-Type':'application/x-www-form-urlencoded'
                }
            }).then(response => {
                let res = response.data;
                if (res.status == 'error') {
                    this.$message.error(res.msg)
                } else {
                    this.$message({
                        type: "success",
                        message: res.msg
                    })
                    this.index = 4
                }
            })
        },
        ok(){
            this.changeEmail.oldemail=''
            this.changeEmail.oldecode= ''
            this.changeEmail.newemail= ''
            this.changeEmail.newecode=''
        },
        no(){
            this.changeEmail.oldemail=''
            this.changeEmail.oldecode= ''
            this.changeEmail.newemail= ''
            this.changeEmail.newecode=''
        }
    }   
}
</script>

<style scoped>

</style>