import React from 'react';
import {Input, Form } from 'antd';

const FormBuilder = () => {
  return (
    <Form.Item label = "文件名:" name = "文件名">
      <Input />
    </Form.Item>
  )
}

export default FormBuilder
