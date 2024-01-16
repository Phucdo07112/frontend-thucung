import React from "react";
import Loading from "../components/LoadingComponent/Loading";
import { convertPrice } from "../utils/jsonString";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../contant";
import { useMemo } from "react";
const DetailOrder = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const navigate = useNavigate()

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };
  const queryOrder = useQuery(
    { queryKey: ["orders-details"], queryFn: fetchDetailsOrder },
    {
      enabled: id,
    }
  );
  const { isLoading, data } = queryOrder;


  const renderProduct = (order) => {
  console.log('order',order);
    return (
      <div
        className="flex items-center p-3 bg-[#faf6f1] mt-2 rounded-lg"
        key={order?._id}
      >
        <img
          className="rounded-lg"
          src={order?.image}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            border: "1px solid rgb(238, 238, 238)",
            padding: "2px",
          }}
          alt=""
        />
        <div
          style={{
            width: 260,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginLeft: "10px",
          }}
        >
          {order?.name}
        </div>

        <div
          style={{
            width: 260,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginLeft: "10px",
          }}
        >
          Số lượng: {order?.amount}
        </div>
        
        <span
          style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
        >
          {convertPrice(order?.price)}
        </span>
      </div>
    );
  };

  const handleReviews = (id, router) => {
    navigate(`/${router}/${id}`)
  }

  return (
    <Loading isLoading={false}>
      <div className=" py-5">
        <div className="container">
          <div className="bg-[#FF642F] text-white w-[280px] flex items-center justify-center p-2 rounded-lg mb-8">
            <p className="text-lg font-bold ">Đơn hàng Chi Tiết</p>
          </div>
          <div className="flex gap-5">
            <div className="">
              <div className="flex items-center gap-5 h-[120px]">
                <div className="p-4 bg-black h-full rounded-lg text-white font-bold flex flex-col gap-2 border-blue-700 border-4">
                  <div>Địa chỉ người nhận</div>
                  <div className="flex flex-col gap-2">
                    <div className="name-info">
                      {data?.shippingAddress?.fullName}
                    </div>
                    <div className="address-info">
                      <span>Địa chỉ: </span>{" "}
                      {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                    </div>
                    <div className="phone-info">
                      <span>Điện thoại: </span> {data?.shippingAddress?.phone}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-black h-full rounded-lg text-white font-bold flex flex-col gap-2 border-blue-700 border-4">
                  <div>Hình thức giao hàng</div>
                  <div className="flex flex-col gap-2">
                    <div className="delivery-info">
                      <span className="name-delivery">FAST </span>Giao hàng tiết
                      kiệm
                    </div>
                    <div className="delivery-fee">
                      <span>Phí giao hàng: </span> {data?.shippingPrice}
                    </div>
                    <div className="delivery-fee">
                      <span>Trạng Thái: </span> {data?.isDelivered}
                    
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-black h-full rounded-lg text-white font-bold flex flex-col gap-2 border-blue-700 border-4">
                  <div>Hình thức thanh toán</div>
                  <div className="flex flex-col gap-2">
                    <div className="payment-info">
                      {orderContant.payment[data?.paymentMethod]}
                    </div>
                    <div className="status-payment">
                      {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {data?.orderPetItems?.map((order, index) => {
                  return (
                    <div className="relative">
                      {order?.isDelivered === "Hủy Đơn Hàng" ? (
                        <div
                          // onClick={() => handleCanceOrder(order)}
                          className="absolute top-7 z-10 cursor-pointer right-10"
                        >
                          {/* <IoIosCloseCircle size={25} color="red"/> */}
                        </div>
                      ) : (
                        ""
                      )}
                      <div
                        className={`border-2 bg-white my-3 p-5 rounded-lg ${
                          order?.isDelivered === "Hủy Đơn Hàng"
                            ? "opacity-40"
                            : ""
                        }`}
                        key={order?._id}
                      >
                        {order && renderProduct(order)}
                        <div className="flex items-end flex-col gap-2 mt-2">
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              className={`bg-[#ffbc3e] px-6 py-[14px] rounded-lg font-medium text-white ${data?.isDelivered === "Đơn Hàng Đã Hoàn Thành" ? "" : "opacity-60"}`}
                              onClick={() => handleReviews(order?.pet, "petDetails")}
                              disabled={
                                data?.isDelivered === "Đơn Hàng Đã Hoàn Thành"
                                  ? false
                                  : true
                              }
                            >
                              Đến Đánh Giá Sản Phẩm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {data?.orderItems?.map((order, index) => {
                  return (
                    <div className="relative">
                      {order?.isDelivered === "Hủy Đơn Hàng" ? (
                        <div
                          // onClick={() => handleCanceOrder(order)}
                          className="absolute top-7 z-10 cursor-pointer right-10"
                        >
                          {/* <IoIosCloseCircle size={25} color="red"/> */}
                        </div>
                      ) : (
                        ""
                      )}
                      <div
                        className={`border-2 bg-white my-3 p-5 rounded-lg `}
                        key={order?._id}
                      >
                        {order && renderProduct(order)}
                        <div className="flex items-end flex-col gap-2 mt-2">
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              className={`bg-[#ffbc3e] px-6 py-[14px] rounded-lg font-medium text-white ${data?.isDelivered === "Đơn Hàng Đã Hoàn Thành" ? "" : "opacity-60"}`}
                              onClick={() => handleReviews(order?.product, "productDetails")}
                              disabled={
                                data?.isDelivered === "Đơn Hàng Đã Hoàn Thành"
                                  ? false
                                  : true
                              }
                            >
                              Đến Đánh Giá Sản Phẩm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white flex-1 h-[310px] rounded-lg border-2 p-4 flex items-center justify-center">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-[200px] flex justify-between items-center">
                  <h5 className="font-bold text-lg">Tổng phụ</h5>
                  <p className="text-gray-500 font-semibold">
                    {convertPrice(data?.totalPrice - data?.shippingPrice)}
                  </p>
                </div>
                <div className="w-[200px] flex justify-between items-center">
                  <h5 className="font-bold text-lg">Giá vận chuyển</h5>
                  <p className="text-gray-500 font-semibold">
                    {convertPrice(data?.shippingPrice)}
                  </p>
                </div>
                <div className="w-[200px] flex justify-between items-center">
                  <h5 className="font-bold text-lg">Tổng</h5>
                  <p className="text-red-500 font-semibold">
                    {convertPrice(data?.totalPrice)}
                  </p>
                </div>
                <span style={{ color: "#000", fontSize: "11px" }}>
                  (Đã bao gồm VAT nếu có)
                </span>
                <div className="flex gap-2 items-center mt-4">
                  <button className="bg-[#ff642f] px-9 py-[14px] rounded-full font-medium text-white">
                    Về Trang Chủ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default DetailOrder;
