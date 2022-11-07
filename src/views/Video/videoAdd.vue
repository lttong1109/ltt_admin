<template>
    <div class="mark" v-if="state">
        <div class="title_from">
        <el-form class="video_add" 
            ref="ruleForm"
            :rules="rules"
            label-position="right" 
            label-width="auto" 
            :model="formLabelAlign">   
            <el-form-item label="章节编号">
                {{getchapterid}}
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
            <el-form-item label="添加视频" prop="video" class="addvideo">
                <el-upload 
                    class="upload-demo" 
                    action="http://81.68.121.52:8000/api/chapter_video" 
                    :show-file-list="false"
                    :auto-upload="false"
                    :data="videocont"
                    name="video"
                    ref="upload"
                    :headers="header"
                    :on-change="change"  
                    :name_="name"
                    :zs="video_permission"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  @click="finish">完成</el-button>
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
            formLabelAlign:{
                name:"",
                chapter_id:"",
                video_permission:"",
                video:"",
            },
            videocont:{
                name:'',
                chapter_id:'',
                video_permission:"",
            },
            header:{
                authorization:`Bearer ${this.$store.state.token}`
            },
            // visiable:true
            // imageUrl:'',
            fileList: [ ],
            action:'',
            name:"",
            video_permission:"",
            chapter_id:0
        }
    },
    props:{
            state:{
                type:Boolean,
                default(){
                    return false
                }
            },
            getchapterid:{
                type:Number,
                required:true
            }
    },
    methods:{
        finish(){
            this.state = false
            // this.change();
            

        },
        successs(res){
            if(res.status == 'error'){
                this.$message.error(res.msg)
            }else{
                this.$message({
                type:"success",
                message:'成功'
            })
            }  
        },
        change(file){
            this.imageUrl = URL.createObjectURL(file.raw);
            this.videocont['name']=this.formLabelAlign.name;
            this.videocont['video_permission']=this.formLabelAlign.video_permission;
            this.videocont['chapter_id']=this.getchapterid;
            this.$refs.upload.submit()
            console.log(file,1)
        },
        a(e){
            let file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = e => {
                console.log(e.target.result);
                this.src = e.target.result;
            }
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