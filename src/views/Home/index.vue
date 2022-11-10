<template>
  <div>
    <div class="watch">
      <div class="data">
        <div>
          <div>
            <img width="50px" src="../../assets/用户.png" alt="" />
          </div>
          <div class="shuju" :data="userData">
            <p>今日新增用户</p>
            <!-- <p>{{userData.length}}</p> -->
            <CountTo :startVal='startVal' :endVal='userData.length' :duration='2000' style="text-align: center;" />
          </div>
        </div>
        <div>
          <div>
            <img width="50px" src="../../assets/认证用户.png" alt="" />
          </div>
          <div class="shuju" :data="vipData">
            <p>今日新增会员</p>
            <!-- <p>{{vipData.length}}</p> -->
            <CountTo :startVal='startVal' :endVal='vipData.length' :duration='2000' style="text-align: center;" />
          </div>
        </div>
        <div>
          <div>
            <img width="80px" src="../../assets/金钱.png" alt="" />
          </div>
          <div class="shuju" :data="moneyData">
            <p>今日营收额</p>
            <!-- <p prop='total_price'>{{moneyData.total_price}}</p> -->
            <CountTo :startVal='startVal' :endVal='Number(moneyData.total_price)' :duration='2000'
              style="text-align: center;" />
          </div>
        </div>
        <div>
          <div>
            <img width="70px" src="../../assets/可用金额 .png" alt="" />
          </div>
          <div class="shuju" :data="allData">
          <p>总盈利额</p>
          <!-- <p prop='total_price'>{{allData.total_price}}</p> -->
          <CountTo :startVal='startVal' :endVal='Number(allData.total_price)' :duration='2000'
            style="text-align: center;" />
        </div>
        </div>
      </div>
    </div>
    <div class="form" ref="main"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import CountTo from 'vue-count-to';

export default {
  data() {
    return {
      userData: [],
      vipData: [],
      moneyData: {
        total_price:0
      },
      allData: {
        total_price:0
      },
      startVal: 0
    }
  },
  components: {
    CountTo
  },
  mounted() {
    var myChart = echarts.init(this.$refs.main);
    var option;
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['会员', '订单', '销售额']
      },
      xAxis: [
        {
          type: 'category',
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '订单',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '销售额',
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '会员',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          data: [2, 4, 7, 2, 5, 17, 13]
        },
        {
          name: '订单',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          data: [6, 9, 9, 6, 8, 7, 5]
        },
        {
          name: '销售额',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value + 'w';
            }
          },
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 7.2, 5.3, 8.4]
        }
      ]
    };
    option && myChart.setOption(option);
  },
  created() {
    this.user(),
      this.vip(),
      this.money(),
      this.all()
  },
  methods: {
    user() {
      this.$http({
        url: `http://81.68.121.52:8000/api/currentusers`
      }).then(res => {
        let response = res.data;
        if (response.status == 'success') {
          this.userData = response.data;
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    vip() {
      this.$http({
        url: `http://81.68.121.52:8000/api/currentvipusers`
      }).then(res => {
        let response = res.data;
        if (response.status == 'success') {
          this.vipData = response.data;
          // console.log(this.vipData)
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    money() {
      this.$http({
        url: `http://81.68.121.52:8000/api/currenttotalpay`
      }).then(res => {
        let response = res.data;
        if (response.status == 'success') {
          this.moneyData = response;
          // console.log(this.moneyData.total_price)
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    all() {
      this.$http({
        url: `http://81.68.121.52:8000/api/gop`
      }).then(res => {
        // console.log(res.data)
        let response = res.data;
        if (response.status == 'success') {
          this.allData = response;
          // console.log(this.allData.total_price)
        } else {
          this.$message.error(response.msg);
        }
      })
    }
  }
}
</script>

<style  scoped>
.form {
  height: 480px;
  padding-left: 50px;
  background-color: #fff;
}

.data {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 140px;
  margin-bottom: 30px;
}

.data>div {
  width: 300px;
  padding: 20px, 20px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* border: 3px solid #304156; */
  border-radius: 15px;
}

.shuju {
  color: #09101f;
  font-size: 20px;
  display: flex;
  flex-direction: column;
}

.shuju>p {
  font-weight: 500;
}
</style>