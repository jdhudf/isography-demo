
const initialState = {
  darkmode: false,
  working: 1,
  grid: false,
  selected: null,
  drawer: true,
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
    case 'selected/switch':
      return {
        ...state,
        selected: action.payload
      }
    case 'toggle/drawer':
      return {
        ...state,
        drawer: !state.drawer
      }
    default:
      return state

  }
}
