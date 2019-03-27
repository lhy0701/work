import React, { Component } from 'react'
import Banner from '../../components/Banner'
import './Download.scss'
class Download extends Component {
  constructor() {
    super()
    this.state = {
      isHover: true,
      isIosHover: true
    }
    this.handleOut = this.handleOut.bind(this)
    this.handleOver = this.handleOver.bind(this)
    this.ioshandleOver = this.ioshandleOver.bind(this)
    this.ioshandleOut = this.ioshandleOut.bind(this)
  }
  handleOver(e) {
    window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    this.setState({
      isHover: false
    })
  }
  handleOut(e) {
    window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    this.setState({
      isHover: true
    })
  }
  ioshandleOut(e) {
    window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    this.setState({
      isIosHover: true
    })
  }
  ioshandleOver(e) {
    window.event ? (window.event.cancelBubble = true) : e.stopPropagation()

    this.setState({
      isIosHover: false
    })
  }

  render() {
    //   <div className="download-block">
    //   <dl>
    //     <dd onMouseOver={this.ioshandleOver} onMouseOut={this.ioshandleOut}>
    //       {this.state.isIosHover ? (
    //         <img src={require('./images/icon_ios.png')} alt="android" />
    //       ) : (
    //         <img style={style.hover} src={require('./images/ios.png')} alt="android" />
    //       )}
    //     </dd>
    //     <dt>下载车企典苹果客户端</dt>
    //   </dl>
    // </div>
    return (
      <div >
        <Banner />
        <div className="downloadWrap" style={style.download}>
          <h1 style={style.h1}>立即下载</h1>
          <div className="downloadContainer">
            <div className="download-block">
              <dl>
                <dd onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                  {this.state.isHover ? (
                    <img src={require('./images/icon_anzhuo.png')} alt="android" />
                  ) : (
                    <img style={style.hover} src={require('./images/Android.jpg')} alt="android" />
                  )}
                </dd>
                <dt>下载车企典安卓客户端</dt>
              </dl>
            </div>
 {
          //    <div className="download-block">
          //   <dl>
          //     <dd onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
          //       {this.state.isHover ? (
          //         <img src={require('./images/icon_ios.png')} alt="android" />
          //       ) : (
          //         <img style={style.hover} src={require('./images/app_ios.png')} alt="ios" />
          //       )}
          //     </dd>
          //     <dt>下载车企典Iphone客户端</dt>
          //   </dl>
          // </div>
 }
            <div className="download-block">
              <dl>
                <dd onMouseOver={this.ioshandleOver} onMouseOut={this.ioshandleOut}>
                  {this.state.isIosHover ? (
                    <img src={require('./images/icon_ios.png')} alt="ios" />
                  ) : (
                    <img style={style.hover} src={require('./images/app_ios.png')} alt="ios" />
                  )}
                </dd>
                <dt>下载车企典苹果客户端</dt>
              </dl>
            </div>
            <div className="download-block">
              <dl>
                <dd>
                  <a href="http://www.chexd.com/software/车企典-汽配综合服务平台.exe">
                    <img src={require('./images/icon_cqd.png')} alt="PC端" />
                  </a>
                </dd>
                <dt>下载车企典-汽配综合服务平台</dt>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Download
const style = {
  download: {},
  h1: {
    textAlign: 'center',
    padding: '20px',
    marginTop: '-5px'
  },
  hover: {
    width: '154px',
    height: '154px'
  }
}
