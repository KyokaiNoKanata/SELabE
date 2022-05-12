import {Request,Response} from "express";

const getList = async (req:Request,res:Response)=>{
  const result = {
    success:true,
    data:{}
  };
  return res.json(result);

}
export default {
  'GET /api/testa':getList,
  'POST /api/testb': async (req:Request,res:Response)=>{
    res.end('OK');
  }
}
