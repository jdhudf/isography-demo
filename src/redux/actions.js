import {
  updateJson,
} from '../components/handleLocalstorage'

//export const switchDarkmode = value => ({type: 'darkmode/switch', payload: value});
/*
export const switchDarkmode = value => {
  return {type: 'darkmode/switch', payload: value}
}*/

export const actions = {
  switchDarkmode(value) {
    return {
      type: 'darkmode/switch',
      payload: value
    }
  },
  swicthWorking(value) {
    return {
      type: 'working/switch',
      payload: value
    }
  },
  changeHex({artboards, id, hex, type}) {
    const update = (type) => {

      for (let i = 0; i < artboards.length; i++) {
        if (artboards[i].artboard_id === id) {
          artboards[i].canvas.color_scheme[type] = hex
        }
      }

    }
    switch (type) {
      case "mainColor":

        update(type)

        break;

      case "subColor":

        update(type)

        break;
      case "accentColor":

        update(type)

        break;
      case "background":

        update(type)

        break;
      default:
    }
    return {
      type: 'hex/update',
      payload: artboards
    }
  },
  addNewArtboard(json) {
    const today = new Date();
    console.info("?????")
    return {
      type: 'add/artboard',
      payload: json
    }
  },
}
