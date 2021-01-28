export const getMainColor = (e) => {

  if (localStorage.getItem('mainColor') === null) {
    localStorage.setItem('mainColor', e);
  }
  return localStorage.getItem('mainColor')

}

export const getSubColor = (e) => {

  if (localStorage.getItem('subColor') === null) {
    localStorage.setItem('subColor', e);
  }
  return localStorage.getItem('subColor')

}

export const getAccentColor = (e) => {

  if (localStorage.getItem('accentColor') === null) {
    localStorage.setItem('accentColor', e);
  }
  return localStorage.getItem('accentColor')

}

export const getBackgroundColor = (e) => {

  if (localStorage.getItem('backgroundColor') === null) {
    localStorage.setItem('backgroundColor', e);
  }
  return localStorage.getItem('backgroundColor')

}

export const getSVGdata = (e) => {

  if (localStorage.getItem('data') === null) {
    localStorage.setItem('data', JSON.stringify(e));
  }
  return  JSON.parse(localStorage.getItem('data'))

}

export const artboardScale = (e) => {

  if (localStorage.getItem('artboardScale') === null) {
    localStorage.setItem('artboardScale', e);
  }
  return  JSON.parse(localStorage.getItem('artboardScale'))

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
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
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
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
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
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
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
          svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
          '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
          '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
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
