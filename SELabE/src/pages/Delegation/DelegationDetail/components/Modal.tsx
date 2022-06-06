import {Modal as AntdModal} from 'antd';

const Modal = (
  {modalVisible, hideModal}: {modalVisible: boolean; hideModal: () => void; }) => {
  return(
    <div>
      <AntdModal
        title = "我的文档"
        visible = {modalVisible}
        onCancel = {hideModal}
        onOk={() =>{
          hideModal();
        }}
      >
        <div>好多文档</div>
      </AntdModal>
    </div>
  )
}

export default Modal
