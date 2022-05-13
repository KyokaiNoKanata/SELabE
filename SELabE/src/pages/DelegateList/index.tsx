import React, {useState} from 'react';
import {Table, Row, Col, Card, Button, Pagination, Space, Tooltip} from 'antd';
import { PageContainer} from '@ant-design/pro-layout';
import styles from './index.less';
import {SearchOutlined} from "@ant-design/icons";
import {useRequest,history} from 'umi';
import FunctionList from "@/pages/DelegateList/components/FunctionList";
import { Link } from 'umi';

const index = () => {
  const init = useRequest('api/testa');
  const [modalVisible,setModalVisible] = useState(false);
  console.log(init);

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title:'Action',
      key:'action',
      render:()=>(
        <Space>
          <Link to="new-delegation/100">
            跳转
          </Link>
        </Space>
      ),
    },
  ];
  const searchLayout = () => {};
  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs = {24} sm = {12}></Col>
        <Col xs = {24} sm = {12} className = {styles.tableToolBar}>
          <Space>
            <Tooltip title="search">
              <Button shape="circle" icon={<SearchOutlined />} />
            </Tooltip>
            <Button type = "primary" onClick={()=>{
              setModalVisible(true)
            }}>Add</Button>
          </Space>

        </Col>
      </Row>
    )
  };
  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs = {24} sm = {12}></Col>
        <Col xs = {24} sm = {12} className = {styles.tableToolBar}>
          <Pagination/>
        </Col>
      </Row>
    )
  };
  const columnBuilder = () => {
    return columns;
  }

  return (
    <PageContainer>
      {searchLayout()}
      <Card>
        {beforeTableLayout()}
        <Table
          dataSource={init?.data} pagination={false}
          columns={columnBuilder()}
        />
        {afterTableLayout()}
      </Card>
    </PageContainer>
  );
};

export default index;
