import axios from 'axios'
import { env } from '@/core/js/env'
// import qs from 'qs'

class ApiService {
  constructor() {}

  init() {
    axios.defaults.baseURL = env.getConfig().service
    // axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.withCredentials = true

    // Add a request interceptor
    axios.interceptors.request.use(
      function(config) {
        // Do something before request is sent
        // config.data = config.data.toString()
        return config
      },
      function(error) {
        // Do something with request error
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    axios.interceptors.response.use(
      response => {
        // Do something with response data
        let message = response.data.Message
        // 业务成功
        if (!message.ErrorMessage) {
          return response.data
        } else {
          let e
          e = {
            config: response.config,
            name: 'Business Error',
            message: response.data.Message.ErrorMessage.ErrMsg,
            response: response
          }
          return Promise.reject(e)
        }
      },
      error => {
        // Do something with response error
        return Promise.reject(error)
      }
    )
  }

  /**
   * 更新header
   * @param header
   */
  setHeader(header) {
    Object.assign(axios.defaults.headers.common, header)
  }

  /**
   * get
   * @param url   请求地址
   * @param data  请求参数
   */
  get(url) {
    return axios.get(url).catch(err => {
      throw err
    })
  }

  /**
   * post
   * @param url   请求地址
   * @param data  请求参数
   */
  post(url, data) {
    return axios.post(url, data).catch(err => {
      throw err
      // return err
    })
  }
}

export default new ApiService()
