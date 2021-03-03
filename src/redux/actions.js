import {
  updateJson,
} from '../components/handleLocalstorage'

//export const switchDarkmode = value => ({type: 'darkmode/switch', payload: value});

export const switchDarkmode = value => {
  console.log("action ~~~")
  return {type: 'darkmode/switch', payload: value}
}

export const actions = {
  switchDarkmode(value) {
    console.log("action!")
    return {
      type: 'darkmode/switch',
      payload: value
    }
  },
  changeHex({json,value,type}) {
    console.log("action!")
    return {
      type: 'artboard/update',
      payload: updateJson({ json: json, type:type , value: value})
    }
  },
  updTodo(value) {
    return {
      type: 'UPDTASK',
      value,
    }
  },
  delTodo(value) {
    return {
      type: 'DELTASK',
      value,
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
