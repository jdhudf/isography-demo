export const getArtboardData = ({artboards,working,type}) => {

  if (artboards !== undefined) {
    //const artboards = artboard.artboards

    for(var i=0;i<artboards.length;i++){
      if(artboards[i].artboard_id === working){

        switch (type) {
          case "color_scheme":
            return artboards[i].canvas.color_scheme;
            //break;
          case "artboard_size":
            return artboards[i].canvas.artboard_size;
            //break;
          case "svg_data":
            return  artboards[i].canvas.svg_data
            //break;
          case "last_modified":
            return artboards[i].last_modified
            //break;
          case "artboard_name":
            return artboards[i].artboard_name
            //break;
          default:
        }

      }
    }

  } else {

  }
}

export const setArtboardData = ({type, value}) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.length;i++){
      if(json[i].artboard_id === json.working){

          switch (type) {
            case "mainColor":
              json[i].canvas.color_scheme["mainColor"] = value
              break;
            case "subColor":
              json[i].canvas.color_scheme["subColor"] = value
              break;
            case "accentColor":
              json[i].canvas.color_scheme["accentColor"] = value
              break;
            case "background":
              json[i].canvas.color_scheme["background"] = value
              break;
            case "artboard_size":
              json[i].canvas.artboard_size = value
              break;
            case "last_modified":
              json[i].last_modified = value
              break;
            case "artboard_name":
              json[i].artboard_name = value
              break;
            case "svg_data":
              json[i].canvas.svg_data = value
              break;
            default:
          }

      }
    }
    localStorage.setItem('isography', JSON.stringify(json));
  }
}

export const updateJson = ({json, type, value}) => {
  console.log(json)

  const artboards = json.artboards

  console.log(artboards)

  for(var i=0;i<artboards.length;i++){
    if(artboards[i].artboard_id === json.working){

        switch (type) {
          case "mainColor":
            artboards[i].canvas.color_scheme["mainColor"] = value
            break;
          case "subColor":
            artboards[i].canvas.canvas.color_scheme["subColor"] = value
            break;
          case "accentColor":
            artboards[i].canvas.color_scheme["accentColor"] = value
            break;
          case "background":
            artboards[i].canvas.color_scheme["background"] = value
            break;
          case "artboard_size":
            artboards[i].canvas.artboard_size = value
            break;
          case "last_modified":
            artboards[i].last_modified = value
            break;
          case "artboard_name":
            artboards[i].artboard_name = value
            break;
          case "svg_data":
            artboards[i].canvas.svg_data = value
            break;
          default:
        }

    }
  }
  return artboards
}


export const addNewArtboard = ({
  artboard_name,
  mainColor,
  subColor,
  accentColor,
  background,
  width,
  height,
  svg
}) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    const today = new Date();
    //const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

    const newData = {
      artboard_id: json.data.length + 1,
      artboard_name: artboard_name,
      created_at: today,
      last_modified: today,
      artboard_size: [width,height],
      svg_data: svg,
      color_scheme: {
        mainColor: mainColor,
        subColor: subColor,
        accentColor: accentColor,
        background: background
      }
    }

    json.data.push(newData)
    localStorage.setItem('isography', JSON.stringify(json));
  }
}

export const removeArtboard = (e) => {
  if (localStorage.getItem('isography') !== null) {
    const json = JSON.parse(localStorage.getItem('isography'));

    for(var i=0;i<json.data.length;i++){
      if(json.data[i].artboard_id === json.working){
          //json.data[i].artboard_name = e
          json.data.splice(i,1);
      }
    }
    localStorage.setItem('isography', JSON.stringify(json));
  }
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
