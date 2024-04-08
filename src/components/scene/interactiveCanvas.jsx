import React, { useEffect, useRef } from "react"
import { Texture } from "three";

function InteractiveCanvas({ x, y }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.fillStyle = 'pink';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.fillText('Hello, Canvas!', 50, 50);
  }, []);


  return (
    <canvas
      ref={canvasRef}
      width={1024}
      height={1024}
    />
  )
}

export default InteractiveCanvas