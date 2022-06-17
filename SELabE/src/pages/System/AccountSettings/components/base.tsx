import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Input, Upload, message, List} from 'antd';
import ProForm, {
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm
} from '@ant-design/pro-form';
import ProDescriptions from "@ant-design/pro-descriptions";
import type API from "../../../../services/ant-design-pro/typings"

import styles from './BaseView.less';
import {useModel} from "@@/plugin-model/useModel";

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser?.userInfo?.avatar) {
        return currentUser?.userInfo?.avatar;
      }
    }
    return '';
  };

  const handleFinish = async () => {
    message.success('更新个人信息成功');
  };
  return (
    <div className={styles.baseView}>
      {(
        <>
          <div className={styles.left}>
            <ProDescriptions<API.UserDataItem>
              layout="horizontal"
              column={1}
              dataSource={currentUser?.userInfo}
              columns={[
                {
                  title: '用户名',
                  key: 'username',
                  dataIndex: 'username',
                  ellipsis: true,
                  copyable: true,
                },
                {
                  title: '昵称',
                  key: 'nickname',
                  dataIndex: 'nickname',
                },
                {
                  title: '个人简介',
                  key: 'remark',
                  dataIndex: 'remark',
                  ellipsis: true,
                  copyable: true,
                },
                {
                  title: '邮箱',
                  key: 'email',
                  dataIndex: 'email',
                },
                {
                  title: '手机号',
                  key: 'mobile',
                  dataIndex: 'mobile',
                },
                {
                  title: '操作',
                  valueType: 'option',
                  render: () => [
                    <ModalForm<API.UserDataItem>
                      trigger={<Button type="primary">修改</Button>}
                      initialValues={currentUser?.userInfo}
                      //onFinish={}
                    >
                      <ProFormText
                        name="username"
                        label="用户名"
                        width="md"
                        rules={[
                          {
                            required: true,
                            message: '用户名为必填项',
                          },
                        ]}
                      />
                      <ProFormText
                        rules={[
                          {
                            required: true,
                            message: '用户昵称为必填项',
                          },
                        ]}
                        width="md"
                        name="nickname"
                        label="用户昵称"
                      />
                      <ProFormText
                        width="md"
                        name="remark"
                        label="个人简介（选填)"
                      />
                      <ProFormText
                        rules={[
                          {
                            required: true,
                            message: '邮箱为必填项',
                            type: 'email'                          }
                        ]}
                        width="md"
                        name="email"
                        label="邮箱"
                      />
                    </ModalForm>
                  ],
                },
              ]}
            />

          </div>

          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
