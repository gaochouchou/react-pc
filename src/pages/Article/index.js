import { Link, useNavigate } from 'react-router-dom'
import { Popconfirm, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'



const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  // 频道列表管理
  const { channelStore } = useStore()
  useEffect(() => {
    channelStore.getChannelList()
  }, [channelStore])

  // 文章列表管理
  const [list, setList] = useState({
    list: [],
    count: 0
  })

  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })

  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写到内部
  // 统一不抽离函数到外面，只要涉及到异步请求的函数 都放到useEffect内部
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化，本身是一次性能消耗
  // 写到useEffect中，只会发在依赖项发生变化，函数才会进行初始化
  // 避免性能损失
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      setList({
        list: res.data.results,
        count: res.data.total_count
      })
    }
    loadList()
  }, [params])

  // 点击完成事件
  const onFinish = (values) => {
    const { status, channel_id, date } = values
    console.log(values)
    console.log(status, channel_id, date)
    // 数据处理
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params数据，引起接口重新发送
    // 会默认整体覆盖之前的参数，改了对象的整体引用
    setParams({
      ...params,
      ..._params
    })
    console.log(params)
  }

  // 翻页
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  // 删除文章
  const delArtile = async (data) => {
    // console.log(data.id)
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      ...params,
      page: 1,
    })
  }

  // 跳转更新
  const navigate = useNavigate()
  const goPublish = ({ id }) => {
    navigate(`/publish?id=${id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArtile(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>

          </Space>
        )
      }
    }
  ]

  return (
    <div>
      {/* 筛选区 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          initialValues={{ status: null }}
          onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              defaultValue='请选择文章频道'
              style={{ width: 120 }}
            >
              {channelStore.channel.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)}
              {/* <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option> */}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区 */}
      <Card title={`根据筛选条件共查询到${list.count}条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list.list}
          pagination={{
            pageSize: params.per_page,
            total: list.count,
            onChange: pageChange
          }} />
      </Card>

    </div>
  )
}

export default observer(Article)