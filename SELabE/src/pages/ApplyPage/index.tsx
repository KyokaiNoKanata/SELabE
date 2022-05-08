import React ,{useState,useEffect} from 'react';
import {Card, Checkbox, Col, DatePicker, message, PageHeader, Row} from 'antd';
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
import FormItem from 'antd/lib/form/FormItem';
import ProCard from '@ant-design/pro-card';
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
        <ProCard title = '委托单位信息' bordered>
          <ProFormText width = "md" name = "委托单位_电话" label = "电话:"></ProFormText>
          <ProFormText width = "md" name = "委托单位_传真" label = "传真"></ProFormText>
          <ProFormText width = "md" name = "委托单位_地址" label = "地址"></ProFormText>
          <ProFormText width = "md" name = "委托单位_邮编" label = "邮编"></ProFormText>
          <ProFormText width = "md" name = "委托单位_联系人" label = "联系人"></ProFormText>
          <ProFormText width = "md" name = "委托单位_手机" label = "手机"></ProFormText>
          <ProFormText width = "md" name = "委托单位_Email" label = "E-mail"></ProFormText>
          <ProFormText width = "md" name = "委托单位_网址" label = "网址"></ProFormText>
        </ProCard>
        <ProCard title = '国家重点实验室联系方式' bordered>
          <div>单位地址：南京市栖霞区仙林大道163号</div>
          <div>邮政编码：210023</div>
          <div>电话： 86-25-89683467</div>
          <div>传真： 86-25-89686596</div>
          <div>网址： http://keysoftlab.nju.edu.cn</div>
          <div>E-mail:  keysoftlab@nju.edu.cn</div>
        </ProCard>
        <ProCard bordered>
          <ProForm.Group>
            <ProFormSelect
              name="密级"
              label="密级"
              width='md'
              valueEnum={{
                无密级:'无密级',
                秘密:'秘密',
                机密:'机密',
              }}
              placeholder="无密级"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="查杀病毒"
              label="查杀病毒"
              width='md'
              valueEnum={{
                已完成:'已完成',
                无法完成:'无法完成',
              }}
              placeholder='已完成'
              rules={[{required: true}]}
            />
          </ProForm.Group>
        </ProCard>
        <ProCard title = '材料检查' bordered>
          <ProForm.Group>
            <ProFormCheckbox.Group
              name = '测试样品'
              label = '测试样品'
              layout = 'vertical'
              options={['源代码','可执行文件']}
            />
            <ProFormCheckbox.Group
              name = '需求文档'
              label = '需求文档'
              layout = 'vertical'
              options={['项目计划任务书','需求分析报告','合同']}
            />
            <ProFormCheckbox.Group
              name = '用户文档'
              label = '用户文档'
              layout = 'vertical'
              options = {['用户手册','用户指南']}
            />
            <ProFormCheckbox.Group
              name = '操作文档'
              label = '操作文档'
              layout = 'vertical'
              options = {['操作员手册','安装手册','诊断手册','支持手册']}
            />
            <ProFormText label = '其他' name = '材料检查_其他'></ProFormText>
          </ProForm.Group>
        </ProCard>
        <ProCard bordered>
          <ProForm.Group>
             <ProFormSelect
               width= 'md'
               name = '确认意见'
               label = '确认意见'
               valueEnum={
                 {
                   确认意见1:"测试所需材料不全，未达到受理条件。",
                   确认意见2:"属依据国家标准或自编非标规范进行的常规检测，有资质、能力和资源满足委托方要求。",
                   确认意见3:"无国家标准和规范依据，或实验室缺乏检测设备和工具，无法完成检测。",
                   确认意见4:"超出实验室能力和资质范围，无法完成检测。"
                 }
               }
               placeholder = "请选择"
               rules = {[{required : true}]}
             />
             <ProFormSelect
               width= 'md'
               name = '受理意见'
               label = '受理意见'
               valueEnum={
                 {
                   受理意见1:"受理-进入项目立项和合同评审流程",
                   受理意见2:"不受理",
                   受理意见3:"进一步联系"
                 }
               }
               placeholder= "请选择"
               rules = {[{required : true}]}
             >
             </ProFormSelect>
          </ProForm.Group>
        </ProCard>
        <ProCard bordered>
          <ProFormText width = 'md' label = '测试项目编号' name = '测试项目编号'></ProFormText>
        </ProCard>
        <ProCard bordered>
          <ProFormTextArea
            name = "备注"
            label = "备注"
          >
          </ProFormTextArea>
        </ProCard>
        <ProCard>
          <ProForm.Group>
            <ProFormText name = "受理人（签字）" label = "受理人（签字）"></ProFormText>
            <ProFormText name = "受理人_日期" label = "日期"></ProFormText>
          </ProForm.Group>
        </ProCard>
        <ProCard>
          <ProForm.Group>
            <ProFormText name = "委托人（签字）" label = "委托人（签字）"></ProFormText>
            <ProFormText name = "委托人_日期" label = "日期"></ProFormText>
          </ProForm.Group>
        </ProCard>

      </ProForm>
    </PageContainer>
  );
}
export default Applypage;
