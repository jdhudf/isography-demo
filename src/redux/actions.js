const Actions = {
  switchDarkmode(value) {
    return {
      type: 'switchDarkmode',
      value,
    }
  },
  addTodo(value) {
    return {
      type: 'ADDTASK',
      value,
    }
  },
  fixTodo(value) {
    return {
      type: 'FIXTASK',
      value,
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

export default Actions
