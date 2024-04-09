import React, { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber";
import testPattern from '../../assets/images/uv-test.jpg';
import { RepeatWrapping, CatmullRomCurve3, Vector3 } from "three";
import { points } from '../../assets/models/camera-path.json';
const curve = new CatmullRomCurve3(points.map((p) => new Vector3(p.x, p.y, p.z)));

function InteractiveTexture({ scrollPercent, interactiveMesh }) {
  const positionTarget = new Vector3();
  const canvasRef = useRef();
  const canvas = useRef(document.createElement('canvas'));
  canvas.current.width = 1024;
  canvas.current.height = 1024;
  const context = useRef(canvas.current.getContext('2d'));

  const image = document.createElement('img');
  image.src = testPattern;
  context.current.drawImage(image, 0, 0);
  const textureRef = useRef();

  useEffect(() => {
    context.current.drawImage(image, 0, 0);
    context.current.font = '80px Arial';
    context.current.fillStyle = 'red';

    curve.getPoint((scrollPercent % 1), positionTarget);
    if (interactiveMesh) {
      const { min, max } = interactiveMesh.geometry.boundingBox;
      const width = max.x - min.x;
      const height = max.z - min.z;
      interactiveMesh.worldToLocal(positionTarget)

      const localX = (positionTarget.z + (height / 2)) / height;
      const localY = 1 - ((positionTarget.x + (width / 2)) / width);

      context.current.fillText(`${localX.toFixed(2)}, ${localY.toFixed(2)}`, 200, 500)

      context.current.beginPath();
      context.current.arc(localX * canvas.current.width, localY * canvas.current.height, 50, 0, Math.PI * 2);
      context.current.fillStyle = "blue";
      context.current.fill();
      textureRef.current.needsUpdate = true;

    }

  }, [scrollPercent])

  useFrame((_, delta) => {
    // context.current.fillStyle = 'black';
    // context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
  })

  return (
    <canvasTexture
      flipY={false}
      ref={textureRef}
      attach="map"
      image={canvas.current}
    // wrapS={RepeatWrapping}
    // wrapT={RepeatWrapping}
    // repeat={[4, 4]}
    />
  )
}

export default InteractiveTexture