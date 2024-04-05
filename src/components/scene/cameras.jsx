import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector2, Vector3, CameraHelper, AxesHelper, CatmullRomCurve3, MeshBasicMaterial } from 'three';
import { useHelper, PerspectiveCamera, OrbitControls, OrthographicCamera, Sphere, Cone } from '@react-three/drei';
import { points } from '../../assets/models/camera-path.json';

const curve = new CatmullRomCurve3(points.map((p) => new Vector3(p.x, p.y, p.z)));
const lookAtTarget = new Vector3();
const positionTarget = new Vector3();
const lookAt = new Vector3();
export function TourCamera({ jump, makeDefault, scrollPercent, lookAhead, returnToLounge, setReturnToLounge }) {


  const [containerPosition, setContainerPosition] = useState([0, 0, 0]);
  const progress = useRef(1000.15);
  const { gl } = useThree();
  const containerRef = useRef();
  const cameraRef = useRef();
  const pointerTarget = useRef(new Vector2())
  const rotationTarget = useRef(new Vector2());
  const rotationTarget2 = useRef(new Vector2());
  const drag = useRef(false);

  // useHelper(cameraRef, makeDefault ? AxesHelper : CameraHelper, 'cyan');
  useFrame(() => {
    // if (jump) {
    //   console.log('jumping');
    //   progress.current = scrollPercent;
    // } else {
    // progress.current = scrollPercent;
    // progress.current += ((scrollPercent * (1 - (lookAhead * 2))) - progress.current) / 20;
    progress.current += (scrollPercent - progress.current) / 20
    // }
    // const { x, y, z } = curve.getPoint(progress.current);
    curve.getPoint(progress.current % 1, positionTarget);
    curve.getPoint((progress.current + lookAhead) % 1, lookAtTarget);
    // lookAt.x += (lookAtTarget.x - lookAt.x) / 10;
    // lookAt.y += (lookAtTarget.y - lookAt.y) / 10;
    // lookAt.z += (lookAtTarget.z - lookAt.z) / 10;
    // setContainerPosition([x, y, z]);
    // setContainerPo
    containerRef.current.position.copy(positionTarget)
    containerRef.current.lookAt(lookAtTarget);
    // cameraRef.current.rotation.x += (rotationTarget.current.x - cameraRef.current.rotation.x) / 20;
    // cameraRef.current.rotation.y += ((rotationTarget.current.y + rotationTarget2.current.y) - cameraRef.current.rotation.y) / 20;
    // cameraRef.current.rotation.x += (rotationTarget2.current.x - cameraRef.current.rotation.x) / 20;
    // cameraRef.current.rotation.y = rotationTarget.current.y;
    // cameraRef.current.rotation.x = rotationTarget.current.x;
    // coneRef.current.rotation.z = rotationTarget.current.x;
    // coneRef.current.rotation.y = rotationTarget.current.x;
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
