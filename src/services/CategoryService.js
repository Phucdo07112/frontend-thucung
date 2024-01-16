import axios from "axios"

export const createCategory = async(token, data) => {
    console.log('data123',data);
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/category/create`,data)
    return res.data
}

export const getAllCategory = async() => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/all`)
    return res.data
}

export const getDetailCategory = async(id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/detail/${id}`)
    return res.data
}

export const updateCategory = async(id, token, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/category/update/${id}`, data)
    return res.data
}

export const deleteCategory = async(id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/category/delete/${id}`)
    return res.data
}