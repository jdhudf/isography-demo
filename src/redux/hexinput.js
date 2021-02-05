import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const selectHex = state => state.json

const HexInput = () => {
  const dispatch = useDispatch()

  const color = useSelector(selectHex)

  const hex = color.hex

  console.log('color is ' + color);

  const handleChange = e => {
    dispatch({type: 'hex/changeHex', payload: e.target.value})
  }

  return (
    <input
       type="color"
       value={hex}
       onChange={handleChange}
    />
  )
}

export default HexInput
