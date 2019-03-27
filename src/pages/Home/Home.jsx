import React, { Component } from 'react'
import Banner from '../../components/Banner'
import './Home.scss'
class Home extends Component {
  render() {
    return (
      <div className="cb-home">
        <div>
          <Banner />

          <div className="culture">
            <h1>企业文化</h1>
            <p className="content">
              车兄弟立志于为汽配人创造财富，为员工创造幸福。以车企典软件为依托，凭借软件工具和云商平台，将汽配行业的冗杂信息进行分类整合，加强了信息流通，
              提高了资源流动及利用效率，推动了汽配行业的良性发展，为各领域有志之士提供了成长的舞台。通过不断的创新，为社会创造了财富。以“专业人做专业事”为领导思想，分工明确，精益求精。
            </p>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
