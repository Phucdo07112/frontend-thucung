import React, { useEffect, useState } from "react";
import { Radio, Tabs } from "antd";
import { useQuery } from "@tanstack/react-query";
import * as CategoryService from "../services/CategoryService";
import * as PetsService from "../services/PetsService";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/LoadingComponent/Loading";
const HomePage = () => {
  const navigate = useNavigate();
  const [breedPets, setBreedPets] = useState([]);
  const [breedPetsCat, setBreedPetsCat] = useState([]);
  const [dataDog, setDataDog] = useState([]);
  const [dataCat, setDataCat] = useState([]);
  const [breed, setBreed] = useState("Chó Alaska")
  const [breedCat, setBreedCat] = useState("Mèo Anh")
  const [mode, setMode] = useState("top");
  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };
  const fetchAllBreedProduct = async (typePets) => {
    const res = await PetsService.getAllBreedPets(typePets);
    if (res.status === "OK") {
        setBreedPets(res?.data);
    }
  };

  const fetchAllBreedProductCat = async (typePets) => {
    const res = await PetsService.getAllBreedPets(typePets);
    if (res.status === "OK") {
        setBreedPetsCat(res?.data)
    }
  };
  const getAllpets = async (context) => {
    const breed = context.queryKey && context.queryKey[1];
    // const search = context.queryKey && context.queryKey[2];
    const res = await PetsService.getAllPets("",breed, 0);
    return res;
  };

  const getAllpetsCat = async (context) => {
    const breedCat = context.queryKey && context.queryKey[1];
    // const search = context.queryKey && context.queryKey[2];
    const res = await PetsService.getAllPets("",breedCat, 0);
    return res;
  };

  const queryCategory = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });
  const queryPet = useQuery({
    queryKey: ["pets", breed],
    queryFn: getAllpets,
  });
  const queryPetCat = useQuery({
    queryKey: ["pets", breedCat],
    queryFn: getAllpetsCat,
  });
  const { isLoading: isLoadingCategory, data: categorys } = queryCategory;
  const { isLoading: isLoadingpets, data: pets } = queryPet;
  const { isLoading: isLoadingpetsCat, data: petsCat } = queryPetCat;
  console.log("categorys", queryCategory);
  const handleClickCategory = (id, sect) => {
    navigate(`/${sect}/${id}`);
  };



  useEffect(() => {
    fetchAllBreedProduct("Chó");
  }, []);

  useEffect(() => {
    fetchAllBreedProductCat("Mèo");
  }, []);

  const data = [];
  const dataCata = [];
  useEffect(() => {
    breedPets?.map((item) => {
      // console.log(item)
      data.push({
        label: item,
        children: [],
      })
    })
    
    setDataDog(data)
  },[breedPets,pets])

  useEffect(() => {
    breedPetsCat?.map((item) => {
      // console.log(item)
      dataCata.push({
        label: item,
        children: [],
      })
    })
    
    setDataCat(dataCata)
  },[breedPetsCat,petsCat])

  const onChangeDogItem = (key) => {
    console.log('key', key);
    setBreed(key)
  }

  const onChangeCatItem = (key) => {
    console.log('key', key);
    setBreedCat(key)
  }
  console.log('breedPetsCat',breedPetsCat);
  return (
    <Loading isLoading={isLoadingCategory && isLoadingpets && isLoadingpetsCat}>
      <div className="mb-4">
        <div className="container">
          <div className="flex items-center pt-2 w-full gap-2 mb-6">
            <div className="flex-1 bg-white rounded-lg h-[345px] overflow-y-auto">
              {categorys?.map((category) => (
                <div
                  className="flex items-center gap-3 border-b p-3 cursor-pointer"
                  key={category?._id}
                  onClick={() =>
                    handleClickCategory(category?._id, category?.sect)
                  }
                >
                  <img
                    className="w-[50px] h-[50px] rounded-full object-cover"
                    src={category?.image}
                    alt=""
                  />
                  <p className="text-lg">{category?.name}</p>
                </div>
              ))}
            </div>
            <div className="flex-2">
              <img
                className="rounded-lg"
                src="./images/banner-pet1.jpg"
                alt=""
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <img
                className="rounded-lg"
                src="./images/banner-pet2.jpg"
                alt=""
              />
              <img
                className="rounded-lg"
                src="./images/banner-pet3.jpg"
                alt=""
              />
            </div>
          </div>
          <div className="flex w-full bg-white mt-10 rounded-lg overflow-hidden ">
            <div className="flex-1">
              <div className="w-full p-4 font-semibold text-white bg-[#BA0001]">
                Chó
              </div>
              <img
                className="w-[250px] h-full"
                src="./images/banner-dog.jpg"
                alt=""
              />
            </div>
            <div className="flex-1">
              <Tabs
                defaultActiveKey="Chó Alaska"
                tabPosition={mode}
                style={{
                  height: 450,
                  width: 950,
                }}
                onChange={onChangeDogItem}
                items={dataDog?.map((items, i) => {
                  const id = String(items?.label);
                  console.log('items',items);
                  return {
                    label: (
                      <div className="px-4 font-semibold">{items?.label}</div>
                    ),
                    key: id,
                    children: (
                      <div className="pl-4 flex flex-wrap gap-6 overflow-auto h-[500px] pb-5">
                        {pets?.data?.map((item) => (
                          <Link to={`/petDetails/${item?._id}`}>
                            <img
                              className="w-[200px] h-[300px] object-cover rounded-lg"
                              src={item?.image}
                              alt=""
                            />
                            <p className="text-center font-semibold text-[16px]">
                              {item?.name}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ),
                  };
                })}
              />
            </div>
          </div>
          <div className="flex w-full bg-white mt-10 rounded-lg overflow-hidden ">
            <div className="flex-1">
              <div className="w-full p-4 font-semibold text-white bg-[#BA0001]">
                Mèo
              </div>
              <img
                className="w-[250px] h-full"
                src="./images/banner-cat.jpg"
                alt=""
              />
            </div>
            <div className="flex-1">
              <Tabs
                defaultActiveKey="Mèo Anh"
                tabPosition={mode}
                style={{
                  height: 450,
                  width: 950,
                }}
                onChange={onChangeCatItem}
                items={dataCat?.map((items, i) => {
                  const id = String(items?.label);
                  return {
                    label: (
                      <div className="px-4 font-semibold">{items.label}</div>
                    ),
                    key: id,
                    children: (
                      <div className="pl-4 flex flex-wrap gap-6 overflow-auto h-[500px] pb-5">
                        {petsCat?.data?.map((item) => (
                          <Link to={`/petDetails/${item?._id}`}>
                            <img
                              className="w-[200px] h-[300px] object-cover rounded-lg"
                              src={item?.image}
                              alt=""
                            />
                            <p className="text-center font-semibold text-[16px]">
                              {item?.name}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ),
                  };
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
