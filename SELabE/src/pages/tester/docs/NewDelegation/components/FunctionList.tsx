import ProForm, { ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import {PageHeader, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { getTable3,getDelegationByIds, saveTable3 } from '@/services/ant-design-pro/tester/api';
const FunctionList = () => {
  const params = useLocation();
  const delegationId = (params as any).query.id;//ok

  const request = async () => {
    const table3Id = (await getDelegationByIds({
      ids: String(delegationId),
    })).data[0].table3Id;
    console.log('table3Id='+ table3Id);
    if(table3Id == undefined) {
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
      if(res.code == 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    });
    return true;
  };
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
               }}
               //从后端请求数据显示
               request={request}
      >
        <ProFormText key={'name'} name="name" label="软件名称" />
        <ProFormText key={'version'} name="version" label="版本号" />
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
