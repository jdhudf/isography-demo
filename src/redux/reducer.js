import { combineReducers } from 'redux'
import jsonReducer from './jsonSlice'
import artboardReducer from './artboardSlice'
import templateReducer from './templateSlice'
import historyReducer from './historySlice'

import undoable from 'redux-undo';

const rootReducer = combineReducers({
  json: jsonReducer,
  artboards: undoable(artboardReducer, {
    undoType: 'CANVAS_UNDO',
    redoType: 'CANVAS_REDO',
    // here you will want to configure specific redux-undo action type
  }),
  templates: templateReducer,
  history: historyReducer,
})

export default rootReducer
