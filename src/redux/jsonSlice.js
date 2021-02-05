import {
  getIsographyData,
  addNewArtboard
 } from '../components/handleLocalstorage'

const initialState = {
  hex: '#9ACFE1',
  json: getIsographyData(), 
}

export default function jsonReducer(state = initialState, action) {
  switch (action.type) {
    case 'hex/changeHex':
      return {
        ...state,
        hex: action.payload
      }
    default:
      return state

  }
}
