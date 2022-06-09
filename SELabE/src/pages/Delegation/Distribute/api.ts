import {getSimpleUserByRole} from "@/services/ant-design-pro/delegation/api";

export const handleGetUserByRole = async (params: {
  roleCode: string,
}) => {
  const res = await getSimpleUserByRole(params);
  //select 固定的格式
  type Option = {
    label: string,
    value: string,
  }
  const options: Option[] = [];
  res.data.forEach(item => {
    options.push({
      label: item.nickname,
      value: item.id,
    })
  })
  return options
}
