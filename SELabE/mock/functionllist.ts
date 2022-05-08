import {Request,Response} from "express";

const getList = async (req:Request,res:Response)=>{
  const result = {
    success:true,
    data:
    {name: "ddad", version: "daa"}
  };
  return res.json(result);

}
export default {
  'GET /api/testc':getList,
  'POST /api/tescp': async (req:Request,res:Response) => {
    res.end('OK');
  },
}
