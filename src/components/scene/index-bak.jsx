import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ShaderMaterial, Vector2 } from 'three';
import { Bloom, DepthOfField, ChromaticAberration, EffectComposer, Noise, Vignette, SSR } from '@react-three/postprocessing'
import { Environment, Html, PerspectiveCamera, Plane, Sphere, Box, RoundedBox, useProgress } from '@react-three/drei';
import envFile from '../../assets/images/metro_noord_4k.hdr';
// import { ShaderPass } from 'postprocessing'
import { TourCamera, OverviewCamera } from '../scene/cameras';

import Model from '../scene/model'
import './index.scss';

// Custom fragment shader for bloom effect
const bloomFragmentShader = `
  uniform sampler2D baseTexture;
  varying vec2 vUv;
  void main() {
    vec4 base = texture2D(baseTexture, vUv);
    vec4 bloom = base * 10.2; // Adjust the bloom intensity here
    gl_FragColor = bloom;
  }
`;

function Loader({ setLoaded }) {
  const { progress } = useProgress();
  if (progress === 100) setLoaded(true);
  return (
    <Html className="preloader">
      <h1>{`Still Dripping... ${Math.round(progress)}%`}</h1>
    </Html>
  );
}

function Scene({ overview, scrollPercent, scrollOffset, lookAhead, setLoaded }) {
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
    MAX_STEPS: 20,
    NUM_BINARY_SEARCH_STEPS: 5,
    maxDepthDifference: 3,
    maxDepth: 1,
    thickness: 10,
    ior: 1.5
  }
  const [dpr, setDpr] = useState(1.0)

  return (
    <Canvas className='scene'
      dpr={dpr}
      shadows
      // shadowMap
      gl={{
        logarithmicDepthBuffer: true,
        // antialias: false,
        // stencil: false,
        // depth: false,
        // toneMapping: 1,
        // toneMappingExposure: .15
      }}
    >
      {/* <fog attach="fog" args={['black', 20, 100]} /> */}
      <ambientLight intensity={0.25} />
      {/* <PerformanceMonitorApi onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} ></PerformanceMonitorApi> */}
      <TourCamera makeDefault={!overview} lookAhead={lookAhead} scrollPercent={scrollPercent} scrollOffset={scrollOffset} />
      <OverviewCamera makeDefault={overview} />
      <Environment files={envFile} background={false} intensity={1} />
      <Suspense fallback={<Loader setLoaded={setLoaded} />}>
        <Model />
      </Suspense>
      <EffectComposer disableNormalPass>
        <SSR {...props} />
        <Vignette />
        <ChromaticAberration offset={new Vector2(.001, 0)} />
        {/* <RenderPass attachArray="passes" args={['scene', 'camera']} /> */}

        {/* <shaderPass attachArray="passes" args={[ShaderMaterial, {
          fragmentShader: bloomFragmentShader,
          uniforms: {
            baseTexture: { value: null },
          },
        }]} /> */}
      </EffectComposer>
    </Canvas>
  )
}


export default Scene;