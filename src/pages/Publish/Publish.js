import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { http } from '@/utils'


const { Option } = Select


const Publish = () => {
  const { channelStore } = useStore()
  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])
  // 使用useRef申明一个暂存仓库
  const cacheImgList = useRef()
  const onUploadChange = (result) => {
    // 采取受控写法，在最后一次log里response
    // 最终react state fileList中存放的数据有 response.data.url
    // 这里关键位置：需要做数据格式化
    const fileList = result.fileList
    const formatList = fileList.map(file => {
      // 上传文件 做数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 否则在上传中时 不做处理
      return file
    })
    setFileList(formatList)
    // 同时把图片列表存入仓库一份
    cacheImgList.current = formatList
  }

  // 切换图片
  const [imgCount, setImgSetcount] = useState(1)
  const radioChange = (e) => {
    // 这里判断依据采取原始值，不采取经过useState方法修改之后的数据
    // useState修改之后的数据，无法同步获取修改之后的新值
    const rawValue = e.target.value
    setImgSetcount(e.target.value)
    // 从仓库里面取对应的图片数量，交给我们用来渲染图片列表的fileList
    // 通过调用setFileList
    if (e.target.value === 1) {
      const img = cacheImgList.current ? cacheImgList.current[0] : 0
      setFileList([img])
    } else if (e.target.value === 3) {
      setFileList(cacheImgList.current)
    }
  }

  // 提交表单
  const navigate = useNavigate()
  const conifrm = async (value) => {
    // 此处可能由于网络原因图片取到url有延迟，需要等待
    const params = {
      ...value,
      cover: {
        type: value.type,
        images: fileList.map(item => item.url)
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    }
    else {
      await http.post('/mp/articles?draft=false', params)
    }

    // 跳转列表 提示用户
    navigate('/article')
    message.success(`${id ? '更新' : '发布'}成功`)
  }

  // 编辑功能
  // 文案适配 路由参数id 判断条件
  const [params] = useSearchParams()
  const id = params.get('id')
  console.log('文章id：', id)

  // 数据回填 id调用接口
  // 1、表单回填 2、暂存列表 3、upload组件fileList
  const form = useRef()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const data = res.data
      // 表单数据回填 实例方法
      form.current.setFieldsValue({ ...data })
      // 调用setFileList方法回填upload
      const formatImgList = data.cover.images.map(item => {
        return {
          'url': item
        }
      })
      setFileList(formatImgList)
      // 暂存列表也存入一份(暂存列表和fileList回显列表保持数据结构统一就可以)
      cacheImgList.current = formatImgList
    }
    // 必须是编辑状态才发送请求
    if (id) {
      loadDetail()
      console.log(form.current)
    }
  }, [id])

  // 更新频道列表
  useEffect(() => {
    channelStore.getChannelList()
  }, [channelStore])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? '编辑' : '发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: 'this is Contet' }}
          onFinish={conifrm}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channel.map(item => (<Option value={item.id} key={item.id}>{item.name}</Option>))}

            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 ?
              (<Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action='http://geek.itheima.net/v1_0/upload'
                fileList={fileList}
                onChange={onUploadChange}
                maxCount={imgCount}
                multiple={imgCount > 1}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>) : ''}

          </Form.Item>
          {/* 这里的富文本组件，已经被From.Item控制 */}
          {/* 它的输入内容，会在onFinished回调中收集 */}
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? '更新' : '发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)