import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Upload, Image, Space, Select } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputHeader";
import {
  getBase64,
  renderOptions,
  renderOptionsCategory,
} from "../../utils/jsonString";
import * as CategoryService from "../../services/CategoryService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../Drawer/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
const AdminCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    sect: "",
    image: "",
  });
  const [stateCategory, setStateCategory] = useState(inittial());
  const [stateCategoryDetails, setStateCategoryDetails] = useState(inittial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const { token, name,sect, image } = data;
    const res = CategoryService.createCategory(token, { name,sect, image });
    return res;
  });

  // const mutationCategory = useMutationHooks((data) => {
  //   const res = CategoryService.createCategory(data);
  //   return res;
  // });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, name,sect, image, token } = data;
    const res = CategoryService.updateCategory(id, token, { name,sect, image });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = CategoryService.deleteCategory(id, token);
    return res;
  });

  //   const mutationDeletedMany = useMutationHooks((data) => {
  //     const { token, ...ids } = data;
  //     const res = ProductService.deleteManyProduct(ids, token);
  //     return res;
  //   });

  const fetchGetDetailsCategory = async (rowSelected) => {
    const res = await CategoryService.getDetailCategory(rowSelected);
    if (res) {
      setStateCategoryDetails({
        name: res?.name,
        sect: res?.sect,
        image: res?.image,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateCategoryDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateCategoryDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsCategory(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsCategory = () => {
    setIsOpenDrawer(true);
  };

  // const handleDelteManyProducts = (ids) => {
  //   mutationDeletedMany.mutate(
  //     { ids: ids, token: user?.access_token },
  //     {
  //       onSettled: () => {
  //         queryProduct.refetch();
  //       },
  //     }
  //   );
  // };

  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;
  // const {
  //   data: dataCategory,
  //   isLoading: isLoadingCategories,
  //   isSuccess: isSuccessCategory,
  //   isError: isErrorCategory,
  // } = mutationCategory;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const queryCategory = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });

  const { isLoading: isLoadingCategory, data: categories } = queryCategory;

  const renderImage = (image) => {
    return (
      <div>
        <img className="w-[60px] h-[60px] rounded-lg object-cover" src={image} alt="" />
      </div>
    );
  }

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
          onClick={handleDetailsCategory}
        />
      </div>
    );
  };

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
          color: filtered ? "#1890ff" : undefined,
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
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Image",
      dataIndex: "image",
      render: renderImage,
    },
    {
      title: "Sect",
      dataIndex: "sect",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    categories?.length &&
    categories?.map((product) => {
      return { ...product, key: product._id };
    });

  useEffect(() => {
    if (isSuccess && data) {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  // useEffect(() => {
  //   if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
  //     message.success();
  //   } else if (isErrorDeletedMany) {
  //     message.error();
  //   }
  // }, [isSuccessDelectedMany]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted) {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateCategoryDetails({
      name: "",
      image: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated) {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryCategory.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCategory({
      name: "",
      sect: "", 
      image: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      token: user?.access_token,
      name: stateCategory.name,
      sect: stateCategory.sect,
      image: stateCategory.image,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryCategory.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateCategory({
      ...stateCategory,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateCategoryDetails({
      ...stateCategoryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetailsCategory = (e) => {
    queryCategory?.data?.map((category) => {
      if (category.name === e.target.value) {
        console.log("category._id", category._id);
        return setStateCategoryDetails({
          ...stateCategoryDetails,
          category: category._id,
        });
      }
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateCategory({
      ...stateCategory,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateCategoryDetails({
      ...stateCategoryDetails,
      image: file.preview,
    });
  };
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateCategoryDetails },
      {
        onSettled: () => {
          queryCategory.refetch();
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setStateCategory({
      ...stateCategory,
      type: value,
    });
  };
  const handleChangeSelectCategory = (value) => {
    console.log("value", value);
    setStateCategory({
      ...stateCategory,
      category: value,
    });
  };

  const FormItem = Form.Item;

  console.log("stateCategoryDetails", stateCategoryDetails);
  return (
    <div className="text-[#2C3B54]">
      <div>
        {/* <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "40px" }} />
        </Button> */}
        <div style={{ marginTop: "20px" }}>
          <TableComponent
            iconTitle={<BiSolidCategoryAlt size={40} />}
            title="Category Lists"
            iconAdd={<MdCategory size={18} />}
            AddTitle="Create Category"
            IsShowModal={setIsModalOpen}
            // handleDeleteMany={handleDelteManyProducts}
            columns={columns}
            data={dataTable}
            isLoading={isLoadingCategory}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id);
                }, // click row
              };
            }}
          />
        </div>
        <ModalComponent
          forceRender
          title="Tạo danh mục"
          open={isModalOpen}
          onCancel={handleCancel}
          // okButtonProps={{ style: { display: 'none' } }}
          onOk={onFinish}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              // onFinish={onFinish}
              autoComplete="on"
              form={form}
            >
              <FormItem
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
                  value={stateCategory.name}
                  onChange={handleOnchange}
                  name="name"
                />
              </FormItem>

              <FormItem
                label="Sect"
                name="sect"
                rules={[
                  {
                    required: true,
                    message: "Please input your sect!",
                  },
                ]}
              >
                <InputComponent
                  value={stateCategory.sect}
                  onChange={handleOnchange}
                  name="sect"
                />
              </FormItem>

              <FormItem
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please input your image!",
                  },
                ]}
              >
                <Upload onChange={handleOnchangeAvatar} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                  {stateCategory.image && (
                    <Image
                      src={stateCategory.image}
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
              </FormItem>

              <FormItem
                wrapperCol={{
                  offset: 20,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </FormItem>
            </Form>
          </Loading>
        </ModalComponent>
        <DrawerComponent
          forceRender
          title="Chi tiết sản phẩm"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="60%"
        >
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
            <Form
              name="basicccc"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={onUpdateProduct}
              autoComplete="on"
              form={form}
            >
              <FormItem
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
                  value={stateCategoryDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </FormItem>

              <FormItem
                label="Sect"
                name="sect"
                rules={[
                  {
                    required: true,
                    message: "Please input your sect!",
                  },
                ]}
              >
                <InputComponent
                  value={stateCategoryDetails.sect}
                  onChange={handleOnchangeDetails}
                  name="sect"
                />
              </FormItem>

              <FormItem
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please input your image!",
                  },
                ]}
              >
                <Upload onChange={handleOnchangeAvatarDetails} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                  {stateCategoryDetails.image && (
                    <Image
                      src={stateCategoryDetails.image}
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
              </FormItem>

              <FormItem
                wrapperCol={{
                  offset: 20,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Apply
                </Button>
              </FormItem>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent
          title="Xóa danh mục"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
        >
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có chắc xóa Danh mục này không?</div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  );
};

export default AdminCategory;
