import { number } from '@/core/js/filter'
let dayOption = {
  color: ['#42a3ff'],
  legend: {
    data: ['开单量', '开单金额(元)'],
    bottom: 20
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: function(params) {
      var result = `${params[0].axisValue}</br>`
      params.forEach(function(item) {
        let color = ''
        let value = ''

        if (item.seriesIndex == 0) {
          color = '#42a3ff'
          value = item.value
        } else if (item.seriesIndex == 1) {
          color = '#f79800'
          value = item.value
        } else {
          color = '#79bda0'
          value = number(item.value, 2)
        }
        result +=
          '<div style="overflow: hidden;"><div style="margin-right:5px;margin-top:5px;border-radius:10px;width:10px;height:10px;float:left;background-color:' +
          color +
          '"' +
          '></div> <div style="float:left;">' +
          item.seriesName +
          '&nbsp;' +
          '</div><div style="float:right;">' +
          value +
          '</div></div>'
      })
      return result
    }
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: '20%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['0:00-4:00', '4:00-8:00', '8:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'],
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        interval: 0
      }
    }
  ],
  yAxis: [
    {
      name: '开单量',
      type: 'value',
      axisLine: {
        show: false
      }
    },
    {
      name: '开单商户数',
      type: 'value',
      axisLine: {
        show: false
      },
      show: false
    },
    {
      name: '开单金额',
      type: 'value',
      axisLine: {
        show: false
      },
      show: true
    }
  ],
  series: [
    {
      name: '开单量',
      type: 'bar',
      barWidth: '30%',
      data: [],
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#42a3ff'
        }
      }
    },
    {
      name: '开单商户数',
      type: 'bar',
      barWidth: '30%',
      data: [],
      itemStyle: {
        normal: {
          color: '#f79800'
        }
      },
      yAxisIndex: 0,
      smooth: true
    },
    {
      name: '开单金额(元)',
      type: 'line',
      data: [],
      yAxisIndex: 2,
      itemStyle: {
        normal: {
          color: '#79bda0'
        }
      },
      smooth: true
    }
  ]
}

let monthOption = {
  color: ['#42a3ff'],
  legend: {
    data: ['开单量', '开单金额(元)'],
    bottom: 20
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: function(params) {
      var result = `${params[0].axisValue}日</br>`
      params.forEach(function(item) {
        let color = ''
        let value = ''

        if (item.seriesIndex == 0) {
          color = '#42a3ff'
          value = item.value
        } else if (item.seriesIndex == 1) {
          color = '#f79800'
          value = item.value
        } else {
          color = '#79bda0'
          value = number(item.value, 2)
        }
        result +=
          '<div style="overflow: hidden;"><div style="margin-right:5px;margin-top:5px;border-radius:10px;width:10px;height:10px;float:left;background-color:' +
          color +
          '"' +
          '></div> <div style="float:left;">' +
          item.seriesName +
          '&nbsp;' +
          '</div><div style="float:right;">' +
          value +
          '</div></div>'
      })
      return result
    }
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: '20%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        interval: 0
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        show: false
      }
    },
    {
      name: '开单商户数',
      type: 'value',
      show: false,
      axisLine: {
        show: false
      }
    },
    {
      name: '开单金额',
      type: 'value',
      axisLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: '开单量',
      type: 'bar',
      barWidth: '30%',
      data: [],
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#42a3ff'
        }
      }
    },
    {
      name: '开单商户数',
      type: 'bar',
      barWidth: '30%',
      data: [],
      itemStyle: {
        normal: {
          color: '#f79800'
        }
      },
      yAxisIndex: 0,
      smooth: true
    },
    {
      name: '开单金额(元)',
      type: 'line',
      data: [],
      yAxisIndex: 2,
      itemStyle: {
        normal: {
          color: '#79bda0'
        }
      },
      smooth: true
    }
  ]
}

let mapOption = {
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      var res = params.name + '<br/>'
      var myseries = mapOption.series
      let color = ''
      for (var i = 0; i < myseries.length; i++) {
        if (i == 0) {
          color = '#42a3ff'
        } else if (i == 1) {
          color = '#f79800'
        } else if (i == 2) {
          color = '#79bda0'
        } else {
          color = '#f3625c'
        }
        for (var j = 0; j < myseries[i].data.length; j++) {
          if (myseries[i].data[j].name == params.name) {
            res +=
              '<span style="margin-right:5px;margin-top:5px;border-radius:10px;width:10px;height:10px;float:left;background-color:' +
              color +
              '"' +
              '></span>' +
              myseries[i].name +
              ' : ' +
              myseries[i].data[j].value +
              '</br>'
          }
        }
      }
      return res
    }
  },
  visualMap: {
    left: '90px',
    top: 'bottom',
    calculable: true,
    min: 0,
    max: 45000,
    inRange: {
      color: ['#e0ffff', '#006edd']
    }
  },
  series: [
    {
      name: '活跃商户数',
      type: 'map',
      mapType: 'china',
      roam: false,
      emphasis: {
        itemStyle: {
          areaColor: '#fff'
        }
      },
      data: []
    },
    {
      name: '商户门店数',
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      data: []
    },
    {
      name: '开单金额',
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      data: []
    },
    {
      name: 'PC终端数量(台)',
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      data: []
    }
  ]
}

export { dayOption, monthOption, mapOption }
