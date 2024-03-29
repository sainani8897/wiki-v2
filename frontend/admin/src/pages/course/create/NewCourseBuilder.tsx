/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-use-before-define
import React, { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { Button, ButtonGroup, ButtonToolbar, CheckPicker, Divider, Dropdown, FlexboxGrid, Form, IconButton, InputGroup, InputNumber, List, Message, Modal, Panel, Placeholder, Schema, SelectPicker, Stack, TagInput, Uploader, toaster } from 'rsuite';
import RadioTile from '@/components/RadioTile';
import { Icon } from '@rsuite/icons';
import { VscNotebookTemplate, VscRepoClone, VscFile, VscLock, VscWorkspaceTrusted, VscBook } from 'react-icons/vsc';
import FormHeader from './FormHeader';
import Textarea from '@/components/Textarea';
import axiosInstance from '../../../interceptors/axios';
import PageNextIcon from '@rsuite/icons/PageNext';
import { useNavigate, useParams } from 'react-router-dom';
import ImageIcon from '@rsuite/icons/legacy/Image';
import FilmIcon from '@rsuite/icons/legacy/Film';
import UserCircleIcon from '@rsuite/icons/legacy/UserCircleO';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import { slugify } from '@/utils';
import Quill from 'quill';
import { CKEditor, CodeBlock } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PlusIcon from '@rsuite/icons/Plus';
import { BsThreeDotsVertical } from "react-icons/bs";

const NewCourseBuilder = () => {
    const [type, setType] = useState('personal');
    const [level, setLevel] = React.useState('Private');
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [lectureformError, setlectureFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({} as any);
    const [lectureformValue, setLectureFormValue] = React.useState({} as any);
    const [selectedRoles, setSelectedRoles] = React.useState([]);
    const [sections, setSectionsData] = React.useState([]);
    const [course, setCourseData] = React.useState({} as any);
    const [selectData, setRolesData] = React.useState([]);
    const [selectInstructorsData, setInstructorsData] = React.useState([]);
    const [sectionAction, setSectionAction] = React.useState('add');
    const [lectureAction, setLectureAction] = React.useState('add');
    const [sectionId, setSectionId] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [openLectureModel, setLectureModel] = React.useState(false);
    const [openSectionDelModel, setSectionDelModel] = React.useState(false);
    const [openLectureDelModel, setLectureDelModel] = React.useState(false);
    const [totalDocs, setTotalSections] = React.useState(0);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const handleAddSectionModelOpen = () => setOpen(true);
    const handleAddSectionModelClose = () => setOpen(false);
    const handleDeleteSectionModelOpen = () => setSectionDelModel(true);
    const handleDeleteSectionModelClose = () => setSectionDelModel(false);
    const handleAddLectureModelOpen = () => setLectureModel(true);
    const handleAddLectureModelClose = () => setLectureModel(false);
    const handleDeleteLectureModelOpen = () => setLectureDelModel(true);
    const handleDeleteLectureModelClose = () => setLectureDelModel(false);
    const [deleteId, setDeleteId] = React.useState('');
    const [deleteLectureId, setDeleteLectureId] = React.useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    const renderContentType = (contentType: string) => {
        switch (contentType) {
            case 'text':
                return (
                    <Form.Group controlId="content">
                        <Form.ControlLabel>Content</Form.ControlLabel>
                        <CKEditor
                            editor={ClassicEditor}
                            data={lectureformValue.content ?? ''}
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={event => {
                                console.log(event);
                            }}
                            onBlur={(_event, editor) => {
                                lectureformValue.content = editor.getData();
                                setLectureFormValue(lectureformValue);
                            }}
                            onFocus={(_event, editor) => {
                                console.log('Focus.', editor);
                            }}
                        />
                    </Form.Group>
                );
            case 'youtube':
                return (
                    <Form.Group controlId="content">
                        <Form.ControlLabel>YouTube</Form.ControlLabel>
                        <Form.Control name="content" />
                        <Form.HelpText>Video URL.</Form.HelpText>
                    </Form.Group>
                );
            case 'vimeo':
                return (
                    <Form.Group controlId="content">
                        <Form.ControlLabel>Vimeo</Form.ControlLabel>
                        <Form.Control name="content" />
                        <Form.HelpText>Video URL.</Form.HelpText>
                    </Form.Group>
                );
            case 'self_hosted':
                return (<Form.Group controlId="content">
                    <Form.ControlLabel>Self Hosted</Form.ControlLabel>
                    <Form.Control name="content" accepter={Uploader} />
                </Form.Group>);
            default:
                return (<span>NA</span>);
        }
    };

    /* Schema for validation */
    const model = Schema.Model({
        title: Schema.Types.StringType().isRequired('This field is required.'),
        slug: Schema.Types.StringType().isRequired('This field is required.'),
        categories: Schema.Types.ArrayType().isRequired('This field is required.'),
        instructor: Schema.Types.StringType().isRequired('This field is required.'),
        course_price: Schema.Types.StringType().isRequired('This field is required.'),
        cut_off_price: Schema.Types.StringType().isRequired('This field is required.'),
    });

    /* Schema for validation */
    const lectureModel = Schema.Model({
        title: Schema.Types.StringType().isRequired('This field is required.')
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const create = (_event: SyntheticEvent) => {
        const payload = formValue;
        payload.course = id;
        payload.instructor = course?.instructor?._id;
        payload.sort_order = totalDocs + 1;

        axiosInstance.post('/sections', { payload })
            .then(response => {
                setFormValue({});
                handleAddSectionModelClose();
                toaster.push(<Message type="success">{response.data.message}</Message>);
                forceUpdate();
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message type="error">{errorMsg}</Message>);
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lectureCreate = (_event: SyntheticEvent) => {
        const payload = lectureformValue;
        payload.course = id;
        payload.instructor = course?.instructor?._id;
        payload.sort_order = totalDocs + 1;
        payload.section = sectionId;
        payload.type = 'lesson';
        axiosInstance.post('/lectures', { payload })
            .then(response => {
                setFormValue({});
                handleAddLectureModelClose();
                toaster.push(<Message type="success">{response.data.message}</Message>);
                forceUpdate();
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message type="error">{errorMsg}</Message>);
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateSection = (_event: SyntheticEvent) => {
        const payload = formValue;
        payload.course = id;
        payload.instructor = course?.instructor?._id;

        axiosInstance.patch('/sections', { payload })
            .then(response => {
                setFormValue({});
                handleAddSectionModelClose();
                toaster.push(<Message type="success">{response.data.message}</Message>);
                forceUpdate();
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message type="error">{errorMsg}</Message>);
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lectureUpdate = (_event: SyntheticEvent) => {
        const payload = lectureformValue;
        axiosInstance.patch('/lectures', { payload })
            .then(response => {
                setFormValue({});
                handleAddLectureModelClose();
                toaster.push(<Message type="success">{response.data.message}</Message>);
                forceUpdate();
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message type="error">{errorMsg}</Message>);
            });
    };


    const setSectionDeleteModel = (deleteId: string) => {
        handleDeleteSectionModelOpen();
        setDeleteId(deleteId);
    };

    const setLectureDeleteModel = (deleteId: string) => {
        handleDeleteLectureModelOpen();
        setDeleteLectureId(deleteId);
    };

    const onConfirmSectionDeletion = () => {
        return axiosInstance.delete('/sections', {
            method: 'delete',
            data: {
                _id: [deleteId]
            }
        })
            .then(response => {
                handleDeleteSectionModelClose();
                forceUpdate();
                toaster.push(<Message type="success">{response.data.message}</Message>);
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message type="error">{errorMsg}</Message>);
            });
    };

    const onConfirmLectureDeletion = () => {
        return axiosInstance.delete('/lectures', {
            method: 'delete',
            data: {
                _id: [deleteLectureId]
            }
        })
            .then(response => {
                handleDeleteLectureModelClose();
                forceUpdate();
                toaster.push(<Message type="success">{response.data.message}</Message>);
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message type="error">{errorMsg}</Message>);
            });
    };

    const handleSectionSubmit = e => {
        if (sectionAction === 'edit') {
            updateSection(e);
        }
        else {
            create(e);
        }
    };

    const handleLectureSubmit = e => {
        if (lectureAction === 'edit') {
            lectureUpdate(e);
        }
        else {
            lectureCreate(e);
        }
    };

    const sectionEdit = (section: any): void => {
        setSectionAction('edit');
        setFormValue({
            title: section.title ?? '',
            description: section.description ?? '',
            status: section.status ?? '',
            sort_order: section.sort_order ?? '',
            _id: section._id ?? null
        });
        handleAddSectionModelOpen();
    };

    const lectureEdit = (lecture: any): void => {
        setLectureAction('edit');
        setLectureFormValue(lecture);
        handleAddLectureModelOpen();
    };


    const data = [
        { text: 'collection0 item0', collection: 0 },
        { text: 'collection0 item1', collection: 0 },
        { text: "I'm last one.", collection: 3, disabled: true }
    ];

    const styleCenter = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60px'
    };

    const slimText = {
        fontSize: '0.666em',
        color: '#97969B',
        fontWeight: 'lighter',
        paddingBottom: 5
    };

    const titleStyle = {
        paddingBottom: 5,
        whiteSpace: 'nowrap',
        fontWeight: 500
    };

    const dataStyle = {
        fontSize: '1.2em',
        fontWeight: 500
    };

    const renderRaise = React.useCallback(number => {
        const isPositive = number > 0;
        const isNegative = number < 0;
        return (
            <span style={{ paddingLeft: 15, color: isNegative ? 'red' : 'green' }}>
                <span>{isPositive ? '+' : null}</span>
                <span>{number}</span>
            </span>
        );
    }, []);

    const handleSortEnd = ({ oldIndex, newIndex }) =>
        setData(prvData => {
            const moveData = prvData.splice(oldIndex, 1);
            const newData = [...prvData];
            newData.splice(newIndex, 0, moveData[0]);
            return newData;
        }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getData = () => {
        axiosInstance.get('/sections', { params: { course: id, limit: 50 } })
            .then(response => {
                const data = response?.data;
                console.log("Sections data:", data);
                setSectionsData(data?.data?.docs ?? []);
                setTotalSections(data?.data?.totalDocs ?? 0);
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message showIcon type="error">{errorMsg}</Message>, { placement: 'topEnd', duration: 5000 });
            });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getCourseData = (): void => {
        axiosInstance.get('/course', { params: { course: id } })
            .then(response => {
                const data = response?.data;
                setCourseData(data?.data?.docs[0] ?? []);
            })
            .catch(error => {
                const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
                toaster.push(<Message showIcon type="error">{errorMsg}</Message>, { placement: 'topEnd', duration: 5000 });
            });
    };

    const reloadComponent = (): void => {
        if (id) {
            getCourseData();
            getData();
        } else {
            setSectionAction('add');
        }
    };

    useEffect(() => {
        reloadComponent();
    }, [id, ignored]);


    return (
        <>
            <List bordered>
                {sections.map((section: any, index) => (
                    <List.Item key={section?._id} index={index + 1}>
                        <Panel style={{ margin: "2px" }} className='mr-4' header={<Stack justifyContent="space-between">
                            <span>{section?.title}</span>
                            <ButtonGroup>
                                <IconButton size="sm" onClick={() => { sectionEdit(section); }} appearance="primary" icon={< EditIcon />} />
                                <IconButton size="sm" onClick={() => { setSectionDeleteModel(section?._id); }} appearance="primary" color='red' icon={<TrashIcon />} />
                            </ButtonGroup>
                            {/* <IconButton icon={<BsThreeDotsVertical />} appearance="default" />
                            <Dropdown title="Dropdown">
                                <Dropdown.Item>New File</Dropdown.Item>
                                <Dropdown.Item>New File with Current Profile</Dropdown.Item>
                                <Dropdown.Item>Download As...</Dropdown.Item>
                                <Dropdown.Item>Export PDF</Dropdown.Item>
                                <Dropdown.Item>Export HTML</Dropdown.Item>
                                <Dropdown.Item>Settings</Dropdown.Item>
                                <Dropdown.Item>About</Dropdown.Item>
                            </Dropdown> */}
                        </Stack>} >
                            <List sortable onSort={handleSortEnd} bordered>
                                {section?.lectures.map(({ title, sort_order: sortOrder, status, content_type, type, content, description, section, instructor, course, _id }, index) => (
                                    <List.Item key={title} index={index} collection={sortOrder}>
                                        <Panel style={{ margin: "2px" }} className='mt-4' header={""} >
                                            <Stack justifyContent="space-between">
                                                <span>{title}</span>
                                                <ButtonGroup>
                                                    <IconButton size="sm" onClick={() => { lectureEdit({ title, sort_order: sortOrder, status, content, content_type, description, section, instructor, course, type, _id }); }} icon={< EditIcon />} />
                                                    <IconButton size="sm" onClick={() => { setLectureDeleteModel(_id); }} icon={<TrashIcon />} />
                                                </ButtonGroup>
                                            </Stack>
                                        </Panel>
                                    </List.Item>
                                ))}

                            </List>
                            <ButtonToolbar style={{ margin: "10px", }} >
                                <IconButton appearance="primary" size='xs' onClick={() => { setLectureFormValue({}); handleAddLectureModelOpen(); setSectionId(section._id); }} icon={<PlusIcon />} >Add Lecture</IconButton>
                                {/* <IconButton appearance="primary" color="green" icon={<PlusIcon />}>
                                        Component
                                    </IconButton> */}
                            </ButtonToolbar>
                        </Panel>
                    </List.Item>
                ))}
            </List>

            <ButtonToolbar style={{ margin: "10px" }}>
                <IconButton appearance="ghost" onClick={() => { setFormValue({}); handleAddSectionModelOpen(); }} block>Add Section</IconButton>
            </ButtonToolbar>

            {/* Model Starts Here */}
            <Modal size="lg" backdrop={true} overflow={true} open={open} onClose={handleAddSectionModelClose}>
                <Modal.Header>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid ref={formRef} model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSectionSubmit}
                        onCheck={setFormError}>
                        <FormHeader
                            title="Add Section"
                            description="Add new section to add your content."
                        />
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Section Title</Form.ControlLabel>
                            <Form.Control name="title" />
                            <Form.HelpText>Course names must be unique.</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.ControlLabel>Description</Form.ControlLabel>
                            <Form.Control name="description" accepter={Textarea} />
                        </Form.Group>
                        <Form.Group controlId="checkPicker">
                            <Form.ControlLabel>Status</Form.ControlLabel>
                            <Form.Control
                                name="status"
                                accepter={SelectPicker}
                                data={[
                                    {
                                        label: 'Active',
                                        value: "Active"
                                    }, {
                                        label: 'In-Active',
                                        value: "In-Active"
                                    }
                                ]}
                                block
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSectionSubmit} appearance="primary">
                        Add
                    </Button>
                    <Button onClick={handleAddSectionModelClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal backdrop={true} keyboard={false} open={openSectionDelModel} onClose={handleDeleteSectionModelClose}>
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
                    <Button onClick={handleDeleteSectionModelClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={onConfirmSectionDeletion} appearance="primary">
                        Yes, Delete
                    </Button>

                </Modal.Footer>
            </Modal>

            {/* Lecture Modal popup */}
            <Modal size="lg" overflow={true} backdrop={'static'} open={openLectureModel} onClose={handleAddLectureModelClose}>
                <Modal.Header>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid ref={formRef} model={lectureModel} formValue={lectureformValue} onChange={setLectureFormValue} onSubmit={handleLectureSubmit}
                        onCheck={setFormError}>
                        <FormHeader
                            title="Add Lecture"
                            description="Add Content to your Lectures"
                        />
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Lecture Title</Form.ControlLabel>
                            <Form.Control name="title" />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.ControlLabel>Description</Form.ControlLabel>
                            <Form.Control name="description" accepter={Textarea} />
                        </Form.Group>
                        <Form.Group controlId="checkPicker">
                            <Form.ControlLabel>Content Type</Form.ControlLabel>
                            <Form.Control
                                name="content_type"
                                accepter={SelectPicker}
                                data={[{
                                    label: 'Text',
                                    value: "text"
                                },
                                {
                                    label: 'Self Hosted',
                                    value: "self_hosted"
                                }, {
                                    label: 'YouTube',
                                    value: "youtube"
                                }, {
                                    label: 'Vimeo',
                                    value: "vimeo"
                                }
                                ]}
                                block
                            />
                        </Form.Group>
                        {/* <Form.Group controlId="content_text">
                            <Form.ControlLabel>Content</Form.ControlLabel>
                            <CKEditor
                                editor={ClassicEditor}
                                data={lectureformValue.content ?? ''}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={event => {
                                    console.log(event);
                                }}
                                onBlur={(_event, editor) => {
                                    lectureformValue.content = editor.getData();
                                    setLectureFormValue(lectureformValue);
                                }}
                                onFocus={(_event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                        </Form.Group> */}
                        {renderContentType(lectureformValue?.content_type)}

                        <Form.Group controlId="checkPicker">
                            <Form.ControlLabel>Status</Form.ControlLabel>
                            <Form.Control
                                name="status"
                                accepter={SelectPicker}
                                data={[
                                    {
                                        label: 'Active',
                                        value: "Active"
                                    }, {
                                        label: 'In-Active',
                                        value: "In-Active"
                                    }
                                ]}
                                block
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleLectureSubmit} appearance="primary">
                        Add
                    </Button>
                    <Button onClick={handleAddLectureModelClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal backdrop={true} keyboard={false} open={openLectureDelModel} onClose={handleDeleteLectureModelClose}>
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
                    <Button onClick={handleDeleteLectureModelClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={onConfirmLectureDeletion} appearance="primary">
                        Yes, Delete
                    </Button>

                </Modal.Footer>
            </Modal>

        </>
    );
};

export default NewCourseBuilder;
