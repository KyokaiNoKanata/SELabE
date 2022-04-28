import {Request,Response} from "express";

const getList = async (req:Request,res:Response)=>{
  const result = {
    success:true,
    data:
      [{
        key:1,
        name:'test01',
        id:1
      },
    {
      key:2,
      name:'test02',
      id:2
    },
    {
    key:3,
      name:'test03',
    id:3
    }]
  };
  return res.json(result);

}
export default {
  'GET /api/testa':getList,
  'POST /api/testb': async (req:Request,res:Response)=>{
    res.end('OK');
  }
}
