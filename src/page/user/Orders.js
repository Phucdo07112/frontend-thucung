import { Checkbox, Form, InputNumber } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Banner from "../../components/Banner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlice";
import * as message from "../../components/Message/Message";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slides/userSlice";
import { useMutationHooks } from "../../hooks/useMutationHook";
import StepComponent from "../../components/Step/StepComponent";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { convertPrice } from "../../utils/jsonString";
import Loading from "../../components/LoadingComponent/Loading";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputHeader";
const Orders = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  console.log("order", order);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onChange = (e) => {
    console.log("listChecked", listChecked);
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleChangePetCount = (type, idPet, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idPet }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idPet }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      order?.orderPetItems?.forEach((item) => {
        newListChecked.push(item?.pet);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  // const priceDiscountMemo = useMemo(() => {
  //   const result = order?.orderItemsSlected?.reduce((total, cur) => {
  //     const totalDiscount = cur.discount ? cur.discount : 0;
  //     return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
  //   }, 0);
  //   if (Number(result)) {
  //     return result;
  //   }
  //   return 0;
  // }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (Number(priceMemo) >= 500000) {
      return 0;
    } else if (Number(priceMemo) >= 200000) {
      return 10000;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  console.log('diliveryPriceMemo',diliveryPriceMemo);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, diliveryPriceMemo]);

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleAddCard = () => {
    if (!order?.orderItemsSlected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const { isLoading, data } = mutationUpdate;

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "Free ship",
      description: "Trên 500.000 VND",
    },
  ];
  return (
    <div className="pb-10 bg-white">
      <Banner title="Cart" link="Home-cart" />
      <div className="container">
        <div className="flex items-end justify-end">
          <div className="my-4 flex items-center gap-4">
            <span className="text-lg font-semibold">Địa chỉ: </span>
            <span className="text-lg" style={{ fontWeight: "bold" }}>
              {`${user?.address} ${user?.city}`}{" "}
            </span>
            <button
              className="bg-[#ffbc3e] px-6 py-[14px] rounded-lg font-medium text-white"
              onClick={handleChangeAddress}
            >
              Thay đổi
            </button>
          </div>
        </div>
        <div className="max-w-[900px] mx-auto mt-8">
          <div className="">
            <StepComponent
              items={itemsDelivery}
              current={
                diliveryPriceMemo === 10000
                  ? 2
                  : diliveryPriceMemo === 20000
                  ? 1
                  : order.orderItemsSlected.length === 0
                  ? 0
                  : 3
              }
            />
          </div>
        </div>
        <div className="relative overflow-x-auto mt-10">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-lg font-semibold border-b">
                <th scope="col" className="px-6 py-3">
                  <Checkbox
                    onChange={handleOnchangeCheckAll}
                    checked={
                      listChecked?.length ===
                      order?.orderItems?.length + order?.orderPetItems?.length
                    }
                  ></Checkbox>
                  <span> Tất cả ({order?.orderItems?.length + order?.orderPetItems?.length} sản phẩm)</span>
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="flex items-center gap-3 px-6 py-3">
                  <p className="">Remove</p>
                  <DeleteOutlined
                    style={{ cursor: "pointer" }}
                    onClick={handleRemoveAllOrder}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems?.map((order) => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="flex items-center gap-3 px-6 py-4 font-semibold text-lg text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <Checkbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></Checkbox>
                      <img
                        className="w-[80px] h-[80px] object-cover rounded-full"
                        src={order?.image}
                        alt=""
                      />
                      <p>{order?.name}</p>
                    </th>
                    <td className="px-6 py-4">{convertPrice(order?.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 items-center w-[120px] border border-[#ccc] rounded-lg">
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          className="w-[30px] h-[30px]"
                          onClick={() =>
                            handleChangeCount(
                              "decrease",
                              order?.product,
                              order?.amount === 1
                            )
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                          />
                        </button>
                        <InputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInstock}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          className="w-[30px] h-[30px]"
                          onClick={() =>
                            handleChangeCount(
                              "increase",
                              order?.product,
                              order?.amount === order.countInstock,
                              order?.amount === 1
                            )
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {convertPrice(order?.price * order?.amount)}
                    </td>
                    <td className="px-6 py-4 text-center cursor-pointer">
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </td>
                  </tr>
                );
              })}

              {order?.orderPetItems?.map((order) => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="flex items-center gap-3 px-6 py-4 font-semibold text-lg text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <Checkbox
                        onChange={onChange}
                        value={order?.pet}
                        checked={listChecked.includes(order?.pet)}
                      ></Checkbox>
                      <img
                        className="w-[80px] h-[80px] object-cover rounded-full"
                        src={order?.image}
                        alt=""
                      />
                      <p>{order?.name}</p>
                    </th>
                    <td className="px-6 py-4">{convertPrice(order?.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 items-center w-[120px] border border-[#ccc] rounded-lg">
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          className="w-[30px] h-[30px]"
                          onClick={() =>
                            handleChangePetCount(
                              "decrease",
                              order?.pet,
                              order?.amount === 1
                            )
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                          />
                        </button>
                        <InputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInstock}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          className="w-[30px] h-[30px]"
                          onClick={() =>
                            handleChangePetCount(
                              "increase",
                              order?.pet,
                              order?.amount === order.countInstock,
                              order?.amount === 1
                            )
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {convertPrice(order?.price * order?.amount)}
                    </td>
                    <td className="px-6 py-4 text-center cursor-pointer">
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.pet)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-start mt-10">
          <div className="flex flex-1 items-center gap-4">
            <input
              className="bg-[#faf6f1] w-[300px] p-3 rounded-lg"
              placeholder="Enter coupon code"
            />
            <button className="bg-[#ffbc3e] px-9 py-[14px] rounded-full font-medium text-white">
              Apply coupon
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-end items-end">
            <div className="w-[200px] flex justify-between items-center">
              <h5 className="font-bold text-lg">Subtotal</h5>
              <p className="text-gray-500 font-semibold">
                {convertPrice(priceMemo)}
              </p>
            </div>
            <div className="w-[200px] flex justify-between items-center">
              <h5 className="font-bold text-lg">Shipping Cost</h5>
              <p className="text-gray-500 font-semibold">
                {convertPrice(diliveryPriceMemo)}
              </p>
            </div>
            <div className="w-[200px] flex justify-between items-center">
              <h5 className="font-bold text-lg">Total</h5>
              <p className="text-red-500 font-semibold">
                {convertPrice(totalPriceMemo)}
              </p>
            </div>
            <span style={{ color: "#000", fontSize: "11px" }}>
              (Đã bao gồm VAT nếu có)
            </span>
            <div className="flex gap-2 items-center mt-4">
              <button className="bg-[#222222] px-9 py-[14px] rounded-full font-medium text-white">
                Update
              </button>
              <button
                className="bg-[#ff642f] px-9 py-[14px] rounded-full font-medium text-white"
                onClick={handleAddCard}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your  phone!" }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your  address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default Orders;
