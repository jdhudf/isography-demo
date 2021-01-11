import React, {useState, useRef} from "react"

//==============================
//  We edit each items by transform
//  (rotate,translate etc...)
//
//  That's why each items has states of
//  * x & y
//  * scale
//  * selected or not
//==============================
const DraggableItem = (props) => {
    const [x, setX] = useState(50);
    const [y, setY] = useState(50);
    const [gap, setGap] = useState({x: 0, y: 0})
    const [isMouseDown, setIsMouseDown] = useState(false)
    const svgRef = useRef(null)
    const isSelect = useState(false)


    // マウス押下時
    const onMouseDown = (e) => {
        setIsMouseDown(true);
        const rect = e.currentTarget.getBoundingClientRect();//client rect
        const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
        const mouseY = e.pageY;
        setGap({ x: mouseX - rect.left, y: mouseY - rect.top });
        console.log(e)
        console.log(rect)
        console.log( mouseX ,  mouseY)
    }

    // マウス移動時
    const onMouseMove = (e) => {
        // マウス押下中
        if (isMouseDown) {
            const mouseX = e.pageX;
            const mouseY = e.pageY;

            const svgRect = svgRef.current.getBoundingClientRect();
            const relativeX = mouseX - svgRect.left;
            const relativeY = mouseY - svgRect.top;

            setX(relativeX - gap.x);
            setY(relativeY - gap.y);
        }
    }

    // マウス押下解除時
    const onMouseUp = (e) => {
        setIsMouseDown(false);
    }

    const onMouseLeave = (e) => {
        setIsMouseDown(false);
    }

    const onSelect = (e, item) => {
      item = e.target;
        console.log(e.target)
    }

    const handleKeyPress = (event) => {
      if(event.key === 'Enter'){
        console.log('enter press here! ')
      }
    }

    const style = {
      background: "#fff",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    }

    const transform = `translate(${x} ${y})`

    return (
   <svg
      style={style}
      id="svg"
      version="1.1"
      width="500"
      height="400"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      fill="#fff"
      onKeyPress={handleKeyPress}
    >
    {/*<rect
      onClick={onSelect}
      width="100"
      height="100"
      x={x}
      y={y}
      className="main"
      stroke="#666"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    />*/}

      <g x={x}
         y={y}
         transform={transform}
         onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}
         onMouseMove={onMouseMove}
         onMouseLeave={onMouseLeave}
      >
      <path className="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"/><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" className="sub"/><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" className="accent"/>
      </g>
    </svg>
    )
}

function duplicateItems() {

}

export default DraggableItem;
