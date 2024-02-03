/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-use-before-define
import React, { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { Button, ButtonGroup, ButtonToolbar, CheckPicker, Divider, FlexboxGrid, Form, IconButton, InputGroup, InputNumber, List, Message, Modal, Panel, Placeholder, Schema, SelectPicker, Stack, TagInput, toaster } from 'rsuite';
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
import { slugify } from '@/utils';

const NewCourseBuilder = () => {
    const [type, setType] = useState('personal');
    const [level, setLevel] = React.useState('Private');
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({} as any);
    const [selectedRoles, setSelectedRoles] = React.useState([]);
    const [sections, setSectionsData] = React.useState([]);
    const [course, setCourseData] = React.useState({} as any);
    const [selectData, setRolesData] = React.useState([]);
    const [selectInstructorsData, setInstructorsData] = React.useState([]);
    const [sectionAction, setSectionAction] = React.useState('add');
    const [open, setOpen] = React.useState(false);
    const [totalDocs,setTotalSections] = React.useState(0);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const handleAddSectionModelOpen = () => setOpen(true);
    const handleAddSectionModelClose = () => setOpen(false);

    const navigate = useNavigate();
    const { id } = useParams();

    /* Schema for validation */
    const model = Schema.Model({
        title: Schema.Types.StringType().isRequired('This field is required.'),
        slug: Schema.Types.StringType().isRequired('This field is required.'),
        categories: Schema.Types.ArrayType().isRequired('This field is required.'),
        instructor: Schema.Types.StringType().isRequired('This field is required.'),
        course_price: Schema.Types.StringType().isRequired('This field is required.'),
        cut_off_price: Schema.Types.StringType().isRequired('This field is required.'),
    });

    const handleSubmit = e => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
        }
        if (action === 'add') {
            create(e);
        }
        else {
            // update(e);
        }
    };

    const getCategories = async () => {
        try {
            const { data: categories } = await axiosInstance.get('/categories');
            const selectDataRaw = categories?.data?.docs?.map(item => ({
                label: item.category_name,
                value: item._id,
            })) ?? [];
            setRolesData(selectDataRaw);
        } catch (error) {

        }
    };

    const getInstructors = async () => {
        try {
            const { data: users } = await axiosInstance.get('/users');
            const selectDataRaw = users?.data?.docs?.map(item => ({
                label: item.name,
                value: item._id,
            })) ?? [];
            setInstructorsData(selectDataRaw);
        } catch (error) {

        }
    };

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

    const handleSectionSubmit = e => {
        if (sectionAction === 'edit') {
        //   update(e);
        }
        else{
          create(e);
        }
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
        axiosInstance.get('/sections', { params: { course: id,limit:50 } })
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
    const getCourseData = ():void => {
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

    const reloadComponent = ():void => {
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

        // <Form>
        //   <FormHeader
        //     title="Create new course"
        //     description="Start fresh or use examples for seamless course creation success!."
        //   />

        //   <Stack spacing={30} style={{ margin: '60px 0' }}>
        //     <RadioTile
        //       icon={<Icon as={VscFile} />}
        //       title="Create blank project"
        //       value={type}
        //       name="personal"
        //       onChange={setType}
        //     >
        //       Create a blank project to house your files, plan your work, and collaborate on code, among
        //       other things.
        //     </RadioTile>
        //     <RadioTile
        //       icon={<Icon as={VscNotebookTemplate} />}
        //       title="Create from template"
        //       value={type}
        //       name="brand"
        //       onChange={setType}
        //     >
        //       Create a project pre-populated with the necessary files to get you started quickly.
        //     </RadioTile>
        //     <RadioTile
        //       icon={<Icon as={VscRepoClone} />}
        //       title="Import project"
        //       value={type}
        //       name="group"
        //       onChange={setType}
        //     >
        //       Migrate your data from an external source like GitHub, Bitbucket, or another instance of
        //       GitLab.
        //     </RadioTile>
        //   </Stack>
        // </Form>
        <>
            <List bordered>
                {sections.map((section: any, index) => (
                    <List.Item key={section?._id} index={index + 1}>
                        <Panel style={{ margin: "2px" }} className='mr-4' header={<Stack justifyContent="space-between">
                            <span>{section?.title}</span>
                            <ButtonGroup>
                            <IconButton size="sm" appearance="primary" icon={< EditIcon/>} />
                            <IconButton size="sm" appearance="primary" color='red' icon={<TrashIcon/>} />
                            </ButtonGroup>
                        </Stack>} >
                            <List sortable onSort={handleSortEnd}>
                                {data.map(({ text, collection, disabled }, index) => (
                                    <List.Item key={text} index={index} disabled={disabled} collection={collection}>
                                        <Panel style={{ margin: "2px" }} className='mr-4' header="Add Section" bordered >
                                            <Placeholder.Paragraph />
                                        </Panel>
                                    </List.Item>
                                ))}
                            </List>
                        </Panel>
                    </List.Item>
                ))}
            </List>

            <ButtonToolbar>
                <IconButton appearance="ghost" onClick={() => handleAddSectionModelOpen()} icon={<AddOutlineIcon />} block>Add Section</IconButton>
            </ButtonToolbar>

            {/* Model Starts Here */}
            <Modal overflow={true} open={open} onClose={handleAddSectionModelClose}>
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

        </>
        // <Form fluid ref={formRef} model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSubmit}
        // onCheck={setFormError}>
        //   <FormHeader
        //     title="Add Section"
        //     description="Add new section to add your content."
        //   />

        //   <Form.Group controlId="name">
        //     <Form.ControlLabel>Course Title</Form.ControlLabel>
        //     <Form.Control name="title" />
        //     <Form.HelpText>Course names must be unique.</Form.HelpText>
        //   </Form.Group>

        //   <Form.Group controlId="name">
        //     <Form.ControlLabel>Slug</Form.ControlLabel>
        //     <Form.Control name="slug" />
        //     <Form.HelpText>Slug names must be unique.</Form.HelpText>
        //   </Form.Group>

        //   {/* <Form.Group controlId="url">
        //   <Form.ControlLabel>Project URL</Form.ControlLabel>

        //   <InputGroup style={{ width: '100%' }}>
        //     <InputGroup.Addon>https://rsuitejs.com/</InputGroup.Addon>
        //     <Form.Control name="url" />
        //   </InputGroup>
        //   <Form.HelpText>
        //     Want to house several dependent projects under the same namespace? <a>Create a group.</a>
        //   </Form.HelpText>
        // </Form.Group> */}
        //   <Form.Group controlId="checkPicker">
        //     <Form.ControlLabel>Category</Form.ControlLabel>
        //     <Form.Control
        //       name="categories"
        //       accepter={CheckPicker}
        //       data={selectData}
        //       block
        //     />
        //   </Form.Group>

        //   <Form.Group controlId="checkPicker">
        //     <Form.ControlLabel>Instructors</Form.ControlLabel>
        //     <Form.Control
        //       name="instructor"
        //       accepter={SelectPicker}
        //       data={selectInstructorsData}
        //       block
        //     />
        //   </Form.Group>

        //   <Form.Group controlId="checkPicker">
        //     <Form.ControlLabel>Instructors</Form.ControlLabel>
        //     <Form.Control
        //       name="status"
        //       accepter={SelectPicker}
        //       data={[
        //         {
        //           label: 'Active',
        //           value: "Active"
        //         }, {
        //           label: 'In-Active',
        //           value: "In-Active"
        //         }
        //       ]}
        //       block
        //     />
        //   </Form.Group>

        //   <Form.Group controlId="description">
        //     <Form.ControlLabel>Description</Form.ControlLabel>
        //     <Form.Control name="description" accepter={Textarea} />
        //   </Form.Group>

        //   <Form.Group controlId="tags">
        //     <Form.ControlLabel>Tags</Form.ControlLabel>
        //     <Form.Control name="tags" accepter={TagInput} block />
        //     <Form.HelpText>Press Enter to add a new keyword.</Form.HelpText>
        //   </Form.Group>

        //   <Form.Group controlId="InputNumber">
        //     <Form.ControlLabel>Course Price</Form.ControlLabel>
        //     <Form.Control name="course_price" accepter={InputNumber} />
        //     <Form.HelpText>Course after discounted price.</Form.HelpText>
        //   </Form.Group>
        //   {/* <Form.Group controlId="InputNumber">
        //       <Form.ControlLabel>InputNumber</Form.ControlLabel>
        //       <Form.Control name="InputNumber" accepter={InputNumber} />
        //   </Form.Group> */}

        //   <Form.Group controlId="name">
        //     <Form.ControlLabel>Cutt of Price</Form.ControlLabel>
        //     <Form.Control name="cut_off_price" accepter={InputNumber} />
        //     <Form.HelpText>Course Actual Price.</Form.HelpText>
        //   </Form.Group>

        //   {/* <Form.Group controlId="plan">
        //     <Form.ControlLabel>Visibility Level</Form.ControlLabel>
        //     <Stack spacing={10} direction="column" alignItems={'stretch'}>
        //       <RadioTile
        //         icon={<Icon as={VscLock} />}
        //         title="Private"
        //         value={level}
        //         name="Private"
        //         onChange={setLevel}
        //       >
        //         Project access must be granted explicitly to each user. If this project is part of a
        //         group, access will be granted to members of the group.
        //       </RadioTile>
        //       <RadioTile
        //         icon={<Icon as={VscWorkspaceTrusted} />}
        //         title="Internal"
        //         value={level}
        //         name="Internal"
        //         onChange={setLevel}
        //       >
        //         The project can be accessed by any logged in user except external users.
        //       </RadioTile>
        //     </Stack>
        //   </Form.Group> */}
        //   <Divider />
        //   <Stack justifyContent="space-between">
        //         <IconButton
        //           icon={<PageNextIcon />}
        //           placement="right"
        //           appearance="primary"
        //           type='submit'
        //           onClick={() => handleSubmit}
        //         >
        //           Continue
        //         </IconButton>
        //     </Stack>
        // </Form>
    );
};

export default NewCourseBuilder;
