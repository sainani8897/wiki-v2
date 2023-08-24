import React from 'react';
import {
  Drawer,
  DrawerProps,
  Button,
  Form,
  Stack,
  InputNumber,
  InputGroup,
  Slider,
  Rate,
  SelectPicker
} from 'rsuite';

const DrawerView = (props: DrawerProps) => {
  const { onClose, ...rest } = props;
  const selectData = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice'].map(item => ({
    label: item,
    value: item
  }));
  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={onClose} {...rest}>
      <Drawer.Header>
        <Drawer.Title>Add a Category</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={onClose} appearance="primary">
            Confirm
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancel
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Category</Form.ControlLabel>
            <Form.Control name="category"/>
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Slug</Form.ControlLabel>
            <Form.Control name="city" readOnly />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Sort Order</Form.ControlLabel>
            <Form.Control name="sort_order" accepter={InputNumber} style={{ width: '100%' }}  />
          </Form.Group>
          <Form.Group controlId="selectPicker">
          <Form.ControlLabel>Parent Category</Form.ControlLabel>
          <Form.Control name="parent" accepter={SelectPicker} style={{ width: '100%' }} data={selectData} />
        </Form.Group>
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default DrawerView;
