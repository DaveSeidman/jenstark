import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber'
import { AnimationMixer, VideoTexture, RepeatWrapping, MeshStandardMaterial } from 'three'
import { useGLTF, useTexture, MeshWobbleMaterial } from '@react-three/drei';
import sceneFile from '../../assets/models/scene.glb';
import { pages } from '../../../config.json'
// import InteractiveTexture from './interactiveTexture';

function Model({ triggerPlayback, scrollPercent, overview, x, y, passcode }) {
  const wobbleMat = useRef();
  // console.log(wobbleMat.current)
  // const [interactiveMesh, setInteractiveMesh] = useState();
  const clonedMeshes = useRef([]);
  const gltf = useGLTF(sceneFile);
  const fakeFloorMat = new MeshStandardMaterial();
  const realFloorMat = useRef(gltf.scene.getObjectByName('floor').material.clone());

  // console.log(gltf.scene)

  const alloySign = gltf.scene.getObjectByName('alloy')
  const lucidCar = gltf.scene.getObjectByName('lucid-car_passcodes_lucid')
  // console.log(alloySign);
  const videoTextures = useRef({})
  const mixers = useRef([]);
  // const interactiveMaterialRef = useRef();

  // const totalPercent = (scrollPercent % 1) * 100;
  // let activeIndex = -1;
  // for (let i = 0; i < pages.length; i += 1) {
  //   if (pages[i].percent > totalPercent) {
  //     activeIndex = i - 1;
  //     break;
  //   }
  // }
  // TODO: if we want to be clever, we can add which videos should be playing
  // in each page object from pages and then trigger them to start or stop
  // based on where we are in the experience.

  const startVideos = () => {
    // console.log('start all videos')
    Object.keys(videoTextures.current).forEach((name) => {
      if (!videoTextures.current[name].source.data) {
        // console.log('vid not found?', name);
      } else {
        videoTextures.current[name].source.data.play();
        videoTextures.current[name].needsUpdate = true
      }
    })
  }

  useEffect(() => {
    // console.log("doing stuff with model")
    let animCount = 0;

    // TODO: look into shadow baking

    const sun = gltf.scene.getObjectByName('Sun');
    // sun.intensity = 5;
    // sun.shadow.mapSize.width = 64;
    // sun.shadow.mapSize.height = 64;
    // sun.shadow.camera.near = 0.01;
    // sun.shadow.camera.far = 10;
    // sun.shadow.bias = .0001;

    // setSun(sun);
    // sun.rotation.y += .1


    // const passcodeObjects = gltf.scene.getObjectByName('_passcodes');
    // if (!passcodeObjects) console.log('passcodes object missing!')

    // if (passcodeObjects && passcode) {
    //   passcodeObjects.children.forEach((child) => {
    //     child.visible = child.name === passcode
    //   })
    // }

    // if (clonedMeshes.current.length === 0) {

    gltf.scene.traverse((obj) => {
      // if (obj.name.includes('Couch')) {
      //   console.log(obj);
      // }
      if (obj.name !== '_passcodes' && obj.name.includes('passcodes')) {
        const passcodes = obj.name.split('_').slice(obj.name.split('_').indexOf('passcodes') + 1);
        obj.visible = passcodes.indexOf(passcode) >= 0;
        // console.log(obj.name, passcodes, passcode, passcodes.indexOf(passcode))
      }
      // if (obj.name.includes('projector_beam')) {
      //   wobbleMat.current.transparent = true;
      //   wobbleMat.current.opacity = .1;
      //   wobbleMat.current.alphaMap = obj.material.alphaMap;
      //   obj.material = wobbleMat.current;
      // }

      if (obj.name.includes('clone') && !obj.name.includes('cloned')) {
        const name = obj.name.slice(0, -9);
        const originalObject = gltf.scene.getObjectByName(name);
        if (originalObject) {
          const clonedObject = originalObject.clone();
          clonedObject.name = `${name}_cloned`;
          clonedObject.position.copy(obj.position);
          obj.parent.add(clonedObject);
          clonedMeshes.current.push(clonedObject)
        } else console.log('couldn\'t find', name)
      }

      if (obj.isLight) {
        obj.distance = 5;
        // obj.castShadow = true;
      }

      if (obj.type === 'SkinnedMesh') {
        obj.frustumCulled = false;
        const mixer = new AnimationMixer(obj)
        mixers.current.push(mixer);
        // TODO: we'll need to store the animation name, maybe as something we can parse from the obj name
        const action = mixer.clipAction(gltf.animations[animCount]);
        action.play();
        animCount += 1;
      }

      if (obj.material?.name.includes('mp4') && !obj.material?.name.includes('ComingSoon') && !videoTextures.current[obj.material.name]) {
        const video = document.createElement('video');
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
        video.setAttribute('muted', true);
        video.setAttribute('loop', true);
        video.src = `./videos/${obj.material.name.replace(/\.mp4.+$/, '.mp4')}`;
        const videoTexture = new VideoTexture(video)
        videoTexture.flipY = false;
        videoTexture.wrapS = RepeatWrapping;
        videoTexture.wrapT = RepeatWrapping;
        videoTextures.current[obj.material.name] = videoTexture;
        obj.material.map = videoTexture;
        obj.material.emissiveMap = videoTexture;
      }

      // if (obj.material?.name.toLowerCase().includes('interactive')) {
      // obj.material = interactiveMaterialRef.current;
      // setInteractiveMesh(obj);
      // }
    });
    // }

  }, [passcode])

  useEffect(() => {
    // console.log(videoTextures.current)
  }, [scrollPercent])

  useEffect(() => {
    const floorObject = gltf.scene.getObjectByName('floor');
    const newMaterial = overview ? fakeFloorMat.clone() : realFloorMat.current.clone();
    floorObject.material = newMaterial;

  }, [overview])

  useEffect(() => {
    if (triggerPlayback) {
      // console.log('triggerPlayback is true');
      startVideos();
    }
  }, [triggerPlayback])

  useFrame((_, delta) => {
    Object.keys(videoTextures.current).forEach(name => {
      // videoTextures.current[name].update();
    })

    alloySign.rotation.y += .005;
    lucidCar.rotation.y -= .005;

    mixers.current.forEach(mixer => {
      mixer.update(delta)
    })
  })

  return (
    <group>
      <primitive object={gltf.scene} />
      <mesh>
        <MeshWobbleMaterial ref={wobbleMat} />
      </mesh>
      {/* <mesh position={[-25, 5, 50]} rotation={[Math.PI, Math.PI / 2, Math.PI]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={2} ref={interactiveMaterialRef}>
          <InteractiveTexture
            x={x} y={y}
            scrollPercent={scrollPercent}
            interactiveMesh={interactiveMesh}
          ></InteractiveTexture>
        </meshBasicMaterial>
      </mesh> */}
    </group >
  );
}

export default Model;
