import React, { Component } from 'react'

class Aboutus extends Component {
  render() {
    return (
      <div>
        <img style={style.img} src={require('./images/aboutus.png')} alt="北京车兄弟有限公司" />
      </div>
    )
  }
}
export default Aboutus
const style = {
  img: {
    width: '100%',
    minWidth: '1300px'
  }
}
