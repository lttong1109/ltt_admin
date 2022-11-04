<template>
    <div>
        <header class="model_header">
            <div class="xuanze">
                <p>
                    当前一级标题：
                </p>
                <el-select v-model="Chapter_value" @change = "changeChapter">
                    <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary">新增模块</el-button>
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
                    <el-button size="mini">编辑</el-button>
                    <el-button size="mini" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "Model",
    data(){
        return{
            tableData:[],
            state: false,
            fullscreenLoading: false,
            modelData: [],
            Chapter_value: 33,
        }
    },
    created() {
        this.getList();
        this.rerenderTableData();
    },
    methods: {
        getList() {
            this.$http({
                method: "GET",
                url: `/api/course?pk=${this.Chapter_value}`,
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
            this.Chapter_value = val;
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
</style>