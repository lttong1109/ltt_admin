<template>
    <div>
        <el-steps :active="index" align-center>
            <el-step title="步骤1" description="请输入您的旧密码"></el-step>
            <el-step title="步骤2" description="输入邮箱验证码"></el-step>
            <el-step title="步骤3" description="请输入您的新密码"></el-step>
            <el-step title="步骤4" description="请再次输入您的新密码"></el-step>
        </el-steps>
        <div class="changepass">
            <div class="aaaaa">
                <el-input style="width: 317px; " v-model="changePassword.oldpassword" placeholder="请输入旧密码"></el-input>
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain @click="sendcode">确定并发送邮箱验证码</el-button>
            </div>
            <div class="aaaaa">
                <el-input style="width: 430px;" v-model="changePassword.code" placeholder="请输入验证码"></el-input>
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain>确定</el-button>
            </div>
            <div class="aaaaa">
                <el-input style="width: 430px;" v-model="changePassword.newpassword" placeholder="请输入新密码"></el-input>
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain>确定</el-button>
            </div>
            <div class="aaaaa">
                <el-input style="width: 430px;" v-model="changePassword.newpasswordd" placeholder="请再次输入您的新密码"></el-input>
                <el-button type="success" style="height: 35px;margin-left: 10px;" plain>确定</el-button>
            </div>
            <!-- <el-input v-model="changePassword.newpassword" placeholder="请输入新密码"></el-input>
            <el-input v-model="changePassword.newpasswordd" placeholder="请再次输入您的新密码"></el-input> -->
            <div class="button_count">
                <el-button type="primary" plain>确定</el-button>
                <el-button type="info" plain>取消</el-button>
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
        //输旧密码并且给绑定邮箱发验证码
        sendcode(){
            if(this.password != this.changePassword.oldpassword){
                this.$message({
                    message: "旧密码输入错误，请重新输入"                   
                })
                this.changePassword.oldpassword = ""
            }else{
                this.$http({
                    url:"api/superchangepwd",
                    method:"POST",

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
        }
    }
}
</script>

<style scoped>

</style>