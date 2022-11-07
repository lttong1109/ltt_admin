<template>
    <div>
        <el-steps :active="index" align-center>
            <el-step title="步骤1" description="获取邮箱验证码"></el-step>
            <el-step title="步骤2" description="输入邮箱验证码和新密码"></el-step>
            <!-- <el-step title="步骤3" description="请输入您的新密码"></el-step>
            <el-step title="步骤4" description="请再次输入您的新密码"></el-step> -->
        </el-steps>
        <div class="changepass">
            <div class="getcode">
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain @click="sendcode">获取邮箱验证码</el-button>
            </div>
            <div class="aaaaa">
                <el-input style="width: 430px;" v-model="changePassword.code" placeholder="请输入验证码"></el-input>
            </div>
            <div class="aaaaa">
                <el-input style="width: 430px;" v-model="changePassword.newpassword" placeholder="请输入新密码" show-password></el-input>
            </div>
            <div class="aaaaa">
                <el-input style="width: 430px;" v-model="changePassword.newpasswordd" placeholder="请再次输入您的新密码" show-password></el-input>
            </div>
            <div class="button_count">
                <el-button type="primary" plain @click="yes">确定</el-button>
                <el-button type="info" plain @click="no">取消</el-button>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            changePassword: {
                oldpassword:"",
                code:"",
                newpassword:"",
                newpasswordd:""
            },
            index:0
        }
    },
    created(){
        this.password = this.$store.state.user.password;
        this.email = this.$store.state.user.email;
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        //给绑定邮箱发验证码
        sendcode() {
            this.$http({
                url: "api/superchangepwd",
                method: "POST",
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
        },
        //验证验证码 输入新密码
        yes() {
            this.$http({
                method: "PUT",
                url: "api/superchangepwd",
                data: `text=${this.changePassword.code}&pwd1=${this.changePassword.newpassword}&pwd2=${this.changePassword.newpasswordd}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                let res = response.data;
                if (res.status == 'error') {
                    this.$message.error(res.msg)
                } else {
                    this.$alert(
                        '密码更改成功，请重新登陆','提示',{
                            confirmButtonText:"确定",
                            callback: action =>{
                                this.$store.commit('removeToken'); //调用removeToken
                                this.$cookie.remove('rh_id'); //删除rh_id
                                this.$router.push('/login');  //跳转
                            }
                        }
                    )

                    // this.$message({
                    //     type: "success",
                    //     message: res.msg
                    // })
                    // this.index = 2
                    // this.changePassword.code = ''
                    // this.changePassword.newpassword = ''
                    // this.changePassword.newpasswordd = ''
                }
            })
        },
        no(){
            this.changePassword.code = ''
            this.changePassword.newpassword = ''
            this.changePassword.newpasswordd = ''
        }
    }
}



// git

// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/lttong1109/ltt_admin.git
// git push -u origin main
</script>

<style scoped>
.getcode{
    /* display: block; */
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
}
</style>



