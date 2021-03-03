const initialState = {
  templates: [
    {
      name: "Square",
      ratio: [1,1],
    },
    {
      name: "Twitter Card Ratio",
      ratio: [1,0.75],
    },
    {
      name: "OGP Card Ratio",
      ratio: [1,0.55],
    },
    {
      name: "Golden Ratio",
      ratio: [1,1.25],
    },
    {
      name: "Silver Ratio",
      ratio: [1,0.65],
    },
  ],
}

export default function templateReducer(state = initialState, action) {
  switch (action.type) {
    case 'darkmode/switch':
      return {
        ...state,
        template: action.payload
      }
    default:
      console.log("problem in reducer")
      return state

  }
}
