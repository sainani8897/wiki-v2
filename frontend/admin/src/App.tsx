import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Students from './pages/students';
import StudentsCreate from './pages/students/create';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const AuthenticatedRoutes = ({ children }) => {
  // You can include a layout or additional components here if needed
  return <div>{children}</div>;
};

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
            <Route path="users" element={<Users />} />
            {/* <Route path="students" element={<Students />} /> */}
            <Route path="/students">
              <Route index element={<Students />} />
              <Route path="create" element={<StudentsCreate />} />
              <Route path="edit/:id" element={<StudentsCreate />} />
              {/* <Route path="me" element={...} /> */}
            </Route>
            <Route path="create-student" element={<StudentsCreate />} />
            <Route path="update-student/:id" element={<StudentsCreate />} />
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
