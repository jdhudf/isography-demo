import { combineReducers } from 'redux'
import jsonReducer from './jsonSlice'
import artboardReducer from './artboardSlice'
import templateReducer from './templateSlice'

const rootReducer = combineReducers({
  json: jsonReducer,
  artboards: artboardReducer,
  template: templateReducer,
})

export default rootReducer
