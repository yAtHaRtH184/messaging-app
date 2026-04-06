import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas   = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 0, 0);

    // Cyber Wave Particle Grid
    const gridX = 150, gridZ = 150, spacing = 2;
    const COUNT = gridX * gridZ;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const phases    = new Float32Array(COUNT);

    const color1 = new THREE.Color(0x00d4ff);
    const color2 = new THREE.Color(0x9945ff);
    const color3 = new THREE.Color(0xff00aa);

    let i = 0;
    for (let ix = 0; ix < gridX; ix++) {
      for (let iz = 0; iz < gridZ; iz++) {
        const x = (ix - gridX / 2) * spacing;
        const z = (iz - gridZ / 2) * spacing;
        positions[i * 3] = x; positions[i * 3 + 1] = 0; positions[i * 3 + 2] = z;
        phases[i] = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(x*x + z*z);
        const finalColor = new THREE.Color().lerpColors(
          color1, Math.random() > 0.5 ? color2 : color3, Math.sin(dist * 0.05) * 0.5 + 0.5
        );
        colors[i * 3] = finalColor.r; colors[i * 3 + 1] = finalColor.g; colors[i * 3 + 2] = finalColor.b;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('baseY',    new THREE.BufferAttribute(phases, 1));

    const material = new THREE.PointsMaterial({
      size: 0.35, vertexColors: true, transparent: true,
      opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = -0.1;
    scene.add(particles);

    // Background stars
    const starsGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(3000);
    for (let j = 0; j < 3000; j++) starPos[j] = (Math.random() - 0.5) * 400;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.3 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    let rafId;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime() * 0.8;

      camera.position.x += (mouseX * 15 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 10 + 30 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      stars.rotation.y = t * 0.02;

      const posAttr = geometry.attributes.position;
      const posArr = posAttr.array;
      let idx = 0;
      for (let ix = 0; ix < gridX; ix++) {
        for (let iz = 0; iz < gridZ; iz++) {
          const x = posArr[idx * 3], z = posArr[idx * 3 + 2];
          posArr[idx * 3 + 1] =
            Math.sin(ix * 0.1 + t) * 3 +
            Math.cos(iz * 0.1 + t * 0.8) * 3 +
            Math.sin(Math.sqrt(x*x + z*z) * 0.05 - t * 2) * 5;
          idx++;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose(); material.dispose();
      starsGeo.dispose(); starsMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="three-canvas" ref={canvasRef} />;
}
