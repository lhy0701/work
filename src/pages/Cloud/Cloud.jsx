import React, { Component } from 'react'
import './Cloud.scss'
import { Form, Input, Button } from 'antd'
class WrappedRegistrationForm extends Component {
  constructor() {
    super()
    this.state = {
      isHover: true,
      isIosHover: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const config = {
      rules: [
        {
          required: true,
          message: '请输入正确手机号码',
          len: 11,
          whitespace: true,
          regexp: /^1[34578]\d{9}$/,
          max: 11
        }
      ]
    }
    return (
      <div>
        <div style={style.download}>
          <div>
            <div className="loginWrap" style={style.loginWrap}>
              <div className="loginForm">
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item
                    label="手机号"
                    whitespace={true}
                    labelCol={{
                      xs: { span: 24 },
                      sm: { span: 6 }
                    }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 18 }
                    }}
                  >
                    {getFieldDecorator('phone', {
                      ...config
                    })(<Input placeholder="请输入云商手机号" />)}
                  </Form.Item>
                  <Form.Item
                    label="密码"
                    labelCol={{
                      xs: { span: 24 },
                      sm: { span: 6 }
                    }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 18 }
                    }}
                  >
                    {getFieldDecorator('password', {
                      ...{
                        rules: [
                          {
                            required: true,
                            message: '请输入正确密码',
                            whitespace: true
                          }
                        ]
                      }
                    })(<Input type="password" placeholder="请输入云商密码" />)}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      立即登录
                    </Button>
                    <span>提示：登录手机号和密码是云商的手机号和密码。</span>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const style = {
  download: {},
  loginWrap: {
    width: '966px',
    height: '452px',
    background: '',
    margin: '122px auto'
  }
}
const Cloud = Form.create({ name: 'register' })(WrappedRegistrationForm)

export default Cloud
