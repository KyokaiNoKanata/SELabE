import AuditComponent from "@/pages/docs/Report/Audit/components/AuditComponent";

/**
 * 测试部主管审核测试报告
 */
export default () => {
  return (
    <AuditComponent person={'manager'} audit={true}/>
  );
};

