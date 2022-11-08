<template>
    <div class="mark" v-if="state">
        <div class="model_from">
        <el-form class="chapter_add" 
            ref="ruleForm"
            :rules="rules"
            label-position="right" 
            label-width="auto" 
            :model="formLabelAlign">
            <el-form-item label="一级标题id：">
                {{Chapter_id}}
            </el-form-item>
            <el-form-item label="新增模块名称" prop="model_name">
                <el-input v-model="formLabelAlign.model_name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" plain>确认</el-button>
                <el-button type="info" @click="cancelForm('ruleForm')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>
<script>
// $chilren $parent $root $emit props ref注册 this.$refs去找你注册的这个组件
export default{
    data(){
        const validateName = (rule,value,callback) => {
            if(value == ""){
                callback(new Error('请输入模块名称'));
            }else{
                callback();
            }
        }
        return{
            formLabelAlign:{
                chapter_name:""
            },
            rules:{
                chapter_name:[{validator:validateName,trigger:"blur"}]
                //      自定义函数               触发方式
            },
            // visiable:true
        }
    },
    props:{
            state:{
                type:Boolean,
                default(){
                    return false
                }
            },
            Chapter_id:{
                type:Number,
                required:true
            }
    },
    methods:{
        submitForm(chapter_name){
            this.$refs[chapter_name].validate((state) => {
                if(state){
                    let name = this.formLabelAlign.model_name;
                    let classify = this.Chapter_id;
                    // console.log(pk)
                    let formData = new FormData();
                    formData.append('name',name);
                    formData.append('classify',classify);

                    this.$http({   //发请求
                        url:"api/course",
                        method:'POST',
                        data:formData
                    }).then(res => {
                        let response = res.data;
                        if (response.status == 'success'){
                            this.formLabelAlign.model_name = "";
                            this.$emit('cancel');
                            this.$message({
                                type:'success',
                                message:`${response.msg}`
                            })
                            this.$emit('success')
                        }else{
                            this.$message.error(response.msg);
                        }
                    }).catch(error => {
                        this.$message.error('接口错误');
                    })
                }else{
                    return false;
                }
            })
        },
        cancelForm(){
            this.formLabelAlign.chapter_name = "";
            this.$emit('cancel')
        }
    }
}
</script>
<style>
.model_add .el-form-item__content{
    margin-left: 0 !important;
}
.mark{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    background-color: rgba(0,0,0,.4);
    z-index: 999;
}
</style>
<style scoped>
.model_from{
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    padding-top: 40px;
}
</style>