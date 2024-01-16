import { Button } from 'antd'
import React from 'react'
const ButtonComponent = ({size, bordered, className, textButton, icon,classNameText, disabled, ...rests}) => {
  return (
    <Button
        size={size}
        bordered={bordered}
        className={className}
        icon={icon}
        disabled={disabled}
        {...rests}
    >
        <span className={classNameText}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent