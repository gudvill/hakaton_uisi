import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

const Model = () => {
  const meshRef = useRef();
  const gltf = useLoader(GLTFLoader, '/models/letters_website.glb');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={[1.5, 1.5, 1.5]}
      position={[0, 0, 0]}
    />
  );
};

const Model3D = () => {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{
          width: '110%',
          height: '110%',
          marginLeft: '-5%',
          marginTop: '-5%',
          background: 'transparent'
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Model3D;