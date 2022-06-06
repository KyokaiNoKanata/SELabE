import type {ReactNode} from "react";
import type API from "@/services/ant-design-pro/typings";
import {Link} from "umi";
import {Button, message} from "antd";
import CheckDelegation from "@/pages/Delegation/list/components/CheckDelegation";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import constant from "../../../../../config/constant";
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import {useRef} from "react";
import {ProFormInstance} from "@ant-design/pro-form/lib/BaseForm/BaseForm";
import {cancelDelegationClient} from "@/services/ant-design-pro/delegation/api";

export default () => {
  const formRef =useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const onCancel = async () => {
    const delegationId = formRef.current?.getFieldFormatValue!(['delegationId']);
    const cancelRemark = formRef.current?.getFieldFormatValue!(['cancelRemark']);
    const resp = await cancelDelegationClient({
      delegationId: delegationId,
      remark: cancelRemark,
    });
    if(resp.code == 0) {
      message.success('取消成功');
      actionRef.current?.reload();
      return true;
    } else {
      message.error(resp.msg);
      return false;
    }
  }
  const columns: ProColumns<API.DelegationItem>[] = [
    /** 填写委托 */
    {
      title: '填写委托',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        if ((record.state == constant.delegationState.DELEGATE_WRITING.desc
          || record.state == constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc
          || record.state == constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc)) {
          return [
            <Link to={{pathname: constant.docPath.delegation.APPLY, state: {id: id}}}>
              <Button type="primary">填写</Button>
            </Link>
          ]
        } else if(record.state == constant.delegationState.CLIENT_CANCEL_DELEGATION.desc
          || record.state == constant.delegationState.ADMIN_CANCEL_DELEGATION.desc){
          return [
            <text>委托已取消</text>
          ]
        } else {
          return [
            <text>委托已填写</text>
          ]
        }
      }
    },
    //取消委托
    {
      title: '取消委托',
      dataIndex: 'cancel',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        if(record.state == constant.delegationState.CLIENT_CANCEL_DELEGATION.desc
          || record.state == constant.delegationState.ADMIN_CANCEL_DELEGATION.desc) {
          return [];
        }
        return [
          <ModalForm
            formRef={formRef}
            key={'audit'}
            title="取消委托"
            trigger={<Button type="primary">
              取消
            </Button>}
            onFinish={onCancel}
            submitter={
              {
                searchConfig: {
                  submitText: '是',
                  resetText: '否',
                }
              }
            }
          >
            <ProFormText
              name={'delegationId'}
              label={'委托编号'}
              readonly
              initialValue={record.id}
            ></ProFormText>
            <ProFormText
              label={'取消理由'}
              name={'cancelRemark'}
              placeholder={'请输入取消理由'}
            >
            </ProFormText>
          </ModalForm>
        ]
      }
    },
  ];
  return (<CheckDelegation
    operationColumns={columns}
    actionRef={actionRef}
  />)
}
