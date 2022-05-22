import {Request,Response} from "express";

const getList = async (req:Request,res:Response)=>{
  const result = {
    success:true,
    data:
      {
        '软件用户对象描述':'adadadadad',
        '主要功能及用途简介（限200字）':'hhhhhhhhh'
      }
  };
  return res.json(result);

}
export default {
  'GET /api/testb':getList,
  'POST /api/testbp': async (req:Request,res:Response) => {
    res.end('OK');
  },
}
