import ProForm, {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import {Button, Col, Form, message, PageHeader, Row} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import TextArea from "antd/es/input/TextArea";
import {useLocation} from "umi";
import {getDelegationByIds, getTable2, saveTable2 } from '@/services/ant-design-pro/delegation/api';
import React from "react";

const Date: any = ProFormDatePicker;
const StepApplyPage: React.FC<{ editable: boolean,isClient: boolean }> = (prop) => {
  const params = useLocation();
  const delegationId = (params as any).query.id;//ok
  const request = async () => {
    const table2Id = (await getDelegationByIds({
      ids: String(delegationId),
    })).data[0].table2Id;
    console.log('table2Id='+ table2Id);
    if(table2Id == undefined) {
      return {};
    }
    const resp = await getTable2({
      id: String(table2Id),
    });
    //json string -> obj
    //const obj = JSON.parse(resp.data);
    //console.log(obj)
    return resp.data;
  }
  const onSubmit = async (value: any) => {
    //console.log(value)
    saveTable2({
      delegationId: delegationId,
      data: value,
    }).then(res => {
      if(res.code == 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    });
  }
  return (
    <PageContainer content="用户向本中心发起测试委托">
      <PageHeader
        className="site-page-header"
        title="软件项目委托测试申请书"
      />
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          submitter={{
            render: (props) => {
              if (props.step === 0) {
                return (
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    下一步 {'>'}
                  </Button>
                );
              }

              if (props.step === 1) {
                return [
                  <Button key="pre" onClick={() => props.onPre?.()}>
                    {'<'} 上一步
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    下一步 {'>'}
                  </Button>,
                ];
              }

              return [
                <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                  {'<'} 上一步
                </Button>,
                prop.editable &&
                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                  保存
                </Button>,
              ];
            },
          }}
          stepsProps={{
            direction: 'vertical',
          }}
          //formRef={formRef}
          onFinish={onSubmit}

        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="step1"
            title="第一页"
            stepProps={{
              description: '软件项目基本信息',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第一页结束')
              //await waitTime(1000);
              return true;
            }}
            request={request}
          >
            <Row>
              <Col span={12}>
                <ProFormCheckbox.Group
                  name="测试类型"
                  label="测试类型"
                  options={['软件确认测试', '成果/技术鉴定测试', '专项资金验收测试']}
                  layout="vertical"
                  disabled={prop.isClient}
                  rules={[{required: false}]}
                >

                </ProFormCheckbox.Group>
              </Col>
              <Col span={12}>
                <ProCard>
                  <ProFormText initialValue="" width="md" name="软件名称_其它" label="其它" disabled={prop.isClient}/>
                </ProCard>
              </Col>
            </Row>

            <ProFormText width="md" name="软件名称" label="软件名称" rules={[{required: true}]} disabled={prop.isClient}/>
            <ProFormText width="md" name="版本号" label="版本号" rules={[{required: true}]} disabled={prop.isClient}/>
            <ProFormText width="md" name="委托单位Ch" label="委托单位（中文）" rules={[{required: true}]} disabled={prop.isClient}/>
            <ProFormText width="md" name="委托单位En" label="委托单位（英文）" rules={[{required: true}]} disabled={prop.isClient}/>
            <ProFormText width="md" name="开发单位" label="开发单位" rules={[{required: true}]} disabled={prop.isClient}/>
            <ProFormSelect
              name="单位性质"
              label="单位性质"
              width='md'
              valueEnum={{
                内资企业: '内资企业',
                外合资企业: '外(合)资企业',
                科研院校: '科研院校',
                政府事业团体: '政府事业团体',
                港澳台合资企业: '港澳台(合)资企业',
                其它: '其它'
              }}
              disabled={prop.isClient}
              rules={[{required: false}]}
            />
            <Form.Item name="软件用户对象描述" label="软件用户对象描述" rules={[{required: true}]} >
              <TextArea style={{height: 60}} disabled={prop.isClient}/>
            </Form.Item>
            <Form.Item name="主要功能及用途简介（限200字）" label="主要功能及用途简介（限200字）" rules={[{required: true}]}>
              <TextArea showCount maxLength={200} style={{height: 60}} disabled={prop.isClient}/>
            </Form.Item>

          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="step2"
            title="第二页"
            stepProps={{
              description: '软件项目详情',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第二页结束')
              return true;
            }}
            request={request}
          >
            <Row>
              <Col span={12}>
                <ProCard
                  bordered
                  layout="default"
                >
                  <ProFormCheckbox.Group
                    name="测试依据"
                    label="测试依据"
                    layout="horizontal"
                    options={['GB/T 25000.51-2010', 'GB/T 16260.1-2006', 'NST-03-WI12-2011', 'NST-03-WI13-2011']}
                    rules={[{required: false}]}
                    disabled={prop.isClient}
                  />
                  <ProFormText initialValue="" width="sm" name="测试依据_其它" addonBefore="其它" disabled={prop.isClient}/>
                </ProCard>
              </Col>
              <Col span={12}>
                <ProCard bordered>
                  <ProFormCheckbox.Group
                    name="需要测试的技术指标"
                    label="需要测试的技术指标"
                    layout="horizontal"
                    options={['功能性', '可靠性', '易用性', '效率', '可维护性', '可移植性',
                      '代码覆盖度', '缺陷检测率', '代码风格符合度', '代码不符合项检测率',
                      '产品说明要求', '用户文档集要求']}
                    rules={[{required: false}]}
                    disabled={prop.isClient}
                  />
                  <ProFormText initialValue="" width="md" name="需要测试的技术指标_其它" addonBefore="其它" disabled={prop.isClient}/>
                </ProCard>
              </Col>
            </Row>
            <Row>
              <ProCard title='软件规模（至少一种）' bordered layout={"default"}>
                <ProForm.Group>
                  <ProFormText width="md" name="功能数" label="功能数（到最后一级菜单）" rules={[{required: true}]} disabled={prop.isClient}/>
                  <ProFormText width="md" name="功能点数" label="功能点数" rules={[{required: true}]} disabled={prop.isClient}/>
                  <ProFormText width="md" name="代码行数" label="代码行数（不包括注释行、空行）" rules={[{required: true}]} disabled={prop.isClient}/>
                </ProForm.Group>
              </ProCard>
            </Row>
            <Row>
              <ProCard title='软件类型' bordered>
                <ProForm.Group>
                  <ProFormSelect
                    name="系统软件"
                    label="系统软件"
                    width='md'
                    valueEnum={{
                      操作系统: '操作系统',
                      中文处理系统: '中文处理系统',
                      网络系统: '网络系统',
                      嵌入式操作系统: '嵌入式操作系统',
                      其他: '其他'
                    }}
                    disabled={prop.isClient}
                    placeholder="Please select"
                    rules={[{required: true}]}
                  />
                  <ProFormSelect
                    name="支持软件"
                    label="支持软件"
                    width='md'
                    valueEnum={{
                      程序设计语言: '程序设计语言',
                      数据库系统设计: '数据库系统设计',
                      工具软件: '工具软件',
                      网络通信软件: '网络通信软件',
                      中间件: '中间件',
                      其他: '其他'
                    }}
                    disabled={prop.isClient}
                    placeholder="Please select"
                    rules={[{required: true}]}
                  />
                  <ProFormSelect
                    name="应用软件"
                    label="应用软件"
                    width='md'
                    valueEnum={{
                      行业管理软件: '行业管理软件',
                      办公软件: '办公软件',
                      模式识别软件: '模式识别软件',
                      图形图像软件: '图形图像软件',
                      控制软件: '控制软件',
                      网络应用软件: '网络应用软件',
                      信息管理软件: '信息管理软件',
                      数据库管理应用软件: '数据库管理应用软件',
                      安全与保密软件: '安全与保密软件',
                      嵌入式应用软件: '嵌入式应用软件',
                      教育软件: '教育软件',
                      游戏软件: '游戏软件 ',
                      其他: '其他'
                    }}
                    disabled={prop.isClient}
                    placeholder="Please select"
                    rules={[{required: true}]}
                  />
                </ProForm.Group>
              </ProCard>
            </Row>
            <Row>
              <ProCard title='运行环境' split={Response ? 'horizontal' : 'vertical'} bordered>
                <Col span={24}>
                  <ProCard title='客户端' type="inner" bordered>
                    <Col>
                      <ProForm.Group>
                        <ProFormCheckbox initialValue={false} name="Windows" disabled={prop.isClient}>Windows</ProFormCheckbox>
                        <ProFormText initialValue="" name="WindowsVersion" addonAfter="(版本)" disabled={prop.isClient}/>
                      </ProForm.Group>
                    </Col>
                    <Col>
                      <ProForm.Group>
                        <ProFormCheckbox initialValue={false} name="Linux" disabled={prop.isClient}>Linux</ProFormCheckbox>
                        <ProFormText initialValue="" name="LinuxVersion" addonAfter="(版本)" disabled={prop.isClient}/>
                      </ProForm.Group>
                    </Col>
                    <Col>
                      <ProForm.Group>
                        <ProFormCheckbox initialValue={false} name="操作系统_其它" disabled={prop.isClient}>其它</ProFormCheckbox>
                        <ProFormText initialValue="" name="操作系统_其它版本" addonAfter="(版本)" disabled={prop.isClient}/>
                      </ProForm.Group>
                    </Col>
                    <ProForm.Group>
                      <ProFormText width="xs" name="客户端内存要求" label="内存要求" addonAfter='MB' rules={[{required: true}]} disabled={prop.isClient}/>
                    </ProForm.Group>
                    <Form.Item initialValue="" name="客户端其他要求" label="其他要求" rules={[{required: false}]}>
                      <TextArea style={{height: 60}} disabled={prop.isClient}/>
                    </Form.Item>
                  </ProCard>
                </Col>
                <Col span={24}>
                  <ProCard title='服务器端' type="inner" bordered>
                    <Row>
                      <Col span={24}>
                        <ProCard title='硬件' type="inner" bordered>
                          <ProFormGroup>
                            <ProFormCheckbox.Group
                              name="架构"
                              label="架构"
                              layout="vertical"
                              options={['PC服务器', 'UNIX／Linux服务器']}
                              rules={[{required: true}]}
                              disabled={prop.isClient}
                            />
                            <ProFormText initialValue="" width="sm" name="架构_其它" addonBefore="其它" disabled={prop.isClient}/>
                            <ProFormText width="xs" name="服务器端内存要求" label="内存要求" addonAfter='MB'
                                         rules={[{required: true}]} disabled={prop.isClient}/>
                            <ProFormText width="xs" name="服务器端硬盘要求" label="硬盘要求" addonAfter='MB'
                                         rules={[{required: true}]} disabled={prop.isClient}/>
                            <Form.Item initialValue="" name="服务器端其他要求" label="其他要求" rules={[{required: false}]}>
                              <TextArea style={{height: 60}} disabled={prop.isClient}/>
                            </Form.Item>
                          </ProFormGroup>
                        </ProCard>
                      </Col>
                      <Col span={24}>
                        <ProCard title='软件' type="inner" bordered>
                          <ProFormGroup>
                            <ProFormText width="md" name="操作系统" label="操作系统" rules={[{required: true}]} disabled={prop.isClient}/>
                            <ProFormText width="md" name="版本" label="版本" rules={[{required: true}]} disabled={prop.isClient}/>
                            <ProFormText width="md" name="编程语言" label="编程语言" rules={[{required: true}]} disabled={prop.isClient}/>
                            <ProFormText width="md" name="数据库" label="数据库" rules={[{required: true}]} disabled={prop.isClient}/>
                            <ProFormText width="md" name="中间件" label="中间件" rules={[{required: true}]} disabled={prop.isClient}/>
                            <ProFormText width="md" name="其他支撑软件" label="其他支撑软件" rules={[{required: true}]} disabled={prop.isClient}/>
                          </ProFormGroup>
                          <ProFormCheckbox.Group
                            name="构架"
                            label="构架"
                            layout="horizontal"
                            options={['C/S', 'B/S', '其它']}
                            rules={[{required: true}]}
                            disabled={prop.isClient}
                          />

                        </ProCard>
                      </Col>
                    </Row>
                  </ProCard>
                </Col>
                <Col span={24}>
                  <ProCard bordered title="网络环境" type="inner">
                    <ProFormText width="xl" name="网络环境" rules={[{required: true}]} disabled={prop.isClient}/>
                  </ProCard>
                </Col>
              </ProCard>
            </Row>

            <ProCard title="样品与数量" bordered split={Response ? 'horizontal' : 'vertical'}>
              <ProCard bordered title='软件介质' type='inner'>
                <ProFormCheckbox.Group
                  name="软件介质"
                  layout="horizontal"
                  options={['光盘', 'U盘']}
                  rules={[{required: false}]}
                  disabled={prop.isClient}
                />
                <ProFormText initialValue="" width="sm" name="软件介质_其它" addonBefore="其它" disabled={prop.isClient}/>
              </ProCard>
              <ProCard title="文档资料" bordered type='inner'>
                <Form.Item name="文档资料" rules={[{required: true}]}>
                  <TextArea style={{height: 60, width: 500}} disabled={prop.isClient}/>
                </Form.Item>
                <div>
                  注：1、需求文档（例如：项目计划任务书、需求分析报告、合同等）（验收、鉴定测试必须）
                  2、用户文档（例如：用户手册、用户指南等）（必须）
                  3、操作文档（例如：操作员手册、安装手册、诊断手册、支持手册等）（验收项目必须）
                </div>
              </ProCard>
              <ProCard title="提交的样品（硬拷贝资料、硬件）五年保存期满" bordered type='inner'>
                <ProFormSelect
                  name="提交的样品"
                  width='md'
                  valueEnum={{
                    由本实验室销毁: '由本实验室销毁',
                    退还给我们: '退还给我们'
                  }}
                  disabled={prop.isClient}
                  placeholder="Please select"
                  rules={[{required: true}]}
                />
              </ProCard>

            </ProCard>
            <ProCard bordered>
              <Date name="希望测试完成时间" label="希望测试完成时间" disabled={prop.isClient}/>
            </ProCard>

          </StepsForm.StepForm>

          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="step3"
            title="第三步"
            stepProps={{
              description: '确认和受理信息',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第三页结束')
              return true;
            }}
            request={request}
          >
            <Row>
              <Col span={24}>
                <ProCard title='委托单位信息' bordered>
                  <ProFormText width="md" name="委托单位_电话" label="电话" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_传真" label="传真" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_地址" label="地址" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_邮编" label="邮编" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_联系人" label="联系人" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_手机" label="手机" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_Email" label="E-mail" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                  <ProFormText width="md" name="委托单位_网址" label="网址" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                </ProCard>
              </Col>
            </Row>

            <ProCard bordered>
              <ProFormSelect
                name="密级"
                label="密级"
                width='md'
                valueEnum={{
                  无密级: '无密级',
                  秘密: '秘密',
                  机密: '机密',
                }}
                placeholder="Please select"
                disabled={prop.isClient}
                rules={[{required: true}]}
              />
              <ProFormSelect
                name="查杀病毒"
                label="查杀病毒"
                width='md'
                valueEnum={{
                  已完成: '已完成',
                  无法完成: '无法完成',
                }}
                disabled={prop.isClient}
                rules={[{required: true}]}
              />
              <ProFormText initialValue="" width="sm" name="所用查杀工具" addonBefore="所用查杀工具" disabled={prop.isClient}/>
            </ProCard>

            <ProCard title='材料检查' bordered>
              <ProForm.Group>
                <ProFormCheckbox.Group
                  name='测试样品'
                  label='测试样品'
                  layout='vertical'
                  options={['源代码', '可执行文件']}
                  rules={[{required: true}]}
                  disabled={prop.isClient}
                />
                <ProFormCheckbox.Group
                  name='需求文档'
                  label='需求文档'
                  layout='vertical'
                  options={['项目计划任务书', '需求分析报告', '合同']}
                  rules={[{required: true}]}
                  disabled={prop.isClient}
                />
                <ProFormCheckbox.Group
                  name='用户文档'
                  label='用户文档'
                  layout='vertical'
                  options={['用户手册', '用户指南']}
                  rules={[{required: true}]}
                  disabled={prop.isClient}
                />
                <ProFormCheckbox.Group
                  name='操作文档'
                  label='操作文档'
                  layout='vertical'
                  options={['操作员手册', '安装手册', '诊断手册', '支持手册']}
                  rules={[{required: true}]}
                  disabled={prop.isClient}
                />
                <ProFormText label='其他' name='材料检查_其他' disabled={prop.isClient}></ProFormText>
              </ProForm.Group>
            </ProCard>
            <ProCard bordered>
              <ProFormText width='md' label='测试项目编号' name='测试项目编号' rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
            </ProCard>
            <ProCard bordered>
              <ProFormTextArea
                name="备注"
                label="备注"
                rules={[{required: true}]}
                disabled={prop.isClient}
              >
              </ProFormTextArea>
            </ProCard>

            <ProCard bordered={true}>

              <ProForm.Group>
                <ProFormText name="委托人（签字）" label="委托人（签字）" rules={[{required: true}]} disabled={prop.isClient}></ProFormText>
                <Date name="委托人_日期" label="日期" disabled={prop.isClient}></Date>
              </ProForm.Group>
            </ProCard>
            <ProCard title='国家重点实验室联系方式' bordered>
              <div>单位地址：南京市栖霞区仙林大道163号</div>
              <div>邮政编码：210023</div>
              <div>电话： 86-25-89683467</div>
              <div>传真： 86-25-89686596</div>
              <div>网址： http://keysoftlab.nju.edu.cn</div>
              <div>E-mail: keysoftlab@nju.edu.cn</div>
            </ProCard>


          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  )
    ;
};

export default StepApplyPage;
