import {
  updateJson,
} from '../components/handleLocalstorage'

//export const switchDarkmode = value => ({type: 'darkmode/switch', payload: value});

export const switchDarkmode = value => {
  return {type: 'darkmode/switch', payload: value}
}

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

    let artboard;
    switch (type) {
      case "main":

        for (let i = 0; i < artboards.length; i++) {

          console.log("??????" + artboards[i].artboard_id)

          if (artboards[i].artboard_id === id) {
            artboard = artboards[i]
            console.log(type)
            console.log(artboards[i].canvas.color_scheme['mainColor'])
            artboards[i].canvas.color_scheme['mainColor'] = hex
            console.log(artboards[i].canvas.color_scheme['mainColor'])
          } else {
            console.log("へっ!")
          }
        }
        console.log("へへっ!")
      case "sub":

        break;
      case "accent":

        break;
      case "background":

        break;
      default:
    }
    return {
      type: 'hex/update',
      payload: artboards
    }
  },
}

const setCanvasData = ({
  working:working_id,
  type: data_type,
  data: svg_data}) => {

  const { json, switchDarkmode } = this.props

  const darkmode = json.json.darkmode

  const artboard_array = json.json.json.data

  const working = json.json.json.working

  for (var i=0;i<artboard_array.length;i++){
    if (working === artboard_array[i].artboard_id) {

      console.log(artboard_array[i],artboard_array[i].color_scheme)
    } else {
      console.log(working,artboard_array[i].artboard_id)
    }
  }
}
