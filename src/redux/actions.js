export const actions = {
  switchDarkmode(value) {
    return {
      type: 'darkmode/switch',
      payload: value
    }
  },
  switchGrid(value) {
    return {
      type: 'grid/switch',
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

    const newData = JSON.parse(JSON.stringify(artboards));

    const update = (type) => {

      for (let i = 0; i < newData.length; i++) {
        if (newData[i].artboard_id === id) {
          newData[i].canvas.color_scheme[type] = hex
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
      payload: newData
    }
  },
  addNewArtboard(json) {
    //const today = new Date();
    //console.info("?????")
    return {
      type: 'add/artboard',
      payload: json
    }
  },
  updateArtboard(value) {
    return {
      type: 'update/artboard',
      payload: value
    }
  },
  recordHistory(value) {
    return {
      type: 'record/history',
      payload: value
    }
  },
  resetHistory(value) {
    return {
      type: 'reset/history',
      payload: value
    }
  },
  undo(value) {
    return {
      type: 'UNDO',
      payload: value
    }
  },
  redo(value) {
    return {
      type: 'REDO',
      payload: value
    }
  },
  switchSelected(value) {
    return {
      type: 'selected/switch',
      payload: value
    }
  },
  toggleDrawer() {
    return {
      type: 'toggle/drawer',
    }
  },
  changeColorSet(value) {
    return {
      type: 'change/colors',
      payload: value
    }
  },
}
