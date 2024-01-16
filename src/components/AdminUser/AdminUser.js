import React, { useEffect, useRef, useState } from "react";
import { BiSolidUserAccount } from "react-icons/bi";
import { BsPersonAdd } from "react-icons/bs";
import { AiOutlineDownload } from "react-icons/ai";
import { Button, Form, Image, Space, Upload } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import DrawerComponent from "../Drawer/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent"
import InputComponent from "../InputComponent/InputHeader"
import { getBase64 } from "../../utils/jsonString";
import * as message from "../Message/Message";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);

  // search table
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    address: "",
    avatar: "",
    // image: "",
    // type: "",
    // countInStock: "",
    // newType: '',
    // discount: '',
  });
  const [form] = Form.useForm();


  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    console.log('1');
    return UserService.updateUser(id, token, { ...rests });
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });
  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const handleDelteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          QueryClient.invalidateQueries(["users"]);
        },
      }
    );
  };
  console.log('user',user);
  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const handleDetailsUser = () => {
    setIsOpenDawer(true);
  };
  // const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdate,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdate,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;
  console.log('dataDeletedMany',dataDeletedMany);
  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
  });

  const { isLoading: isLoadingUser, data: users } = queryUser;

  useEffect(() => {
    if (dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

  useEffect(() => {
    if (dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = async () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{
            fontSize: "20px",
            color: "white",
            backgroundColor: "red",
            padding: "8px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{
            fontSize: "20px",
            color: "white",
            backgroundColor: "yellow",
            padding: "8px",
            borderRadius: "10px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
          onClick={handleDetailsUser}
        />
      </div>
    );
  };
  // hàm search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a?.name?.length - b?.name?.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a?.email?.length - b?.email?.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a?.address?.length - b?.address?.length,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      sorter: (a, b) => a?.isAdmin?.length - b?.isAdmin?.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  console.log('users',users);
  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "TRUE" : "FALSE",
      };
    });

  // useEffect(() => {
  //   if (data?.status === "OK") {
  //     message.success();
  //     handleCancel();
  //   } else if (data?.status === "ERR") {
  //     message.error();
  //   }
  // }, [data?.status]);

  useEffect(() => {
    if (dataUpdate?.status === "OK") {
      message.success();
      handleCancelDrawer();
    } else if (dataUpdate?.status === "ERR") {
      message.error();
    }
  }, [dataUpdate?.status]);

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
        // image: res?.data?.image,
        // type: res?.data?.type,
        // countInStock: res?.data?.countInStock,
        // newType: '',
        // discount: '',
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleCancelDrawer = () => {
    setIsOpenDawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      address: "",
      avatar: "",
      // image: "",
      // type: "",
      // countInStock: "",
    });
    form.resetFields();
  };



  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };


  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file?.preview,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          // giúp refetch lại update mới
          queryUser.refetch();
        },
      }
    );
  };

  return (
    <div className="text-[#2C3B54]">
      <div>
        <div>
          <div>
            <TableComponent
              iconTitle={<BiSolidUserAccount size={40} />}
              title="User Lists" 
              iconAdd={<BsPersonAdd size={18} />} 
              AddTitle="Create User"
              handleDeleteMany={handleDelteManyUsers}
              columns={columns}
              // isLoading={isFetchingUser}
              data={dataTable}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setRowSelected(record._id);
                  },
                };
              }}
            />
          </div>
          <DrawerComponent
            title="Chi tiết người dùng"
            isOpen={isOpenDrawer}
            onClose={() => setIsOpenDawer(false)}
            width="60%"
            forceRender
          >
            <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                onFinish={onUpdateUser}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Name!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.name}
                    onChange={handleOnchangeDetails}
                    name="name"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.email}
                    onChange={handleOnchangeDetails}
                    name="email"
                  />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.phone}
                    onChange={handleOnchangeDetails}
                    name="phone"
                  />
                </Form.Item>

                <Form.Item
                  label="Admin"
                  name="isAdmin"
                  rules={[
                    {
                      required: true,
                      message: "Please input your isAdmin!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.isAdmin}
                    onChange={handleOnchangeDetails}
                    name="isAdmin"
                  />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your address!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateUserDetails.address}
                    onChange={handleOnchangeDetails}
                    name="address"
                  />
                </Form.Item>

                <Form.Item
                  label="Avatar"
                  name="avatar"
                  rules={[
                    {
                      required: true,
                      message: "Please input your avatar!",
                    },
                  ]}
                >
                  <Upload onChange={handleOnchangeAvatarDetails} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                    {stateUserDetails?.avatar && (
                      <Image
                        src={stateUserDetails?.avatar}
                        style={{
                          height: "60px",
                          width: "60px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginLeft: "10px",
                        }}
                        alt="avatar"
                      />
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 20,
                    span: 16,
                  }}
                >
                  <Button className="bg-[#FF642F] hover:bg-[#FF642F]" type="primary" htmlType="submit">
                    Apply
                  </Button>
                </Form.Item>
              </Form>
            </Loading>
          </DrawerComponent>
          <ModalComponent
            title="Xóa người dùng"
            open={isModalOpenDelete}
            onCancel={handleCancelDelete}
            onOk={handleDeleteUser}
          >
            <Loading isLoading={isLoadingDeleted}>
              <div>Bạn có chắc xóa tài khoản này không?</div>
            </Loading>
          </ModalComponent>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
