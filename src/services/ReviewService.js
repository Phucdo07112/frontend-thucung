import axios from "axios"

export const createReview = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/review/create`,data)
    return res.data
}

// export const getAllCategory = async() => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/all`)
//     return res.data
// }

export const getDetailReview = async(id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/detail/${id}`)
    return res.data
}

export const updateReview = async(id, token, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/review/update/${id}`, data)
    return res.data
}

export const deleteReview = async(id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/review/delete/${id}`)
    return res.data
}