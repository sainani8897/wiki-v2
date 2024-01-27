import React, { useState, useEffect } from 'react';
import { Modal, Button, toaster,Message } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import axiosInstance from '../../interceptors/axios';


const DeleteModal = (props: any) => {
    const { onClose, deleteId, open, reload } = props;

    const onConfirm = () => {
        return axiosInstance.delete('/students',{
            method: 'delete',
            data:{
                _id: [deleteId]
            }
        })
        .then(response => {
            toaster.push(<Message type="success">{response.data.message}</Message>);
            onClose();
            reload();
        })
        .catch(error => {
            toaster.push(<Message type="error">Oops! Something went wrong</Message>);
            onClose();
        });
    }

    return (
        <>
            <Modal backdrop={true} keyboard={false} open={open} onClose={onClose}>
                <Modal.Header>
                    <Modal.Title> Warning <RemindIcon style={{ color: '#ffb300', fontSize: 20, marginBottom: 2 }} /> </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* <Placeholder.Paragraph /> */}
                    {/* <TrashIcon color='red' className='text-center' style={{ fontSize: '5em'}} /> */}
                    <h5> Are you sure you want to Delete this Record ?</h5>
                    <p className='text-muted'>This action cannot be undone</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} appearance="primary">
                        Yes, Delete
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteModal