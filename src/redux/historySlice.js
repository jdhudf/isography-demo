
const initialState = {
  past: [],
  present: {},
  future: []
}

/*export default function historyReducer(state = initialState, action) {
  switch (action.type) {
    case 'record/history':
      console.log("his his")
      return {
        canvas : action.payload
      }
    default:
      return state

  }
}*/

export default function historyReducer(state = initialState, action) {

  const { past, present, future } = state

  console.log(state)

  switch (action.type) {
    case 'reset/history':
      return {
        past: [],
        present: action.payload,
        future: []
      }
    case 'record/history':
      return {
        past: [...past, action.payload],
        present: action.payload,
        future: []
      }
    case 'UNDO':
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [action.payload, ...future]
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
      return state

  }
}
