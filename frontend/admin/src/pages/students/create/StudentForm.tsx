/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React, { SyntheticEvent, useEffect, } from 'react';
import {
  Form,
  SelectPicker,
  Input,
  Message,
  Divider,
  Schema,
  ButtonToolbar,
  Button,
  toaster
} from 'rsuite';
import PageContent from '@/components/PageContent';
import axiosInstance from '../../../interceptors/axios';
import { useNavigate, useParams } from "react-router-dom";


const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  /* Schema for validation */
  const model = Schema.Model({
    first_name: Schema.Types.StringType().isRequired('This field is required.'),
    last_name: Schema.Types.StringType().isRequired('This field is required.'),
    mobile: Schema.Types.StringType().isRequired('This field is required.'),
    email: Schema.Types.StringType().isRequired('This field is required.'),
    address_line1: Schema.Types.StringType().isRequired('This field is required.'),
    address_line2: Schema.Types.StringType().isRequired('This field is required.'),
    city: Schema.Types.StringType().isRequired('This field is required.'),
    state: Schema.Types.StringType().isRequired('This field is required.'),
    status: Schema.Types.StringType().isRequired('This field is required.'),
  });

  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({} as any);
  const [action, setAction] = React.useState('add');

  const handleSubmit = (e) => {
    if (action === 'add') {
      create(e);
    }
    update(e);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const create = (event: SyntheticEvent) => {
    const payload = formValue;
    payload.address = {
      address_line1: formValue.addres_line1,
      address_line2: formValue.addres_line2,
      city: formValue.city,
      pincode:formValue.pincode,
      state: formValue.state
    };
    axiosInstance.post('/students', { payload })
      .then(response => {
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
        navigate("/students", { replace: true });
      })
      .catch(error => {
        const error_msg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{error_msg}</Message>);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const update = (event: SyntheticEvent) => {
    const payload = formValue;
    payload._id = id;
    payload.address = {
      address_line1: formValue.addres_line1,
      address_line2: formValue.addres_line2,
      city: formValue.city,
      pincode:formValue.pincode,
      state: formValue.state
    };
    axiosInstance.patch('/students', { payload })
      .then(response => {
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
        navigate("/students", { replace: true });
      })
      .catch(error => {
        const error_msg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{error_msg}</Message>);
      });
  };

  const getData = () => {
    axiosInstance.get('/students', { params: { _id: id } })
      .then(response => {
        const data = response?.data;
        console.log("response", data);
        setFormValue({
          first_name: data.data?.docs[0]?.first_name ?? '',
          last_name: data.data?.docs[0]?.last_name ?? '',
          mobile: data.data?.docs[0]?.mobile ?? '',
          email: data.data?.docs[0]?.email ?? '',
          address_line1: data.data?.docs[0]?.address?.address_line1 ?? '',
          address_line2: data.data?.docs[0]?.address?.address_line2 ?? '',
          city: data.data?.docs[0]?.address?.city ?? '',
          state: data.data?.docs[0]?.address?.state ?? '',
          pincode: data.data?.docs[0]?.address?.pincode ?? '',
          status: data.data?.docs[0]?.status ?? '',
          highest_qualification: data.data?.docs[0]?.highest_qualification ?? '',
        });
        toaster.push(<Message showIcon type="success">{response.data.message}</Message>,{ placement:'topEnd', duration: 5000 });
      })
      .catch(error => {
        const error_msg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message showIcon type="error">{error_msg}</Message>,{ placement:'topEnd', duration: 5000 });
      });
  };


  useEffect(() => {
    if (id) {
      console.log("i am edit!!!!");
      setAction('edit');
      getData();
    }else{
      setAction('add');
    }
  }, [id]);

  return (
    <PageContent>
      <Message>
        Student Edit Page.
      </Message>
      <Divider />
      <Form className="basic-form" layout="horizontal" model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSubmit}
        onCheck={setFormError}>
        <Form.Group controlId="first_name">
          <Form.ControlLabel>First Name</Form.ControlLabel>
          <Form.Control name="first_name" />
        </Form.Group>

        <Form.Group controlId="last_name">
          <Form.ControlLabel>Last Name</Form.ControlLabel>
          <Form.Control name="last_name" />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" />
        </Form.Group>

        <Form.Group controlId="mobile">
          <Form.ControlLabel>Mobile</Form.ControlLabel>
          <Form.Control name="mobile" />
        </Form.Group>

        <Form.Group controlId="address_line1">
          <Form.ControlLabel>address_line1</Form.ControlLabel>
          <Form.Control name="address_line1" />
        </Form.Group>

        <Form.Group controlId="address_line2">
          <Form.ControlLabel>address_line2</Form.ControlLabel>
          <Form.Control name="address_line2" />
        </Form.Group>

        <Form.Group controlId="city">
          <Form.ControlLabel>city</Form.ControlLabel>
          <Form.Control name="city" />
        </Form.Group>

        <Form.Group controlId="state">
          <Form.ControlLabel>state</Form.ControlLabel>
          <Form.Control name="state" />
        </Form.Group>

        <Form.Group controlId="pincode">
          <Form.ControlLabel>pincode</Form.ControlLabel>
          <Form.Control name="pincode" />
        </Form.Group>

        <Form.Group controlId="Highest_qualification">
          <Form.ControlLabel>Highest Qualification</Form.ControlLabel>
          <Form.Control name="highest_qualification" accepter={SelectPicker} data={[
            {
              label: 'Bachelors',
              value: "Bachelors"
            }, {
              label: 'Graducation',
              value: "Graducation"
            },
            {
              label: 'Masters',
              value: "Masters"
            },
            {
              label: 'PG/Diploma',
              value: "PG/Diploma"
            }, {
              label: 'High School',
              value: "High School"
            }


          ]} />
        </Form.Group>
        <Form.Group controlId="selectPicker">
          <Form.ControlLabel>Status</Form.ControlLabel>
          <Form.Control name="status" accepter={SelectPicker} data={[
            {
              label: 'Active',
              value: "Active"
            }, {
              label: 'In-Active',
              value: "In-Active"
            }
          ]} />
        </Form.Group>


        <Form.Group>
          <ButtonToolbar>
            <Button appearance="primary" type='submit'>Submit</Button>
            <Button appearance="default">Cancel</Button>
          </ButtonToolbar>
        </Form.Group>

      </Form>

    </PageContent>
  );
};

export default StudentForm;
