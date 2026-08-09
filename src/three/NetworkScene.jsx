import { useEffect, useRef } from "react";
import * as THREE from "three";

// Renders an ambient, slowly-rotating node network — a literal nod to
// "cloud / server network" rather than a generic particle sphere.
export default function NetworkScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // ---- Build node graph ----
    const NODE_COUNT = 46;
    const nodes = [];
    const group = new THREE.Group();
    scene.add(group);

    const signalColor = new THREE.Color(0x00d9c0);
    const violetColor = new THREE.Color(0x7c6fff);

    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);

    for (let i = 0; i < NODE_COUNT; i++) {
      const isAccent = i % 9 === 0;
      const mat = new THREE.MeshBasicMaterial({
        color: isAccent ? violetColor : signalColor,
        transparent: true,
        opacity: isAccent ? 0.9 : 0.6,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);

      // distribute roughly within an ellipsoid volume
      const r = 5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta) * 1.15,
        r * Math.sin(phi) * Math.sin(theta) * 0.75,
        r * Math.cos(phi) * 0.6
      );
      mesh.userData.baseY = mesh.position.y;
      mesh.userData.floatSpeed = 0.2 + Math.random() * 0.3;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;

      group.add(mesh);
      nodes.push(mesh);
    }

    // connect nearby nodes with thin lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2c3a4a,
      transparent: true,
      opacity: 0.5,
    });
    const linePositions = [];
    const MAX_DIST = 3.1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if (d < MAX_DIST) {
          linePositions.push(
            nodes[i].position.x,
            nodes[i].position.y,
            nodes[i].position.z,
            nodes[j].position.x,
            nodes[j].position.y,
            nodes[j].position.z
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // a few traveling "packet" pulses along random edges
    const pulseGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: signalColor,
      transparent: true,
      opacity: 0.95,
    });
    const PULSE_COUNT = 7;
    const pulses = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      const mesh = new THREE.Mesh(pulseGeo, pulseMat.clone());
      mesh.userData = { a, b, t: Math.random(), speed: 0.15 + Math.random() * 0.25 };
      group.add(mesh);
      pulses.push(mesh);
    }

    let frameId;
    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      if (!prefersReduced) {
        group.rotation.y = t * 0.045 + mouseX * 0.15;
        group.rotation.x = mouseY * 0.08;

        nodes.forEach((n) => {
          n.position.y =
            n.userData.baseY +
            Math.sin(t * n.userData.floatSpeed + n.userData.floatOffset) * 0.12;
        });

        pulses.forEach((p) => {
          p.userData.t += p.userData.speed * 0.01;
          if (p.userData.t > 1) {
            p.userData.t = 0;
            p.userData.a = nodes[Math.floor(Math.random() * nodes.length)];
            p.userData.b = nodes[Math.floor(Math.random() * nodes.length)];
          }
          p.position.lerpVectors(
            p.userData.a.position,
            p.userData.b.position,
            p.userData.t
          );
        });
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      nodeGeo.dispose();
      lineGeo.dispose();
      pulseGeo.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
