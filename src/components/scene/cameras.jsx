import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector2, Vector3, CameraHelper, AxesHelper, CatmullRomCurve3, MeshBasicMaterial } from 'three';
import { useHelper, PerspectiveCamera, OrbitControls, OrthographicCamera, Sphere, Cone } from '@react-three/drei';
import { points } from '../../assets/models/camera-path.json';

const curve = new CatmullRomCurve3(points.map((p) => new Vector3(p.x, p.y, p.z)));
const lookAtTarget = new Vector3();
const positionTarget = new Vector3();
const lookAt = new Vector3();

export function TourCamera({ startPercent, camRotation, makeDefault, scrollPercent, lookAhead, returnToLounge, setReturnToLounge }) {
  const [containerPosition, setContainerPosition] = useState([0, 0, 0]);
  const progress = useRef(startPercent);
  const { gl } = useThree();
  const containerRef = useRef();
  const cameraRef = useRef();
  const pointerTarget = useRef(new Vector2())
  const rotationTarget = useRef(new Vector2());
  const rotationTarget2 = useRef(new Vector2());
  const drag = useRef(false);
  const framesWithMotion = useRef(0);

  useFrame(() => {
    // if (Math.abs(scrollPercent - progress.current) > .025) {
    //   framesWithMotion.current += 1;
    // }
    // else {
    //   framesWithMotion.current -= framesWithMotion.current > 0 ? 1 : 0;
    // }
    progress.current += (scrollPercent - progress.current) / 20;
    // console.log(Math.abs(scrollPercent - progress.current), framesWithMotion.current);
    curve.getPoint(progress.current % 1, positionTarget);
    curve.getPoint((progress.current + lookAhead) % 1, lookAtTarget);
    containerRef.current.position.copy(positionTarget)
    containerRef.current.lookAt(lookAtTarget);

    // if(framesWithMotion.current > 5) setCamRotation(0); 
    cameraRef.current.rotation.y += (camRotation - cameraRef.current.rotation.y) / 20;
  });

  const pointerDown = (e) => {
    drag.current = true;
    const { clientX, clientY } = e;
    const { width, height } = gl.domElement.getBoundingClientRect();
    pointerTarget.current.x = clientY / height;
    pointerTarget.current.y = clientX / width;
  }

  const pointerUp = () => {
    drag.current = false;
  }

  const pointerMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height } = gl.domElement.getBoundingClientRect();

    if (drag.current) {
      rotationTarget.current.x += ((clientY / height) - pointerTarget.current.x) * 4;
      rotationTarget.current.y += ((clientX / width) - pointerTarget.current.y) * 4;
    }

    rotationTarget2.current.y = (clientX / width) * -.2;
    rotationTarget2.current.x = (clientY / height) * .2;

    pointerTarget.current.x = clientY / height;
    pointerTarget.current.y = clientX / width;
  };

  useEffect(() => {
    // addEventListener('pointerdown', pointerDown);
    // addEventListener('pointermove', pointerMove);
    // addEventListener('pointerup', pointerUp);

    return () => {
      // removeEventListener('pointerdown', pointerDown);
      // removeEventListener('pointermove', pointerMove);
      // removeEventListener('pointerup', pointerUp);
    };
  }, []);

  useEffect(() => {
    if (returnToLounge) {
      console.log('jump the camera to the start')
      setReturnToLounge(false);
    }
  }, [returnToLounge])

  useEffect(() => {
    rotationTarget.current.y = Math.PI;

  }, [scrollPercent])

  return (
    <group ref={containerRef}
      position={containerPosition}
    >
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={makeDefault}
        fov={70}
        near={1}
        far={1000}
      >
        <Cone
          visible={!makeDefault}
          scale={[2, 4, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          material={new MeshBasicMaterial({ wireframe: true })}
        ></Cone>
      </PerspectiveCamera>

    </group>
  );
}

export function OverviewCamera({ makeDefault }) {
  return (
    <OrthographicCamera
      makeDefault={makeDefault}
      position={[0, 100, 0]}
      rotation={[-90 * (Math.PI / 180), 0, 0]}
      zoom={5}
    />
  );
}
