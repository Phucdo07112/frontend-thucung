import React, { useEffect } from 'react'
import CardComponent from '../components/CardComponent/CardComponent'
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from "../services/ProductService"
import * as PetsService from "../services/PetsService"
import * as UserService from "../services/UserService"
import { useMutationHooks } from '../hooks/useMutationHook';
import Loading from '../components/LoadingComponent/Loading';
const Heart = () => {
    const user = useSelector((state) => state.user);

    const getAllProductById = async (context) => {
        const data = context.queryKey && context.queryKey[1]
        console.log('1233',data);
        const res = await ProductService.getAllProductbyId(data)
        return res
      }

      const getAllPetById = async (context) => {
        const data = context.queryKey && context.queryKey[1]
        const res = await PetsService.getAllPetbyId(data)
        return res
      }

      const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        return UserService.updateUser(id, token, { ...rests });
      });
    
      const {
        data: dataUpdate,
        isLoading: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdate,
      } = mutationUpdate;
    const queryProductById = useQuery({ queryKey: ['productHeart',user?.heartProduct], queryFn: getAllProductById })
    const queryPetById = useQuery({ queryKey: ['petHeart',user?.heartPet], queryFn: getAllPetById })

    const { isLoading: isLoadingProduct, data: product } = queryProductById
    const { isLoading: isLoadingPet, data: pet } = queryPetById

    useEffect(() => {
      mutationUpdate.mutate({
        id: user?._id,
        token: user?.access_token,
        heartProduct: user?.heartProduct,
        ...user,
      });
    }, [user?.heartProduct]);

    useEffect(() => {
      mutationUpdate.mutate({
        id: user?._id,
        token: user?.access_token,
        heartProduct: user?.heartPet,
        ...user,
      });
    }, [user?.heartPet]);
  return (
    <Loading isLoading={isLoadingProduct && isLoadingProduct && isLoadingUpdated}>
      <div className='bg-white'>
        <div className='container'>
        <div className="pt-5">
        <div className="bg-[#FF642F] text-white w-[280px] flex items-center justify-center p-2 rounded-lg mb-7">
              <p className="text-lg font-bold ">Danh sách yêu thích</p>
            </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
                    {
                      product?.data?.map((prod) => (
                        <CardComponent data={prod} isProduct={true} />
                      ))
                    }

{
                      pet?.data?.map((pets) => (
                        <CardComponent data={pets} isPet={true} />
                      ))
                    }
                </div>
            </div>
        </div>
    </div>
    </Loading>
  )
}

export default Heart