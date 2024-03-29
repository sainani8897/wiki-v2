import React from 'react';
import {BrowserRouter as Router,   Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { CustomProvider } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import locales from './locales';
import Frame from './components/Frame';
import DashboardPage from './pages/dashboard';
import Error404Page from './pages/authentication/404';
import Error403Page from './pages/authentication/403';
import Error500Page from './pages/authentication/500';
import Error503Page from './pages/authentication/503';

import SignInPage from './pages/authentication/sign-in';
import SignUpPage from './pages/authentication/sign-up';
import MembersPage from './pages/tables/members';
import VirtualizedTablePage from './pages/tables/virtualized';
import Categories from './pages/categories';
import Roles from './pages/roles';
import Permissions from './pages/permissions';
import FormBasicPage from './pages/forms/basic';
import FormWizardPage from './pages/forms/wizard';
import CalendarPage from './pages/calendar';
import { appNavs } from './config';
import Users from './pages/users';
import Instructors from './pages/instructors';
import Students from './pages/students';
import StudentsCreate from './pages/students/create';
import CourseCreate from './pages/course/create';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import UserForm from './pages/users/create';
import InstructorForm from './pages/instructors/create';
import Course from './pages/Course';

const AuthenticatedRoutes = ({ children }) => {
  // You can include a layout or additional components here if needed
  return <div>{children}</div>;
};

interface RoutesProps {
  children?: React.ReactNode;
  location?: Partial<Location> | string;
}

const App = () => {
  // dotenv.config();
  return (
    <IntlProvider locale="en" messages={locales.en}>
      <CustomProvider locale={enGB}>
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="error-404" element={<Error404Page />} />
          <Route path="error-403" element={<Error403Page />} />
          <Route path="error-500" element={<Error500Page />} />
          <Route path="error-503" element={<Error503Page />} />
          {/* Auth Files */}
          <Route path="/" element={<Frame navs={appNavs} />}>
            {/* <PrivateRoute component={AuthenticatedRoutes}>
            </PrivateRoute> */}
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="table-members" element={<MembersPage />} />
            <Route path="table-virtualized" element={<VirtualizedTablePage />} />
            <Route path="categories" element={<Categories />} />
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
            {/* <Route path="users" element={<Users />} /> */}
            {/* <Route path="students" element={<Students />} /> */}
            <Route path="/students">
              <Route index element={<Students />} />
              <Route path="create" element={<StudentsCreate />} />
              <Route path="edit/:id" element={<StudentsCreate />} />
              {/* <Route path="me" element={...} /> */}
            </Route>
            <Route path="/users">
              <Route index element={<Users />} />
              <Route path="create" element={<UserForm />} />
              <Route path="edit/:id" element={<UserForm />} />
              {/* <Route path="me" element={...} /> */}
            </Route>
            <Route path="/instructors">
              <Route index element={<Instructors />} />
              <Route path="create" element={<InstructorForm />} />
              <Route path="edit/:id" element={<InstructorForm />} />
              {/* <Route path="me" element={...} /> */}
            </Route>
            <Route path="/courses">
              <Route index element={<Course />} />
              <Route path="create" element={<CourseCreate />} />
              <Route path="edit/:id" element={<CourseCreate />} />
              {/* <Route path="me" element={...} /> */}
            </Route>
            <Route path="create-course" element={<CourseCreate />} />
            {/* <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} /> */}
            <Route path="form-basic" element={<FormBasicPage />} />
            <Route path="form-wizard" element={<FormWizardPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </CustomProvider>
    </IntlProvider>
  );
};

export default App;
