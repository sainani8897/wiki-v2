// eslint-disable-next-line no-use-before-define
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { CheckPicker, Divider, Form, IconButton, InputGroup, InputNumber, Message, Schema, SelectPicker, Stack, TagInput, toaster } from 'rsuite';
import RadioTile from '@/components/RadioTile';
import { Icon } from '@rsuite/icons';
import { VscNotebookTemplate, VscRepoClone, VscFile, VscLock, VscWorkspaceTrusted,VscBook  } from 'react-icons/vsc';
import FormHeader from './FormHeader';
import Textarea from '@/components/Textarea';
import axiosInstance from '../../../interceptors/axios';
import PageNextIcon from '@rsuite/icons/PageNext';
import { useNavigate, useParams } from 'react-router-dom';

const BasicInfo = () => {
  const [type, setType] = useState('personal');
  const [level, setLevel] = React.useState('Private');
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({} as any);
  const [selectedRoles, setSelectedRoles] = React.useState([]);
  const [selectData, setRolesData] = React.useState([]);
  const [selectInstructorsData, setInstructorsData] = React.useState([]);
  const [action, setAction] = React.useState('add');

  const navigate = useNavigate();
  const { id } = useParams();

  /* Schema for validation */
  const model = Schema.Model({
    title: Schema.Types.StringType().isRequired('This field is required.'),
    slug: Schema.Types.StringType().isRequired('This field is required.'),
    categories: Schema.Types.ArrayType().isRequired('This field is required.'),
    instructor: Schema.Types.StringType().isRequired('This field is required.'),
    course_price: Schema.Types.NumberType().isRequired('This field is required.'),
    cut_off_price: Schema.Types.NumberType().isRequired('This field is required.'),
  });

  const handleSubmit = e => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    if (action === 'add') {
      create(e);
    }
    else{
      //update(e);
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

  const create = (event: SyntheticEvent) => {
    axiosInstance.post('/course', { payload: formValue })
      .then(response => {
        setFormValue({});
        toaster.push(<Message type="success">{response.data.message}</Message>);
      })
      .catch(error => {
        const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message type="error">{errorMsg}</Message>);
      });
  };

  useEffect(() => {
    if (id) {
      console.log("i am edit!!!!");
      setAction('edit');
      getData();
    } else {
      setAction('add');
    }
    getCategories();
    getInstructors();
  }, []);


  const getData = () => {
    axiosInstance.get('/course', { params: { _id: id } })
      .then(response => {
        const data = response?.data;
        console.log("response", data);
        const allRoles = data.data?.docs[0]?.roles?.map(role=>role._id);
        setSelectedRoles(allRoles);
        setFormValue({
          title: data.data?.docs[0]?.title ?? '',
          slug: data.data?.docs[0]?.slug ?? '',
          categories: data.data?.docs[0]?.categories ?? '',
          instructor: data.data?.docs[0]?.instructor?._id ?? '',
          course_price: data.data?.docs[0]?.course_price ?? '',
          cut_off_price: data.data?.docs[0]?.cut_off_price ?? '',
          description: data.data?.docs[0]?.description ?? '',
          status: data.data?.docs[0]?.status ?? '',
          tags: data.data?.docs[0]?.tags ?? '',
        });;
      })
      .catch(error => {
        const errorMsg = error?.response?.data?.message ?? "Oops Something went wrong";
        toaster.push(<Message showIcon type="error">{errorMsg}</Message>, { placement: 'topEnd', duration: 5000 });
      });
  };

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
    <Form fluid ref={formRef} model={model} formValue={formValue} onChange={setFormValue} onSubmit={handleSubmit}
    onCheck={setFormError}>
      <FormHeader
        title="Create new course"
        description="Add Basic information of the course and continue."
      />

      <Form.Group controlId="name">
        <Form.ControlLabel>Course Title</Form.ControlLabel>
        <Form.Control name="title" />
        <Form.HelpText>Course names must be unique.</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="name">
        <Form.ControlLabel>Slug</Form.ControlLabel>
        <Form.Control name="slug" />
        <Form.HelpText>Slug names must be unique.</Form.HelpText>
      </Form.Group>

      {/* <Form.Group controlId="url">
      <Form.ControlLabel>Project URL</Form.ControlLabel>

      <InputGroup style={{ width: '100%' }}>
        <InputGroup.Addon>https://rsuitejs.com/</InputGroup.Addon>
        <Form.Control name="url" />
      </InputGroup>
      <Form.HelpText>
        Want to house several dependent projects under the same namespace? <a>Create a group.</a>
      </Form.HelpText>
    </Form.Group> */}
      <Form.Group controlId="checkPicker">
        <Form.ControlLabel>Category</Form.ControlLabel>
        <Form.Control
          name="categories"
          accepter={CheckPicker}
          data={selectData}
          block
        />
      </Form.Group>

      <Form.Group controlId="checkPicker">
        <Form.ControlLabel>Instructors</Form.ControlLabel>
        <Form.Control
          name="instructor"
          accepter={SelectPicker}
          data={selectInstructorsData}
          block
        />
      </Form.Group>

      <Form.Group controlId="checkPicker">
        <Form.ControlLabel>Instructors</Form.ControlLabel>
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

      <Form.Group controlId="description">
        <Form.ControlLabel>Description</Form.ControlLabel>
        <Form.Control name="description" accepter={Textarea} />
      </Form.Group>

      <Form.Group controlId="tags">
        <Form.ControlLabel>Tags</Form.ControlLabel>
        <Form.Control name="tags" accepter={TagInput} block />
        <Form.HelpText>Press Enter to add a new keyword.</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="InputNumber">
        <Form.ControlLabel>Course Price</Form.ControlLabel>
        <Form.Control name="course_price" accepter={InputNumber} />
        <Form.HelpText>Course after discounted price.</Form.HelpText>
      </Form.Group>
      {/* <Form.Group controlId="InputNumber">
          <Form.ControlLabel>InputNumber</Form.ControlLabel>
          <Form.Control name="InputNumber" accepter={InputNumber} />
      </Form.Group> */}

      <Form.Group controlId="name">
        <Form.ControlLabel>Cutt of Price</Form.ControlLabel>
        <Form.Control name="cut_off_price" accepter={InputNumber} />
        <Form.HelpText>Course Actual Price.</Form.HelpText>
      </Form.Group>

      {/* <Form.Group controlId="plan">
        <Form.ControlLabel>Visibility Level</Form.ControlLabel>
        <Stack spacing={10} direction="column" alignItems={'stretch'}>
          <RadioTile
            icon={<Icon as={VscLock} />}
            title="Private"
            value={level}
            name="Private"
            onChange={setLevel}
          >
            Project access must be granted explicitly to each user. If this project is part of a
            group, access will be granted to members of the group.
          </RadioTile>
          <RadioTile
            icon={<Icon as={VscWorkspaceTrusted} />}
            title="Internal"
            value={level}
            name="Internal"
            onChange={setLevel}
          >
            The project can be accessed by any logged in user except external users.
          </RadioTile>
        </Stack>
      </Form.Group> */}
      <Divider />
      <Stack justifyContent="space-between">
            <IconButton
              icon={<PageNextIcon />}
              placement="right"
              appearance="primary"
              type='submit'
              onClick={() => handleSubmit}
            >
              Continue
            </IconButton>
        </Stack>
    </Form>
  );
};

export default BasicInfo;
