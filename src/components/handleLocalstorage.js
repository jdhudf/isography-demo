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
