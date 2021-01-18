export function onWheel(e) {
  e.preventDefault();

  if (e.ctrlKey) {

    let scale = this.state.artboardScale;
    scale -= e.deltaY * 0.01;
    this.setState({ artboardScale: scale })

  } else {

    let posX = this.state.artboardPosition[0];
    let posY = this.state.artboardPosition[1];

    posX -= e.deltaX * 1;
    posY -= e.deltaY * 1;

    this.setState({ artboardPosition: [ posX ,posY] })

  }
}
