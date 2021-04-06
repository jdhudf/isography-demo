import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {


  state = {
    displayColorPicker: false,
    color: `${this.props.color}`,
  };


  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.hex },()=>{
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    })
  };

  render() {


    const styles = reactCSS({
      'default': {
        color: {
          width: '25px',
          height: '25px',
          borderRadius: '4px',
          background: `${this.state.color}`,
          display: 'inline-block',
          border: 'solid 1px #E7E7E7',
          marginRight: '10px',
        },
        swatch: {
          padding: '3px',
          //background: '#fff',
          borderRadius: '5px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginTop: '1px',
          width: '150px',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          marginLeft: '30px',
          marginTop: '10px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });




    return (
      <div className="color-picker">

        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } /> <span>{this.state.color}</span>
        </div>
        {/*
          Conditional operator = condition ? true : false
          */}
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    );
  }
}


export default ColorPicker;
