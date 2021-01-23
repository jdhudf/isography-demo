
import { getSVGdata,artboardScale,artboardPosition } from '../../handleLocalstorage'

export function onWheel(e) {

  const state = {
    artboardScale: artboardScale(1),
    artboardPosition:  artboardPosition([0,0]),
  }

  e.preventDefault();

  if (e.ctrlKey) {

    let scale = state.artboardScale;
    scale -= e.deltaY * 0.01;

    localStorage.setItem('artboardScale', scale);

    return scale

  } else {

    let posX = state.artboardPosition[0];
    let posY = state.artboardPosition[1];

    posX -= e.deltaX * 1;
    posY -= e.deltaY * 1;

    localStorage.setItem('artboardPosition', JSON.stringify([ posX ,posY]));

    return [ posX,posY ]

  }
}
