<template>
    <div>
        <header class="Video_header">
            <div class="xuanze_count">
              <div class="xuanze">
                <el-tree :data="choice"  @node-click="handleNodeClick" :props="defaultProps"></el-tree>
                <!-- :props="defaultProps" -->
              </div>
            </div>
            <el-button type="primary" @click="videoAdd">新增视频</el-button>
            <!-- <VideoAdd :state="state" @cancel="cancel" @success="success"></VideoAdd> -->
        </header>
        <el-table :data="videoData" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }">
            <el-table-column prop="id" label="编号" sortable> </el-table-column>
            <el-table-column prop="name" label="名称" sortable> </el-table-column>
            <el-table-column prop="create_time" label="创建时间" sortable></el-table-column>
            <el-table-column prop="update_time" label="更新日期" sortable></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="mini"> 编辑</el-button>
                        
                    <el-button size="mini" type="danger" @click="handleDelete()">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
// import VideoAdd from './videoAdd';
export default {
  name:"Video",
  data() {
    return {
      videoData: [],
      state: false,
      fullscreenLoading: false,
      value: '',
      choice: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    }
  },
    components:{
        // VideoAdd,
    },
    created() {
        this.getList();
        this.gettitle();
        this.getchapter()
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
        getList() {
            this.$http({
                method: "GET",
                url: 'api/chapter_video?pk=25',
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
        handleEdit(index,row) {
        this.dialogFormVisible = true
        this.videoindex=index;
        let newvideoData = this.videoData[index];
        // let keys = Object.keys(this.form);
        this.form.name = newvideoData.name;
        this.form.id = newvideoData.id;
        this.form.expires = newvideoData.expires;
        this.form.description = newvideoData.description;     
      },
      videoupdate(index,row){
        console.log(this.form.name)
        this.$confirm('确认修改文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'denger'
        }).then(() => {
          // let name=this.form.name;
          this.fullscreenLoading = true;
          this.$http({
            url: "/api/chapter_video",
            method: "PUT",
            data: `pk=${this.form.id}&name=${this.form.name}&chapter_id=${this.form.chapter_id}`,
            headers: {
              'Content-Type': "application/x-www-form-urlencoded"
            }
          }).then(res => {
            this.fullscreenLoading = false;
            // console.log(res)
            let response = res.data;
            // console.log(response)
            if (response.status == 'success') {
              // console.log(response.status)
              this.$message({
                type: "success",
                message: "修改成功!!",
              });
              this.rerenderTableData();
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
              message: '已取消修改！'
            });
          });
        this.dialogFormVisible = false;
      },
      videocancel(){
        this.dialogFormVisible = false;
      },
        handleDelete(index, row) {
        this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'denger'
        }).then(() => {
          this.fullscreenLoading = true;
          this.$http({
            url: "/api/chapter_video",
            method: "DELETE",
            data: `pk=${row.id}`,
            headers: {
              'Content-Type': "application/x-www-form-urlencoded"
            }
          }).then(res => {
            console.log(res)
            this.fullscreenLoading = false;
            let response = res.data;
            if (response.status == 'success') {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.rerenderTableData();
            } else {
              this.$message.error(response.msg);
            }
          })
        }).catch(() => {
          this.fullscreenLoading = false;
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
        videoAdd(){
            this.state = true
        },
        cancel(){
          this.state = false;
        },
        success(){
          this.rerenderTableData();
        },
      gettitle() {
        this.$http({
          url: "api/classify"
        }).then(res => {
          console.log(res.data);
          let response = res.data;
          if (response.status == 'success') {
            this.titleData = response.data;
            // console.log(response.data)
          } else {
            this.$message.error(response.msg);
          }
        })
      },
      // getchapter(){
      //   this.$http({
      //           method: "GET",
      //           url: `/api/chapter?pk=${this.titleData.id}`,
      //       }).then(res => {
      //           console.log(res);
      //           let response = res.data;
      //           if (response.status == 'success') {
      //               this.chapterData = response.data;
      //           } else {
      //               this.$message.error(response.msg);
      //           }
            // })
      // }
    },
}
</script>
<style scoped>
.Video_header {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>