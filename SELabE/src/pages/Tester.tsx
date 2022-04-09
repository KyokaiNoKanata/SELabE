import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

const Tester: React.FC = () => {
  const intl = useIntl();
  return (
    <PageHeaderWrapper
      content={intl.formatMessage({
        id: 'todo',
        defaultMessage: 'This page can only be viewed by tester',
      })}
    >
    </PageHeaderWrapper>
  );
};

export default Tester;
