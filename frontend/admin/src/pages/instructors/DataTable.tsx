// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  Table,
  Button,
  DOMHelper,
  Progress,
  Stack,
  SelectPicker,
  IconButton,
  Pagination,
  ButtonToolbar
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import DrawerView from './DrawerView';
import { mockUsers } from '@/data/mock';
import { NameCell, ImageCell, ActionCell } from './Cells';
import axiosInstance from '../../interceptors/axios';
import { useNavigate } from "react-router-dom";
import DeleteModal from './DeleteModal';


// const data = mockUsers(20);
const defaultData = mockUsers(1000);

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;



const DataTable = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setdeleteId] = useState('');
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<any>({});
  const navigate = useNavigate();

  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  const defaultData: any = users;

  const data = defaultData?.data?.docs.map((v, i) => {
    return v;
  });

  let checked = false;
  let indeterminate = false;

  // if (checkedKeys.length === data.length) {
  //   checked = true;
  // } else if (checkedKeys.length === 0) {
  //   checked = false;
  // } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
  //   indeterminate = true;
  // }

  const handleCheckAll = (_value, checked) => {
    const keys = checked ? data.map(item => item.id) : [];
    setCheckedKeys(keys);
  };

  const handleCheck = (value, checked) => {
    const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
    setCheckedKeys(keys);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    if (users?.status === 200) {
      return data;
    }
  };

  const getData = (page = 1, limit = 10) => {
    return axiosInstance.get('/users', { params: { limit, page } })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    getData(page, limit);
  }, [page, limit]);

  const onEdit = (data: any) => {
    navigate(`/users/edit/${data._id}`);
  };

  const deleteModal = (id: string) => {
    setdeleteId(id);
    setShowDeleteModal(true);
  };

  const reloadComponent = () => {
    getData();
  };

  return (
    <>
      <Stack className="table-toolbar" justifyContent="space-between">
        <Button appearance="primary" onClick={() => {
          navigate("/users/create");
        }} >
          Add User
        </Button>
        {/* onClick={() => setShowDrawer(true)} */}

        {/* <Stack spacing={6}>
          <SelectPicker
            label="Rating"
            data={ratingList}
            searchable={false}
            value={rating}
            onChange={setRating}
          />
          <InputGroup inside>
            <Input placeholder="Search" value={searchKeyword} onChange={setSearchKeyword} />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </Stack> */}
      </Stack>

      <Table
        height={Math.max(getHeight(window) - 200, 400)}
        data={filteredData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
      >
        <Column width={50} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="_id" />
        </Column>


        <Column width={80} align="center">
          <HeaderCell>Avatar</HeaderCell>
          <ImageCell dataKey="profile" />
        </Column>

        <Column minWidth={160} flexGrow={1} sortable>
          <HeaderCell>Name</HeaderCell>
          <NameCell dataKey="name" />
        </Column>
        <Column width={300}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={300}>
          <HeaderCell>Mobile</HeaderCell>
          <Cell dataKey="mobile" />
        </Column>
        <Column width={300}>
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="status" />
        </Column>
        <Column width={300}>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="user_type" />
        </Column>



        {/* <Column width={100} sortable>
          <HeaderCell>Rating</HeaderCell>
          <Cell dataKey="rating">
            {rowData =>
              Array.from({ length: rowData.rating }).map((_, i) => <span key={i}>⭐️</span>)
            }
          </Cell>
        </Column> */}





        <Column width={120}>
          <HeaderCell>
            <MoreIcon />
          </HeaderCell>
          <Cell className="link-group">
            {/* {rowData => rowData.parent_id?.category_name} */}
            {
              rowData => (
              <ButtonToolbar>
                <IconButton size="sm" color="blue" onClick={() => { onEdit(rowData) }} appearance="ghost" circle icon={<EditIcon />} />
                {/* <IconButton size="sm" onClick={() => {
                  deleteModal(rowData._id);
                }} color="red" appearance="ghost" circle icon={<TrashIcon />} /> */}
              </ButtonToolbar>



              )
            }

          </Cell>
        </Column>

      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          total={defaultData?.data?.totalDocs}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
      <DrawerView open={showDrawer} onClose={() => setShowDrawer(false)} />

      {/* Delete Modal */}
      <DeleteModal open={showDeleteModal} deleteId={deleteId} onClose={() => setShowDeleteModal(false)} reload={() => reloadComponent()} />
    </>
  );
};

export default DataTable;
