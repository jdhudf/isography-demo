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

export const artboardPoosition = (e) => {

  if (localStorage.getItem('artboardPoosition') === null) {
    localStorage.setItem('artboardPoosition', JSON.stringify(e));
  }
  return  JSON.parse(localStorage.getItem('artboardPoosition'))

}
