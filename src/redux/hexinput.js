import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAdjust
} from '@fortawesome/free-solid-svg-icons'

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
    <div className="mode-change" onClick={handleChange}><FontAwesomeIcon icon={faAdjust} /></div>
  )
}

export default DarkmodeButton
