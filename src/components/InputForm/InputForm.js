import React from 'react'
import styles from './InputForm.module.css'
import { Input } from 'antd'

const InputForm = ({ placeholder = 'Nhập text', onChange, value, ...rests }) => {

    return (
        <Input className="rounded-lg w-full" placeholder={placeholder} value={value} {...rests} onChange={onChange} required />
    )
}

export default InputForm