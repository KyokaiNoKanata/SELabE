import AuditComponent from "@/pages/docs/Report/Audit/components/AuditComponent";

/**
 * 签字人审核测试报告
 */
export default () => {
  return (
    <AuditComponent person={'signatory'} audit={true}/>
  );
};
