import ProForm, {ProFormGroup, ProFormList, ProFormText} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, message, PageHeader} from 'antd';
import {useLocation} from 'react-router-dom';
import {getDelegationByIds, getTable3, saveTable3, submitDelegation} from '@/services/ant-design-pro/delegation/api';
import React from "react";

const FunctionList: React.FC<{ editable: boolean, isClient: boolean }> = (prop) => {
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id
  const request = async () => {
    const table3Id = (await getDelegationByIds({
      ids: String(delegationId),
    })).data[0].table3Id;
    console.log('table3Id=' + table3Id);
    if (table3Id == undefined) {
      return {};
    }
    const resp = await getTable3({
      id: String(table3Id),
    });
    //json string -> obj
    //const obj = JSON.parse(resp.data);
    //console.log(obj)
    console.log(resp.data)
    return resp.data;
  }
  const onFinish = async (value: any) => {
    const id: number = parseInt(delegationId);
    const data = value;
    saveTable3({
      delegationId: id,
      data: data,
    }).then(res => {
      if (res.code == 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    });
    return true;
  };
  /** 提交委托 */
  const handleSubmitDelegation = async () => {
    const res = await submitDelegation({
      id: delegationId,
    })
    if (res.code == 0) {
      message.success('委托已提交');
    } else {
      //message.error(res.msg)
      message.error('请先保存表单');
    }
  }
  // @ts-ignore
  // @ts-ignore
  return (
    <PageContainer>
      <PageHeader
        className="function-list"
        title="委托测试软件功能列表"
      />
      <ProForm onFinish={onFinish}
               key={'function-list'}
               submitter={{
                 searchConfig: {
                   resetText: '重置',
                   submitText: '保存',
                 },
                 render: (props, doms) => {
                   return prop.editable && [
                     ...doms,
                     <Button htmlType="button" onClick={handleSubmitDelegation} key='submit'>提交委托</Button>
                   ]
                 }
               }}
        //从后端请求数据显示
               request={request}
      >
        <ProFormText key={'name'} name="name" label="软件名称" disabled={prop.isClient}/>
        <ProFormText key={'version'} name="version" label="版本号" disabled={prop.isClient}/>
        <ProFormList
          name="function"
          label="功能列表"
          creatorButtonProps={prop.isClient ? false : {}}
          copyIconProps={prop.isClient ? false : {
            tooltipText: '复制此行到末尾',
          }}
          deleteIconProps={prop.isClient ? false : {
            tooltipText: '不需要这行了',
          }}
          itemRender={({listDom, action}, {record}) => {
            return (
              <ProCard
                bordered
                extra={action}
                title={record?.name}
                style={{
                  marginBottom: 8,
                }}
              >
                {listDom}
              </ProCard>
            );
          }}
        >
          <ProFormGroup>
            <ProFormText name="ffunction" label="功能名称" disabled={prop.isClient}/>
          </ProFormGroup>
          <ProFormList
            name="mfunction"
            label="子功能列表"
            creatorButtonProps={prop.isClient ? false : {}}
            itemRender={({listDom, action}, {record}) => {
              return (
                <ProCard
                  bordered
                  extra={action}
                  title={record?.name}
                >
                  {listDom}
                </ProCard>
              );
            }}
            copyIconProps={prop.isClient ? false : {
              tooltipText: '复制此行到末尾',
            }}
            deleteIconProps={prop.isClient ? false : {
              tooltipText: '不需要这行了',
            }}
          >

            <ProFormGroup key="group">
              <ProFormText name="value" label="子功能名称" disabled={prop.isClient}/>
              <ProFormText name="label" label="子功能说明" disabled={prop.isClient}/>
            </ProFormGroup>

          </ProFormList>
        </ProFormList>
      </ProForm>
    </PageContainer>
  );
};

export default FunctionList;
