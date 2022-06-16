import React from 'react';
import { Modal } from 'antd';
import type {API} from "@/services/ant-design-pro/typings";
import {getMenuByRole, getRoleByUser, menuList, roleList} from "@/services/ant-design-pro/system/api";
import Form from "@ant-design/pro-form";
import {
  ProForm,
  ProFormText,
  ProFormSelect
} from '@ant-design/pro-form';
import {forEach} from "lodash";
import { DefaultOptionType } from 'antd/lib/select';


export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.RoleDataItem) => void;
  onSubmit: (values: Partial<API.RoleDataItem>) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RoleDataItem>;
};

const getRoleData = async () => {
  const result = await roleList();
  return result.data;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const options: { label: string | undefined; value: number | undefined; }[] | undefined = [];
  const [form] = Form.useForm();
  return (
    <Modal
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      footer={null}
    >
      <ProForm
        title="角色分配"
        request={
          async () => {
            form.resetFields();
            const menus = await getRoleByUser(props.values.id);
            return ({
              name:props.values.name,
              id:props.values.id,
              menuIds: menus.data
            })
          }
        }
        onFinish={props.onSubmit}
      >
        <ProFormText
          name="id"
          label="用户ID"
          width="md"
          disabled
        />
        <ProFormText
          name="name"
          label="用户昵称"
          width="md"
          rules={[
            {
              required: true,
              message: '请输入用户昵称！',
            },
          ]}
        />
        <ProFormSelect
          name="roleIds"
          label="所属角色"
          width="lg"
          mode="multiple"
          request={async () => {
            getRoleData().then(res => {
              forEach(res, (item: any) => {
                options.push({
                  label: item.name,
                  value: item.id
                })
              });
              console.log(options);
            });
            return options;
          }
          }
         />
      </ProForm>
    </Modal>

  );
};

export default UpdateForm;
