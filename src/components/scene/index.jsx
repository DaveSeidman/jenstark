import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { LinearToneMapping } from 'three';
import { Bloom, EffectComposer, Vignette, SSR } from '@react-three/postprocessing'
import { Environment, useProgress, PerformanceMonitor } from '@react-three/drei';
import envFile from '../../assets/images/metro_noord_4k.hdr';
import { TourCamera, OverviewCamera } from '../scene/cameras';

import Model from '../scene/model'
import './index.scss';

function Scene({ startPercent, camRotation, returnToLounge, setReturnToLounge, overview, scrollPercent, scrollOffset, lookAhead, setLoaded, triggerPlayback, setAmountLoaded }) {
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
  const [dpr, setDpr] = useState(1.0)

  const { progress } = useProgress();
  setAmountLoaded(progress);
  if (progress === 100) setLoaded(true);

  return (
    <Canvas
      className='scene'
      performance={{ min: 0.5 }} // TODO: test this on mobile
      dpr={dpr}
      // shadows
      // shadowMap
      gl={{
        logarithmicDepthBuffer: true,
        // antialias: false,
        // stencil: false,
        // depth: false,
        toneMapping: LinearToneMapping,
        toneMappingExposure: .5
      }}
    >
      <PerformanceMonitor onIncline={() => setDpr(1)} onDecline={() => setDpr(0.75)} />

      {/* <fog attach="fog" args={['black', 20, 100]} /> */}
      <ambientLight intensity={0.5} />
      <TourCamera startPercent={startPercent} camRotation={camRotation} makeDefault={!overview} lookAhead={lookAhead} scrollPercent={scrollPercent} scrollOffset={scrollOffset} returnToLounge={returnToLounge} setReturnToLounge={setReturnToLounge} />
      <OverviewCamera makeDefault={overview} />
      <Environment files={envFile} background={false} intensity={1} />
      <Suspense>
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
        {/* <SSAO
          blendFunction={4} // blend mode
          samples={32} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          rings={2} // amount of rings in the occlusion sampling pattern
          distanceThreshold={.5} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
          distanceFalloff={0.5} // distance falloff. min: 0, max: 1
          rangeThreshold={0.15} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
          rangeFalloff={0.9} // occlusion range falloff. min: 0, max: 1
          luminanceInfluence={0.2} // how much the luminance of the scene influences the ambient occlusion
          radius={2} // occlusion sampling radius
          scale={2} // scale of the ambient occlusion
          bias={0.83} // occlusion bias
        /> */}
        <Vignette />
      </EffectComposer>
    </Canvas>
  )
}


export default Scene;