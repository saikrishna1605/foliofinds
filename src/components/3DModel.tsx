// 3DModel.tsx
"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, useGLTF } from "@react-three/drei";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { useLoader as useThreeLoader } from "@react-three/fiber";
import * as THREE from "three";

function Model() {
  // Load textures (do NOT include /public in the path, Next.js serves from /public root)
  const colorMap = useTexture("/pbr/texture_diffuse.png");
  const normalMap = useTexture("/pbr/texture_normal.png");
  const roughnessMap = useTexture("/pbr/texture_roughness.png");
  const metallicMap = useTexture("/pbr/texture_metallic.png");

  // Load OBJ model
  const obj = useThreeLoader(OBJLoader, "/base.obj");

  // Defensive: ensure obj is a Group and has children
  const clonedObj = React.useMemo(() => obj.clone(), [obj]);

  React.useEffect(() => {
    clonedObj.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          map: colorMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          metalnessMap: metallicMap,
          color: 0xcccccc, // fallback color
        });
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });
  }, [clonedObj, colorMap, normalMap, roughnessMap, metallicMap]);

  // Center the model
  React.useEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedObj);
    const center = box.getCenter(new THREE.Vector3());
    clonedObj.position.sub(center);
  }, [clonedObj]);

  return <primitive object={clonedObj} scale={2} />;
}

export default function ThreeDModel() {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
