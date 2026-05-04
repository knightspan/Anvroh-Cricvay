'use client';

// Your edited code goes here.

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Line } from '@react-three/drei';
import { Suspense } from 'react';

// Basic representation of a cricket pitch (approx 20.12m x 3.05m)
const Pitch = () => {
  return (
    <Box args={[3.05, 0.1, 20.12]} position={[0, -0.05, 0]}>
      <meshStandardMaterial color="#c2b280" />
    </Box>
  );
};

const Trajectory = ({ points, color = 'red' }: { points: [number, number, number][], color?: string }) => {
  return (
    <Line points={points} color={color} lineWidth={3} />
  );
};

const Ball = ({ position }: { position: [number, number, number] }) => {
  return (
    <Sphere args={[0.071, 16, 16]} position={position}>
      <meshStandardMaterial color="darkred" />
    </Sphere>
  );
};

export default function Pitch3D({ 
  trajectories = [] 
}: { 
  trajectories?: { points: [number, number, number][], color?: string }[] 
}) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <Canvas 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
        camera={{ position: [0, 12, 18], fov: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <Suspense fallback={null}>
          <Pitch />
          {trajectories.map((traj, idx) => (
            <group key={idx}>
              <Trajectory points={traj.points} color={traj.color} />
              <Ball position={traj.points[traj.points.length - 1]} />
            </group>
          ))}
        </Suspense>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the ground
        />
        <gridHelper args={[50, 50, '#334155', '#1e293b']} position={[0, -0.06, 0]} />
      </Canvas>
    </div>
  );
}


