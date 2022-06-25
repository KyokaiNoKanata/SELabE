import React, {useRef, useState} from 'react';
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
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import {uploadAvatar} from "@/services/ant-design-pro/system/api";
import type { UploadChangeParam } from 'antd/es/upload';


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
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('文件格式不支持！');
  }
  const isLt4M = file.size / 1024 / 1024 < 4;
  if (!isLt4M) {
    message.error('图片大小不能超过4MB');
  }
  return isJpgOrPng && isLt4M;
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};


const handleUpload = async function (img: RcFile | undefined) {
  return await uploadAvatar(img as RcFile).then(res => {
    message.success("上传成功");
    return res.data.msg;
  })
}

const BaseView: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const [, setLoading] = useState(false);
  const [, setImageUrl] = useState<string>();
  const currentUser = initialState?.currentUser;
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser?.userInfo?.avatar) {
        return currentUser?.userInfo?.avatar;
      }
    }
    return '';
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
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
            <>
              <div className={styles.avatar_title}>头像</div>
              <div className={styles.avatar}>
                <img src={getAvatarURL()} alt="avatar" />
              </div>
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                action={async (img: RcFile)=>{
                  await handleUpload(img);
                  actionRef.current?.reload();
                  return "";
                }}
              >
                <div className={styles.button_view}>
                  <Button>
                    <UploadOutlined />
                    更换头像
                  </Button>
                </div>
              </Upload>
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
