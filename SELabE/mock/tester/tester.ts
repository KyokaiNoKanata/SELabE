import { Request, Response } from 'express';
import moment from 'moment';
import { parse } from 'url';
import {keys} from "lodash";
const genList = (current: number, pageSize: number) => {
  const delegationDataSource: API.DelegationItem[] = [];
  const valueEnum = {
    0: 'notReceived',
    1: 'received',
    2: 'schemeEvaluating',
    3: 'schemeRefused',
    4: 'schemePass',
    5: 'testing',
    6: 'reportEvaluating',
    7: 'reportRefused',
    8: 'finish',
    9: 'notDistributed',
  };
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    delegationDataSource.push({
      key: index,
      id: index,
      contractId: index,
      //href: 'https://ant.design',
      /*avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2]*/
      name: `委托 ${index}`,
      state: valueEnum[Math.floor(Math.random() * 10) % 10],
      launchTime: moment().format('YYYY-MM-DD HH:mm:ss'), //发起时间
      //processTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      //acceptTime:moment().format('YYYY-MM-DD HH:mm:ss'),
      creatorId:index,
      marketRemark: '呵呵' + index,
      offerRemark: '哈哈' + index,
      testingRemark: '哇哇' + index,
    });
  }
  //delegationDataSource.reverse();
  return delegationDataSource;
};

let delegationDataSource = genList(1, 100);
/** 获取列表信息(分页) ok */
function getDelegation(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { pageNo = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.DelegationItem & {
    sorter: any;
    filter: any;
  };
  let dataSource = [...delegationDataSource].slice(
    ((pageNo as number) - 1) * (pageSize as number),
    (pageNo as number) * (pageSize as number),
  );
  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }
  console.log(params.filter);
  console.log(params.sorter);
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).some((key) => {
          if (!filter[key]) {
            return true;
          }
          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }
          return false;
        });
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data?.name?.includes(params.name || ''));
  }
  const result = {
    code: 200,
    data: {
      list:dataSource,
      total: delegationDataSource.length
    },
    msg: 'ok',
  }
  return res.json(result);
}

/** 根据 id 删除 ok */
function deleteDelegationById(req: Request, res: Response,u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url;
  }
  const params = parse(url, true).query;
  const id = params.id;
  (() => {
    let deletedItem = undefined;
    delegationDataSource.map((item) => {
      if(item.id == id) {
        deletedItem = item;
      }
    })
    delegationDataSource = delegationDataSource.filter((item)=>{
      return !(item.id == id);
    })
    let resp = {
      code:200,
      data:true,
      msg:'ok',
    }
    if(deletedItem === undefined) {
      resp = {
        code:500,
        data:false,
        msg:'error'
      }
    }
    return res.json(resp);
  })();
}
/** 根据id更新 name和 url ok */
function updateDelegation(req: Request, res: Response,u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url;
  }
  const data = req.body;
  const result = {
    code:500,
    data:false,
    msg:"error",
  }
  delegationDataSource.forEach((item) => {
    if(item.id == data.id) {
      item.name = data.name;
      item.url = data.url;
      result.code = 0;
      result.data = true;
      result.msg = 'ok';
    }
  })
  return res.json(result)
}
/** 新建 */
function createDelegation(req: Request, res: Response,u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url;
  }
  const data = req.body;
  let maxId = 0;
  delegationDataSource.forEach((item) => {
    if(item.id > maxId) {
      maxId = item.id;
    }
  })
  let newItem = {
    id: maxId + 1,
    name:data.name,
  }
  delegationDataSource.push(newItem);
  const result = {
    code: 0,
    data: maxId,
    msg: 'ok',
  }
  return res.json(result);
}
export default {
  'GET /api/admin-api/system/delegation/page': getDelegation,//ok
  'DELETE /api/admin-api/system/delegation/delete': deleteDelegationById,//ok
  'PUT /api/admin-api/system/delegation/update' :updateDelegation,//ok
  'POST /api/admin-api/system/delegation/create' : createDelegation,//unTested
};
