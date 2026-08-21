import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';

function Shapes() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[1, 1, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <boxGeometry args={[1.2, 1.6, 0.2]} />
          <meshPhysicalMaterial 
            color="#4f46e5" // indigo
            transmission={0.9} 
            opacity={1} 
            metalness={0.2} 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.5} 
          />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-1, -0.8, 0.8]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.5, 0.15, 16, 32]} />
          <meshPhysicalMaterial 
            color="#ec4899" // pink
            transmission={0.9} 
            opacity={1} 
            metalness={0.2} 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.5} 
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-0.5, 0.5, -1]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshPhysicalMaterial 
            color="#10b981" // emerald
            transmission={0.9} 
            opacity={1} 
            metalness={0.2} 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.5} 
          />
        </mesh>
      </Float>
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="city" />
        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, 0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Shapes />
        </PresentationControls>
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
