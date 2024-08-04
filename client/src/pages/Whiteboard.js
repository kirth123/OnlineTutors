import React, {useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { SocketContext } from "./Context";

var server = process.env.REACT_APP_SERVER;

function Whiteboard(props) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  var context, canvas;
  const { socket, peerSocket } = useContext(SocketContext);

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 1.5;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    context = canvas.getContext('2d');
    context.scale(1, 1);
    context.lineCap = 'butt';
    context.strokeSytle = 'green';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    socket.on("ondraw", ({x, y}) => {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    });

    socket.on('ondown', ({x, y}) => {
      contextRef.current.moveTo(x, y);
    });
  }, [socket]);

  function startDrawing({nativeEvent}) {
    if(peerSocket == '') {
      return;
    }

    var {offsetX, offsetY} = nativeEvent;
    socket.emit('down', {x: offsetX, y: offsetY, to: peerSocket});
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  }

  function finishDrawing() {
    contextRef.current.closePath();
    setDrawing(false);
  }

  function draw({nativeEvent}) {
    if(!drawing || peerSocket == '') {
      return;
    }

    var {offsetX, offsetY} = nativeEvent;
    socket.emit('draw', {x: offsetX, y: offsetY, to: peerSocket});
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }
  
  return (
    <canvas 
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}>
    </canvas>
  );
}

export default Whiteboard;