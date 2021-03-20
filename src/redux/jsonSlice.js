import {
  getIsographyData,
 } from '../components/handleLocalstorage'

import { switchDarkmode } from './actions';

const initialState = {
  darkmode: false,
  working: 1,
  grid: false,
}

export default function jsonReducer(state = initialState, action) {
  switch (action.type) {
    case 'darkmode/switch':
      return {
        ...state,
        darkmode: !state.darkmode
      }
    case 'grid/switch':
      return {
        ...state,
        grid: !state.grid
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
