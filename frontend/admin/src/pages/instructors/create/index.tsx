/* eslint-disable no-use-before-define */
import React from 'react';
import UserForm from './UserForm';

import { Breadcrumb, Panel } from 'rsuite';

const Page = () => {
  
  return (
    <Panel
      header={
        <>
          <h3 className="title">Users</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/users">Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Create User</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <UserForm />
    </Panel>
  );
};

export default Page;
