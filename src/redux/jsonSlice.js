
const initialState = {
  darkmode: false,
  working: 1,
  grid: false,
  selected: null,
  drawer: true,
  colors: [],
  artboardScale: 0.8,
  artboardPosition: [0, 0],
  textEditor: false,
  editable: false,
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
    case 'change/colors':
      return {
        ...state,
        colors: action.payload
      }
    case 'update/artboardScale':
      return {
        ...state,
        artboardScale: action.payload
      }
    case 'update/artboardPosition':
      return {
        ...state,
        artboardPosition: action.payload
      }
    case 'switch/textEditor':
      return {
        ...state,
        textEditor: action.payload
      }
    case 'switch/editable':
      return {
        ...state,
        textEditor: action.payload
      }
    default:
      return state

  }
}
