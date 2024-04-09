import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber'
import { AnimationMixer, VideoTexture, RepeatWrapping, MeshStandardMaterial } from 'three'
import { useGLTF, useTexture } from '@react-three/drei';
import sceneFile from '../../assets/models/scene.glb';
import { pages } from '../../../config.json'
// import InteractiveTexture from './interactiveTexture';

function Model({ triggerPlayback, scrollPercent, x, y }) {

  const [interactiveMesh, setInteractiveMesh] = useState();

  // Ask GPT if we should move the gltf loading outside of here
  const gltf = useGLTF(sceneFile);
  const alloySign = gltf.scene.getObjectByName('alloy')
  const videoTextures = useRef({})
  const mixers = useRef([]);
  const interactiveMaterialRef = useRef();

  const totalPercent = (scrollPercent % 1) * 100;
  let activeIndex = -1;
  for (let i = 0; i < pages.length; i += 1) {
    if (pages[i].percent > totalPercent) {
      activeIndex = i - 1;
      break;
    }
  }
  // TODO: if we want to be clever, we can add which videos should be playing
  // in each page object from pages and then trigger them to start or stop
  // based on where we are in the experience.

  const startVideos = () => {
    console.log('start all videos')
    Object.keys(videoTextures.current).forEach((name) => {
      if (!videoTextures.current[name].source.data) {
        console.log('vid not found?', name);
      } else {
        videoTextures.current[name].source.data.play();
        videoTextures.current[name].needsUpdate = true
      }
    })
  }

  useEffect(() => {
    let animCount = 0;
    gltf.scene.traverse((obj) => {

      if (obj.name.includes('clone') && !obj.name.includes('cloned')) {
        const name = obj.name.slice(0, -9);
        const originalObject = gltf.scene.getObjectByName(name);
        if (originalObject) {
          const clonedObject = originalObject.clone();
          clonedObject.name = `${name}_cloned`;
          clonedObject.position.copy(obj.position);
          gltf.scene.add(clonedObject);
        } else console.log('couldnt find', name)
        // console.log(name, originalObject);
        // const originalObject = gltf.scene.getObjectByName()
      }

      if (obj.isLight) {
        obj.distance = 5;
        obj.castShadow = true;
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

      if (obj.material?.name.includes('mp4') && !videoTextures.current[obj.material.name]) {
        const video = document.createElement('video');
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
        video.setAttribute('muted', true);
        video.setAttribute('loop', true);
        video.src = `./videos/${obj.material.name.replace(/\.mp4.+$/, '.mp4')}`;
        const videoTexture = new VideoTexture(video)
        videoTexture.flipY = false;
        videoTexture.wrapS = RepeatWrapping;
        videoTextures.current[obj.material.name] = videoTexture;
        obj.material.map = videoTexture;
        obj.material.emissiveMap = videoTexture;
      }

      if (obj.material?.name.toLowerCase().includes('interactive')) {
        // obj.material = interactiveMaterialRef.current;
        // setInteractiveMesh(obj);
      }
    });

  }, [])

  useEffect(() => {
    if (triggerPlayback) {
      console.log('triggerPlayback is true');
      startVideos();
    }
  }, [triggerPlayback])

  useFrame((_, delta) => {
    Object.keys(videoTextures.current).forEach(name => {
      videoTextures.current[name].update();
    })

    alloySign.rotation.y += .005;

    mixers.current.forEach(mixer => {
      mixer.update(delta)
    })
  })

  return (
    <group>
      <primitive object={gltf.scene} />
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
