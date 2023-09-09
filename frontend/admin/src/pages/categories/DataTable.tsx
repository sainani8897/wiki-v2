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
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any>({});
  const [categoryData, setCategoryData] = useState<any>({});
  
  // const data = mockUsers(20);
  const defaultData: any = categories;

  const handleChangeLimit = dataKey => {
    // console.log(' i was called::::')
    setPage(1);
    setLimit(dataKey);
    getCategories(page, limit);
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
    setCategoryData(data);
    setShowDrawer(true);
    console.log("Edit data::",data);
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {

    // console.log("categories data:",categories);

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
    if (categories?.status === 200) {
      return data;
    }
  };

  useEffect(() => {
    getCategories(page, limit);
  }, [page, limit]);


  const getCategories = (page: number = 1, limit: number = 10) => {
    return axiosInstance.get('/categories', { params: { limit, page } })
      .then(response => {
        setCategories(response.data);
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
    alert(1);
    getCategories();
  }

  return (
    <>
      <Stack className="table-toolbar" justifyContent="space-between">
        <Button appearance="primary" onClick={() => setShowDrawer(true)}>
          Add Category
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
          <Cell dataKey="category_name" />
        </Column>

        <Column minWidth={160} flexGrow={1} sortable>
          <HeaderCell>Slug</HeaderCell>
          <Cell dataKey="slug" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Sort Order</HeaderCell>
          <Cell dataKey="sort" />
        </Column>

        <Column width={100}>
          <HeaderCell>Parent</HeaderCell>
          <Cell dataKey="parent_id" >
            {rowData => rowData.parent_id?.category_name}
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
      <DrawerView open={showDrawer} customData={{ categories, categoryData }} onClose={() => setShowDrawer(false)} reload={()=>reloadComponent()}/>
      
      {/* Delete Modal */}
      <DeleteModal open={showDeleteModal} deleteId={deleteId} onClose={() => setShowDeleteModal(false)} reload={()=>reloadComponent()} />
    </>
  );
};

export default DataTable;
