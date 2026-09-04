import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useScroll } from "framer-motion";
import * as THREE from "three";

const TEX_SIZE = 768;

// Paints a cratered moon height field, derives a real tangent-space normal
// map from it (finite-difference / Sobel-style gradient, wrapped so the
// sphere UV seam is invisible), and reuses the same field as a roughness
// map — so every crater actually catches and occludes light instead of
// faking it with a flat bump.
const useMoonTextures = () => {
  return useMemo(() => {
    const size = TEX_SIZE;
    const height = document.createElement("canvas");
    height.width = size;
    height.height = size;
    const hctx = height.getContext("2d");

    hctx.fillStyle = "#9a9a9a";
    hctx.fillRect(0, 0, size, size);

    const rand = (min, max) => min + Math.random() * (max - min);

    // maria (large dark plains)
    for (let i = 0; i < 7; i++) {
      const x = rand(0, size);
      const y = rand(0, size);
      const r = rand(size * 0.05, size * 0.13);
      const grad = hctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(0,0,0,0.28)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      hctx.fillStyle = grad;
      hctx.beginPath();
      hctx.arc(x, y, r, 0, Math.PI * 2);
      hctx.fill();
    }

    // craters: dark bowl + bright rim, drawn straight into the height field
    // so the normal map derived from it produces real occlusion
    for (let i = 0; i < 260; i++) {
      const x = rand(0, size);
      const y = rand(0, size);
      const r = rand(size * 0.006, size * 0.035);
      const depth = rand(0.35, 0.85);

      const bowl = hctx.createRadialGradient(x, y, 0, x, y, r);
      bowl.addColorStop(0, `rgba(0,0,0,${depth})`);
      bowl.addColorStop(0.75, `rgba(0,0,0,${depth * 0.25})`);
      bowl.addColorStop(1, "rgba(0,0,0,0)");
      hctx.fillStyle = bowl;
      hctx.beginPath();
      hctx.arc(x, y, r, 0, Math.PI * 2);
      hctx.fill();

      const rim = hctx.createRadialGradient(x, y, r * 0.75, x, y, r * 1.15);
      rim.addColorStop(0, "rgba(0,0,0,0)");
      rim.addColorStop(0.6, `rgba(255,255,255,${depth * 0.35})`);
      rim.addColorStop(1, "rgba(255,255,255,0)");
      hctx.fillStyle = rim;
      hctx.beginPath();
      hctx.arc(x, y, r * 1.15, 0, Math.PI * 2);
      hctx.fill();
    }

    // fine regolith speckle
    for (let i = 0; i < 4000; i++) {
      const x = rand(0, size);
      const y = rand(0, size);
      const shade = rand(-14, 14);
      hctx.fillStyle = `rgba(${shade > 0 ? 255 : 0},${shade > 0 ? 255 : 0},${shade > 0 ? 255 : 0},${Math.abs(shade) / 60})`;
      hctx.fillRect(x, y, 1.4, 1.4);
    }

    const heightData = hctx.getImageData(0, 0, size, size).data;
    const getHeight = (x, y) => {
      const xi = (x + size) % size;
      const yi = (y + size) % size;
      return heightData[(yi * size + xi) * 4] / 255;
    };

    const normalCanvas = document.createElement("canvas");
    normalCanvas.width = size;
    normalCanvas.height = size;
    const nctx = normalCanvas.getContext("2d");
    const normalImg = nctx.createImageData(size, size);
    const strength = 2.6;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (getHeight(x - 1, y) - getHeight(x + 1, y)) * strength;
        const dy = (getHeight(x, y - 1) - getHeight(x, y + 1)) * strength;
        const len = Math.sqrt(dx * dx + dy * dy + 1);
        const idx = (y * size + x) * 4;
        normalImg.data[idx] = ((dx / len) * 0.5 + 0.5) * 255;
        normalImg.data[idx + 1] = ((dy / len) * 0.5 + 0.5) * 255;
        normalImg.data[idx + 2] = ((1 / len) * 0.5 + 0.5) * 255;
        normalImg.data[idx + 3] = 255;
      }
    }
    nctx.putImageData(normalImg, 0, 0);

    // color/albedo map — same base tone, gently tinted by the height field
    // so maria/craters read as color, not just relief
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = size;
    colorCanvas.height = size;
    const cctx = colorCanvas.getContext("2d");
    const colorImg = cctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const h = getHeight(x, y);
        const v = 150 + (h - 0.6) * 190;
        const idx = (y * size + x) * 4;
        colorImg.data[idx] = v * 1.02;
        colorImg.data[idx + 1] = v * 1.0;
        colorImg.data[idx + 2] = v * 0.98;
        colorImg.data[idx + 3] = 255;
      }
    }
    cctx.putImageData(colorImg, 0, 0);

    const map = new THREE.CanvasTexture(colorCanvas);
    const normalMap = new THREE.CanvasTexture(normalCanvas);
    const roughnessMap = new THREE.CanvasTexture(height);
    if ("colorSpace" in map) map.colorSpace = THREE.SRGBColorSpace;

    return { map, normalMap, roughnessMap };
  }, []);
};

const useStarSprite = () => {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
};

const useNebulaTexture = () => {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      0,
      size * 0.5,
      size * 0.5,
      size * 0.5
    );
    grad.addColorStop(0, "rgba(34,229,238,0.32)");
    grad.addColorStop(0.5, "rgba(140,70,220,0.1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
};

const MOON_RADIUS = 1.9;

const Moon = ({ scrollYProgress }) => {
  const groupRef = useRef();
  const lightRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const { map, normalMap, roughnessMap } = useMoonTextures();

  useEffect(() => {
    const handleMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.current.y * 0.12,
        0.03
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        2.1 + pointer.current.x * 0.15,
        0.03
      );
    }
    if (lightRef.current) {
      const progress = scrollYProgress.get();
      const angle = THREE.MathUtils.lerp(Math.PI * 0.88, 0.02, progress);
      lightRef.current.position.set(
        Math.sin(angle) * 6,
        1.6,
        Math.cos(angle) * 6
      );
    }
  });

  return (
    <>
      <directionalLight ref={lightRef} intensity={3.2} color="#fff7e8" />
      <ambientLight intensity={0.08} color="#22e5ee" />
      <group ref={groupRef} position={[2.1, 0.6, 0]}>
        <mesh>
          <sphereGeometry args={[MOON_RADIUS, 128, 128]} />
          <meshStandardMaterial
            map={map}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(1.4, 1.4)}
            roughnessMap={roughnessMap}
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      </group>
    </>
  );
};

const STAR_VERTEX = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vTwinkle;
  void main() {
    vTwinkle = 0.5 + 0.5 * sin(uTime * 1.4 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z) * (0.55 + 0.45 * vTwinkle);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT = `
  uniform sampler2D uMap;
  varying float vTwinkle;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vec3(1.0), tex.a * (0.35 + 0.65 * vTwinkle));
  }
`;

const Starfield = () => {
  const materialRef = useRef();
  const starMap = useStarSprite();

  const { positions, sizes, phases } = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 22 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      size[i] = Math.random() * 1.8 + 0.4;
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, sizes: size, phases: phase };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMap: { value: starMap } }),
    [starMap]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={phases.length}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={STAR_VERTEX}
        fragmentShader={STAR_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Nebula = () => {
  const ref = useRef();
  const texture = useNebulaTexture();

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.004;
  });

  return (
    <mesh ref={ref} position={[-2.5, -0.5, -22]}>
      <planeGeometry args={[42, 42]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const SceneSetup = () => {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
  }, [gl]);
  return null;
};

const ScrollMoon = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneSetup />
        <Nebula />
        <Starfield />
        <Moon scrollYProgress={scrollYProgress} />
        <EffectComposer>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default ScrollMoon;
