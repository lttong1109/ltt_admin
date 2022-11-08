<template>
  <div style="height: 650px; position: relative; background: #FFF;">
    <el-table
      :data="logsData"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column prop="id" label="编号" sortable> </el-table-column>
      <el-table-column prop="username" label="名称" sortable> </el-table-column>
      <el-table-column prop="ip" label="ip地址" sortable> </el-table-column>
      <el-table-column prop="create_time" label="创建时间" sortable>
      </el-table-column>
    </el-table>
    <div class="bottom">
      <el-pagination 
        layout="prev, pager, next" 
        :total="total" 
        @current-change="handelCurrentChange"
        v-model = "page"
        ><!-- 总条数 -->
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
name: "Logs",
components: {
  
},
data() {
  return {
    logsData: [],
    state: false,
    fullscreenLoading: false,
    total:0,
    page:1,
  };
},
  created() {
      this.getList()
  },
  methods: {
    handelCurrentChange(val){
      this.page = val
      this.getList()
    },
      getList(){
          this.$http({
          url:`/api/supersigninlogs?page=${this.page}`,
          method: "GET",
      }).then(res => {
          console.log(res);
          let response = res.data;
          if(response.status == 'success'){
            response.data.forEach(item => {
                  item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
              })
              this.logsData = response.data;
              this.total = (response.count)*10;
          }else{
              this.$message.error(response.msg);
          }
          
      })
      },

  },
};
</script>
<style >
.el-pagination{
  text-align: center;
}
.el-pager li{
  background: none;
}
.el-pagination button:disabled {
    background-color: transparent;
    color: #303133;
}
.btn-next{
  background: transparent;
}
.bottom{
  width: 100%;
  background: #fff;
  /* margin-top: 20px; */
  position: absolute;
  bottom: 20px;
}
</style>
  