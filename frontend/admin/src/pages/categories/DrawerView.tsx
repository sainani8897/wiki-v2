import React,{useEffect,SyntheticEvent} from 'react';
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
} from 'rsuite';
import { slugify } from '@/utils';
import axiosInstance from '../../interceptors/axios';

const DrawerView = (props: DrawerProps) => {
  const { onClose, customData,action,reload, ...rest } = props;
  const categories = customData?.categories;
  const category = customData?.categoryData;

  /* Schema for validation */
  const model = Schema.Model({
    category_name: Schema.Types.StringType().isRequired('This field is required.'),
    slug: Schema.Types.StringType().isRequired('This field is required.'),
    sort_order: Schema.Types.StringType().isRequired('This field is required.'),
  });

  const selectData = categories?.data?.docs?.map(item => ({
    label: item.category_name,
    value: item._id
  }));

  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({} as any);

  const handleCategoryChange = () => {
    console.log(formValue)
    formValue.slug = slugify(formValue.category_name)
    setFormValue(formValue);
  }

  const handleSubmit = (e) => {
    if(action === 'edit'){
      update(e)
    }
    create(e);
  };

  const create = (event:SyntheticEvent) => {
    axiosInstance.post('/categories', { payload: formValue })
      .then(response => {
        onClose?.(event);
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
        reload()
      })
      .catch(error => {
        const error_msg  = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{error_msg}</Message>);
      });
  };


  const update = (event:SyntheticEvent) => {
    axiosInstance.patch('/categories', { payload: formValue })
      .then(response => {
        onClose?.(event);
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
        reload()
      })
      .catch(error => {
        const error_msg  = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{error_msg}</Message>);
      });
  };

  useEffect(() => {
    console.log("customData:",customData)
    setFormValue({
      category_name:category.category_name ?? '',
      slug:category.slug ?? '',
      status:category.status ?? '',
      sort:category.sort ?? '',
      parent_id:category?.parent_id?._id ?? '',
      _id:category?._id ?? ''
    })
  }, [customData]);


  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={onClose} {...rest}>
      <Form fluid model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSubmit}
        onCheck={setFormError}>

        <Drawer.Header>
          <Drawer.Title>{action === 'create' ? "Add" : 'Edit' } a Category</Drawer.Title>
          <Drawer.Actions>
            <Button appearance="primary" type="submit">
              Confirm
            </Button>
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
          </Drawer.Actions>
        </Drawer.Header>

        <Drawer.Body>
          <Form.Group controlId="category_name-3">
            <Form.ControlLabel>Category</Form.ControlLabel>
            <Form.Control name="category_name" onBlur={handleCategoryChange} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Slug</Form.ControlLabel>
            <Form.Control name="slug" readOnly />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Sort Order</Form.ControlLabel>
            <Form.Control name="sort" accepter={InputNumber} style={{ width: '100%' }} />
          </Form.Group>
          <Form.Group controlId="selectPicker">
            <Form.ControlLabel>Parent Category</Form.ControlLabel>
            <Form.Control name="parent_id" accepter={SelectPicker} style={{ width: '100%' }} data={selectData} />
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
        </Drawer.Body>
      </Form>
    </Drawer>
  );
};

export default DrawerView;
