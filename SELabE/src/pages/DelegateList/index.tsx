import React, {useEffect, useState} from 'react';
import {Table, Row, Col, Card, Button, Pagination, Space, Tooltip} from 'antd';
import { PageContainer} from '@ant-design/pro-layout';
import styles from './index.less';
import {SearchOutlined} from "@ant-design/icons";
import {useRequest,history} from 'umi';
import Modal from './component/Modal'


const index = () => {
  const init = useRequest('api/testa');
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
          <Button onClick={()=>{
            history.push('/apply-page');
          }}>编辑</Button>
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

  useEffect(() => {
    init.run();
  },[modalVisible]);

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
      <Modal
        modalVisible = {modalVisible}
        hideModal={()=>{
          setModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default index;
