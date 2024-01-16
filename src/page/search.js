import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { Rate, Select, Slider } from "antd";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineRight, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import * as CategoryService from "../services/CategoryService";
import * as PetsService from "../services/PetsService";
import * as ProductService from "../services/ProductService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDebounce } from "../hooks/useDebounce";
import CardComponent from "../components/CardComponent/CardComponent";
import Loading from "../components/LoadingComponent/Loading";
const Search = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const searchProduct = useSelector((state) => state?.search?.search); // search
  const searchDebounce = useDebounce(searchProduct, 100); // hook delay nhận value search
  const [isLoadingSearch, setIsLoadingSearch] = useState(false); // set loading khi search
  const [limit, setLimit] = useState(3);
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchProductAll = async (context) => {
    const limit = context.queryKey && context.queryKey[1];
    const search = context.queryKey && context.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);

    return res; //return để query nhận được data all khi đi product sẽ nhận được và thay đổi để set lại state
  };

  const fetchPetAll = async (context) => {
    const limit = context.queryKey && context.queryKey[1];
    const search = context.queryKey && context.queryKey[2];
    const res = await PetsService.getAllPets(search, limit);

    return res; //return để query nhận được data all khi đi product sẽ nhận được và thay đổi để set lại state
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const handleClickCategory = (id, sect) => {
    navigate(`/${sect}/${id}`);
  };
  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };
  const getAllPetByCategory = async (context) => {
    const id = context.queryKey && context.queryKey[1];
    const res = await PetsService.getPetByCategory(id);
    return res;
  };

  const queryCategory = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });
  const queryPetByCategory = useQuery({
    queryKey: ["petCategory", categoryId],
    queryFn: getAllPetByCategory,
  });

  const { isLoading: isLoadingCategory, data: categorys } = queryCategory;
  const { isLoading: isLoadingPetCategory, data: petCategorys } =
    queryPetByCategory;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  const {
    isLoading: isLoadingPet,
    data: pets,
    isPreviousData: isPreviousDataPet,
  } = useQuery(["pets", limit, searchDebounce], fetchPetAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  return (
    <Loading isLoading={isLoadingCategory}>
      <div className="pb-10 bg-white">
        <Banner title="Pets" link="home / pet" />
        <div className="container pt-5">
          <div className="w-full flex gap-5">
            <div className="flex-1">
              <div className="bg-[#ffbc3e] px-5 py-4 text-white rounded-lg text-[16px] ">
                <input
                  className="text-white placeholder:text-white "
                  placeholder="Search here"
                />
              </div>
              <div className="mt-5 border-2 p-4 rounded-lg">
                <p className="text-lg font-semibold">Categories</p>
                <div className="mt-5 flex flex-col gap-5 text-[15px] font-medium">
                  {categorys?.map((category) => (
                    <div
                      className={`flex items-center justify-between cursor-pointer ${
                        categoryId === category?._id
                          ? "text-gray-800"
                          : "text-gray-500"
                      } `}
                      key={category._id}
                      onClick={() =>
                        handleClickCategory(category?._id, category?.sect)
                      }
                    >
                      {category.name}{" "}
                      <AiOutlineRight
                        size={18}
                        className={`${
                          categoryId === category?._id
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-4">
              <div className="flex  items-center justify-between">
                <p className="text-gray-500 font-medium">
                  Showing 1-{products?.data?.length + pets?.data?.length} items
                </p>
                <Select
                  defaultValue="Sort by Popular"
                  style={{
                    width: 200,
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Sort by Popular",
                      label: "Sort by Popular",
                    },
                    {
                      value: "Bubble Sort",
                      label: "Bubble Sort",
                    },
                    {
                      value: "Selection Sort",
                      label: "Selection Sort",
                    },
                  ]}
                />
              </div>
              <div className="mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
                  {products?.data?.map((product) => (
                    <CardComponent data={product} isProduct={true} />
                  ))}

                  {pets?.data?.map((pet) => (
                    <CardComponent data={pet} isPet={true} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default Search;
