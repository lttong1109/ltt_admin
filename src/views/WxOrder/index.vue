<template>
    <div style="height: 650px; position: relative; background: #FFF;">
        <el-table 
            :data="zfbData" 
            style="width: 100%" 
            :default-sort="{ prop: 'date', order: 'descending' }"
        >
            <el-table-column prop="id" label="编号" sortable width="80px"></el-table-column>
            <el-table-column prop="vip" label="会员名" sortable width="120px"></el-table-column>
            <el-table-column prop="total_amount" label="交易金额" sortable  width="120px"></el-table-column>
            <el-table-column prop="qs_trade_no" label="订单编号" sortable></el-table-column>
            <el-table-column prop="pay_state" label="交易状态" sortable :formatter = "format"></el-table-column>
            <el-table-column prop="create_time" label="交易时间" sortable></el-table-column>
            <el-table-column prop="update_time" label="更新时间" sortable></el-table-column>
            <!-- <el-table-column prop="open_vip" label="是否开会员" sortable></el-table-column> -->
        </el-table>
        <div class="bottom">
            <el-pagination 
                layout="prev, pager, next" 
                :total="total" 
                @current-change="handelCurrentChange"
                v-model="page">
                    <!-- 总条数 -->
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: "ZfbOrder",
    components: {},
    data() {
        return {
            zfbData: [],
            state: false,
            fullscreenLoading: false,
            total:0,
            page:1,
        };
    },
    created() {
        this.getList();
    },
    methods: {
        format(row, column, cellValue){
            if(cellValue == 'TRADE_CREATE'){
                return "商家订单创建，等待创建支付宝订单";
            }else if(cellValue == 'WAIT_BUYER_PAY'){
                return "交易创建，等待买家付款"
            }else if(cellValue == 'TRADE_CLOSED '){
                return "交易创建，等待买家付款"
            }else if(cellValue == 'TRADE_SUCCESS'){
                return "交易创建，等待买家付款"
            }else if(cellValue == 'TRADE_FINISHED'){
                return "交易创建，等待买家付款"
            }
        },
        // 支付状态
        // TRADE_CREATE 商家订单创建，等待创建支付宝订单
        // WAIT_BUYER_PAY 交易创建，等待买家付款
        // TRADE_CLOSED 未付款交易超时关闭，或支付完成后全额退款
        // TRADE_SUCCESS 交易支付成功
        // TRADE_FINISHED 交易结束，不可退款
        handelCurrentChange(val) {
            this.page = val
            this.getList()
        },
        getList() {
            this.$http({
                method: "GET",
                url: `api/alipay_order_query?page=${this.page}`,
            }).then(res => {
                let response = res.data;
                console.log(res)
                if (response.status == 'success') {
                    response.data.forEach(item => {
                        item.create_time = new Date(item.create_time).toLocaleString();//转换为年月日
                        item.update_time = new Date(item.update_time).toLocaleString();
                    })
                    this.zfbData = response.data;
                    this.total = (response.count)*10;
                } else {
                    this.$message.error(response.msg);
                }
            })
        },  
    },
};

</script>
<style>
.bottom{
  width: 100%;
  background: #fff;
  position: absolute;
  bottom: 20px;
}
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
</style>