import AuditComponent from "@/pages/docs/Report/Audit/components/AuditComponent";

/**
 * 用户审核测试报告
 */
export default () => {
  return (
    <AuditComponent person={'client'} audit={true}/>
  );
};
