// 封装bar组件

import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

function Bar ({ title, XData, yData, style }) {
  const domRef = useRef(null)
  const chartInit = () => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(domRef.current)
    // 绘制图表
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: XData
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: yData
        }
      ]
    })
  }

  useEffect(() => {
    chartInit()
  }, [])

  return (
    <div>
      {/* 准备一个挂载结点 */}
      <div ref={domRef} style={style}></div>
    </div>
  )
}
export default Bar