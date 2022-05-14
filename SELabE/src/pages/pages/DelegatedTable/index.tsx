import React from 'react';
import ProForm, { ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';

const DelegatedTable = () => {
  return (
    <ProForm onFinish={async (e) => console.log(e)}>
      <ProFormText name="name" label="软件名称" />
      <ProFormText name="name" label="版本号" />
      <ProFormList
        label="软件功能项目"
        initialValue={[
          {
            name: '',
          },
        ]}
        itemRender={({ listDom, action }, { record }) => {
          return (
            <ProCard
              bordered
              extra={action}
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
          <ProFormText name="name" label="功能" />
        </ProFormGroup>
        <ProFormList
          name="labels"
          initialValue={[
            {
              value: '',
              label: '',
            },
          ]}
          copyIconProps={{
            tooltipText: '复制此行到末尾',
          }}
          deleteIconProps={{
            tooltipText: '不需要这行了',
          }}
        >
          <ProFormGroup key="group">
            <ProFormText width="xl" name="value" label="功能模块" />
            <ProFormText width="xl" name="label" label="功能说明" />
          </ProFormGroup>
        </ProFormList>
      </ProFormList>
    </ProForm>
  );
};

export default Demo;
