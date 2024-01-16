import { Rate } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AiOutlineHeart,AiOutlineEye,AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addHeart } from "../../redux/slides/userSlice";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { convertPrice } from "../../utils/jsonString";
const CardComponent = ({data, isPet=false, isProduct=false}) => {
    const user = useSelector((state) => state?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    // const mutationUpdate = useMutationHooks((data) => {
    //   const { id, token, ...rests } = data;
    //   return UserService.updateUser(id, token, { ...rests });
    // });

    // const {
    //   data: dataUpdate,
    //   isLoading: isLoadingUpdated,
    //   isSuccess: isSuccessUpdated,
    //   isError: isErrorUpdate,
    // } = mutationUpdate;

    const handleHeart = (e) => {
        e.stopPropagation();
        
        if(isPet) {
          dispatch(addHeart({
            petId: data?._id
          }))
          // mutationUpdate.mutate(
          //   { id: user?._id, token: user?.access_token, heartPet: user?.heartPet,   ...user }
          // );
          
        } else if(isProduct) {
          dispatch(addHeart({
            productId: data?._id
          }))
          // mutationUpdate.mutate(
          //   { id: user?._id, token: user?.access_token, heartProduct: user?.heartProduct,   ...user }
          // );
          
        }
    }

    
    // useEffect(() => {
    //   if(isPet) {
    //     mutationUpdate.mutate(
    //       { id: user?._id, token: user?.access_token, heartPet: user?.heartPet,   ...user }
    //     );
    //   } else if (isProduct) {
    //     mutationUpdate.mutate(
    //       { id: user?._id, token: user?.access_token, heartProduct: user?.heartProduct,   ...user }
    //     );
    //   }
    // },[user?.heartPet, user?.heartProduct, isPet, isProduct])

    const handelOnClick = (e) => {
      e.stopPropagation();
      if(isPet) {
        navigate(`/petDetails/${data?._id}`)
      } else if(isProduct) {
        navigate(`/productDetails/${data?._id}`)
      }
    }
  return (
    <div
      onClick={handelOnClick}
      className=" cursor-pointer group relative h-[380px] w-[300px] "
      key={data?._id}
    >
      <div className="transition-all duration-300 ease-in-out w-full h-[79%] bg-[#FAF7F2] rounded-lg p-3 absolute top-0 left-0 group-hover:top-[-15px] ">
        <img
          className="rounded-lg w-full h-full"
          src={`${data?.image ? data?.image : "../images/dogvang.jpg"}`}
          alt=""
        />
      </div>
      <div className="transition duration-300 ease-in-out absolute right-5 top-1 bg-[#ffc458] text-white p-3 rounded-full opacity-0 group-hover:opacity-100" onClick={handleHeart}>
        {
          user?.heartPet?.includes(data?._id) || user?.heartProduct?.includes(data?._id) ?  (
            <>
            <AiFillHeart color="#ff642f" size={25} />
            </>
          ) : (
            <AiOutlineHeart size={25} />
          )
        }
      </div>
      <div className="transition duration-300 ease-in-out absolute right-5 top-[60px] bg-[#0090AE] text-white p-3 rounded-full opacity-0 group-hover:opacity-100">
        <AiOutlineEye size={22} />
      </div>
      <button className="transition duration-300 ease-in-out bg-black px-11 py-[14px] rounded-full text-[12px] font-medium text-white absolute top-[265px] z-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100">
        Add to cart
      </button>
      <div className="flex flex-col w-full  items-center absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <Rate disabled defaultValue={data?.rating} />
        <p className="text-lg font-medium whitespace-nowrap text-ellipsis text-center overflow-hidden w-full">{data?.name}</p>
        <p className="text-red-700 font-medium">{convertPrice(Number(data?.price))}</p>
      </div>
    </div>
  );
};

export default CardComponent;
