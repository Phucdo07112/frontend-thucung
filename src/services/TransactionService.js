import axios from "axios"

export const createtransactions = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/transactions/create`,data)
    return res.data
}

// export const getAllCategory = async() => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/all`)
//     return res.data
// }

export const getDetailtransactions = async(id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/transactions/detail/${id}`)
    return res.data
}

export const updatetransactions = async(id, token, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/transactions/update/${id}`, data)
    return res.data
}

export const deletetransactions = async(id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/transactions/delete/${id}`)
    return res.data
}