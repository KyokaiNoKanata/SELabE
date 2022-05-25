import ProForm, {ProFormGroup, ProFormList, ProFormText,ProFormDatePicker} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import {PageHeader, message, Form,Button,Input} from 'antd';
import React from "react";
const TestReportChecklist = () => {
  const onFinish = async (value: any) => {
       console.log(value)
     }
  const request = async () => {
         return {};
       }
  return (
    <PageContainer>
      <PageHeader
        className="testreportchecklist"
        title="测试报告检查表"
      />
      <ProForm onFinish={onFinish}
               key={'testreportchecklist'}

               //从后端请求数据显示
               request={request}
      >
      <ProCard border>
        <ProFormText name='软件名称' label='软件名称' width='xl'/>
        <ProFormText name='委托单位' label='委托单位' width='xl'/>
      </ProCard>
      <ProCard border style={{ marginTop: 8 }} gutter={[8, 8]} wrap>
             <ProCard colSpan={2}  layout="center" bordered>
               序号
             </ProCard>
             <ProCard colSpan={4} layout="center" bordered>
               检查内容
             </ProCard>
             <ProCard colSpan={14} layout="center" bordered>
               内容描述
             </ProCard>
             <ProCard colSpan={4} layout="center" bordered>
               检查结果
             </ProCard>
             <ProCard colSpan={2} layout="center" bordered>
              1
             </ProCard>
             <ProCard colSpan={4} layout="center" bordered>
             报告编号
             </ProCard>
             <ProCard colSpan={14} layout="center" bordered>
              检查报告编号的正确性（是否符合编码规则）与前后的一致性（报告首页与每页页眉）。
             </ProCard>
             <ProCard colSpan={4} layout="center" bordered>
               <ProFormText name="检查结果1" width='xs'/>
             </ProCard>
             <ProCard colSpan={2} layout="center" bordered>2</ProCard>
             <ProCard colSpan={4} layout="center" bordered>页码</ProCard>
             <ProCard colSpan={14} layout="center" bordered>
             检查页码与总页数是否正确（报告首页与每页页眉）。
             </ProCard>
             <ProCard colSpan={4} layout="center" bordered>
              <ProFormText name="检查结果2" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>3</ProCard>
            <ProCard colSpan={4} layout="center" bordered>软件名称</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
            是否和确认单一致，是否前后一致（共三处，包括首页、报告页、附件三）。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果3" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>4</ProCard>
            <ProCard colSpan={4} layout="center" bordered>版本号</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
            是否和确认单一致，是否前后一致（共二处，包括首页、报告页）。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果4" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>5</ProCard>
            <ProCard colSpan={4} layout="center" bordered>委托单位</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             是否和确认单一致，是否前后一致（共二处，包括首页、报告页）。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果5" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>6</ProCard>
            <ProCard colSpan={4} layout="center" bordered>完成日期</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             是否前后一致（共二处，包括首页、报告页页末）。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果6" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>7</ProCard>
            <ProCard colSpan={4} layout="center" bordered>委托单位地址</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             是否和确认单一致（共一处，报告页）。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果7" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>8</ProCard>
            <ProCard colSpan={4} layout="center" bordered>序号</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             附件二、附件三中的序号是否正确、连续。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果8" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>9</ProCard>
            <ProCard colSpan={4} layout="center" bordered>测试样品</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             样品名称是否正确，数量是否正确。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果9" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>10</ProCard>
            <ProCard colSpan={4} layout="center" bordered>软、硬件列表</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             列表是否完整（如打印机），用途描述是否合理正确。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果10" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>11</ProCard>
            <ProCard colSpan={22}  bordered>文字、内容、格式</ProCard>

            <ProCard colSpan={2} layout="center" bordered>11.1</ProCard>
            <ProCard colSpan={4} layout="center" bordered>错别字</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             报告中是否还有错别字。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果11.1" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>11.2</ProCard>
            <ProCard colSpan={4} layout="center" bordered>语句</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
             报告的语句是否通顺合理；每个功能描述结束后是否都有句号。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果11.2" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>11.3</ProCard>
            <ProCard colSpan={4} layout="center" bordered>格式</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
            报告的格式是否美观，字体是否一致，表格大小是否一致。（如无特殊情况请尽量不要将报告页中的表格分为2页。）
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果11.3" width='xs'/>
            </ProCard>

            <ProCard colSpan={2} layout="center" bordered>12</ProCard>
            <ProCard colSpan={4} layout="center" bordered>用户文档测试报告</ProCard>
            <ProCard colSpan={14} layout="center" bordered>
            语句是否通顺，是否准确描述用户的文档。
            </ProCard>
            <ProCard colSpan={4} layout="center" bordered>
            <ProFormText name="检查结果12" width='xs'/>
            </ProCard>
         </ProCard>
        <ProCard border>
            <ProFormText name="检查人" label='检查人' width='md'/>
            <ProFormDatePicker name='日期' label='日期'/>
        </ProCard>
      </ProForm>
    </PageContainer>
  );
};

export default TestReportChecklist;
