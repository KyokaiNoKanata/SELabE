import React, { useState } from 'react';
import ProForm, { ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, PageHeader } from 'antd';
import { useRequest } from 'umi';

const FunctionList = () => {
  const [values,setValues]=useState({});
  const request=useRequest({
    url:'api/testcp',
    method:'post',
    body:JSON.stringify(values),
  },{
    manual:true
  });
  const [form]=Form.useForm();
  const onFinish = (value:any) => {
    console.log(value);
    setValues(value);
    request.run();
  };
  return (
    <PageContainer>
      <PageHeader
        className="function-list"
        title="委托测试软件功能列表"
      />
    <ProForm onFinish={onFinish}>
      <ProFormText name="name" label="软件名称" />
      <ProFormText name="version" label="版本号" />
      <ProFormList
        name="function"
        label="功能列表"
        itemRender={({ listDom, action }, { record }) => {
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
          <ProFormText name="ffunction" label="功能名称"  />
        </ProFormGroup>
        <ProFormList
          name="mfunction"
          label="子功能列表"
          
          itemRender={({ listDom, action }, { record }) => {
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
          copyIconProps={{
            tooltipText: '复制此行到末尾',
          }}
          deleteIconProps={{
            tooltipText: '不需要这行了',
          }}
        >
         
          <ProFormGroup key="group">
            <ProFormText name="value" label="子功能名称" />
            <ProFormText name="label" label="子功能说明"  />
          </ProFormGroup>
          
        </ProFormList>
      </ProFormList>
    </ProForm>
    </PageContainer>
  );
};

export default FunctionList;