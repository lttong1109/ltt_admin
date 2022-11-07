<template>
    <div>
        <header class="model_header">
            <div class="xuanze">
                <p>
                    当前一级标题：
                </p>
                <el-select v-model="Chapter_id" @change = "changeChapter">
                    <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button type="primary" @click="modeladd">新增模块</el-button>
                <modelAdd :state="state" @cancel="cancel" @success="success" :Chapter_id="Chapter_id"></modelAdd>
            </div>
        </header>
        <el-table 
            :data="modelData" 
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
                        @click="modelEdit(scope.$index, scope.row)" 
                        v-loading.fullscreen.lock="fullscreenLoading"
                    >编辑</el-button>
                    <el-dialog title="" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="模块编号：" :label-width="formLabelWidth">
                                <el-form-item v-model="form.id" autocomplete="off">{{ form.id }}</el-form-item>
                            </el-form-item>
                            <el-form-item label="模块名称：" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="upcancel()">取 消</el-button>
                            <el-button type="primary" @click="updateok(scope.$index, scope.row)">确 定</el-button>
                        </div>
                    </el-dialog>


                    <el-button 
                        size="mini" 
                        type="danger" 
                        @click="modelDelete(scope.$index, scope.row)"  
                        v-loading.fullscreen.lock="fullscreenLoading"
                        style="margin-left: 10px;"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import modelAdd from './modelAdd.vue'
export default {
    name: "Model",
    data(){
        return{
            tableData:[],
            state: false,
            fullscreenLoading: false,
            modelData: [],
            dialogFormVisible:false,
            form:{
                id:"",
                name:""
            },
            formLabelWidth: '100px',
            Chapter_id:33
        }
    },
    created() {
        this.getList();
        this.rerenderTableData();
    },
    components:{
        modelAdd
    },
    methods: {
        getList() {
            this.$http({
                method: "GET",
                url: `/api/course?pk=${this.Chapter_id}`,
            }).then(res => {
                console.log(res);
                let response = res.data;
                if (response.status == 'success') {
                    response.data.forEach(item => {
                        item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
                        item.update_time = new Date(item.update_time).toLocaleString();
                    })
                    this.modelData = response.data;
                } else {
                    this.$message.error(response.msg);
                }
            })
        },
        changeChapter(val){
            this.Chapter_id = val;
            this.getList();
        },
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
        modelDelete(index,row){
        this.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'denger'
        }).then(() => {
          this.fullscreenLoading = true;
          this.$http({
            url: "api/course",
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
        modelEdit(index,row){
            this.dialogFormVisible = true
            console.log(this.modelData.id)
            let newmodelData = this.modelData[index];
            this.form.name = newmodelData.name;
            this.form.id = newmodelData.id;
        },
    updateok(index, row) {
      this.$confirm('确认编辑文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'denger'
      }).then(() => {
        this.fullscreenLoading = true;
        this.$http({
          url: "api/course",
          method: "PUT",
          data: `pk=${this.form.id}&name=${this.form.name}`,
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          }
        }).then(res => {
          this.fullscreenLoading = false;
          let response = res.data;
          if (response.status == 'success') {
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
    cancel(){
      this.state = false;
      },
    success(){
      this.getList();
    },
    modeladd(){
      this.state = true;
    },
    }

}
</script>

<style>
.model_header {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
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
  transform: translate(-50%, -50%) !important;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  padding-top: 40px;
  box-shadow: none !important;
  margin-top: 0vh !important;
}
</style>