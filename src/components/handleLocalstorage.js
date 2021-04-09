export const getArtboardData = ({artboards,working,type}) => {

  const copy =  JSON.parse(JSON.stringify(artboards));

  if (copy !== undefined) {
    //const artboards = artboard.artboards

    for(var i=0;i<copy.length;i++){
      if(copy[i].artboard_id === working){

        switch (type) {
          case "color_scheme":
            return copy[i].canvas.color_scheme;
            //break;
          case "artboard_size":
            return copy[i].canvas.artboard_size;
            //break;
          case "svg_data":
            return  copy[i].canvas.svg_data
            //break;
          case "last_modified":
            return copy[i].last_modified
            //break;
          case "artboard_name":
            return copy[i].artboard_name
            //break;
          case "grid":
            return copy[i].grid
            //break;
          default:
        }

      }
    }

  } else {

  }
}

export const getCanvas = ({artboards,working}) => {

  const copy =  artboards//artboardsJSON.parse(JSON.stringify(artboards));

  if (copy !== undefined) {
    //const artboards = artboard.artboards

    for(var i=0;i<copy.length;i++){
      if(copy[i].artboard_id === working){

        return copy[i].canvas

      }
    }

  } else {

  }
}

export const setCanvas = ({working, artboards,value}) => {

  const newData =  JSON.parse(JSON.stringify(artboards));

  for(var i=0;i<newData.length;i++){
    if(newData[i].artboard_id === working){

        newData[i].canvas = value

    }
  }
  return newData
}

export const updateArtboards = ({working, type, artboards,value}) => {

  const newData =  JSON.parse(JSON.stringify(artboards));

  for(var i=0;i<newData.length;i++){
    if(newData[i].artboard_id === working){

        switch (type) {
          case "mainColor":
            newData[i].canvas.color_scheme["mainColor"] = value
            break;
          case "subColor":
            newData[i].canvas.color_scheme["subColor"] = value
            break;
          case "accentColor":
            newData[i].canvas.color_scheme["accentColor"] = value
            break;
          case "background":
            newData[i].canvas.color_scheme["background"] = value
            break;
          case "artboard_size":
            newData[i].canvas.artboard_size = value
            break;
          case "last_modified":
            newData[i].last_modified = value
            break;
          case "artboard_name":
            newData[i].artboard_name = value
            break;
          case "svg_data":
            newData[i].canvas.svg_data = value
            break;
          case "grid":
            newData[i].grid = value
            break;
          case "canvas":
            newData[i].canvas = value
            break;
          default:
        }

    }
  }
  return newData
}


export const addNewArtboard = ({
  artboards,
  artboard_name,
  mainColor,
  subColor,
  accentColor,
  background,
  width,
  height,
  svg
}) => {

  const copy = JSON.parse(JSON.stringify(artboards));
  const today = new Date();

  const newData = {
    artboard_id: artboards.length + 1,
    artboard_name: artboard_name,
    created_at: today,
    last_modified: today,
    grid: 1,
    canvas: {
      artboard_size: [width,height],
      svg_data: svg,
      color_scheme: {
        mainColor: mainColor,
        subColor: subColor,
        accentColor: accentColor,
        background: background
      }
    }
  }

  copy.push(newData)

  return copy
}

export const removeArtboard = ({artboards,working}) => {

  for(var i=0;i<artboards.length;i++){
    if(artboards[i].artboard_id === working){
        //json.data[i].artboard_name = e
        artboards.splice(i,1);
    }
  }

  return artboards

}


export const artboardPosition = (e) => {

  if (localStorage.getItem('artboardPosition') === null) {
    localStorage.setItem('artboardPosition', JSON.stringify(e));
  }
  return  JSON.parse(localStorage.getItem('artboardPosition'))

}

export const artboardScale = (e) => {

  if (localStorage.getItem('artboardScale') === null) {
    localStorage.setItem('artboardScale', e);
  } else if (localStorage.getItem('artboardScale') === "0") {
    localStorage.setItem('artboardScale', 1);
  }
  return  JSON.parse(localStorage.getItem('artboardScale'))

}


export const getIsographyData = (e) => {

  if (localStorage.getItem('isography') === null) {

    const json = {
      darkmode: false,
      working: 1,
      artboards: [
        {
          artboard_id: 1,
          artboard_name: 'Artboard Name 1',
          created_at: 'Tue, 22 May 2018 13:20:00 GMT',
          last_modified: 'Tue, 22 May 2018 13:20:00 GMT',
          canvas: {
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
          }
        },
        {
          artboard_id: 2,
          artboard_name: 'Artboard Name 2',
          created_at: 'Tue, 22 May 2018 13:20:00 GMT',
          last_modified: 'Tue, 22 May 2018 13:20:00 GMT',
          canvas: {
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
          }
        },
      ],
      templates: [
        {
          name: "Square",
          ratio: [1,1],
        },
        {
          name: "Twitter Card Ratio",
          ratio: [1,0.75],
        },
        {
          name: "OGP Card Ratio",
          ratio: [1,0.55],
        },
        {
          name: "Golden Ratio",
          ratio: [1,1.25],
        },
        {
          name: "Silver Ratio",
          ratio: [1,0.65],
        },
      ],
    }

    localStorage.setItem('isography', JSON.stringify(json));

  }

  return  JSON.parse(localStorage.getItem('isography'))

}
