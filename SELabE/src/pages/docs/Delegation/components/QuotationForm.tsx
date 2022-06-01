import {PageContainer} from "@ant-design/pro-layout";
import {Button, message, PageHeader} from "antd";
import ProForm, {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormText
} from "@ant-design/pro-form";
import React, {useRef, useState} from 'react';
import ProCard from "@ant-design/pro-card";
import {EditableProTable, ProColumns} from "@ant-design/pro-table";
import {
  acceptOffer,
  getDelegationByIds, getOffer, rejectOffer,
  saveOffer, submitOffer,
} from "@/services/ant-design-pro/delegation/api";
import {useLocation} from "react-router-dom";
import {ProFormInstance} from "@ant-design/pro-form/lib/BaseForm/BaseForm";

type DataSourceType = {
  id: React.Key;
  xiangmu?: string;
  fenxiang?: string;
  danjia?: string;
  shuoming?: string;
  hangheji?: string;
  children?: DataSourceType[];
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '项目',
    dataIndex: 'xiangmu',
  },
  {
    title: '分项',
    dataIndex: 'fenxiang',
  },
  {
    title: '单价',
    dataIndex: 'danjia',
  },
  {
    title: '说明',
    dataIndex: 'shuoming',
  },
  {
    title: '行合计',
    dataIndex: 'hangheji',
  },
  {
    title: '操作',
    valueType: 'option',
  },
];



/**
 * @param props isClient 判断身份是不是客户，如果是，则前面只能看不能写，最后签字，不然，是市场部，
 * @constructor
 */
const QuotationForm: React.FC<{isClient: boolean}> = (props) => {
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  const request = async () => {
    const offerId = (await getDelegationByIds({
      ids: String(delegationId),
    })).data[0].offerId;
    console.log('offerId='+ offerId);
    if(offerId == undefined) {
      return {};
    }
    const resp = await getOffer({
      id: offerId,
    });
    console.log(resp.data)
    return resp.data;
  };
  //保存
  const onFinish = async (value: any) => {
    const id: number = parseInt(delegationId);
    const data = value;
    console.log(data);
    saveOffer({
      delegationId: id,
      data: data,
    }).then(res => {
      if(res.code == 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    });
    return true;
  };
  //提交:提交委托号即可
  const handleSubmit = async () => {
    const res = await submitOffer({
      delegationId: delegationId,
    })
    if(res.code == 0) {
      message.success('报价单已提交');
    } else {
      message.error(res.msg);
    }
  }
  //接受，需要签字
  const handleAccept = async () => {
    let sign = formRef.current?.getFieldFormatValue!(['sign']);
    if(sign == undefined || (sign = sign.trim()) == '') {
      message.warning('请先签字')
      return;
    }
    const resp = await acceptOffer({
      delegationId: delegationId,
    });
    if(resp.code == 0) {
      message.success('报价单已接受');
    } else {
      message.error(resp.msg);
    }
  }
  //拒绝，需要原因
  const handleReject = async () => {
    let reason = formRef.current?.getFieldFormatValue!(['reason']);
    if(reason == undefined || (reason = reason.trim()) == '') {
      message.warning('请先输入原因')
      return;
    }
    const resp = await rejectOffer({
      delegationId: delegationId,
      reason: reason,
    });
    if(resp.code == 0) {
      message.success('报价单已拒绝');
    } else {
      message.error(resp.msg);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        className="quotation"
        title="报价单"
      />
      <ProCard>
        <ProForm
          key={'quotation'}
          onFinish={onFinish}
          request={request}
          formRef={formRef}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '保存',
            },
            render: (_, doms) => {
              return  [
                !props.isClient && (doms[0], doms[1]),
                !props.isClient && <Button htmlType="button" onClick={handleSubmit} key='submit'>提交</Button>,
                //客户：接受或拒绝
                props.isClient && <Button htmlType="button" onClick={handleAccept} key='accept'>接受</Button>,
                props.isClient && <Button htmlType="button" onClick={handleReject} key='reject' danger>拒绝</Button>,
              ]
            }
          }}
        >
          <ProFormDatePicker disabled={props.isClient} name="报价日期" label="报价日期"/>
          <ProFormDateRangePicker disabled={props.isClient} name="报价有效期" label="报价有效期"/>
          <ProFormText disabled={props.isClient} name="软件名称" label="软件名称" width="md"/>
          <ProForm.Item
            name="项目表格"
            trigger="onValuesChange"
          >
            <EditableProTable<DataSourceType>
              rowKey="id"
              toolBarRender={false}
              columns={columns}
              recordCreatorProps={{
                newRecordType: 'dataSource',
                position: 'bottom',
                record: () => ({
                  id: Date.now(),
                }),
                hidden: props.isClient,
              }}
              editable={{
                type: 'multiple',
                editableKeys,
                onChange: setEditableRowKeys,
                actionRender: (row, _, dom) => {
                  return [dom.delete];
                },
              }}
            />
          </ProForm.Item>
          <ProFormText disabled={props.isClient} name="小计" label="小计" width="xl"/>
          <ProFormText disabled={props.isClient} name="税率（8%）" label="税率（8%）" width="xl"/>
          <ProFormText disabled={props.isClient} name="总计" label="总计" width="xl"/>
          <ProFormText disabled={props.isClient} name="报价提供人" label="报价提供人" width="xl"/>
          <ProFormText disabled={!props.isClient} name="sign" label="如果接受报价，请在此签字" width="xl"/>
          <ProFormText disabled={!props.isClient} name="reason" label="如果不接受报价，请输入理由" width="xl"/>
          <div>户 名： 南京大学</div>
          <div>开户银行： 中国工商银行股份有限公司南京汉口路分理处</div>
          <div>账 号： 4301011309001041656</div>
          <br/>

        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
export default QuotationForm;
