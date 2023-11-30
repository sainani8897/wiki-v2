import React, { useEffect, SyntheticEvent } from 'react';
import {
  Drawer,
  DrawerProps,
  Button,
  Form,
  InputNumber,
  SelectPicker,
  Schema,
  toaster,
  Message,
  CheckPicker,
  CheckTreePicker 
} from 'rsuite';
import { slugify } from '@/utils';
import axiosInstance from '../../interceptors/axios';

const DrawerView = (props: DrawerProps) => {
  const { onClose, customData, action, reload, ...rest } = props;
  const permissions = customData?.permissions;
  const role = customData?.roleData;

  /* Schema for validation */
  const model = Schema.Model({
    display_text: Schema.Types.StringType().isRequired('This field is required.'),
    name: Schema.Types.StringType().isRequired('This field is required.'),
    permissions:Schema.Types.ArrayType().isRequired('This field is required.'),
  });

  const selectData = permissions?.data?.docs?.map(item => ({
    label: item.display_text,
    value: item._id,
    role: item.group_name
  })) ?? [];

  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({} as any);

  const handleCategoryChange = () => {
    console.log(formValue)
    formValue.name = slugify(formValue?.display_text || '', '_')
    setFormValue(formValue);
  }

  const handleSubmit = (e) => {
    if (action === 'edit') {
      update(e)
    }
    create(e);
  };

  const create = (event: SyntheticEvent) => {
    axiosInstance.post('/roles', { payload: formValue })
      .then(response => {
        onClose?.(event);
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
        reload()
      })
      .catch(error => {
        const error_msg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{error_msg}</Message>);
      });
  };


  const update = (event: SyntheticEvent) => {
    axiosInstance.patch('/roles', { payload: formValue })
      .then(response => {
        onClose?.(event);
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
        reload()
      })
      .catch(error => {
        const error_msg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{error_msg}</Message>);
      });
  };

  useEffect(() => {
    console.log("customData:", customData)
    setFormValue({
      display_text:role.display_text ?? '',
      name:role.name ?? '',
      status:role.status ?? '',
      // sort:category.sort ?? '',
      // parent_id:category?.parent_id?._id ?? '',
      // _id:category?._id ?? ''
    })
  }, [customData]);

  const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({
      label: item,
      value: item,
      role: Math.random() > 0.5 ? 'Owner' : 'Guest'
    })
  );

  function compare(a, b) {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  return (
    <>
      <Drawer backdrop="static" size="sm" placement="right" onClose={onClose} {...rest}>
        <Drawer.Header>
          <Drawer.Title>{action == 'create' ? "Add" : 'Edit'} a Role</Drawer.Title>
          <Drawer.Actions>
            <Button appearance="primary" type="button" onClick={handleSubmit}>
              Confirm
            </Button>
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
          </Drawer.Actions>
        </Drawer.Header>

        <Drawer.Body>
          <Form fluid model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSubmit}
            onCheck={setFormError}>
            <Form.Group controlId="category_name-3">
              <Form.ControlLabel>Role</Form.ControlLabel>
              <Form.Control name="display_text" onBlur={handleCategoryChange} />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Slug</Form.ControlLabel>
              <Form.Control name="name" readOnly />
            </Form.Group>
            <Form.Group controlId="checkPicker">
              <Form.ControlLabel>Permissions</Form.ControlLabel>
              <CheckPicker name='permissions' onSelect={(value)=>{
                const formData = formValue;
                formData.permissions = value
                setFormValue(formData);
                console.log(formValue)
              }} data={selectData} renderValue={(formValue)=>{}}
              groupBy="role" style={{ width: '100%' }} />
            </Form.Group>
            <Form.Group controlId="selectPicker">
              <Form.ControlLabel>Status</Form.ControlLabel>
              <Form.Control name="status" accepter={SelectPicker} style={{ width: '100%' }} data={[
                {
                  label: 'Active',
                  value: "Active"
                }, {
                  label: 'In-Active',
                  value: "In-Active"
                }
              ]} />
            </Form.Group>
           

          </Form>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

export default DrawerView;
