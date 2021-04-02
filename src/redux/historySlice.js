import { switchDarkmode } from './actions';

const initialState = {
  past: [],
  present: {

  },
  future: []
}

export default function historyReducer(state = initialState, action) {

  const { past, present, future } = state


  switch (action.type) {
    case 'reset/histoty':
      return {
        ...state,
        past: [],
        present: action.payload,
        future: []
      }
    case 'record/histoty':
      console.log("his his")
      return {
        ...state,
        past: [...past, action.payload],
        present: action.payload,
        future: []
      }
    case 'UNDO':
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      console.log("undo")
      console.log("previous: " + previous)
      console.log("newPast: " + newPast)
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      }
    case 'REDO':
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      }
    default:
      console.log("problem in reducer")
      return state

  }
}
