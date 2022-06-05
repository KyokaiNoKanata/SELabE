import React from 'react';
import { Modal } from 'antd';
import type {API} from "@/services/ant-design-pro/typings";
import {getMenuByRole, menuList} from "@/services/ant-design-pro/system/api";
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

const getMenuData = async () => {
  const result = await menuList();
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
      }}
      footer={null}
    >
      <ProForm
          title="配置角色"
          request={
            async () => {
              form.resetFields();
              const menus = await getMenuByRole(props.values.id);
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
          label="角色ID"
          width="md"
          disabled
        />
          <ProFormText
            name="name"
            label="角色名称"
            width="md"
            rules={[
              {
                required: true,
                message: '请输入角色名称！',
              },
            ]}
          />
        <ProFormSelect
          name="menuIds"
          label="菜单权限"
          width="lg"
          mode="multiple"
          request={async () => {
            getMenuData().then(res => {
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
          >

        </ProFormSelect>
      </ProForm>
    </Modal>

  );
};

export default UpdateForm;
