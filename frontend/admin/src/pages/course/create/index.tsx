// eslint-disable-next-line no-use-before-define
import React from 'react';
import CourseForm from './CourseForm';
import Builder from './CourseBuilder';
import { Breadcrumb, Panel } from 'rsuite';

const Page = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Courses</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Courses</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <Builder />
    </Panel>
  );
};

export default Page;
