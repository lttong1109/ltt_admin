<template>
    <div class="manager-insert">
        <div class="up">
            新增管理员
        </div>
        <el-form ref = 'form' :rules = "rules" :model = "form" label-width = "80px">
            <el-form-item class="newuser" prop = "username" style="margin-left: 0;">
                <el-input style = "width: 500px;" v-model = "form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <!-- <el-form-item style="margin: 0;" > -->
            <div class="anniu" >    
                <el-button type = "info" @click = "onSubmit" plain>立即创建</el-button>
            <!-- </el-form-item> -->
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        data(){
            const validateUsername= (rules,value,callback) =>{
                if(/\w{6,18}/.test(value)){
                    callback()
                }else{
                    callback(Error("用户名需6-18位"))
                }
            }
            return{
                form: {
                    username: '',
                },
                rules:{
                    username:[{
                        validator:validateUsername,
                        trigger:'blur'
                    }]
                }
            }
        },
        methods:{
            onSubmit(){
                this.$refs.form.validate(valid =>{
                    if(valid){
                        let username = this.form.username;
                        let formdata = new FormData;
                        formdata.append('username', username)
                        this.$http({
                            method:"POST",
                            url:"api/createsuperuser",
                            data:formdata
                        }).then(response =>{
                            let res = response.data;
                            if(res.status == 'error'){
                                this.$message.error(res.msg)
                            }else{
                                this.$alert(`用户名：${res.username}\n 密码：${res.password}`, '新增账号信息提示', {
                                    confirmButtonText: '确定'
                                });
                                this.form = ""
                            }
                        })
                    }else{
                        return false;
                    }
                })
            }
            //l3CPu52Wok
        }
    }
</script>

<style scoped>
.manager-insert{
    background-color: #fff;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
}
.up{
    background: #304156;
    color: rgb(191, 203, 217);
    line-height: 50px;
    text-align: center;
    font-weight: bold;
    font-size: 18.72px;
    margin-bottom: 100px;
}
.newuser{
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
}
.anniu{
    /* text-align: center; */
    display: flex;
    justify-content: center;
}

</style>