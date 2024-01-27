import React from 'react';
import { Form, Button, Panel, Stack, Divider,Schema,Message,toaster } from 'rsuite';
import { Link,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { localStorageService } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../Auth/authAction';
import {ThunkDispatch} from "@reduxjs/toolkit";


const SignUp = () => {
  const navigate = useNavigate();
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({} as any);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    // dispatch(registerUser({ 
    //   email:formValue.email,
    //   password:formValue.password
    // }));
    return axios
    .post(process.env.API_URL+'/login', {
      email:formValue.email,
      password:formValue.password
    })
    .then(res => {
      
      localStorageService.set('token',res.data.token);
      localStorageService.set('refresh_token',res.data.refresh_token);
      navigate('/');
      
    }).catch(error => {
      const errorMessage = error?.response?.data?.message ?? "Oops Something went wrong";
      toaster.push(<Message type="error">{errorMessage}</Message>);
    });
    
  };

    /* Schema for validation */
    const model = Schema.Model({
      email: Schema.Types.StringType().isEmail().isRequired('This field is required.'),
      password: Schema.Types.StringType().isRequired('This field is required.')
    });

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh'
      }}
    >
      {/* <Brand style={{ marginBottom: 10 }} /> */}

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Sign In</h3>}>
        <p style={{ marginBottom: 10 }}>
          <span className="text-muted">New Here? </span>{' '}
          <Link to="/sign-up"> Create an Account</Link>
        </p>

        <Form fluid model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSubmit}
            onCheck={setFormError} >
          <Form.Group>
            <Form.ControlLabel>E-mail</Form.ControlLabel>
            <Form.Control name="email" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>
              <span>Password</span>
              <a style={{ float: 'right' }}>Forgot password?</a>
            </Form.ControlLabel>
            <Form.Control name="password" type="password" />
          </Form.Group>
          <Form.Group>
            <Stack spacing={6} divider={<Divider vertical />}>
              <Button appearance="primary" type='submit' >Sign in</Button>
            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default SignUp;
