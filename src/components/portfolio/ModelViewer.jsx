import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Loading model...
      </span>
    </div>
  );
}

/**
 * Drag-to-rotate 3D model viewer.
 * `path` should point to a .glb/.gltf file, e.g. imported from src/assets.
 */
export function ModelViewer({ path, className = "" }) {
  return (
    <div className={`relative bg-[#050505] ${className}`}>
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [3, 2, 3], fov: 40 }}>
          <Stage environment="city" intensity={0.4} adjustCamera>
            <Model path={path} />
          </Stage>
          <OrbitControls
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.2}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
