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
      console.log("darkmode action!")
      console.log(state.darkmode)
      return {
        ...state,
        darkmode: !state.darkmode
      }
    case 'working/switch':
      return {
        ...state,
        working: action.payload
      }
    default:
      console.log("problem in reducer")
      return state

  }
}
