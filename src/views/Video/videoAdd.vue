<template>
    <div class="mark" v-if="state">
        <div class="title_from">
        <el-form class="vip_add" 
            ref="ruleForm"
            :rules="rules"
            label-position="right" 
            label-width="auto" 
            :model="formLabelAlign">   
            <el-form-item label="视频" prop="video">
                <el-upload 
                    class="upload-demo" 
                    action="https://jsonplaceholder.typicode.com/posts/" >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="视频名称" prop="name">
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="是否免费" prop="video_permission">
                <el-select v-model="value" clearable placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
                <el-button @click="cancelForm('ruleForm')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>
<script>
export default{
    data(){
        const validateName = (rule,value,callback) => {
            if(value == ""){
                callback(new Error('请输入标题名称'));
            }else{
                callback();
            }
        }
        return {
            options: [{
                value: '1',
                label: '免费'
            }, {
                value: '',
                label: '收费'
            }],
            value: '',
            formLabelAlign:{
                name:""
            },
            rules:{
                name:[{validator:validateName,trigger:"blur"}]
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
            }
    },
    methods:{
        submitForm(name){
            this.$refs[name].validate((state) => {
                if(state){
                    let name = this.formLabelAlign.name;
                    let formData = new FormData();
                    formData.append('name',name);
                    // formData.append('video',video);
                    // formData.append('video_permission',video_permission);
                    // formData.append('chapter_id ',"25");
                    this.$http({   //发请求
                        url:"/api/chapter_video",
                        method:'POST',
                        data:formData
                    }).then(res => {
                        let response = res.data;
                        if (response.status == 'success'){
                            this.formLabelAlign.name = "";
                            this.$emit('cancel');
                            this.$message({
                                type:'success',
                                message:`${response.msg}:${response.title}`
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
            this.formLabelAlign.name = "";
            // this.visiable = false;
            this.$emit('cancel')
        },
    }
}
</script>
<style>
.title_add .el-form-item__content{
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
.title_from{
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