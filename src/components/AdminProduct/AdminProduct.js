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
import * as ProductService from "../../services/ProductService";
import * as CategoryService from "../../services/CategoryService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../Drawer/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { BiSolidAddToQueue } from "react-icons/bi";
import { BsHouseAdd } from "react-icons/bs";
import TextArea from "antd/es/input/TextArea";
const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    newType: "",
    newCategory: "",
    discount: "",
    category: "",
    expenses: "",
  });
  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
      discount,
      category,
      expenses,
    } = data;

    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
      discount,
      category,
      expenses
    });
    return res;
  });

  const mutationCategory = useMutationHooks((data) => {
    const res = CategoryService.createCategory(data);
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, category, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { category, ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    const categoryDetail = await CategoryService.getDetailCategory(
      res?.data?.category
    );
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
        category: categoryDetail?.name,
        expenses: res?.data?.expenses
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDelteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };

  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataCategory,
    isLoading: isLoadingCategories,
    isSuccess: isSuccessCategory,
    isError: isErrorCategory,
  } = mutationCategory;
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
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const queryCategory = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });

  const { isLoading: isLoadingCategory, data: categories } = queryCategory;
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

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
          onClick={handleDetailsProduct}
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
      title: "Price",
      dataIndex: "price",
      // sorter: (a, b) => a.price - b.price,
      // filters: [
      //   {
      //     text: ">= 50",
      //     value: ">=",
      //   },
      //   {
      //     text: "<= 50",
      //     value: "<=",
      //   },
      // ],
      // onFilter: (value, record) => {
      //   if (value === ">=") {
      //     return record.price >= 50;
      //   }
      //   return record.price <= 50;
      // },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      // filters: [
      //   {
      //     text: ">= 3",
      //     value: ">=",
      //   },
      //   {
      //     text: "<= 3",
      //     value: "<=",
      //   },
      // ],
      // onFilter: (value, record) => {
      //   if (value === ">=") {
      //     return Number(record.rating) >= 3;
      //   }
      //   return Number(record.rating) <= 3;
      // },
    },
    {
      title: "Type",
      dataIndex: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      category: "",
      expenses:""
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
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
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
      category: "",
      expenses: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    let idCategory = "";

    categories?.map((category) => {
      if (category?.name === stateProduct.category) {
        idCategory = category?._id;
      }
    });
    console.log("idCategory", idCategory);
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type:
        stateProduct.type === "add-type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
      category: idCategory,
      expenses: stateProduct.expenses
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  console.log("stateProduct", stateProduct);

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetailsCategory = (value) => {
    // let idCategory = "";

    // categories?.map((category) => {
    //   if (category?.name === stateProductDetails?.category) {
    //     idCategory = category?._id;
    //   }
    // });
    // console.log('idCategory',idCategory);
    setStateProductDetails({
      ...stateProductDetails,
      category: value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };
  const onUpdateProduct = () => {
    categories?.map((category) => {
      if (category?.name === stateProductDetails.category) {
        mutationUpdate.mutate(
          {
            id: rowSelected,
            token: user?.access_token,
            ...stateProductDetails,
            category: category?._id,
          },
          {
            onSettled: () => {
              queryProduct.refetch();
            },
          }
        );
      }
    });
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  const handleChangeSelectCategory = (value) => {
    setStateProduct({
      ...stateProduct,
      category: value,
    });
  };
  const FormItem = Form.Item;
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
            iconTitle={<BiSolidAddToQueue size={40} />}
            title="Product Lists"
            iconAdd={<BsHouseAdd size={18} />}
            AddTitle="Create Product"
            IsShowModal={setIsModalOpen}
            handleDeleteMany={handleDelteManyProducts}
            columns={columns}
            data={dataTable}
            isLoading={isLoadingProducts}
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
          title="Tạo sản phẩm"
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
                  value={stateProduct.name}
                  onChange={handleOnchange}
                  name="name"
                />
              </FormItem>

              <FormItem
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input your type!",
                  },
                ]}
              >
                <Select
                  name="type"
                  // defaultValue="lucy"
                  style={{
                    width: "100%",
                  }}
                  value={stateProduct.type}
                  onChange={handleChangeSelect}
                  options={renderOptions(typeProduct.data)}
                />
              </FormItem>

              {stateProduct.type === "add-type" && (
                <Form.Item
                  label="New type"
                  name="newType"
                  rules={[
                    { required: true, message: "Please input your type!" },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.newType}
                    onChange={handleOnchange}
                    name="newType"
                  />
                </Form.Item>
              )}

              <FormItem
                label="count inStock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input your count inStock!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.countInStock}
                  onChange={handleOnchange}
                  name="countInStock"
                />
              </FormItem>

              <FormItem
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.price}
                  onChange={handleOnchange}
                  name="price"
                />
              </FormItem>

              <FormItem
                label="Expenses"
                name="expenses"
                rules={[
                  {
                    required: true,
                    message: "Please input your expenses!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.expenses}
                  onChange={handleOnchange}
                  name="expenses"
                />
              </FormItem>

              <FormItem
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <TextArea
                  value={stateProduct.description}
                  onChange={handleOnchange}
                  name="description"
                />
              </FormItem>

              <FormItem
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input your rating!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.rating}
                  onChange={handleOnchange}
                  name="rating"
                />
              </FormItem>

              <FormItem
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.discount}
                  onChange={handleOnchange}
                  name="discount"
                />
              </FormItem>

              {/* <FormItem
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input your category!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.category}
                  onChange={handleOnchange}
                  name="category"
                />
              </FormItem> */}

              <FormItem
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input your category!",
                  },
                ]}
              >
                <Select
                  name="category"
                  // defaultValue="lucy"
                  style={{
                    width: "100%",
                  }}
                  value={stateProduct.category}
                  onChange={handleChangeSelectCategory}
                  options={renderOptionsCategory(categories)}
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
                  {stateProduct.image && (
                    <Image
                      src={stateProduct.image}
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
                  value={stateProductDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </FormItem>

              <FormItem
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input your type!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.type}
                  onChange={handleOnchangeDetails}
                  name="type"
                />
              </FormItem>

              <FormItem
                label="Count inStock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input your Count inStock!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.countInStock}
                  onChange={handleOnchangeDetails}
                  name="countInStock"
                />
              </FormItem>

              <FormItem
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.price}
                  onChange={handleOnchangeDetails}
                  name="price"
                />
              </FormItem>

              <FormItem
                label="Expenses"
                name="expenses"
                rules={[
                  {
                    required: true,
                    message: "Please input your expenses!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.expenses}
                  onChange={handleOnchangeDetails}
                  name="expenses"
                />
              </FormItem>

              <FormItem
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <TextArea
                  value={stateProductDetails.description}
                  onChange={handleOnchangeDetails}
                  name="description"
                />
              </FormItem>

              <FormItem
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input your rating!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.rating}
                  onChange={handleOnchangeDetails}
                  name="rating"
                />
              </FormItem>

              <FormItem
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.discount}
                  onChange={handleOnchangeDetails}
                  name="discount"
                />
              </FormItem>

              {/* <FormItem
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input your category!",
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetails.category}
                  onChange={handleOnchangeDetailsCategory}
                  name="category"
                />
              </FormItem> */}

              <FormItem
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input your category!",
                  },
                ]}
              >
                <Select
                  name="category"
                  // defaultValue="lucy"
                  style={{
                    width: "100%",
                  }}
                  value={stateProductDetails.category}
                  onChange={handleOnchangeDetailsCategory}
                  options={renderOptionsCategory(categories)}
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
                  {stateProductDetails.image && (
                    <Image
                      src={stateProductDetails.image}
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
          title="Xóa sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
        >
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có chắc xóa sản phẩm này không?</div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  );
};

export default AdminProduct;
