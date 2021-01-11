import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: `${this.props.color}`,
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.hex })
    this.props.method(color.hex)
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '25px',
          height: '25px',
          borderRadius: '2px',
          background: `${this.state.color}`,
        },
        swatch: {
          padding: '3px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
          marginTop: '1px',
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
      <div>

        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        {/*
          Conditional operator = condition ? true : false
          */}
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color }
          onChange={ this.handleChange } />
          {/*onChange={this.props.onChange(e.target.value)}/>*/}
        </div> : null }

      </div>
    );
  }
}


export default ColorPicker;
