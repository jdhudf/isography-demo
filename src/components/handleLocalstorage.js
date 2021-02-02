export const getColor = (e,c) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          return json.data[i].color_scheme[c]
      }
    }
  }
}

export const setColor = (e,c) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          json.data[i].color_scheme[c] = e
      }
    }
    localStorage.setItem('isography', JSON.stringify(json));
  }
}



export const getSVGdata = (e) => {

  if (localStorage.getItem('isography') !== null) {
    const json =  JSON.parse(localStorage.getItem('isography'))

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          return  json.data[i].svg_data
      }
    }

  }
}

export const setSVGdata = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          json.data[i].svg_data = e
      }
    }
    localStorage.setItem('isography', JSON.stringify(json));
  }
}

export const getCanvasScale = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          return json.data[i].artboard_size
      }
    }
  }
}

export const getLastModified = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          return json.data[i].last_modified
      }
    }
  }
}

export const setLastModified = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          json.data[i].last_modified = e
      }
    }
    localStorage.setItem('isography', JSON.stringify(json));
  }
}

export const setArtboardName = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          json.data[i].artboard_name = e
      }
    }
    localStorage.setItem('isography', JSON.stringify(json));
  }
}

export const getArtboardName = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id == json.working){
          return json.data[i].artboard_name
      }
    }
  }
}

export const artboardScale = (e) => {

  if (localStorage.getItem('artboardScale') === null) {
    localStorage.setItem('artboardScale', e);
  }
  return  JSON.parse(localStorage.getItem('artboardScale'))

}

export const addNewArtboard = (e,
                               artboard_name,
                               mainColor,
                               subColor,
                               accentColor,
                               background) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

    const newData = {
      artboard_id: json.data.length + 1,
      artboard_name: artboard_name,
      created_at: date,
      last_modified: date,
      artboard_size: [800,600],
      svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub"><circle cx="0" cy="0" r="50"></circle></g>',
      '<g transform="translate(100,250) scale(2,2)" class="main" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
      '<g transform="translate(50,150) scale(1,1)" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
      color_scheme: {
        mainColor: mainColor,
        subColor: subColor,
        accentColor: accentColor,
        background: background
      }
    }

    json.data.push(newData)
    localStorage.setItem('isography', JSON.stringify(json));
  }
}

export const artboardPosition = (e) => {

  if (localStorage.getItem('artboardPosition') === null) {
    localStorage.setItem('artboardPosition', JSON.stringify(e));
  }
  return  JSON.parse(localStorage.getItem('artboardPosition'))

}

export const getIsographyData = (e) => {

  if (localStorage.getItem('isography') === null) {

    const json = {
      working : 1,
      data: [
        {
          artboard_id: 1,
          artboard_name: 'Artboard Name 1',
          created_at: '2020-01-26',
          last_modified: '2020-01-26',
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
        },
        {
          artboard_id: 2,
          artboard_name: 'Artboard Name 2',
          created_at: '2020-01-26',
          last_modified: '2020-01-26',
          artboard_size: [800,600],
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
          color_scheme: {
            mainColor: '#1496BA',
            subColor: '#00607c',
            accentColor: '#bfd9e1',
            background: '#fff'
          }
        },
        {
          artboard_id: 3,
          artboard_name: 'Artboard Name 3',
          created_at: '2020-01-26',
          last_modified: '2020-01-26',
          artboard_size: [800,600],
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" class="accent"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
          color_scheme: {
            mainColor: '#7343ec',
            subColor: '#eccbff',
            accentColor: '#13d9ea',
            background: '#F0F0F0'
          }
        },
        {
          artboard_id: 4,
          artboard_name: 'Artboard Name 4',
          created_at: '2020-01-26',
          last_modified: '2020-01-26',
          artboard_size: [800,600],
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" class="accent"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
          color_scheme: {
            mainColor: '#cccccc',
            subColor: '#000000',
            accentColor: '#FAFAFA',
            background: '#ffffff'
          }
        },
      ]
    }

    localStorage.setItem('isography', JSON.stringify(json));

  }

  return  JSON.parse(localStorage.getItem('isography'))

}
