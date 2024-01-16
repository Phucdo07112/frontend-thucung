import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { InputNumber, Rate } from "antd";
import { BsFacebook, BsTwitter, BsInstagram } from "react-icons/bs";
import { FaPinterestP } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import * as PetsService from "../services/PetsService";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderPet,
  addOrderProduct,
  resetOrder,
} from "../redux/slides/orderSlice";
import * as message from "../components/Message/Message";
import * as ReviewService from "../services/ReviewService";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { convertPrice } from "../utils/jsonString";
import { useMutationHooks } from "../hooks/useMutationHook";
import { RiDeleteBinLine } from "react-icons/ri";
const desc = ["Rất Tệ", "Tệ", "Bình Thường", "Tốt", "Rất Tốt"];
const PetDetails = () => {
  const { productId } = useParams();
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [rate, setRate] = useState(5);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const getDetailPet = async (context) => {
    const id = context.queryKey && context.queryKey[1];
    const res = await PetsService.getDetailsPets(id);
    return res;
  };

  const mutation = useMutationHooks((data) => {
    const res = ReviewService.createReview({ ...data });
    return res;
  });
  const mutationDeletedReview = useMutationHooks((data) => {
    const { id } = data;
    const res = ReviewService.deleteReview(id);
    return res;
  });
  const queryDetailPet = useQuery({
    queryKey: ["pet-detail", productId],
    queryFn: getDetailPet,
  });

  const { isLoading: isLoadingPet, data: petDetail } = queryDetailPet;

  const { data: reviewData, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeletedReview;
  const pet = petDetail?.data;

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === petDetail?.data?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
      (!orderRedux && petDetail?.data?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (petDetail?.data?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  useEffect(() => {
    if (order.isSucessOrder) {
      message.success("Đã thêm vào giỏ hàng");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSucessOrder]);

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/login", { state: location?.pathname });
    } else {
      // {
      //     name: { type: String, required: true },
      //     amount: { type: Number, required: true },
      //     image: { type: String, required: true },
      //     price: { type: Number, required: true },
      //     product: {
      //         type: mongoose.Schema.Types.ObjectId,
      //         ref: 'Product',
      //         required: true,
      //     },
      // },
      const orderRedux = order?.orderItems?.find(
        (item) => item?.product === petDetail?.data?._id
      );
      console.log("orderRedux", petDetail?.data);
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && petDetail?.data?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderPetItem: {
              name: petDetail?.data?.name,
              amount: numProduct,
              image: petDetail?.data?.image,
              price: petDetail?.data?.price,
              pet: petDetail?.data?._id,
              discount: petDetail?.data?.discount,
              countInstock: petDetail?.data?.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const handleReview = (e) => {
    e.preventDefault();

    const params = {
      userId: user?.id,
      username: username,
      email: email,
      image: user?.avatar,
      reviewText: comment,
      rating: rate,
      pet: pet?._id,
    };
    setComment("");
    mutation.mutate(params, {
      onSettled: () => {
        queryDetailPet.refetch();
      },
    });
  };

  const handleOnChangUserName = (e) => {
    setUsername(e.target.value);
  };

  const handleOnChangComment = (e) => {
    setComment(e.target.value);
  };

  const handleOnChangEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleDeleteReview = (id, userId) => {
    if (user?.id === userId) {
      mutationDeletedReview.mutate(
        { id: id },
        {
          onSettled: () => {
            queryDetailPet.refetch();
          },
        }
      );
    }
  };

  console.log("petDetail?.reviews", petDetail?.reviews);
  return (
    <div className="pb-10 bg-white">
      <Banner title="ProductDetails" link="Home / ProductDetails" />
      <div className="container">
        {petDetail?.data && (
          <div className="flex gap-5 pt-8" key={petDetail?.data?._id}>
            <div className="flex-1 bg-[#FAF7F2] p-6 rounded-lg h-[570px]">
              <img
                className="rounded-lg h-[520px] w-full object-cover"
                src={petDetail?.data?.image}
                alt=""
              />
            </div>
            <div className="flex-1">
              <div className="flex items-end gap-6">
                <h3 className="text-[40px] font-bold text-gray-700 space-">
                  {petDetail?.data?.name}
                </h3>
                <p className="font-bold text-[21px] text-red-500">
                  {convertPrice(Number(petDetail?.data?.price))}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-5 mb-5">
                <Rate disabled defaultValue={`${petDetail?.data?.rating}`} />
                <p className="font-medium text-gray-500">2 Customer Reviews</p>
              </div>
              <hr />
              <p className="font-medium text-gray-500 my-3 text-[17px] leading-6">
                {petDetail?.data?.description}
              </p>
              <p className="font-medium text-gray-500 text-[17px] pt-11 ">
                REF. 4231/406
              </p>
              <p className="font-medium text-gray-500 mt-2  text-[17px]">
                Avallable in store
              </p>
              <div className="flex items-center gap-5 my-11">
                <h6 className="text-lg font-bold text-gray-700">
                  Choose quantity
                </h6>
                <div className="flex gap-1 items-center w-[120px] border border-[#ccc] rounded-lg">
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    className="w-[30px] h-[30px]"
                    onClick={() =>
                      handleChangeCount("decrease", numProduct === 1)
                    }
                  >
                    <MinusOutlined
                      style={{ color: "#000", fontSize: "20px" }}
                    />
                  </button>
                  <InputNumber
                    style={{
                      borderTop: "none",
                      borderBottom: "none",
                      width: "40px",
                    }}
                    className="flex-1 "
                    defaultValue={1}
                    min={1}
                    max={petDetail?.data?.countInStock}
                    onChange={onChange}
                    value={numProduct}
                    size="small"
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
                        numProduct === petDetail?.data?.countInStock
                      )
                    }
                  >
                    <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="bg-[#ff642f] px-11 py-[17px] rounded-full font-medium text-white"
                  onClick={handleAddOrderProduct}
                >
                  Add to cart
                </button>
                <button className="bg-[#ffbc3e] px-11 py-[17px] rounded-full font-medium text-white">
                  Add to wishfist
                </button>
              </div>
              {errorLimitOrder && (
                <div style={{ color: "red" }}>San pham het hang</div>
              )}
              <div className="flex items-center gap-4 mt-11">
                <p className="text-lg font-bold text-gray-700">
                  Share with friends
                </p>
                <div className="flex items-center gap-2">
                  <div className="transition duration-300 ease-in-out flex items-center justify-center bg-[#FAF7F2] hover:bg-[#0866FF] p-4 text-[18px] rounded-full hover:text-white cursor-pointer">
                    <BsFacebook />
                  </div>
                  <div className="transition duration-300 ease-in-out flex items-center justify-center bg-[#FAF7F2] hover:bg-[#1D9BF0] p-4 text-[18px] rounded-full hover:text-white cursor-pointer">
                    <BsTwitter />
                  </div>
                  <div className="transition duration-300 ease-in-out flex items-center justify-center bg-[#FAF7F2] hover:bg-[#CD3058] p-4 text-[18px] rounded-full hover:text-white cursor-pointer">
                    <BsInstagram />
                  </div>
                  <div className="transition duration-300 ease-in-out flex items-center justify-center bg-[#FAF7F2] hover:bg-[#E60023] p-4 text-[18px] rounded-full hover:text-white cursor-pointer">
                    <FaPinterestP />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <h4 className="text-[30px] font-bold text-gray-700 mt-8">
            {petDetail?.reviews.length} Reviews
          </h4>
          <div>
            {petDetail?.reviews?.map((review) => (
              <div key={review?._id}>
                <div className="flex gap-5 my-7">
                  <div>
                    <img
                      className="w-[150px] rounded-full"
                      src={review?.image}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-5 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-700">
                          {review?.username}
                        </p>
                        <p className="text-red-600 font-medium">
                          {/* {format Date.parse(review?.createdAt)} */}
                          {new Date(review?.createdAt).toString("yyyy-MM-dd")}
                        </p>
                      </div>
                      <div className="flex flex-col-reverse items-end gap-1">
                        <Rate disabled defaultValue={review?.rating} />
                        {user?.id === review?.userId || user?.isAdmin ? (
                          <div
                            className="cursor-pointer bg-red-500 p-2 rounded-full text-white"
                            onClick={() =>
                              handleDeleteReview(review?._id, review?.userId)
                            }
                          >
                            <RiDeleteBinLine size={20} />
                          </div>
                        ): null}
                      </div>
                    </div>
                    <p className="text-[18px]">{review?.reviewText}</p>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
        {user?.commentIdOrder.includes(petDetail?.data?._id) && (
          <div className="">
            <h4 className="text-[30px] font-bold text-gray-700 my-8">
              Add a review
            </h4>
            <div className="flex items-center gap-4">
              <p>Rate this Product?</p>{" "}
              <Rate
                tooltips={desc}
                onChange={setRate}
                defaultValue={5}
                value={rate}
              />
              {rate ? (
                <span className="ant-rate-text">{desc[rate - 1]}</span>
              ) : (
                ""
              )}
            </div>
            <form
              className="w-full flex flex-col gap-8 mt-5"
              onSubmit={handleReview}
            >
              <textarea
                className="w-full h-[150px] rounded-lg bg-[#FAF7F2] border-none p-4 "
                placeholder="Write a comment"
                value={comment}
                onChange={handleOnChangComment}
              />
              <div className="flex items-center gap-8">
                <input
                  className="flex-1 bg-[#FAF7F2] rounded-lg p-4 focus:outline-none focus:ring focus:ring-[#FF642F]"
                  placeholder="Your name"
                  value={username}
                  onChange={handleOnChangUserName}
                  required
                />
                <input
                  className="flex-1 bg-[#FAF7F2] rounded-lg  p-4 focus:outline-none focus:ring focus:ring-[#FF642F]"
                  placeholder="Email address"
                  value={email}
                  onChange={handleOnChangEmail}
                  required
                />
              </div>
              <button
                className="bg-[#ff642f] px-11 py-[17px] rounded-full font-medium text-white w-[200px]"
                type="submit"
              >
                Submit a review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetails;
