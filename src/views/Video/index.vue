<template>
  <div class="all">
    <el-tree :data="choice" class="filter-tree" defalut-expand-all ref='tree' @current-change="getvideo"
      :aaa="gettitleid" :bbb="getchapterid"></el-tree>
    <div class="content">
      <header class="Video_header">
        <el-button type="primary" @click="videoadd" >新增视频</el-button>
        <VideoAdd :state="state" @cancel="cancel" @success="success" :getchapterid="getchapterid"></VideoAdd>
      </header>
      <el-table :data="videoData" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }">
        <el-table-column prop="id" label="编号" sortable width="80px"> </el-table-column>
        <el-table-column prop="name" label="名称" sortable> </el-table-column>
        <el-table-column prop="mp4_url" label="视频地址" sortable width="170px"> </el-table-column>
        <el-table-column prop="video_permission" label="视频属性" sortable width="100px" :formatter = "format"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable width="170px"></el-table-column>
        <el-table-column prop="update_time" label="更新日期" sortable width="170px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button 
              size="mini" 
              @click="handleEdit(scope.$index, scope.row)"
              v-loading.fullscreen.lock="fullscreenLoading"
            >编辑</el-button>
            <el-dialog title="" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="章节编号：" :label-width="formLabelWidth">
                  <el-form-item v-model="form.id" autocomplete="off">{{ getchapterid }}</el-form-item>
                </el-form-item>
                <el-form-item label="视频名称：" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="tips">提示：如需修改视频内容，请删除后重新上传</el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="upcancel()">取 消</el-button>
                <el-button type="primary" @click="updateok(scope.$index, scope.row)">确 定</el-button>
              </div>
            </el-dialog>

            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
              v-loading.fullscreen.lock="fullscreenLoading" style="margin-left: 10px;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import VideoAdd from './videoAdd';
export default {
  name: "Video",
  data() {
    return {
      videoData: [],
      state: false,
      fullscreenLoading: false,
      dialogFormVisible: false,
      value: '',
      choice: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      gettitleid: 33,
      getchapterid: 25,
      form: {
        chapter_id: '',
        name: ''
      },
      formLabelWidth: '100px',
    }
  },
  components: {
    VideoAdd,
  },
  created() {
    this.getList();
    this.gettree();
    // this.getchapter()
  },
  methods: {

    // 树结构渲染数据
    gettree() {
      this.$http({
        url: "api/classify"
      }).then(res => {
        let datas = res.data.data
        let newArr = [];
        // console.log(datas)
        datas.forEach(item => {
          newArr.push(
            this.$http({
              url: `api/chapter`,
              params: {
                pk: item.id
              }
            }))
        })
        Promise.all(newArr).then(res => {//一次性拿到所有数组
          // console.log(res)
          res.forEach((item, index) => {
            let arr = [];
            item.data.data.forEach(item => {
              arr.push({
                id: item.id,
                label: item.name
              })

            })
            this.choice.push({
              id: datas[index].id,
              label: datas[index].name,
              children: arr
            })

          })
        });
      })
    },
    getvideo(a, b) {
      // console.log(a,b)
      if (b.level == 1) {
        this.gettitleid = a.id
      }
      if (b.level == 2) {
        this.getchapterid = a.id
      }
      this.getList();
    },
    getList() {
      this.$http({
        method: "GET",
        url: `api/chapter_video?pk=${this.getchapterid}`,
      }).then(res => {
        console.log(res);
        let response = res.data;
        if (response.status == 'success') {
          response.data.forEach(item => {
            item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
            item.update_time = new Date(item.update_time).toLocaleString();
          })
          this.videoData = response.data;
        } else {
          this.$message.error(response.msg);
        }
      })
    },

    //删除视频
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'denger'
      }).then(() => {
        this.fullscreenLoading = true;
        this.$http({
          method: "DELETE",
          url: 'api/chapter_video',
          data: `pk=${row.id}`,
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          }
        }).then(response => {
          console.log(row.id)
          let res = response.data;
          if (res.status == 'error') {
            this.$message.error(res.msg)
          } else {
            this.$message({
              type: "success",
              message: res.msg
            })
            this.getList();
          }
        })
      })
    },

    // 编辑视频
    handleEdit(index, row) {
      this.dialogFormVisible = true
      let newvideoData = this.videoData[index];
      this.form.name = newvideoData.name;
      this.form.id = newvideoData.id;
    },
    updateok(index, row) {
      this.$confirm('确认编辑文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'denger'
      }).then(() => {
        this.fullscreenLoading = true;
        this.$http({
          url: "api/chapter_video",
          method: "PUT",
          data: `pk=${this.form.id}&name=${this.form.name}&chapter_id=${this.getchapterid}`,
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          }
        }).then(res => {
          this.fullscreenLoading = false;
          let response = res.data;
          // console.log(response)
          if (response.status == 'success') {
            // console.log(response.status)
            this.$message({
              type: "success",
              message: "修改成功!!",
            });
            this.getList();
          } else {
            this.$message.error(response.msg);
          }
        }).catch(error => {
          this.$message.error('接口错误');
        })
      }).catch(() => {
        this.fullscreenLoading = false;
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      });
      this.dialogFormVisible = false;
    },
    upcancel() {
      this.dialogFormVisible = false;
    },
    format(row, column, cellValue){
            if(cellValue == 1){
                return "免费"
            }else{
                return "收费"
            }
      },

    //新增视频
    videoadd(){
      this.state = true;
    },
    cancel(){
      this.state = false;
      },
    success(){
      this.getList();
    }

  }
}
</script>
<style >
.Video_header {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.all {
  display: flex;
  justify-content: space-between;
}

.content {
  width: 1028px;
}

.el-dialog {
  width: 500px;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  padding-top: 40px;
  box-shadow: none !important;
  margin-top: 0vh !important;
}

.el-tree {
  width: 210px;
  padding: 20px 10px;
}

.tips {
  text-align: center;
  padding-top: 20px;
  color: #ff5546;
  font-size: 12px;
}
</style>