import React from 'react'
import { Input } from "antd";
const InputHeader = ({size,placeholder,bordered, style, value, ...rests}) => {
  return (
    <Input
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={style}
        value={value}
        {...rests}
    />
  )
}

export default InputHeader