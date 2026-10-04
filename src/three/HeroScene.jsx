import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vertexShader, fragmentShader, postVertexShader, postFragmentShader } from "./shaders/dataFlowShaders";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene({ className = "" }) {
  const mountRef = useRef(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState(2);
  const [internalProgress, setInternalProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Refs for fast-changing values
  const scrollProgressRef = useRef(0);
  const performanceLevelRef = useRef(2);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    console.log('[HeroScene] Component mounted, prefersReduced:', prefersReduced);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) {
      setPerformanceLevel(0);
      performanceLevelRef.current = 0;
      return;
    }
    
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "";
    const isMobile = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
    const isLowEnd = /Intel.*HD|Intel.*UHD|Adreno.*[0-5][0-9][0-9]|Mali.*[TG]?[0-9]{2}/i.test(renderer);
    
    if (isMobile || isLowEnd) {
      setPerformanceLevel(1);
      performanceLevelRef.current = 1;
    } else {
      setPerformanceLevel(2);
      performanceLevelRef.current = 2;
    }
    console.log('[HeroScene] Performance level:', performanceLevelRef.current, 'Renderer:', renderer);
  }, []);

  // Create ScrollTrigger to track hero scroll progress
  useEffect(() => {
    if (prefersReduced) return;
    
    const heroSection = document.querySelector('section[style*="200vh"]') || mountRef.current?.closest('section');
    if (!heroSection) {
      console.warn('[HeroScene] Hero section not found for ScrollTrigger');
      return;
    }

    const st = ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        setInternalProgress(progress);
        scrollProgressRef.current = progress;
      },
    });

    return () => st.kill();
  }, [prefersReduced]);

  // Mouse tracking - lerp for smooth movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouseRef.current.x = e.clientX / window.innerWidth;
      targetMouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Main Three.js effect - runs ONCE on mount
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || prefersReduced) {
      console.log('[HeroScene] Skipping Three.js init - prefersReduced:', prefersReduced, 'mount:', !!mount);
      return;
    }

    console.log('[HeroScene] Initializing Three.js scene...');

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    console.log('[HeroScene] Mount dimensions:', width, 'x', height);

    if (width === 0 || height === 0) {
      console.error('[HeroScene] Mount has zero dimensions!');
      return;
    }

    const scene = new THREE.Scene();
    
    // Use perspective camera for 3D depth and dolly effect
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block"; // Ensure canvas is visible
    mount.appendChild(renderer.domElement);
    console.log('[HeroScene] Canvas appended to DOM:', renderer.domElement);

    // Post-processing composer
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    });

    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(new RenderPass(scene, camera));

    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
    });
    const postPass = new ShaderPass(postMaterial);
    composer.addPass(postPass);

    // Main data flow shader
    const flowMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uPerformanceLevel: { value: performanceLevelRef.current },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, flowMaterial);
    scene.add(quad);

    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      targetMouseRef.current.x = (e.clientX - rect.left) / rect.width;
      targetMouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const currentScrollProgress = scrollProgressRef.current;
      const currentPerformanceLevel = performanceLevelRef.current;

      // Smooth lerp mouse position
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

      // DRAMATIC SCROLL REACTIVITY
      // Camera dolly: move from z=12 to z=3 (9 units of movement)
      const cameraZ = THREE.MathUtils.lerp(12, 3, currentScrollProgress);
      camera.position.z = cameraZ;
      
      // Camera rotation: rotate 180 degrees around Y axis
      const cameraRotY = currentScrollProgress * Math.PI;
      camera.rotation.y = cameraRotY;
      
      // Camera tilt: slight up/down movement
      camera.rotation.x = Math.sin(currentScrollProgress * Math.PI * 2) * 0.15;

      // Scale the quad dramatically based on scroll (1.0 to 2.5x)
      const quadScale = THREE.MathUtils.lerp(1.0, 2.5, currentScrollProgress);
      quad.scale.setScalar(quadScale);

      // Rotate quad based on scroll
      quad.rotation.z = currentScrollProgress * Math.PI * 0.5;

      // Update shader uniforms
      flowMaterial.uniforms.uTime.value = elapsed;
      flowMaterial.uniforms.uScrollProgress.value = currentScrollProgress;
      flowMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      flowMaterial.uniforms.uPerformanceLevel.value = currentPerformanceLevel;

      postMaterial.uniforms.uTime.value = elapsed;
      postMaterial.uniforms.uScrollProgress.value = currentScrollProgress;
      postMaterial.uniforms.uResolution.value.set(width, height);

      composer.render();
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      
      renderer.setSize(w, h);
      composer.setSize(w, h);
      renderTarget.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      flowMaterial.uniforms.uResolution.value.set(w, h);
      postMaterial.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Mark as mounted for debugging
    setIsMounted(true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      
      geometry.dispose();
      flowMaterial.dispose();
      postMaterial.dispose();
      renderTarget.dispose();
      composer.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      setIsMounted(false);
    };
  }, [prefersReduced]);

  if (prefersReduced) {
    return (
      <div
        ref={mountRef}
        className={`${className} bg-base relative overflow-hidden`}
        aria-hidden="true"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-base via-surface to-base/80" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,217,192,0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 20%, rgba(124,111,255,0.1) 0%, transparent 60%)'
        }} />
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className={className} 
      aria-hidden="true"
      style={{ width: "100%", height: "100%", minHeight: "100%" }}
    />
  );
}