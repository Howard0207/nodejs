/* Created by GH on 2018/04/20 */
$(function(){
  // Navigation Menu
  $(function() {
    $(".menu ul").css({display: "none"}); // Opera Fix
    $(".menu li").hover(function(){
      $(this).find('ul:first').css({visibility: "visible",display: "none"}).slideDown("normal");
    },function(){
      $(this).find('ul:first').css({visibility: "hidden"});
    });
  });



var base = +new Date(1968, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [Math.random() * 300];

for (var i = 1; i < 20000; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}

var option = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        top: '30px',
        left: 'center',
        text: '大数据量面积图',
    },
    grid: {
      left: '15%',
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '30%'],
        splitLine: false
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            name:'模拟数据',
            type:'line',
            smooth:true,
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
            data: data
        }
    ]
};


var chart = echarts.init(document.getElementById('month-report'), 'vintage');
chart.setOption(option)


var option1 = {
  title: {
      text: '基础雷达图'
  },
  tooltip: {},
  legend: {
      data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
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
      indicator: [
         { name: '销售（sales）', max: 6500},
         { name: '管理（Administration）', max: 16000},
         { name: '信息技术（Information Techology）', max: 30000},
         { name: '客服（Customer Support）', max: 38000},
         { name: '研发（Development）', max: 52000},
         { name: '市场（Marketing）', max: 25000}
      ]
  },
  series: [{
      name: '预算 vs 开销（Budget vs spending）',
      type: 'radar',
      // areaStyle: {normal: {}},
      data : [
          {
              value : [4300, 10000, 28000, 35000, 50000, 19000],
              name : '预算分配（Allocated Budget）'
          },
           {
              value : [5000, 14000, 28000, 31000, 42000, 21000],
              name : '实际开销（Actual Spending）'
          }
      ]
  }]
};

var chart1 = echarts.init(document.getElementById('views-report'), 'vintage');
chart1.setOption(option1)



var option2 = {
  title : {
      text: '某站点用户访问来源',
      subtext: '纯属虚构',
      x:'center'
  },
  tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
  },
  series : [
      {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
              {value:335, name:'直接访问'},
              {value:310, name:'邮件营销'},
              {value:234, name:'联盟广告'},
              {value:135, name:'视频广告'},
              {value:1548, name:'搜索引擎'}
          ],
          itemStyle: {
              emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
};
var chart2 = echarts.init(document.getElementById('category-report'), 'vintage');
chart2.setOption(option2)



var option3 = {
  xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
  }]
};
var chart3 = echarts.init(document.getElementById('comments-report'), 'vintage');
chart3.setOption(option3)



})