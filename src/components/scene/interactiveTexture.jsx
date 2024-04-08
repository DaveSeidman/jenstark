import React, { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber";

function InteractiveTexture({ x, y }) {
  const canvasRef = useRef();
  const canvas = useRef(document.createElement('canvas'));
  canvas.current.width = 512;
  canvas.current.height = 512;
  const context = useRef(canvas.current.getContext('2d'));
  const textureRef = useRef();

  useFrame((_, delta) => {
    context.current.fillStyle = 'black';
    context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
    context.current.font = '40px Arial';
    context.current.fillStyle = 'white';
    context.current.fillText(`Hello! ${x}, ${y}`, x, 250);
    textureRef.current.needsUpdate = true;

  })

  return (
    <canvasTexture
      flipY={false}
      ref={textureRef}
      attach="map"
      image={canvas.current}
    />
  )
}

export default InteractiveTexture