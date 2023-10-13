import React, { useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  Table,
  Button,
  DOMHelper,
  Progress,
  Checkbox,
  Stack,
  SelectPicker,
  TagPicker,
  Whisper,
  IconButton,
  Pagination,
  Popover,
  Dropdown,
  CellProps,
  ButtonToolbar
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import DrawerView from './DrawerView';
import { mockUsers } from '@/data/mock';
import { NameCell, ImageCell, CheckCell, ActionCell } from './Cells';
import  DeleteModal from './DeleteModal';
import axiosInstance from '../../interceptors/axios';



const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

const ratingList = [
  { value: "Active", label: "Active" },
  { value: "In-Active", label: "In-Active" },

];


const DataTable = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [deleteId, setdeleteId] = useState('');
  const [actionId, setActionId] = useState('');
  const [action, setAction] = useState('create');
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState<any>({});
  const [permissions, setPermissions] = useState<any>({});
  const [roleData, setRoleData] = useState<any>({});
  
  // const data = mockUsers(20);
  const defaultData: any = roles;

  const handleChangeLimit = dataKey => {
    // console.log(' i was called::::')
    setPage(1);
    setLimit(dataKey);
    getRoles(page, limit);
  };

  const handlePageChange = dataKey => {
    setPage(dataKey);
  };

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
    // const keys = checked ? data.map(item => item.id) : [];
    // setCheckedKeys(keys);
  };

  const handleCheck = (value, checked) => {
    // const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
    // setCheckedKeys(keys);
  };

  const onEdit = (data: any) => {
    setRoleData(data);
    setAction('edit');
    setActionId(data._id)
    setShowDrawer(true);
    console.log("Edit data::",data);
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {

    // console.log("roles data:",roles);

    // const filtered = data.filter(item => {
    //   if (!item.name.includes(searchKeyword)) {
    //     return false;
    //   }

    //   if (rating && item.rating !== rating) {
    //     return false;
    //   }

    //   return true;
    // });

    // if (sortColumn && sortType) {
    //   return filtered.sort((a, b) => {
    //     let x: any = a[sortColumn];
    //     let y: any = b[sortColumn];

    //     if (typeof x === 'string') {
    //       x = x.charCodeAt(0);
    //     }
    //     if (typeof y === 'string') {
    //       y = y.charCodeAt(0);
    //     }

    //     if (sortType === 'asc') {
    //       return x - y;
    //     } else {
    //       return y - x;
    //     }
    //   });
    // }
    if (roles?.status === 200) {
      return data;
    }
  };

  useEffect(() => {
    getRoles(page, limit);
    getPermissions()
  }, [page, limit]);


  const getRoles = (page: number = 1, limit: number = 10) => {
    return axiosInstance.get('/roles', { params: { limit, page } })
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const getPermissions = (page: number = 1, limit: number = 1000) => {
    return axiosInstance.get('/permissions', { params: { limit, page } })
      .then(response => {
        setPermissions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const deleteModal = (id:string) => {
    setdeleteId(id);
    setShowDeleteModal(true);
  }

  const reloadComponent = () =>{
    getRoles();
    getPermissions();
  }

  const add = () => {
    setAction('create')
    setShowDrawer(true)
    setRoleData({})
    setActionId('')
  }

  return (
    <>
      <Stack className="table-toolbar" justifyContent="space-between">
        <Button appearance="primary" onClick={() => add()}>
          Add Role
        </Button>

        <Stack spacing={6}>
          {/* <TagPicker
            label="Status"
            data={ratingList}
            searchable={false}
            value={rating}
            onChange={setRating}
          /> */}
          <TagPicker
            data={ratingList} placeholder="Status" />
          <InputGroup inside>
            <Input placeholder="Search" value={searchKeyword} onChange={setSearchKeyword} />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </Stack>
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
          <Cell dataKey="index">
            {(rowData, index:number) => index + 1}
          </Cell>
        </Column>

        <Column minWidth={160} flexGrow={1} sortable>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="display_text" />
        </Column>

        <Column minWidth={160} flexGrow={1} sortable>
          <HeaderCell>Slug</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={100}>
          <HeaderCell>Permissions</HeaderCell>
          <Cell dataKey="permissions" >
            {rowData => rowData.permissions?.length}
          </Cell>
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="status" />
        </Column>

        <Column width={120}>
          <HeaderCell>
            <MoreIcon />
          </HeaderCell>
          <Cell className="link-group">
            {/* {rowData => rowData.parent_id?.category_name} */}
            {
              rowData => (<ButtonToolbar>
                <IconButton size="sm" color="blue" onClick={()=>{ onEdit(rowData) }} appearance="ghost" circle icon={<EditIcon />} />
                <IconButton size="sm" onClick={()=>{
                  deleteModal(rowData._id)
                }} color="red" appearance="ghost" circle icon={<TrashIcon />} />
              </ButtonToolbar>)
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
          onChangePage={handlePageChange}
          onChangeLimit={handleChangeLimit}
        />
      </div>
      <DrawerView open={showDrawer} action={action} customData={{ permissions, roleData, actionId }} onClose={() => setShowDrawer(false)} reload={()=>reloadComponent()}/>
      
      {/* Delete Modal */}
      <DeleteModal open={showDeleteModal} deleteId={deleteId} onClose={() => setShowDeleteModal(false)} reload={()=>reloadComponent()} />
    </>
  );
};

export default DataTable;
