import { Card, Form, Input, Button, Checkbox, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

function Login () {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  async function onFinish (values) {
    try {
      // values放置所有表单项中用户输入的内容
      // todo：登录操作
      await loginStore.getToken({
        mobile: values.mobile,
        code: values.code
      })
      // 跳转首页
      navigate('/', { replace: true })
      message.success('登陆成功')
    } catch (error) {
      message.error('登录失败')
    }

  }
  // 校验失败时候执行此处函数
  function onFinishFailed (values) {
    console.log(values)
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          initialValues={{
            remember: true,
            mobile: '13911111111',
            code: '246810'
          }}
          // 子项用到的触发事件，需要在Form中声明
          validateTrigger={['onBlur', 'onChange']}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <Form.Item
            name='mobile'
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                message: '请输入正确的手机号!',
                validateTrigger: 'onBlur'
              }
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name='code'
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
              {
                len: 6,
                message: '验证码6个字符',
                validateTrigger: 'onBlur'
              },
            ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item>
            {/* <!-- 渲染Button组件为submit按钮 --> */}
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login