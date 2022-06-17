import React, {useRef} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Upload, message} from 'antd';
import {
  ProFormText,
  ModalForm
} from '@ant-design/pro-form';
import ProDescriptions from "@ant-design/pro-descriptions";
import type API from "../../../../services/ant-design-pro/typings"

import styles from './BaseView.less';
import {useModel} from "@@/plugin-model/useModel";
import {updateUserInfo} from "@/services/ant-design-pro/system/api";
import type {ActionType} from "@ant-design/pro-table";

/* if needed*/
// const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
//   const values = value.split('-');
//   if (!values[0]) {
//     callback('Please input your area code!');
//   }
//   if (!values[1]) {
//     callback('Please input your phone number!');
//   }
//   callback();
// };

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
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser?.userInfo?.avatar) {
        return currentUser?.userInfo?.avatar;
      }
    }
    return '';
  };

  const handleFinish = async (values: API.UserDataItem) => {
      const hide = message.loading('正在修改');
      try {
        await updateUserInfo(values);
        hide();
        message.success('修改成功');
        actionRef.current?.reload();
        return true;
      } catch (error) {
        hide();
        message.error('修改失败请重试！');
        return false;
      }

  };

  return (
    <div className={styles.baseView}>
      {(
        <>
          <div className={styles.left}>
            <ProDescriptions<API.UserDataItem>
              actionRef={actionRef}
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
                      key="update"
                      trigger={<Button type="primary">修改</Button>}
                      initialValues={currentUser?.userInfo}
                      onFinish={async (values) =>{
                        await handleFinish(values).then((res)=>{
                          if(res){
                            actionRef.current?.reload();
                          }
                        })
                      }}
                    >
                      <ProFormText
                        name="username"
                        label="用户名"
                        width="md"
                        disabled
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
                        label="昵称"
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
