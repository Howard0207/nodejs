/* Created by GH on 2018/04/20 */
$(function () {
  // Navigation Menu
  $(function () {
    $('.menu ul').css({ display: 'none' }) // Opera Fix
    $('.menu li').hover(function () {
      $(this).find('ul:first').css({ visibility: 'visible', display: 'none' }).slideDown('normal')
    }, function () {
      $(this).find('ul:first').css({ visibility: 'hidden' })
    })
  })

  class ChartCreater{
    constructor(contents) {
      let chartData = this.dataHandle(contents)
      new Area(chartData.area.x,chartData.area.y)
      new Radar(chartData.radar.x,chartData.radar.y)
      new Pie(chartData.pie.x,chartData.pie.y)
      new Bar(chartData.bar.x,chartData.bar.y)
    }
    dataHandle(contents) {
      let category = []
      // area
      let nowM = new Date().getMonth()+1
      let area_y = new Array(nowM).fill(0)
      let area_x = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      area_x = area_x.slice(0,nowM)
    
      // radar
      let max = Math.ceil(contents.length*0.5)
      let dataR = []
      let indicator = []
    
      // pie
      let dataP = []
      let index = null
    
      // bar
      let dataB = []
    
      for(let i=0,item = null; item = contents[i++];){
        // arr
        let month = new Date(item.addTime).getMonth()
        area_y[month]++
    
        index = category.indexOf(item.category.name)
    
        if(index>-1){
          // radar
          dataR[index]++
          indicator[index].max = Math.max(max,dataR[index])
          // pie
          dataP[index].value += item.views
          // bar
          dataB[index] += item.comments.length
        } else {
          category.push(item.category.name)
          // radar
          indicator.push({name: item.category.name, max: max})
          dataR.push(1)
          // pie
          dataP.push({value: item.views, name:item.category.name})
          // bar
          dataB.push(item.comments.length)
        }
      }
    
      return {
        area: {
          x: area_x,
          y: area_y
        },
        radar: {
          x: indicator,
          y: dataR
        },
        pie: {
          x: category,
          y: dataP
        },
        bar: {
          x: category,
          y: dataB
        }
      }
    }
  }

  class Area{
    constructor(xAxis,yAxis) {
      let option = this.getOptions(xAxis,yAxis)
      let chart = echarts.init(document.getElementById('month-report'), 'vintage')
      chart.setOption(option)
    }
    getOptions(xAxis,yAxis) {
      return {
        tooltip: {
          trigger: 'axis',
          position: function () {
            return ['50%', '50%']
          }
        },
        title: {
          top: '30px',
          left: 'center',
          text: new Date().getFullYear()+'年博客更新情况',
        },
        grid: {
          left: '15%',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '30%'],
          splitLine: false
        },
        series: [
          {
            name: '博客数量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: 'rgb(255, 70, 131)'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }])
              }
            },
            data: yAxis
          }
        ]
      }
    }
  }


  class Radar{
    constructor(xAxis,yAxis) {
      let option = this.getOptions(xAxis,yAxis)
      let chart = echarts.init(document.getElementById('views-report'), 'vintage')
      chart.setOption(option)
    }
    getOptions(xAxis,yAxis) {
      return {
        title: {
          text: '各分类博客占比分析',
          top: '30px',
          left: 'center'
        },
        tooltip: {
          position: function () {
            return ['30%', '50%']
          }
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          center:['50%','58%'],
          radius: '50%',
          indicator: xAxis,
        },
        series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: yAxis,
              name: '预算分配（Allocated Budget）'
            }
          ]
        }]
      }
    }
  }

  class Pie{
    constructor(xAxis,yAxis) {
      let option = this.getOptions(xAxis,yAxis)
      let chart = echarts.init(document.getElementById('category-report'), 'vintage')
      chart.setOption(option)
    }
    getOptions(xAxis,yAxis) {
      return {
        title: {
          text: '各分类博客点击率',
          top: '30px',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '30px',
          data: xAxis
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: yAxis,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }


  class Bar{
    constructor(xAxis,yAxis) {
      let option = this.getOptions(xAxis,yAxis)
      let chart = echarts.init(document.getElementById('comments-report'), 'vintage')
      chart.setOption(option)
    }
    getOptions(xAxis,yAxis) {
      return {
        title: {
          text: '各分类博客互动情况',
          top: '30px',
          left: 'center'
        },
        tooltip: {
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = {top: 60}
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: yAxis,
          type: 'bar'
        }]
      }
    }
  }


  $.ajax({
    url:'/admin/user/dataview',
    type: 'post',
    dataType: 'json',
    data: {},
    success: function(res) {
      new ChartCreater(res.message)
    },
    error: function(e) {
      throw new Error(e)
    }
  })
})