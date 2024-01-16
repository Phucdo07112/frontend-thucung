import { Form, Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useMutationHooks } from "../hooks/useMutationHook";
import { removeAllOrderProduct } from "../redux/slides/orderSlice";
import { updateUser } from "../redux/slides/userSlice";
import * as message from "../components/Message/Message";
import * as UserService from "../services/UserService";
import * as OrderService from "../services/OrderService";
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from "../services/PaymentService";
import Loading from "../components/LoadingComponent/Loading";
import ModalComponent from "../components/ModalComponent/ModalComponent";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import InputComponent from "../components/InputComponent/InputHeader";

import { convertPrice } from "../utils/jsonString";

const Payment = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

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

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo)  + Number(diliveryPriceMemo)
    );
  }, [priceMemo, diliveryPriceMemo]);

  const handleAddOrder = () => {
    const orderItems = []
    const orderPetItems = []
    order?.orderItemsSlected.map((orders) => {
      if(orders?.product) {
        orderItems.push(orders)
      } else if(orders?.pet) {
        orderPetItems.push(orders)
      }
    })
    console.log('orders',orderPetItems,orderItems);
    if (
      user?.access_token &&
      order?.orderItemsSlected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: orderItems,
        orderPetItems: orderPetItems,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { isLoading, data } = mutationUpdate;
  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSlected?.forEach((element) => {
        arrayOrdered.push(element.product);
        arrayOrdered.push(element.pet);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSlected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

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

  const onSuccessPaypal = (details, data) => {
    const orderItems = []
    const orderPetItems = []
    order?.orderItemsSlected.map((orders) => {
      if(orders?.product) {
        orderItems.push(orders)
      } else if(orders?.pet) {
        orderPetItems.push(orders)
      }
    })
    console.log('orders',orderPetItems,orderItems);
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: orderItems,
      orderPetItems: orderPetItems,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    });
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
  const handleDilivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);
  console.log("sdkReady", sdkReady);
  return (
    <div className="">
      <Loading isLoading={isLoadingAddOrder}>
        <div className="max-w-[1000px] mx-auto py-4">
          <div className="bg-white rounded-lg py-4 px-8 border-2">
            <div className="flex items-center justify-between">
              <div className="bg-[#FF642F] text-white w-[280px] flex items-center justify-center p-2 rounded-lg ">
                <p className="text-lg font-bold ">Thanh Toán</p>
              </div>
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
            <div className="flex justify-between gap-[100px] mt-4">
              <div className="">
                <div className="">
                  <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold">
                      Chọn phương thức giao hàng:
                    </label>
                    <Radio.Group
                      className=""
                      onChange={handleDilivery}
                      value={delivery}
                    >
                      <Radio value="fast">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          FAST
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </Radio>
                      <Radio value="gojek">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          GO_JEK
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col gap-2">
                    <lable className="text-lg font-semibold">
                      Chọn phương thức thanh toán:
                    </lable>
                    <Radio.Group
                      className=""
                      onChange={handlePayment}
                      value={payment}
                    >
                      <Radio value="later_money">
                        {" "}
                        Thanh toán tiền mặt khi nhận hàng
                      </Radio>
                      <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div style={{ width: "100%" }}>
                  <div className="flex items-start">
                    <div className="flex-1 flex flex-col justify-end items-end">
                      <div className="w-full flex justify-between items-center">
                        <h5 className="font-bold text-lg">Subtotal</h5>
                        <p className="text-gray-500 font-semibold">
                          {convertPrice(priceMemo)}
                        </p>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <h5 className="font-bold text-lg">Shipping Cost</h5>
                        <p className="text-gray-500 font-semibold">
                          {convertPrice(diliveryPriceMemo)}
                        </p>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <h5 className="font-bold text-lg">Total</h5>
                        <p className="text-red-500 font-semibold">
                          {convertPrice(totalPriceMemo)}
                        </p>
                      </div>
                      <span style={{ color: "#000", fontSize: "11px" }}>
                        (Đã bao gồm VAT nếu có)
                      </span>
                      <div className="flex gap-2 items-center mt-4">
                        {payment === "paypal" && sdkReady ? (
                          <div style={{ width: "320px" }}>
                            <div>
                              <PayPalButton
                                amount="0.01"
                                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                onSuccess={onSuccessPaypal}
                                onError={() => {
                                  alert("Error");
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            className="bg-[#ff642f] px-9 py-[14px] rounded-lg font-medium text-white"
                            onClick={() => handleAddOrder()}
                          >
                            Đặt Hàng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
                rules={[
                  { required: true, message: "Please input your  phone!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Adress"
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
      </Loading>
    </div>
  );
};

export default Payment;
