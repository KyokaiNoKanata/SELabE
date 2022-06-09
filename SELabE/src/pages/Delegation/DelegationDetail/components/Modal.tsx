import {Button, Modal as AntdModal, Space} from 'antd';
import {Link} from "@umijs/preset-dumi/lib/theme";
import {downloadPDFByDelegation} from "@/services/ant-design-pro/file/api";

/** 显示各个文档，点击相应文档进行文档查看
 * @param modalVisible: true:弹窗可见 false:不可见
 * @param hideModal 关闭弹窗
 * @param id 委托id
 * @constructor
 */
const Modal = (
  {modalVisible, hideModal, id}: { modalVisible: boolean; hideModal: () => void; id: number }) => {
  const getDocument = (tableName: string) => {
    return (
      <Button key = "下载" type = "primary" onClick={async () => {
        await downloadPDFByDelegation(id,tableName);
      }}>下载</Button>
    );
  }

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
          <Space direction="horizontal" size={100} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table2", state: {id: id}}}>
              软件项目委托测试申请书
            </Link>
            {getDocument("table2")}
          </Space>

          <Space direction="horizontal" size={114} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table3", state: {id: id}}}>
              委托测试软件功能列表
            </Link>
            {getDocument("table3")}
          </Space>


          <Space direction="horizontal" size={142} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table4", state: {id: id}}}>
              软件委托测试合同
            </Link>
            {getDocument("table4")}
          </Space>

          <Space direction="horizontal" size={86} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table5", state: {id: id}}}>
              软件项目委托测试保密协议
            </Link>
            {getDocument("table5")}
          </Space>

          <Space direction="horizontal" size={212} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/offer", state: {id: id}}}>
              报价单
            </Link>
            {getDocument("offer")}
          </Space>

          <Space direction="horizontal" size={198} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table6", state: {id: id}}}>
              测试方案
            </Link>
            {getDocument("table6")}
          </Space>

          <Space direction="horizontal" size={198} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table7", state: {id: id}}}>
              测试报告
            </Link>
            {getDocument("table7")}
          </Space>

          <Space direction="horizontal" size={198} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table8", state: {id: id}}}>
              测试用例
            </Link>
            {getDocument("table8")}
          </Space>

          <Space direction="horizontal" size={198} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table9", state: {id: id}}}>
              测试记录
            </Link>
            {getDocument("table9")}
          </Space>

          <Space direction="horizontal" size={156} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table10", state: {id: id}}}>
              测试报告检查表
            </Link>
            {getDocument("table10")}
          </Space>

          <Space direction="horizontal" size={198} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table11", state: {id: id}}}>
              问题清单
            </Link>
            {getDocument("table11")}
          </Space>

          <Space direction="horizontal" size={184} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table12", state: {id: id}}}>
              工作检查表
            </Link>
            {getDocument("table12")}
          </Space>

          <Space direction="horizontal" size={156} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table13", state: {id: id}}}>
              测试方案评审表
            </Link>
            {getDocument("table13")}
          </Space>

          <Space direction="horizontal" size={156} style={{ display: 'flex' }}>
            <Link to={{pathname: "/docs/form/table14", state: {id: id}}}>
              软件文档评审表
            </Link>
            {getDocument("table14")}
          </Space>

        </Space>

      </AntdModal>
  )
}

export default Modal
