<template>
    <div>
        <header class="chapter_header">
            <div class="xuanze">
                <p>
                    当前一级标题：
                </p>
                <el-select v-model="Chapter_value" @change = "changeChapter">
                    <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button type="primary" @click="new_chapter">新增章节</el-button>
                <ChapterAdd :Chapter_id = "Chapter_value" :state = "state" @cancel = "cancel" @success = "success"></ChapterAdd>
            </div>
        </header>
        <el-table 
            :data="chapterData" 
            style="width: 100%" 
            :default-sort="{ prop: 'date', order: 'descending' }">
            <el-table-column prop="id" label="编号" sortable> </el-table-column>
            <el-table-column prop="name" label="名称" sortable> </el-table-column>
            <el-table-column prop="create_time" label="创建时间" sortable>
            </el-table-column>
            <el-table-column prop="update_time" label="更新日期" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button 
                        size="mini" 
                        @click="handleEdit(scope.$index, scope.row)" 
                        v-loading.fullscreen.lock="fullscreenLoading"
                    >编辑</el-button>               
                    <el-dialog title="" :visible.sync="dialogFormVisible">
                        <el-form :model="form" id="okk">
                            <el-form-item label="编号：" :label-width="formLabelWidth">
                                <el-form-item v-model="form.id" autocomplete="off">{{form.id}}</el-form-item>
                            </el-form-item>
                            <el-form-item label="名称：" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="chaptercancel">取 消</el-button>
                            <el-button type="primary" @click="chapterupdate(scope.$index,scope.row)">确 定</el-button>
                        </div>
                    </el-dialog>
                    <el-button 
                    style="margin-left: 10px"
                        size="mini" 
                        type="danger" 
                        @click="handleDelete(scope.$index, scope.row)" 
                        v-loading.fullscreen.lock="fullscreenLoading">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import ChapterAdd from './ChapterAdd'

export default {
    name: "Chapter",
    data(){
        return {
            chapterData: [],
            Chapter_value: 33,
            state: false,
            fullscreenLoading: false,
            tableData: [],
            value: '',
            state: false,
            dialogFormVisible: false,
            form: {
                id:'',
                name: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '100px',
        }
    },
    components:{
        ChapterAdd,
    },
    created() {
        this.getList();
        this.rerenderTableData();
    },
    methods: {
        rerenderTableData() {
            this.$http({
                url: "/api/classify"
            }).then(res => {
                console.log(res.data);
                let response = res.data;
                if (response.status == 'success') {
                    response.data.forEach(item => {
                        item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
                        item.update_time = new Date(item.update_time).toLocaleString();
                    })
                    this.tableData = response.data;
                } else {
                    this.$message.error(response.msg);
                }
            })
        },
        changeChapter(val){
            this.Chapter_value = val;
            // console.log(this.Chapter_value)
            this.getList();
        },
        getList() {
            this.$http({
                method: "GET",
                url: `/api/chapter?pk=${this.Chapter_value}`,
            }).then(res => {
                console.log(res);
                let response = res.data;
                if (response.status == 'success') {
                    response.data.forEach(item => {
                        item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
                        item.update_time = new Date(item.update_time).toLocaleString();
                    })
                    this.chapterData = response.data;
                } else {
                    this.$message.error(response.msg);
                }
            })
        },


        handleDelete(index, row) {
        this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          // let formData = new FormData();
          // formData.append('pk',row.id);
          this.fullscreenLoading = true;
          this.$http({
            url: "api/chapter",
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
              this.getList();
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
      new_chapter(){
          this.state = true
      },
      cancel(){
          this.state = false;
          // this.dialogFormVisible = false;
        },
      success(){
        this.getList();
      },
      chapterupdate(index,row){
        console.log(this.form.name)
        this.$confirm('确认修改名称, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'denger'
        }).then(() => {
          // let name=this.form.name;
          this.fullscreenLoading = true;
          this.$http({
            url: "/api/chapter",
            method: "PUT",
            data: `pk=${this.form.id}&chapter_name=${this.form.name}`,
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
              message: '已取消修改！'
            });
          });
        this.dialogFormVisible = false;
      },
      chaptercancel(){
        this.dialogFormVisible = false;
      },
      handleEdit(index,row) {
        this.dialogFormVisible = true
        this.chapterindex=index;
        let newchapterData = this.chapterData[index];
        // let keys = Object.keys(this.form);
        this.form.name = newchapterData.name;
        this.form.id = newchapterData.id;
      },
    }

}
</script>

<style>
.chapter_header {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.xuanze{
    display: flex;
    align-items: center;
    color: #606266;
    font-size: 14px;
}
.el-dialog {
    width: 500px;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%,-50%) !important;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    padding-top: 40px;
    box-shadow: none !important;
    margin-top: 0vh !important;
}
</style>