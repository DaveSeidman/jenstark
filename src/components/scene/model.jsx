import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber'
import { AnimationMixer, VideoTexture, RepeatWrapping, MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei';
import sceneFile from '../../assets/models/scene.glb';

function Model({ triggerPlayback }) {
  // Ask GPT if we should move the gltf loading outside of here
  const gltf = useGLTF(sceneFile);
  const alloySign = gltf.scene.getObjectByName('alloy')
  const videoTextures = useRef({})
  // const videosStarted = useRef(false);
  const mixers = useRef([]);


  const startVideos = () => {
    // console.log("here", videoTextures.current[Object.keys(videoTextures.current)[0]].source.data.paused)
    // if (videosStarted.current) return
    Object.keys(videoTextures.current).forEach((name) => {
      if (!videoTextures.current[name].source.data) {
        console.log('vid not found?', name);
      } else {

        videoTextures.current[name].source.data.play();
        videoTextures.current[name].needsUpdate = true
      }
      // videoTextures.current[name].needsUpdate = true;
      // videoTextures.current[name].needsPMREMUpdate = true
    })
    // videosStarted.current = true;
  }
  useEffect(() => {

    let animCount = 0;
    gltf.scene.traverse((obj) => {

      if (obj.name.includes('clone') && !obj.name.includes('cloned')) {
        // console.log(obj)
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
        const action = mixer.clipAction(gltf.animations[animCount]);
        action.play();
        animCount += 1;
      }

      if (obj.name === 'floor' || obj.name === 'sidewalk') {
        obj.receiveShadow = true;
        // obj.castShadow = true;
        // obj.smoothness = 5
        obj.material = new MeshStandardMaterial({
          color: obj.material.color,
          // color: 0x222222,
          // envMapIntensity: 0,
          roughness: 0,
          // metalness: 0,
          map: obj.material.map,
          normalMap: obj.material.normalMap
        })
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
        // obj.material.emissiveIntensity = .75;
      }
    });

    addEventListener('click', startVideos);

    return () => {
      removeEventListener('click', startVideos)
    }
  }, [])

  useEffect(() => {
    if (triggerPlayback) {
      console.log('play videos here');
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
    </group >
  );
}

export default Model;
