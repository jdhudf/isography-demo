import React from 'react';
import { connect } from 'react-redux'
import { actions } from '../redux/actions';

import {
  getArtboardData,
  updateArtboards,
  setCanvas,
  getCanvas
} from './handleLocalstorage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    this.logErrorToMyService(error, info);
  }

  logErrorToMyService = (error, info) => {

    console.info('error!!!!!!')

    const {
      undo,
      updateArtboard,
      past,
      artboards, working,
      switchSelected
    } = this.props

    const canvas = getCanvas({artboards: artboards, working: working})
    const svg_data = canvas.svg_data;

    undo(canvas)
    const newData = setCanvas({
      working: working,
      artboards: artboards, value: past[past.length-1]
    })

    updateArtboard(newData)
    switchSelected([])

    console.log("error is ... ",error)
    console.log("info is ... ",info)

  }

  render() {
    /*if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Sorry... Error happened.</h1>;
    }*/
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  darkmode: state.json.darkmode,
  working: state.json.working,
  artboards: state.artboards.present.artboards,
  selected: state.json.selected,
  past: state.history.past,
  future: state.history.future,
  present: state.history.present,
  textEditor: state.json.textEditor,
  editable: state.json.editable,
  addText: state.json.addText
})


export default connect(
  mapStateToProps,
  //dispatch => ({ switchDarkmode: value => dispatch(actions.switchDarkmode(value)) })
  dispatch => ({
    switchDarkmode: value => dispatch(actions.switchDarkmode(value)),
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
    recordHistory: value => dispatch(actions.recordHistory(value)),
    undo:           value => dispatch(actions.undo(value)),
    redo:           value => dispatch(actions.redo(value)),
  })
)(ErrorBoundary)
