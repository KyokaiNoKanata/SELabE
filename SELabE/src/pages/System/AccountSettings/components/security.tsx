import React, {useRef} from 'react';
import {addAuth, getCompany} from "@/services/ant-design-pro/system/api";
import {ProDescriptions} from '@ant-design/pro-descriptions';
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import type {ActionType} from "@ant-design/pro-table";
import {message} from "antd";
import type API from "../../../../services/ant-design-pro/typings"
import {useModel} from "@@/plugin-model/useModel";

const SecurityView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();

  const request = async function () {
    const result = await getCompany().then(res => {
      console.log(res)
      if(!res.data){
        return {
          text: "未认证",
          state:  0,
        }
      }else return {
        text: "已认证",
        state:  1,
        company: res?.data?.name,
        address: res?.data?.address,
        phone: res?.data?.phone,
      }
    })
    console.log(result);
    return {
      data: result
    }
  }

  return (
    <ProDescriptions
      title="当前认证"
      request={request}
      columns={[
        {
          title: '状态',
          key: 'text',
          dataIndex: 'text',
          valueType: "textarea",

        },
        {
          title: '当前公司',
          key: 'company',
          dataIndex: 'company',
          valueType: 'textarea',
        },
        {
          title: '地址',
          key: 'address',
          dataIndex: 'address',
          valueType: 'textarea',
        },
        {
          title: '电话',
          key: 'phone',
          dataIndex: 'phone',
          valueType: 'textarea',
        },
        {
          title: '操作',
          valueType: 'option',
          render: () => [
            <ModalForm
              title="添加认证"
              key={"auth"}
              width="400px"
              onFinish={
                async (values: {code?: number}) => {
                  // @ts-ignore
                  await addAuth(values.code, initialState.currentUser?.userId).then((res: API.Response) => {
                    console.log(res?.data);
                    if(!res?.data){
                      message.error(res?.msg);
                    }
                    else {
                      message.success("认证成功");
                    }
                  })
                  actionRef.current?.reload()
                  return true;
                }
              }
              trigger={<a>添加认证</a>}
            >
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: '请输入认证码',
                  },
                ]}
                width="md"
                name="code"
                label="认证码"
                tooltip={"请输入公司提供的八位认证码"}
              />
            </ModalForm>,
          ],
        },
      ]}
    >
    </ProDescriptions>
  );
};

export default SecurityView;
