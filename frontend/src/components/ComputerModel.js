import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/computer.glb');

  // Оптимизация: отключаем тени и уменьшаем детализацию
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={5} rotation={[0, Math.PI * -0.45, 0]} />;
}

export default function ComputerModel() {
  return (
    <Canvas
      camera={{ position: [6, 3, 6], fov: 50 }}
      style={{ width: '100%', height: '700px' }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true
      }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow={false} />
        <directionalLight position={[-10, 5, -5]} intensity={0.8} castShadow={false} />
        <pointLight position={[0, 5, 0]} intensity={1} />
        <spotLight position={[5, 10, 5]} angle={0.3} intensity={1} castShadow={false} />
        <Model />
        <OrbitControls
          enabled={false}
        />
      </Suspense>
    </Canvas>
  );
}
