import {Modal as AntdModal, Space} from 'antd';
import {Link} from "@umijs/preset-dumi/lib/theme";

const Modal = (
  {modalVisible, hideModal, id}: { modalVisible: boolean; hideModal: () => void; id: number }) => {
  return (
      <AntdModal
        title="我的文档"
        visible={modalVisible}
        onCancel={hideModal}
        onOk={() => {
          hideModal();
        }}
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Link to={{pathname: "/docs/form/table2", state: {id: id}}}>
            软件项目委托测试申请书
          </Link>
          <Link to={{pathname: "/docs/form/table3", state: {id: id}}}>
            委托测试软件功能列表
          </Link>

          <Link to={{pathname: "/docs/form/table4", state: {id: id}}}>
            软件委托测试合同
          </Link>

          <Link to={{pathname: "/docs/form/table5", state: {id: id}}}>
            软件项目委托测试保密协议
          </Link>

          <Link to={{pathname: "/docs/form/table6", state: {id: id}}}>
            测试方案
          </Link>

          <Link to={{pathname: "/docs/form/table7", state: {id: id}}}>
            测试报告
          </Link>

          <Link to={{pathname: "/docs/form/table8", state: {id: id}}}>
            测试用例
          </Link>

          <Link to={{pathname: "/docs/form/table9", state: {id: id}}}>
            测试记录
          </Link>

          <Link to={{pathname: "/docs/form/table10", state: {id: id}}}>
            测试报告检查表
          </Link>

          <Link to={{pathname: "/docs/form/table11", state: {id: id}}}>
            问题清单
          </Link>

          <Link to={{pathname: "/docs/form/table12", state: {id: id}}}>
            工作检查表
          </Link>

          <Link to={{pathname: "/docs/form/table13", state: {id: id}}}>
            测试方案评审表
          </Link>

          <Link to={{pathname: "/docs/form/table14", state: {id: id}}}>
            软件文档评审表
          </Link>
        </Space>

      </AntdModal>
  )
}

export default Modal
