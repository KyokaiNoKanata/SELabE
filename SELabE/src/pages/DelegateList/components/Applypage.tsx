import React ,{useState,useEffect} from 'react';
import { Card, message, PageHeader } from 'antd';
import {PageContainer, FooterToolbar} from "@ant-design/pro-layout";
import { Form, Input, Button, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
const { TextArea } = Input;
import {useRequest} from 'umi';
import ProForm, {
  ProFormDependency,
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormGroup,
} from '@ant-design/pro-form';
const Applypage=()=>{
  const [values,setValues]=useState({});
  const init=useRequest('api/testb');
  const request=useRequest({
    url:'api/testbp',
    method:'post',
    body:JSON.stringify(values),
  },{
    manual:true
  });

  const [form]=Form.useForm();
  form.setFieldsValue(init.data);
  const onFinish = (value:any) => {
    console.log(value);
    setValues(value);
    request.run();
  };
  return (
    <PageContainer content="用户向本中心发起测试委托">
      <PageHeader
        className="site-page-header"
        title="软件项目委托测试申请书"
      />
      <ProForm
        hideRequiredMark
        name="basic"
        layout="vertical"
        initialValues={{
          public: '1',
          expectFinishDate: Date.now()
        }}
        form={form}
        onFinish={onFinish}
      >
        <ProFormCheckbox.Group
          name="测试类型"
          label="测试类型"
          options={['软件确认测试', '成果/技术鉴定测试', '专项资金验收测试', '其它']}
        />
        <ProFormGroup>
          <ProFormText width="xl" name="软件名称" label="软件名称" />
          <ProFormText width="md" name="版本号" label="版本号" />
        </ProFormGroup>

        <ProFormText width="xl" name="委托单位Ch" label="委托单位（中文）" />
        <ProFormText width="xl" name="委托单位En" label="委托单位（英文）" />
        <ProFormText width="xl" name="开发单位" label="开发单位" />

        <ProFormRadio.Group
          name="单位性质"
          label="单位性质"
          options={[
            {
              label: '内资企业',
              value: '内资企业 ',
            },
            {
              label: '外(合)资企业 ',
              value: '外(合)资企业 ',
            },
            {
              label: '科研院校 ',
              value: '科研院校 ',
            },
            {
              label: '政府事业团体',
              value: '政府事业团体',
            },
            {
              label: '其它',
              value: '其它',
            },
            {
              label: '港澳台(合)资企业',
              value: '港澳台(合)资企业',
            },
          ]}
        />

        <Form.Item name="软件用户对象描述" label="软件用户对象描述" >
          <TextArea  style={{ height: 60 }}  />
        </Form.Item>

        <Form.Item name="主要功能及用途简介（限200字）" label="主要功能及用途简介（限200字）" >
          <TextArea showCount maxLength={200}  style={{ height: 60 }}  />
        </Form.Item>

        <ProFormCheckbox.Group
          name="测试依据"
          label="测试依据"
          options={['GB/T 25000.51-2010', 'GB/T 16260.1-2006', 'NST-03-WI12-2011','NST-03-WI13-2011','其它']}
        />

        <ProFormCheckbox.Group
          name="需要测试的技术指标"
          label="需要测试的技术指标"
          options={['功能性' , '可靠性' , '易用性',  '效率' , '可维护性' , '可移植性',
            '代码覆盖度',  '缺陷检测率',  '代码风格符合度' , '代码不符合项检测率',
            '产品说明要求' , '用户文档集要求','其它']}
        />


      </ProForm>
    </PageContainer>
  );
}
export default Applypage;
