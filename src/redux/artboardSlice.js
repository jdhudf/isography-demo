const initialState = {
  artboards : [
    {
      artboard_id: 1,
      artboard_name: 'Artboard Name 1',
      created_at: 'Tue, 22 May 2018 13:20:00 GMT',
      last_modified: 'Tue, 22 May 2018 13:20:00 GMT',
      canvas: {
        artboard_size: [800,600],
        svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub"><circle cx="0" cy="0" r="50"></circle></g>',
        '<g transform="translate(100,250) scale(2,2)" class="main" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
        '<g transform="translate(50,150) scale(1,1)" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
        color_scheme: {
          mainColor: '#cccccc',
          subColor: '#000000',
          accentColor: '#FAFAFA',
          background: '#ffffff'
        }
      }
    },
    {
      artboard_id: 2,
      artboard_name: 'Artboard Name 2',
      created_at: 'Tue, 22 May 2018 13:20:00 GMT',
      last_modified: 'Tue, 22 May 2018 13:20:00 GMT',
      canvas: {
        artboard_size: [800,600],
        svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub"><circle cx="0" cy="0" r="50"></circle></g>',
        '<g transform="translate(100,250) scale(2,2)" class="main" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
        '<g transform="translate(50,150) scale(1,1)" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
        color_scheme: {
          mainColor: '#cccccc',
          subColor: '#000000',
          accentColor: '#FAFAFA',
          background: '#4B6A6D'
        }
      }
    },
  ]
}


export default function artboardReducer(state = initialState, action) {
  switch (action.type) {
    case 'hex/update':
      return {
        ...state,
        artboards: action.payload
      }
    case 'add/artboard':
      return {
        ...state,
        artboards: action.payload
      }
    case 'update/artboard':
      return {
        ...state,
        artboards: action.payload
      }
    default:
      console.log("problem in reducer")
      return state

  }
}
