let option = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['日活跃商户', '日活跃用户数', '日开单数', '开单金额', '注册商户', '注册用户数']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 40,
      xAxisIndex: 0,
      handleSize: 8,
      zoomLock: true
    },
    {
      start: 0,
      end: 40,
      xAxisIndex: 0,
      handleSize: 8,
      zoomLock: true,
      top: '95%'
    }
  ],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      interval: 0
    }
  },
  yAxis: [
    {
      type: 'value',
      max: null
    },
    {
      name: '开单金额',
      type: 'value',
      inverse: false,
      max: null
    }
  ],
  series: [
    {
      name: '日活跃商户',
      type: 'line',
      data: [],
      yAxisIndex: 0,
      smooth: true
    },
    {
      name: '日活跃用户数',
      type: 'line',
      data: [],
      yAxisIndex: 0,
      smooth: true
    },
    {
      name: '日开单数',
      type: 'line',
      data: [],
      yAxisIndex: 0,
      smooth: true
    },
    {
      name: '开单金额',
      type: 'line',
      data: [],
      yAxisIndex: 1,
      smooth: true
    },
    {
      name: '注册商户',
      type: 'line',
      data: [],
      yAxisIndex: 0,
      smooth: true
    },
    {
      name: '注册用户数',
      type: 'line',
      data: [],
      yAxisIndex: 0,
      smooth: true
    }
  ]
}

export { option }
