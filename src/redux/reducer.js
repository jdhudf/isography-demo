import { combineReducers } from 'redux'
import jsonReducer from './jsonSlice'

const rootReducer = combineReducers({
  json: jsonReducer
})

export default rootReducer
