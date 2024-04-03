import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ShaderMaterial, Vector2, NoToneMapping, LinearToneMapping, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping, CustomToneMapping } from 'three';
import { Bloom, DepthOfField, ChromaticAberration, EffectComposer, Noise, Vignette, SSR } from '@react-three/postprocessing'
import { Environment, Html, PerspectiveCamera, Plane, Sphere, Box, RoundedBox, useProgress } from '@react-three/drei';
import envFile from '../../assets/images/metro_noord_4k.hdr';
import { TourCamera, OverviewCamera } from '../scene/cameras';

import Model from '../scene/model'
import './index.scss';

function Loader({ setLoaded }) {
  const { progress } = useProgress();
  if (progress === 100) setLoaded(true);
  return (
    <Html className="preloader">
      <h1>{`Loading... ${Math.round(progress)}%`}</h1>
    </Html>
  );
}

function Scene({ overview, scrollPercent, scrollOffset, lookAhead, setLoaded, triggerPlayback }) {
  const props = {
    temporalResolve: true,
    STRETCH_MISSED_RAYS: true,
    USE_MRT: true,
    USE_NORMALMAP: true,
    USE_ROUGHNESSMAP: true,
    ENABLE_JITTERING: true,
    ENABLE_BLUR: false,
    temporalResolveMix: 0.9,
    temporalResolveCorrectionMix: 0.25,
    maxSamples: 0,
    resolutionScale: 1,
    blurMix: 0.5,
    blurKernelSize: 8,
    blurSharpness: 0.5,
    rayStep: 0.3,
    intensity: .5,
    maxRoughness: 0.1,
    jitter: 0.7,
    jitterSpread: .75,
    jitterRough: 0.1,
    roughnessFadeOut: 1,
    rayFadeOut: 0,
    MAX_STEPS: 10,
    NUM_BINARY_SEARCH_STEPS: 5,
    maxDepthDifference: 3,
    maxDepth: 1,
    thickness: 10,
    ior: 1.5
  }
  const [dpr, setDpr] = useState(1)

  return (
    <Canvas
      className='scene'
      performance={{ min: 0.5 }} // TODO: test this on mobile
      dpr={dpr}
      // shadows
      // shadowMap
      gl={{
        logarithmicDepthBuffer: true,
        antialias: false,
        stencil: false,
        depth: false,
        toneMapping: LinearToneMapping,
        toneMappingExposure: .5
      }}
    >
      {/* <fog attach="fog" args={['black', 20, 100]} /> */}
      <ambientLight intensity={0.5} />
      {/* <PerformanceMonitorApi onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} ></PerformanceMonitorApi> */}
      <TourCamera makeDefault={!overview} lookAhead={lookAhead} scrollPercent={scrollPercent} scrollOffset={scrollOffset} />
      <OverviewCamera makeDefault={overview} />
      <Environment files={envFile} background={false} intensity={1} />
      <Suspense fallback={<Loader setLoaded={setLoaded} />}>
        <Model triggerPlayback={triggerPlayback} />
      </Suspense>
      <EffectComposer disableNormalPass>
        <SSR {...props} />
        <Bloom
          mipmapBlur={true}
          intensity={1.5}
          kernalSize={2}
          luminanceSmoothing={1.25}
          luminanceThreshold={.95}
        />
        {/* <ChromaticAberration offset={new Vector2(.0015, 0)} /> */}
        <Vignette />
      </EffectComposer>
    </Canvas>
  )
}


export default Scene;