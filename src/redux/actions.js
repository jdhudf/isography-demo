
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
  addTodo(value) {
    return {
      type: 'ADDTASK',
      payload: value
    }
  },
  fixTodo(value) {
    return {
      type: 'FIXTASK',
      payload: value
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
