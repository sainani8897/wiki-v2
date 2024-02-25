// eslint-disable-next-line no-use-before-define
import React, { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { Modal, ButtonToolbar, Button, Placeholder } from 'rsuite';


const Media = (props:any) => {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const { onClose, customData,action,reload, ...rest } = props;
  
  const handleOpen = value => {
    setSize(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal size={size} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder.Paragraph rows={size === 'full' ? 100 : 10} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


export default Media;