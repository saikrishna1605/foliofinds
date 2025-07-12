"use client";

import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as THREE from 'three';

function Model() {
  const model = useLoader(OBJLoader, '/base.obj');

  // Center and scale the model
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center); // center the model

  return <primitive object={model} scale={0.8} />;
}

export function HomeModelViewer() {
  return (
    <div className="w-full h-[500px] mb-12 rounded-lg overflow-hidden shadow-lg border bg-muted/20">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
}
