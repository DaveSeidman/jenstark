import React, { useEffect, useState, useRef } from "react"
import { useFrame } from "@react-three/fiber";
import testPattern from '../../assets/images/uv-test.jpg';
import { RepeatWrapping, CatmullRomCurve3, Vector3 } from "three";
import { points } from '../../assets/models/camera-path.json';
import sprite1 from '../../assets/images/sprite1.png'
import sprite2 from '../../assets/images/sprite2.png'
import sprite3 from '../../assets/images/sprite3.png'

function InteractiveTexture({ scrollPercent, interactiveMesh }) {
  const curve = new CatmullRomCurve3(points.map((p) => new Vector3(p.x, p.y, p.z)));

  const img1 = document.createElement('img');
  const img2 = document.createElement('img');
  const img3 = document.createElement('img');
  img1.src = sprite1;
  img2.src = sprite2;
  img3.src = sprite3;

  const sprites = [img1, img2, img3];
  const positionTarget = new Vector3();
  const canvasRef = useRef();
  const canvas = useRef(document.createElement('canvas'));
  canvas.current.width = 1024;
  canvas.current.height = 1024;
  const context = useRef(canvas.current.getContext('2d'));
  const camPosition = useRef({ x: 0, y: 0 })

  const padding = 100;

  const particles = useRef([]);
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

      camPosition.current.y = canvas.current.height * (1 - (positionTarget.x + (width / 2)) / width);
      camPosition.current.x = canvas.current.width * ((positionTarget.z + (height / 2)) / height);

      // context.current.fillText(`${camPosition.current.x.toFixed(2)}, ${camPosition.current.y.toFixed(2)}`, 200, 500)

      // context.current.beginPath();
      // context.current.arc(localX * canvas.current.width, localY * canvas.current.height, 50, 0, Math.PI * 2);
      // context.current.fillStyle = "blue";
      // context.current.fill();
      // textureRef.current.needsUpdate = true;

    }

  }, [scrollPercent])

  useFrame((_, delta) => {
    context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    context.current.beginPath();
    context.current.arc(camPosition.current.x, camPosition.current.y, 100, 0, Math.PI * 2);
    context.current.fillStyle = "blue";
    context.current.fill();
    particles.current.forEach((particle) => {
      particle.vx += particle.x < camPosition.current.x ? particle.speed : -particle.speed;
      particle.vy += particle.y < camPosition.current.y ? particle.speed : -particle.speed;

      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= particle.vxx;
      particle.vy *= particle.vyy;

      context.current.drawImage(
        particle.img,
        particle.x,
        particle.y,
        particle.size,
        100
      );
    })

    textureRef.current.needsUpdate = true;
  })

  useEffect(() => {
    // particles.current = new Array(20).fill({

    // })
    const particleAmount = 50;

    for (let i = 0; i < particleAmount; i += 1) {
      particles.current.push({
        x: Math.random() * 1024, // Random x coordinate
        y: Math.random() * 1024, // Random y coordinate
        size: Math.random() * 50 + 50,
        speed: Math.random() * .1,
        vx: 0,
        vy: 0,
        vxx: 1 - (Math.random() * .01),
        vyy: 1 - (Math.random() * .01),
        rotation: Math.random() * Math.PI * 2,
        img: sprites[Math.floor(Math.random() * sprites.length)] // Replace 'YourSpriteName' with the actual sprite name
      })
    }

    // console.log(particles);
    particles.current.forEach(particle => { console.log(particle.x, particle.y) })
  }, [])

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