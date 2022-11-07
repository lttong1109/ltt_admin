<template>
  <div>
    <div class="form" ref="main">

    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
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
          return value ;
        }
      },
      data: [2, 4, 7, 2, 5, 17, 13]
    },
    {
      name: '订单',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value ;
        }
      },
      data: [6, 9, 9, 6, 8, 7,5]
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
  }
}
</script>

<style  scoped>
  .form{
    width: 1200px;
    height: 700px;
    padding-left: 50px;
  }
</style>