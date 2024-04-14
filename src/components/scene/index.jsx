import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { LinearToneMapping, BasicShadowMap } from 'three';
import { Bloom, EffectComposer, Vignette, SSR, SSAO } from '@react-three/postprocessing';
import { Environment, useProgress, PerformanceMonitor } from '@react-three/drei';
// import envFile from '../../assets/images/metro_noord_4k.hdr';
import envFile from '../../assets/images/TCom_NightOffices_2K_hdri_sphere.hdr';
import { TourCamera, OverviewCamera } from './cameras';

import Model from './model';
import './index.scss';

function Scene({ passcode, startPercent, camRotation, returnToLounge, setReturnToLounge, overview, scrollPercent, scrollOffset, lookAhead, setLoaded, triggerPlayback, setAmountLoaded }) {
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
    intensity: 0.5,
    maxRoughness: 0.1,
    jitter: 0.7,
    jitterSpread: 0.75,
    jitterRough: 0.1,
    roughnessFadeOut: 1,
    rayFadeOut: 0,
    MAX_STEPS: 10,
    NUM_BINARY_SEARCH_STEPS: 5,
    maxDepthDifference: 3,
    maxDepth: 1,
    thickness: 10,
    ior: 1.5,
  };
  const [dpr, setDpr] = useState(.75);

  const { progress } = useProgress();
  setAmountLoaded(progress);
  if (progress === 100) setLoaded(true);

  return (
    <Canvas
      className="scene"
      performance={{ min: 0.5 }} // TODO: test this on mobile
      dpr={dpr}
      // shadowmap={-1}
      // shadows
      // shadowMap
      gl={{
        // logarithmicDepthBuffer: true,
        // antialias: false,
        // stencil: false,
        // depth: false,
        toneMapping: LinearToneMapping,
        toneMappingExposure: .65,
      }}
    >
      <PerformanceMonitor onIncline={() => setDpr(1)} onDecline={() => setDpr(0.75)} />

      {/* <fog attach="fog" args={['black', 20, 100]} /> */}
      <ambientLight intensity={0.1} />
      <TourCamera startPercent={startPercent} camRotation={camRotation} makeDefault={!overview} lookAhead={lookAhead} scrollPercent={scrollPercent} scrollOffset={scrollOffset} returnToLounge={returnToLounge} setReturnToLounge={setReturnToLounge} />
      <OverviewCamera makeDefault={overview} />
      <Environment files={envFile} background intensity={0} />
      <Suspense>
        <Model
          passcode={passcode}
          triggerPlayback={triggerPlayback}
          scrollPercent={scrollPercent}
          x={(scrollPercent % 1) * 50}
          y={(scrollPercent % 1) * 25}
          overview={overview}
        />
      </Suspense>

      <EffectComposer disableNormalPass>
        <SSR {...props} />
        <Bloom
          mipmapBlur
          intensity={1.4}
          kernalSize={2}
          luminanceSmoothing={5.25}
          luminanceThreshold={0.95}
        />
        <Vignette />
        {/* <SSAO
          // blendFunction={}
          kernalSize={2}
          scale={2}
          radius={.2}
          bias={10}
          samples={16}
          distanceThreshold={.1}
        ></SSAO> */}
      </EffectComposer>
    </Canvas>
  );
}

export default Scene;
