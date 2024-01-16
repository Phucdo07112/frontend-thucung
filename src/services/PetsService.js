import axios from "axios"
import { axiosJWT } from "./UserService"
export const getPetByCategory = async(id, price,sortPrice,sortPet,breedPet, limit) => {
    let res = {}
    if(price > 0){

        if(sortPrice) {

            if(sortPet) {
                if(breedPet) {
                    res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=price&filter=${price}000&filter=type&filter=${sortPet}&filter=breed&filter=${breedPet}&filter=sort&filter=${sortPrice}`)
                } else {
                    res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=price&filter=${price}000&filter=type&filter=${sortPet}&filter=sort&filter=${sortPrice}`)
                }
            } else {
                res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=price&filter=${price}000&filter=sort&filter=${sortPrice}`)
            }
        } else if(sortPet) {
            if(breedPet) {
                res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=price&filter=${price}&filter=type&filter=${sortPet}&filter=breed&filter=${breedPet}`)
            } else {
                res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=price&filter=${price}000&filter=type&filter=${sortPet}`)
            }
        } else {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=price&filter=${price}000`)
        }
        
    } else if(sortPrice) {
        if(sortPet) {
            if(breedPet) {
                res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?sort=price&filter=type&filter=${sortPet}&sort=${sortPrice}&filter=breed&filter=${breedPet}`)    
            } else {
                res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?sort=price&filter=type&filter=${sortPet}&sort=${sortPrice}`)
            }

        } else {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?sort=price&sort=${sortPrice}`)
        }
    } else if(sortPet) {
        if(breedPet) {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=type&filter=${sortPet}&filter=breed&filter=${breedPet}`)
        } else {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}?filter=type&filter=${sortPet}`)
        }
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/category/${id}`)
    }
    return res.data
}

export const getAllPets = async(search, breed, limit) => {
    console.log('search, breed, limit',search, breed, limit);
    let res = {}
    if(search?.length > 0){
        res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/all?filter=name&filter=${search}&limit=${limit}`)
    } else if(breed) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/all?filter=breed&filter=${breed}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/all?limit=${limit}`)
    }
    return res.data
}

export const getAllPetbyId = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/pets/get-heart`, data)
    return res.data
}

export const getPetType = async(type, page, limit) => {
    if(type){
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    } 
}

export const getPetBreed = async(type, page, limit) => {
    if(type){
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/get-all?filter=breed&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    } 
}

export const getAllTypePets = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/get-all-type`)
    return res.data
}

export const getAllBreedPets = async (type) => {
    const data = {
        type: type
    }
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/pets/get-all-breed`, data )
    return res.data
}

export const createPets = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/pets/create`, data)
    return res.data
}

export const getDetailsPets = async(id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/pets/get-details/${id}`)
    return res.data
}

export const updatePets = async(id, access_Token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/pets/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_Token}`,
        }
    })
    return res.data
}

export const deletePets = async(id,access_Token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/pets/delete/${id}`, {
        headers: {
            token: `Bearer ${access_Token}`,
        }
    })
    return res.data
}