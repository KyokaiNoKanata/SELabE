import {Button} from 'antd';
import {ModalForm, ProFormSelect} from '@ant-design/pro-form';

export type DistributeFormType = {
  //roleCode: string; //exp: 'marketing_department_staff'
  request: any; //select 的 request，从后端拿到所有人的名字
  onSubmit: (values: any) => Promise<boolean>; //提交确认分配
  //trigger:  JSX.Element;
}
const DistributeForm: (props: DistributeFormType) => JSX.Element = (props) => {
  return (
    <ModalForm
      key={'audit'}
      title="分配委托"
      trigger={<Button type="primary">
        分配
      </Button>}
      onFinish={props.onSubmit}
    >
      <ProFormSelect
        showSearch
        width="md"
        label=""
        name="acceptorId"//key
        placeholder={'选择分配成员'}
        request={props.request}
      />
    </ModalForm>
  );
};

export default DistributeForm;
