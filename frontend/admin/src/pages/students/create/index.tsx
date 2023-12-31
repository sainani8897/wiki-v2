/* eslint-disable no-use-before-define */
import React from 'react';
import StudentForm from './StudentForm';

import { Breadcrumb, Panel } from 'rsuite';

const Page = () => {
  console.log("I am here!!!!");
  
  return (
    <Panel
      header={
        <>
          <h3 className="title">Student</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Students</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Student</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <StudentForm />
    </Panel>
  );
};

export default Page;
