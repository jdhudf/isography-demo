import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const selectDarkmode = state => state.json

const DarkmodeButton = () => {
  const dispatch = useDispatch()

  const mode = useSelector(selectDarkmode)

  const value = mode.darkmode

  const handleChange = e => {
    if (value) {
      dispatch({type: 'darkmode/switch', payload: false})
    } else {
      dispatch({type: 'darkmode/switch', payload: true})
    }
  }

  return (
    <button onClick={handleChange}>Mode is {value ? "true":"false"} now</button>
  )
}

export default DarkmodeButton
