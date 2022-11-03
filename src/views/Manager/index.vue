<template>
    <div>
        <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="id" label="编号" width = "80">
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="phone" label="手机号">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="gender" :formatter = "format"  label="性别" width = "80">
            </el-table-column>
            <el-table-column prop="avator" label="头像">
                <template #default = "{row}">
                    <el-avatar :src = "url + row.avator" shape = "square" size = "small"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间">
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间">
            </el-table-column>
            <el-table-column fixed = "right"  label="操作" width = "100">
                <template  #default = "{row}">
                    <el-button size="mini" type="danger" @click = "remove(row.id)">删除</el-button>
                </template>
            </el-table-column>
            
        </el-table>
    </div>
</template>

<script>
import { url } from '@/axios'
export default {
    data() {
        return {
            list: [],
            url
        }
    },
    created() {
        this.render()
    },
    methods: {
        render() {
            this.$http({
                url: "api/superusers",
            }).then(response => {
                let res = response.data
                if (res.status == 'error') {
                    this.$message.error(res.msg);
                } else {
                    res.data.forEach(item => {
                        item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
                        item.update_time = new Date(item.update_time).toLocaleString();
                    })
                    this.list = res.data
                }
            })
        },
        format(row, column, cellValue){
            if(cellValue == 1){
                return "男"
            }else{
                return "女"
            }
        },
        remove(pk){
            this.$http({
                method:"DELETE",
                url:'api/removesuperuser',
                data:`pk=${pk}`,
                headers:{
                    'Content-Type':"application/x-www-form-urlencoded"  
                }
            }).then(response =>{
                let res = response.data;
                if (res.status == 'error') {
                    this.$message.error(res.msg)
                } else { 
                    this.$message({
                        type:"success",
                        message:res.msg
                    })
                    this.render();
                }
            })
        }
    }
}
</script>

<style scoped>

</style>