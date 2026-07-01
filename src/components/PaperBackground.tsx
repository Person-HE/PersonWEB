/**
 * Three.js 纸张背景 —— 漂浮的纸纤维 + 鼠标交互墨水扩散
 *
 * 设计意图：
 * - 背景（layer-bg）：缓慢流动的纸纤维粒子，营造手绘纸张的呼吸感
 * - 鼠标移动产生墨点扩散，符合手绘的"墨水"主题
 * - 不抢戏，仅作为氛围层服务手绘风格
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/** 纸纤维粒子系统 */
function PaperFibers() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // 生成 ~400 个随机分布的"纸纤维"粒子
  const positions = useMemo(() => {
    const count = 400;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * viewport.width * 2.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [viewport.width, viewport.height]);

  // 每个粒子的漂浮速度（独立随机）
  const speeds = useMemo(() => {
    const count = 400;
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const pos = geom.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < speeds.length; i++) {
      // 缓慢漂浮 + 正弦扰动 = 呼吸感
      pos[i * 3] += speeds[i].x + Math.sin(t * 0.3 + speeds[i].phase) * 0.002;
      pos[i * 3 + 1] += speeds[i].y + Math.cos(t * 0.4 + speeds[i].phase) * 0.002;

      // 边界循环（飘出视野则从对面回来）
      const w = viewport.width * 1.3;
      const h = viewport.height * 1.3;
      if (pos[i * 3] > w) pos[i * 3] = -w;
      if (pos[i * 3] < -w) pos[i * 3] = w;
      if (pos[i * 3 + 1] > h) pos[i * 3 + 1] = -h;
      if (pos[i * 3 + 1] < -h) pos[i * 3 + 1] = h;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3A3A3A"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** 鼠标跟随的墨水光晕（大尺寸半透明球）*/
function InkGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, -2));

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // 弹性追踪鼠标：阻尼衰减模拟物理
    targetPos.current.x = pointer.x * 4;
    targetPos.current.y = pointer.y * 2.5;
    meshRef.current.position.lerp(targetPos.current, 1 - Math.pow(0.001, delta));
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <circleGeometry args={[1.8, 32]} />
      <meshBasicMaterial
        color="#D7263D"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </mesh>
  );
}

/** 几个漂浮的手绘风装饰几何（墨点/小方块）*/
function FloatingDoodles() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const doodles = useMemo(() => {
    const items = [];
    const colors = ['#D7263D', '#1B6CA8', '#F4A261', '#2A9D8F'];
    for (let i = 0; i < 8; i++) {
      items.push({
        x: (Math.random() - 0.5) * viewport.width * 2,
        y: (Math.random() - 0.5) * viewport.height * 2,
        z: (Math.random() - 0.5) * 3,
        size: 0.05 + Math.random() * 0.08,
        color: colors[i % colors.length],
        rotSpeed: (Math.random() - 0.5) * 0.3,
        floatSpeed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        type: i % 3, // 0:circle, 1:triangle, 2:square
      });
    }
    return items;
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const d = doodles[i];
      child.position.y = d.y + Math.sin(t * d.floatSpeed + d.phase) * 0.3;
      child.position.x = d.x + Math.cos(t * d.floatSpeed * 0.7 + d.phase) * 0.2;
      child.rotation.z = t * d.rotSpeed;
    });
  });

  return (
    <group ref={groupRef}>
      {doodles.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} rotation={[0, 0, d.phase]}>
          {d.type === 0 && <circleGeometry args={[d.size, 16]} />}
          {d.type === 1 && <circleGeometry args={[d.size, 3]} />}
          {d.type === 2 && <planeGeometry args={[d.size * 1.4, d.size * 1.4]} />}
          <meshBasicMaterial color={d.color} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function PaperBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <PaperFibers />
        <FloatingDoodles />
        <InkGlow />
      </Canvas>
    </div>
  );
}
