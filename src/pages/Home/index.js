// 思路：
// 1、看官方文档，把echarts加入项目
//如何在react获取dom：useRef
// 在什么地方获取dom结点：useEffect
// 2、不抽离定制化参数 先把最小化demo运行起来
// 3、按照需求，修改自定义参数 抽象出业务

import Bar from '@/components/Bar'

function Home () {
  return (
    <div>
      <Bar
        title='主流框架使用满意度'
        xData={['ract', 'vue', 'angular']}
        yData={[30, 40, 50]}
        style={{ width: '500px', height: '400px' }} />
      <Bar
        title='主流框架使用满意度2'
        xData={['ract', 'vue', 'angular']}
        yData={[60, 70, 80]}
        style={{ width: '300px', height: '200px' }} />
    </div>
  )
}

export default Home