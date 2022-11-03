<template>
  <div class="person_all">
    <div class="person_left">
      <div class="person_title">
        <h3>个人信息</h3>
      </div>
      <div class="demo-type">
        <div>
          <div class="avator-count">
            <el-avatar :src="imageUrl"></el-avatar>
          </div>
          <p class="changeAvator">
            <i class="el-icon-edit"></i>
            <span @click="editAvatar">修改头像</span>
          </p>
        </div>
        <el-descriptions :column="1">
          <el-descriptions-item label="用户名 "> {{ user.username }}</el-descriptions-item>
          <el-descriptions-item label="性别 "> {{ user.gender }}</el-descriptions-item>
          <el-descriptions-item label="手机号 "> {{ user.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱 " v-if="user.email"> {{ user.email }}</el-descriptions-item>
          <el-descriptions-item label="邮箱 " v-else>
            <el-input v-model="email" placeholder="请输入邮箱" prop="email"></el-input>
            <el-button @click="sendmsg">
              发送验证码
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
        <el-dialog title="修改头像" :visible.sync="editAvatarDialog" width="40%">
          <el-row type="flex" justify="center">
            <div class="cropper">
              <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
                :info="option.info" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
                :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime"></vueCropper>
            </div>
            <div class="previewBox">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img">
              </div>
              <el-row type="flex" justify="center">
                <el-upload :headers="header" ref="upload" name="avator"
                  action="http://81.68.121.52:8000/api/changesuperavator" :show-file-list="false" :auto-upload="false"
                  :on-change="uploadImg" :on-success="success">
                  <el-button size="mini" type="primary"> 选择头像
                  </el-button>
                </el-upload>
              </el-row>
              <br>
              <el-row>
                <el-button icon="el-icon-plus" circle size="mini" @click="changeScale(1)"></el-button>
                <el-button icon="el-icon-minus" circle size="mini" @click="changeScale(-1)"></el-button>
                <el-button icon="el-icon-download" circle size="mini" @click="down('blob')"></el-button>
                <el-button icon="el-icon-refresh-left" circle size="mini" @click="rotateLeft"></el-button>
                <el-button icon="el-icon-refresh-right" circle size="mini" @click="rotateRight"></el-button>
              </el-row>
            </div>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editAvatarDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveEditAvatar">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="person_right">
      <div class="personchange_title">
        <h3>修改信息</h3>
      </div>
      <div class="change_count">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="修改密码" name="second">
            <Password></Password>
          </el-tab-pane>
          <el-tab-pane label="修改邮箱" name="first">
            <Email></Email>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper';
import { mapState } from 'vuex';//辅助函数
import Password from './password';
import Email from './email'
export default {
  name: "Home",
  components: {
    VueCropper,
    Password,
    Email
  },
  computed:{
    ...mapState(['user'])
  },
  data() {
    return {
      imageUrl: '',
      state: false,
      email:"", 
      activeName: 'second', 
      header: {
        authorization: `Bearer ${this.$store.state.token}`
      },
      editAvatarDialog: false,
      previews: {},
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'jpeg', // 裁剪生成额图片的格式
        canMove: true,  // 能否拖动图片
        original: false,  // 上传图片是否显示原始宽高
        canMoveBox: true,  // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true // 截图框固定大小
      },
    }
  },
  created() {
    this.imageUrl = this.$store.state.user.avator;
    this.username = this.$store.state.user.username;
  },
  methods: {
    //绑定邮箱
    async sendmsg(){
      let formdata = new FormData();
      console.log(this.email)
      formdata.append('email',this.email);
      const response = await this.$http({
        method:"POST",
        url:"api/superbindemail",
        data:formdata
      });
      let res = response.data;
        if (res.status == 'error') {
          this.$message.error(res.msg)
        }else{
          let { value } = await this.$prompt('邮箱验证码发送成功，有效期为两分钟，请及时查收', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          })
          let response = await this.$http({
            method:"PUT",
            url:"/api/superbindemail",
            data:`text=${value}`,
            headers:{
              'Content-Type':"application/x-www-form-urlencoded"  
            }
          })
          let res = response.data;
          console.log(res)
          if(res.status == "error"){
            this.$message.error(res.msg);
          }else{
            this.$message({
              type:"success",
              message:res.msg
            })
          }

        }

    },
    success() {
      this.$message({
        type: 'success',
        message: '用户图像修改成功！'
      })
      // this.gengxintu()
    },

    success() {
      this.$message({
        type: 'success',
        message: '用户图像修改成功！'
      })
      // this.gengxintu()
    },
    editAvatar() {
      this.editAvatarDialog = true
      this.option.img = this.imageUrl
    },


    // 保存头像修改
    saveEditAvatar() {
      this.editAvatarDialog = false
      // this.finish('blob');
      this.$refs.upload.submit()
      // console.log(this.$refs.upload);
      // console.log(this.finish('blob'));
      // console.log(this.action)
    },
    // 放大/缩小
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 保存上传图片
    finish(type) {
      if (type === 'blob') {
        // console.log(type)
        this.$refs.cropper.getCropBlob((data) => {
          this.avatarURL = window.URL.createObjectURL(data);
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          //访问接口保存到数据库写这儿!
          // console.log('else')
        })
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    // 下载图片
    down(type) {
      var aLink = document.createElement('a')
      aLink.download = 'author-img'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
          console.log(aLink.click())
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          aLink.href = data;
          aLink.click()
          console.log(22222)
        })
      }
    },
    // 更换头像--上传本地图片
    uploadImg(file) {
      var _this = this;
      var reader = new FileReader();
      reader.onload = (e) => {
        // console.log(e)
        let data;
        if (typeof e.target.result) {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
          // console.log(data)
        } else {
          data = e.target.result
        }
        _this.option.img = data

      }
      // 转化为base64
      // reader.readAsDataURL(file.raw)
      // 转化为blob
      // console.log(reader.readAsArrayBuffer(file.raw))
      reader.readAsArrayBuffer(file.raw);
    },
    imgcancel() {
      this.statee = false;
    },
    imgok() {
      this.statee = false;
    },
    handleClick(tab, event) {
            console.log(tab, event);
        }
  }
}
</script>
<style >
.mark {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index: 999;
}

.preview>img {
  height: 150px;
}

.imgcount {
  width: 400px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 50px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imglist {
  /* width: 100px; */
  height: 300px;
  /* border: 1px solid gray; */
}

.avator-count {
  display: flex;
  justify-content: center;
}


.changeAvator {
  display: flex;
  justify-content: center;
  font-size: 13px;
  padding-bottom: 20px;
  cursor: pointer;
}

h3 {
  display: block;
  padding-bottom: 20px;
  text-align: center;
  background: #304156;
  color: rgb(191, 203, 217);
  line-height: 50px;
  height: 30px;
  margin-bottom: 0;
}

.demo-type {
  width: 360px;
  background: #fff;
  padding: 20px;
  color: #606266;
}

.el-avatar {
  width: 100px;
  height: 100px;
}

.previewBox {
  text-align: center;
  margin-left: 60px;
}

.preview {
  width: 150px;
  height: 150px;
  margin: 0px auto 20px auto;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #ccc;
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: space-around;
}

.cropper {
  width: 260px;
  height: 260px;
}
.person_title{
  width: 400px;
}
.el-descriptions-item__container{
  display: flex;
  align-items: center;
}
.person_all .el-input__inner{
  width: 300px;
  height: 31px;
}
.el-button{
  padding: 7px 15px;
}
.person_all{
  display: flex;
  justify-content: space-between;
}
.person_right{
  width: 850px;
}
.change_count{
  background-color: #fff;
  padding: 20px;
  color: #606266;
}
.el-tabs__item,
.el-step__title.is-process,
.el-step__head.is-process ,
.el-step__description.is-process{
  color: #606266;
}
.changepass,
.changeemail{
  margin-top: 35px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.person_all .el-input__inner{
  margin-bottom: 15px;
  width: 500px;
  height: 35px;
}
.person_all .el-input{
  display: flex;
  justify-content: center;
}
.demo-type,
.change_count{
  height: 450px;
}
.el-steps{
  margin-top: 20px;
}
.button_count{
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.aaaaa,
.bbbbb{
  display: flex;
  justify-content: flex-start;
}
/* .el-tabs__nav-wrap::after{
  width: 19% !important;
} */
</style>