import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import DataTable from './DataTable';

const Page = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Roles</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            {/* <Breadcrumb.Item>Tables</Breadcrumb.Item> */}
            <Breadcrumb.Item active>Roles</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <DataTable />
    </Panel>
  );
};

export default Page;
