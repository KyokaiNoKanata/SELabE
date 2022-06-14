import React from 'react';
import type API from "@/services/ant-design-pro/typings";

import {
  ProForm,
  ProFormText,
  ProFormRadio
} from '@ant-design/pro-form';
import {Modal} from "antd";


export type CreateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.MenuDataItem) => void;
  onSubmit: (values: Partial<API.MenuDataItem>) => Promise<void>;
  createModalVisible: boolean;
  values: Partial<API.RoleDataItem>;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <Modal
      title="新建菜单"
      width="400px"
      visible={props.createModalVisible}
      footer={null}>
      <ProForm
        onFinish={props.onSubmit}
      >
      <ProFormText
        rules={[
          {
            required: true,
            message: '菜单名称为必填项',
          },
        ]}
        width="md"
        name="name"
        label="菜单名称"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '路径为必填项',
          },
        ]}
        width="md"
        name="path"
        label="路径"
      />
      <ProFormRadio.Group
        rules={[
          {
            required: true,
          },
        ]}
        width="md"
        name="hideInMenu"
        label="在菜单中显示"
        options={[
          {
            value: '0',
            label: '是',
          },
          {
            value: '1',
            label: '否',
          },
        ]}
      />
      <ProFormRadio.Group
        width="md"
        name="status"
        label="状态"
        options={[
          {
            value: '0',
            label: '默认',
          },
          {
            value: '1',
            label: '开发中',
          },
          {
            value: '2',
            label: '已上线',
          }
        ]}
      />
      </ProForm>
    </Modal>

  );
};

export default CreateForm;
