import React from "react";
import { useLocation, useNavigate } from "react-router";
import Loading from "../../components/LoadingComponent/Loading";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils/jsonString";
import { useSelector } from "react-redux";
const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate()
  const user = useSelector((state) => state.user);

  const handleMyOrder = () => {
    navigate('/myorder',{ state : {
      id: user?.id,
      token : user?.access_token
    }
  })
  }
  return (
    <div className="">
      <Loading isLoading={false}>
        <div className="container py-4">
          <div className="bg-white rounded-lg py-6 px-8 border-2">
            <div className="bg-[#FF642F] text-white w-[280px] flex items-center justify-center p-2 rounded-lg ">
              <p className="text-lg font-bold ">Đơn hàng đặt thành công</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="w-full">
                <div className="flex items-center my-4">
                  <div className="flex flex-col gap-2 border bg-[#222222] text-white py-4 px-10 rounded-lg font-medium">
                    <lable className="">Phương thức giao hàng</lable>
                    <div className="">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        {orderContant.delivery[state?.delivery]}
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border bg-[#222222] text-white py-4 px-10 rounded-lg font-medium ml-4">
                    <lable className="">Phương thức thanh toán</lable>

                    <div className="">
                      {orderContant.payment[state?.payment]}
                    </div>
                  </div>
                </div>
                <div className="">
                  {state.orders?.map((order) => {
                    return (
                      <div className="flex mb-6 gap-3 bg-[#faf6f1] py-3 px-6 rounded-lg" key={order?.name}>
                        <div
                          style={{
                            width: "500px",
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                          }}
                        >
                          <img
                            className="w-[60px] h-[60px] object-cover rounded-lg"
                            src={order.image}
                            style={{
                              width: "77px",
                              height: "79px",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                          <div
                            className="text-lg font-medium"
                            style={{
                              width: 260,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order?.name}
                          </div>
                        </div>
                        <div
                          className="justify-between"
                          style={{
flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span>
                            <p
                              className=" font-medium"
                              style={{ fontSize: "16px", color: "#242424" }}
                            >
                              Giá tiền: <span className="text-red-500">{convertPrice(order?.price)}</span>
                            </p>
                          </span>
                          <span>
                            <p
                            className="font-medium"
                              style={{ fontSize: "16px", color: "#242424" }}
                            >
                              Số lượng: <span className="text-red-500">{order?.amount}</span>
                            </p>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end ">
                  <span onClick={handleMyOrder} className="font-semibold bg-red-500 mr-4 p-4 text-lg text-white rounded-lg" >
                    Check Order
                  </span>
                  <span className="font-semibold bg-[#ffbc3e] p-4 text-lg text-white rounded-lg" >
                    Total: {convertPrice(state?.totalPriceMemo)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSuccess;
