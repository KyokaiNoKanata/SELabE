import React from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};
const treeData = [
  {
    title: '系统管理',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '角色管理',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: '委托管理',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '分配委托',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ProForm
      onFinish={props.onSubmit}
    >
        <ProFormTreeSelect
          initialValue={['0-0-0']}
          label="菜单分配"
          width={600}
          request={async () => treeData}
          fieldProps={{
            fieldNames: {
              label: 'title',
            },
            treeCheckable: true,
            //showCheckedStrategy: TreeSelect.SHOW_PARENT,
            placeholder: '选择要分配的菜单',
          }}
        />

        <ProFormTextArea
          name="desc"
          width="md"
          label="角色描述"
          placeholder="请输入至少五个字符"
          rules={[
            {
              required: true,
              message: '请输入至少五个字符的角色描述！',
              min: 5,
            },
          ]}
        />

    </ProForm>
  );
};

export default UpdateForm;
