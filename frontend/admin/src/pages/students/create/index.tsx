/* eslint-disable no-use-before-define */
import React from 'react';
import BasicForm from './StudentForm';

import { Breadcrumb, Panel } from 'rsuite';

const Page = () => {
  console.log("I am here!!!!");
  
  return (
    <Panel
      header={
        <>
          <h3 className="title">Basic Form</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Student</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <BasicForm />
    </Panel>
  );
};

export default Page;
