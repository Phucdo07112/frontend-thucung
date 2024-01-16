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
import * as PetsService from "../../services/PetsService";
import * as CategoryService from "../../services/CategoryService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../Drawer/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { GiDogHouse } from "react-icons/gi";
import { LuDog } from "react-icons/lu";
import TextArea from "antd/es/input/TextArea";
const AdminPet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    age: "",
    breed: "",
    color: "",
    description: "",
    rating: "",
    category: "",
    price: "",
    newType: "",
    type: "",
    image: "",
    discount: "",
    countInStock: "",
    expenses: ""
    // additionalImages: additionalImagesPaths,
  });
  const [statePet, setStatePet] = useState(inittial());
  const [statePetDetails, setStatePetDetails] = useState(inittial());
  console.log('statePetDetails',statePetDetails);
  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      age,
      breed,
      color,
      description,
      rating,
      category,
      price,
      type,
      image,
      discount,
      countInStock,
      expenses,
    } = data;

    const res = PetsService.createPets({
      name,
      age,
      breed,
      color,
      description,
      rating,
      category,
      price,
      type,
      image,
      discount,
      countInStock,
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
    const res = PetsService.updatePets(id, token, { category, ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = PetsService.deletePets(id, token);
    return res;
  });

  // const mutationDeletedMany = useMutationHooks((data) => {
  //   const { token, ...ids } = data;
  //   const res = petservice.deleteManyProduct(ids, token);
  //   return res;
  // });

  const getAllpets = async () => {
    const res = await PetsService.getAllPets();
    return res;
  };

  const fetchGetDetailsPet = async (rowSelected) => {
    const res = await PetsService.getDetailsPets(rowSelected);
    const categoryDetail = await CategoryService.getDetailCategory(
      res?.data?.category
    );
    if (res?.data) {
      setStatePetDetails({
        name: res?.data?.name,
        age: res?.data?.age,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: statePetDetails.type === "add-type" ? statePetDetails.newType : res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
        category: categoryDetail?.name,
        breed: res?.data?.breed,
        color: res?.data?.color,
        expenses: res?.data?.expenses
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(statePetDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, statePetDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsPet(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  // const handleDelteManypets = (ids) => {
  //   mutationDeletedMany.mutate(
  //     { ids: ids, token: user?.access_token },
  //     {
  //       onSettled: () => {
  //         queryPet.refetch();
  //       },
  //     }
  //   );
  // };

  const fetchAlltypePet = async () => {
    const res = await PetsService.getAllTypePets();
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
  // const {
  //   data: dataDeletedMany,
  //   isLoading: isLoadingDeletedMany,
  //   isSuccess: isSuccessDelectedMany,
  //   isError: isErrorDeletedMany,
  // } = mutationDeletedMany;

  const queryPet = useQuery({
    queryKey: ["pets"],
    queryFn: getAllpets,
  });
  const typePet = useQuery({
    queryKey: ["type-pets"],
    queryFn: fetchAlltypePet,
  });
  const queryCategory = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });

  const { isLoading: isLoadingCategory, data: categories } = queryCategory;
  const { isLoading: isLoadingpets, data: pets } = queryPet;

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
    pets?.data?.length &&
    pets?.data?.map((product) => {
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

  // useEffect(() => {
  //   if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
  //     message.success();
  //   } else if (isErrorDeletedMany) {
  //     message.error();
  //   }
  // }, [isSuccessDelectedMany]);

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
    setStatePetDetails({
      name: "",
      age: "",
      breed: "",
      color: "",
      description: "",
      rating: "",
      category: "",
      price: "",
      type: "",
      image: "",
      discount: "",
      countInStock: "",
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
          queryPet.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStatePet({
      name: "",
      age: "",
      breed: "",
      color: "",
      description: "",
      rating: "",
      category: "",
      price: "",
      type: "",
      image: "",
      discount: "",
      countInStock: "",
      expenses:""
    });
    form.resetFields();
  };

  const onFinish = () => {
    let idCategory = "";

    categories?.map((category) => {
      if (category?.name === statePet.category) {
        idCategory = category?._id;
      }
    });
    console.log("idCategory", idCategory);
    const params = {
      name: statePet.name,
      price: statePet.price,
      description: statePet.description,
      rating: statePet.rating,
      image: statePet.image,
      type: statePet.type === "add-type" ? statePet.newType : statePet.type,
      countInStock: statePet.countInStock,
      discount: statePet.discount,
      category: idCategory,
      age: statePet.age,
      breed: statePet.breed,
      color: statePet.color,
      expenses: statePet.expenses
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryPet.refetch();
      },
    });
  };
  console.log("statePetDetails", statePetDetails);

  const handleOnchange = (e) => {
    setStatePet({
      ...statePet,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleOnchangeDetails = (e) => {
    setStatePetDetails({
      ...statePetDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetailsCategory = (value) => {
    // let idCategory = "";

    // categories?.map((category) => {
    //   if (category?.name === statePetDetails?.category) {
    //     idCategory = category?._id;
    //   }
    // });
    // console.log('idCategory',idCategory);
    setStatePetDetails({
      ...statePetDetails,
      category: value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStatePet({
      ...statePet,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStatePetDetails({
      ...statePetDetails,
      image: file.preview,
    });
  };
  const onUpdateProduct = () => {
    categories?.map((category) => {
      if (category?.name === statePetDetails.category) {
        mutationUpdate.mutate(
          {
            id: rowSelected,
            token: user?.access_token,
            ...statePetDetails,
            category: category?._id,
            type: statePetDetails.newType
          },
          {
            onSettled: () => {
              queryPet.refetch();
            },
          }
        );
      }
    });
  };

  const handleChangeSelect = (value) => {
    setStatePet({
      ...statePet,
      type: value,
    });
  };

  const handleChangeSelectDetail = (value) => {
    setStatePetDetails({
      ...statePetDetails,
      type: value,
    });
  };

  const handleChangeSelectCategory = (value) => {
    setStatePet({
      ...statePet,
      category: value,
    });
  };
  const FormItem = Form.Item;
  return (
    <div className="text-[#2C3B54]">
      <div>
        <div style={{ marginTop: "20px" }}>
          <TableComponent
            iconTitle={<GiDogHouse size={40} />}
            title="Pet Lists"
            iconAdd={<LuDog size={18} />}
            AddTitle="Create Pet"
            IsShowModal={setIsModalOpen}
            // handleDeleteMany={handleDelteManypets}
            columns={columns}
            data={dataTable}
            isLoading={isLoadingpets}
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
                  value={statePet.name}
                  onChange={handleOnchange}
                  name="name"
                />
              </FormItem>

              <FormItem
                label="Age"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "Please input your age!",
                  },
                ]}
              >
                <InputComponent
                  value={statePet.age}
                  onChange={handleOnchange}
                  name="age"
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
                  value={statePet.type}
                  onChange={handleChangeSelect}
                  options={renderOptions(typePet?.data)}
                />
              </FormItem>

              {statePet.type === "add-type" && (
                <Form.Item
                  label="New type"
                  name="newType"
                  rules={[
                    { required: true, message: "Please input your type!" },
                  ]}
                >
                  <InputComponent
                    value={statePet.newType}
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
                  value={statePet.countInStock}
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
                  value={statePet.price}
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
                  value={statePet.expenses}
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
                  value={statePet.description}
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
                  value={statePet.rating}
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
                  value={statePet.discount}
                  onChange={handleOnchange}
                  name="discount"
                />
              </FormItem>

              <FormItem
                label="Breed"
                name="breed"
                rules={[
                  {
                    required: true,
                    message: "Please input your breed!",
                  },
                ]}
              >
                <InputComponent
                  value={statePet.breed}
                  onChange={handleOnchange}
                  name="breed"
                />
              </FormItem>

              <FormItem
                label="Color"
                name="color"
                rules={[
                  {
                    required: true,
                    message: "Please input your color!",
                  },
                ]}
              >
                <InputComponent
                  value={statePet.color}
                  onChange={handleOnchange}
                  name="color"
                />
              </FormItem>

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
                  value={statePet.category}
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
                  {statePet.image && (
                    <Image
                      src={statePet.image}
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
                  value={statePetDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </FormItem>

              <FormItem
                label="Age"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "Please input your age!",
                  },
                ]}
              >
                <InputComponent
                  value={statePetDetails.age}
                  onChange={handleOnchangeDetails}
                  name="age"
                />
              </FormItem>

              <FormItem
                label="Breed"
                name="breed"
                rules={[
                  {
                    required: true,
                    message: "Please input your breed!",
                  },
                ]}
              >
                <InputComponent
                  value={statePetDetails.breed}
                  onChange={handleOnchangeDetails}
                  name="breed"
                />
              </FormItem>

              <FormItem
                label="Color"
                name="color"
                rules={[
                  {
                    required: true,
                    message: "Please input your color!",
                  },
                ]}
              >
                <InputComponent
                  value={statePetDetails.color}
                  onChange={handleOnchangeDetails}
                  name="color"
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
                  value={statePetDetails.type}
                  onChange={handleChangeSelectDetail}
                  options={renderOptions(typePet?.data)}
                />
              </FormItem>

              {statePetDetails.type === "add-type" && (
                <Form.Item
                  label="New type"
                  name="newType"
                  rules={[
                    { required: true, message: "Please input your type!" },
                  ]}
                >
                  <InputComponent
                    value={statePetDetails.newType}
                    onChange={handleOnchangeDetails}
                    name="newType"
                  />
                </Form.Item>
              )}

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
                  value={statePetDetails.countInStock}
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
                  value={statePetDetails.price}
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
                  value={statePetDetails.expenses}
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
                  value={statePetDetails.description}
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
                  value={statePetDetails.rating}
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
                  value={statePetDetails.discount}
                  onChange={handleOnchangeDetails}
                  name="discount"
                />
              </FormItem>


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
                  value={statePetDetails.category}
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
                  {statePetDetails.image && (
                    <Image
                      src={statePetDetails.image}
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
          title="Xóa Thú Cưng"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
        >
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có chắc xóa Thú Cưng này không?</div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  );
};

export default AdminPet;
