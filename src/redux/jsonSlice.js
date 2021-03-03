import {
  getIsographyData,
 } from '../components/handleLocalstorage'

import { switchDarkmode } from './actions';

const initialState = {
  darkmode: false,
  working: 1,
}

export default function jsonReducer(state = initialState, action) {
  switch (action.type) {
    case 'darkmode/switch':
      return {
        ...state,
        darkmode: action.payload
      }
    case 'json/changeJson':
      return {
        ...state,
        json: action.payload
      }
    default:
      console.log("problem in reducer")
      return state

  }
}
