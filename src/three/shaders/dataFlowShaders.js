// Vertex Shader - Fullscreen quad with UV passing through
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader - Raymarched Data Flow Field with DRAMATIC scroll reactivity
export const fragmentShader = /* glsl */ `
  #define PI 3.14159265359
  #define TAU 6.28318530718
  
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uPixelRatio;
  uniform float uPerformanceLevel; // 0=low, 1=medium, 2=high
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Brand colors
  const vec3 BASE_COLOR = vec3(0.043, 0.059, 0.078);       // #0B0F14
  const vec3 SIGNAL_CYAN = vec3(0.0, 0.851, 0.753);         // #00D9C0
  const vec3 VIOLET = vec3(0.486, 0.435, 1.0);              // #7C6FFF
  const vec3 VIOLET_DIM = vec3(0.25, 0.2, 0.7);
  const vec3 AMBER = vec3(1.0, 0.706, 0.329);               // #FFB454
  
  // Hash functions
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  vec2 hash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453123); }
  vec3 hash3(vec2 p) { return fract(sin(vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)))) * 43758.5453123); }
  
  // Noise functions
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Domain warping - AMPLITUDE INCREASES DRAMATICALLY WITH SCROLL
  vec2 warp(vec2 p, float t, float scrollProgress) {
    // Base warp amount: 0.3 at top, up to 1.2 at bottom (4x increase)
    float warpAmount = mix(0.3, 1.2, scrollProgress * scrollProgress); // quadratic for more drama
    vec2 q = vec2(fbm(p + vec2(t * 0.05, t * 0.03), 4),
                  fbm(p + vec2(t * 0.07, t * 0.04), 4));
    return p + warpAmount * q;
  }
  
  // Circuit trace SDF - creates sharp, technical lines
  float circuitTrace(vec2 p, float t, float seed, float scrollProgress) {
    // Scale increases with scroll - more detail visible deeper
    float traceScale = mix(6.0, 14.0, scrollProgress);
    vec2 warped = warp(p * traceScale + seed * 100.0, t, scrollProgress);
    float n = fbm(warped, 5);
    
    // Create sharp ridge lines (circuit traces)
    float ridges = 1.0 - abs(n - 0.5) * 2.0;
    ridges = smoothstep(0.7, 1.0, ridges);
    
    // Add perpendicular cross-traces - MORE at higher scroll
    float crossTrace = fbm(warped * 1.5 + vec2(t * 0.1, -t * 0.08) + seed * 200.0, 3);
    crossTrace = 1.0 - abs(crossTrace - 0.5) * 2.0;
    crossTrace = smoothstep(0.8, 1.0, crossTrace);
    
    // Trace thickness increases with scroll
    float traceWeight = mix(0.6, 1.2, scrollProgress);
    return max(ridges, crossTrace * traceWeight);
  }
  
  // Data packet pulse - MORE packets at higher scroll
  float dataPacket(vec2 p, float t, float traceSeed, float packetSeed, float scrollProgress) {
    float traceScale = mix(6.0, 14.0, scrollProgress);
    vec2 warped = warp(p * traceScale + traceSeed * 100.0, t, scrollProgress);
    float trace = circuitTrace(p, t, traceSeed, scrollProgress);
    
    if (trace < 0.5) return 0.0;
    
    // Create moving packets along the trace - SPEED increases with scroll
    float packetSpeed = mix(0.3, 0.8, scrollProgress);
    float packetPos = fract(t * packetSpeed + packetSeed * 0.7);
    float dist = abs(warped.y - packetPos);
    float packet = smoothstep(0.02, 0.0, dist) * 0.8;
    
    // Packet intensity increases with scroll
    return packet * mix(0.6, 1.5, scrollProgress);
  }
  
  // Glow/bloom contribution
  float glow(float d, float intensity) {
    return intensity * exp(-d * 12.0);
  }
  
  // 2D cross product (returns scalar)
  float cross2d(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    uv = (uv - 0.5) * aspect + 0.5;
    
    // DRAMATIC SCROLL-DRIVEN TRANSFORMS
    float scrollDolly = uScrollProgress * 3.0; // Increased from 2.5
    float scrollPanX = sin(uScrollProgress * PI * 2.0) * 0.25; // Increased pan
    float scrollPanY = cos(uScrollProgress * PI * 1.5) * 0.2;  // Increased pan
    
    // Mouse influence - STRONGER at higher scroll
    float mouseInfluenceStrength = mix(0.2, 0.6, uScrollProgress);
    vec2 mouseInfluence = (uMouse - 0.5) * mouseInfluenceStrength;
    
    // Time with scroll offset
    float t = uTime * 0.6 + scrollDolly * 0.5;
    
    // Base background - darkens slightly as we scroll deeper
    vec3 color = BASE_COLOR * mix(1.0, 0.85, uScrollProgress);
    
    // Subtle vignette - tightens with scroll
    float vignette = 1.0 - length(uv - 0.5) * mix(1.2, 1.8, uScrollProgress);
    color *= vignette * 0.85 + 0.15;
    
    // Multiple circuit layers with different seeds and speeds
    float layerCount = uPerformanceLevel >= 2.0 ? 6.0 : (uPerformanceLevel >= 1.0 ? 4.0 : 2.0);
    
    for (int i = 0; i < 6; i++) {
      if (float(i) >= layerCount) break;
      
      float seed = float(i) * 1.7 + 0.3;
      float layerSpeed = 0.15 + float(i) * 0.08;
      // Layer scale increases DRAMATICALLY with scroll
      float layerScale = mix(1.0 + float(i) * 0.3, 3.0 + float(i) * 1.0, uScrollProgress);
      // Layer alpha increases with scroll - more visible
      float layerAlpha = mix(0.1 + float(i) * 0.06, 0.35 + float(i) * 0.15, uScrollProgress);
      
      vec2 layerUv = (uv - 0.5) * layerScale + 0.5;
      layerUv += vec2(scrollPanX, scrollPanY) * float(i + 1) * 0.8;
      layerUv += mouseInfluence * (0.3 + float(i) * 0.15);
      
      // Main circuit trace - now scroll-aware
      float trace = circuitTrace(layerUv, t * layerSpeed, seed, uScrollProgress);
      
      if (trace > 0.0) {
        float layerProgress = float(i) / 5.0;
        vec3 traceColor = mix(SIGNAL_CYAN, VIOLET, layerProgress * 0.7 + 0.15);
        
        // Core trace - BRIGHTER at higher scroll
        float traceIntensity = mix(2.0, 5.0, uScrollProgress);
        color += traceColor * trace * layerAlpha * traceIntensity;
        
        // Glow around trace - MUCH stronger at higher scroll
        float glowIntensity = mix(0.5, 2.0, uScrollProgress);
        color += traceColor * glow(1.0 - trace, layerAlpha * glowIntensity);
        
        // Data packets - MORE and BRIGHTER at higher scroll
        int packetCount = uPerformanceLevel >= 2.0 ? 4 : (uPerformanceLevel >= 1.0 ? 3 : 2);
        for (int p = 0; p < 4; p++) {
          if (p >= packetCount) break;
          float packetSeed = seed + float(p) * 0.33;
          float packet = dataPacket(layerUv, t * layerSpeed, seed, packetSeed, uScrollProgress);
          if (packet > 0.0) {
            vec3 packetColor = mix(AMBER, SIGNAL_CYAN, float(p) * 0.3);
            color += packetColor * packet * 2.5;
            color += packetColor * glow(1.0 - packet, packet * 1.0);
          }
        }
      }
    }
    
    // Central "core" node - GROWS and PULSES dramatically with scroll
    float coreDist = length(uv - vec2(0.5 + scrollPanX, 0.5 + scrollPanY));
    float corePulse = 0.5 + 0.5 * sin(uTime * 1.8 + scrollDolly * 3.0);
    // Core radius expands from 0.15 to 0.35
    float coreRadius = mix(0.15, 0.35, uScrollProgress);
    float core = smoothstep(coreRadius, 0.0, coreDist) * corePulse * mix(0.4, 1.0, uScrollProgress);
    color += SIGNAL_CYAN * core * mix(1.0, 2.5, uScrollProgress);
    color += VIOLET * core * mix(0.5, 1.5, uScrollProgress);
    color += glow(coreDist, corePulse * mix(0.3, 1.2, uScrollProgress));
    
    // Secondary nodes (satellite servers) - ORBIT FASTER and FURTHER at higher scroll
    int nodeCount = uPerformanceLevel >= 2.0 ? 6 : (uPerformanceLevel >= 1.0 ? 4 : 3);
    for (int i = 0; i < 6; i++) {
      if (i >= nodeCount) break;
      float angle = float(i) * TAU / float(nodeCount) + uTime * mix(0.05, 0.25, uScrollProgress);
      // Orbit radius expands with scroll
      float radius = mix(0.35, 0.55, uScrollProgress) + 0.15 * sin(uTime * 0.4 + float(i));
      vec2 nodePos = vec2(0.5 + cos(angle) * radius, 0.5 + sin(angle) * radius * 0.7);
      nodePos += vec2(scrollPanX, scrollPanY);
      
      float nodeDist = length(uv - nodePos);
      // Node size increases with scroll
      float nodeSize = mix(0.035, 0.07, uScrollProgress);
      float node = smoothstep(nodeSize, 0.0, nodeDist);
      float nodePulse = 0.6 + 0.4 * sin(uTime * 2.2 + float(i) * 2.0);
      
      color += mix(SIGNAL_CYAN, VIOLET, float(i) * 0.2) * node * nodePulse * mix(0.4, 1.2, uScrollProgress);
    }
    
    // Connection lines between core and nodes - THICKER and BRIGHTER at higher scroll
    if (uPerformanceLevel >= 1.0) {
      for (int i = 0; i < 6; i++) {
        if (i >= nodeCount) break;
        float angle = float(i) * TAU / float(nodeCount) + uTime * mix(0.05, 0.25, uScrollProgress);
        float radius = mix(0.35, 0.55, uScrollProgress) + 0.15 * sin(uTime * 0.4 + float(i));
        vec2 nodePos = vec2(0.5 + cos(angle) * radius, 0.5 + sin(angle) * radius * 0.7);
        nodePos += vec2(scrollPanX, scrollPanY);
        
        vec2 toCore = vec2(0.5 + scrollPanX, 0.5 + scrollPanY) - nodePos;
        float lineDist = abs(cross2d(uv - nodePos, toCore)) / length(toCore);
        float linePos = dot(uv - nodePos, toCore) / dot(toCore, toCore);
        
        if (linePos > 0.0 && linePos < 1.0) {
          // Line thickness increases with scroll
          float lineThickness = mix(0.006, 0.018, uScrollProgress);
          float lineIntensity = mix(0.1, 0.5, uScrollProgress);
          float line = smoothstep(lineThickness, 0.0, lineDist) * lineIntensity;
          color += SIGNAL_CYAN * line * (0.4 + 0.4 * sin(uTime * 3.0 + float(i)));
        }
      }
    }
    
    // Scanline / CRT texture - more visible at higher scroll
    float scanlines = sin(uv.y * uResolution.y * 0.5 + uTime * 10.0) * mix(0.01, 0.04, uScrollProgress);
    color += vec3(scanlines) * 0.15;
    
    // Film grain - increases with scroll
    float grain = (hash(gl_FragCoord.xy + uTime * 100.0) - 0.5) * mix(0.01, 0.03, uScrollProgress);
    color += vec3(grain);
    
    // Color grading - pushes toward cyan/violet more aggressively at higher scroll
    float colorGrade = mix(1.0, 1.3, uScrollProgress);
    color *= vec3(1.0, colorGrade, colorGrade * 1.1);
    
    // Gamma correction
    color = pow(color, vec3(1.0 / 2.2));
    
    // Clamp
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Post-processing vertex shader (fullscreen)
export const postVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Post-processing fragment shader - Bloom + Chromatic Aberration + Vignette
// DRAMATIC scroll-based chromatic aberration and bloom
export const postFragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  vec3 saturate(vec3 c, float amount) {
    float gray = dot(c, vec3(0.299, 0.587, 0.114));
    return mix(vec3(gray), c, amount);
  }
  
  void main() {
    vec2 uv = vUv;
    vec4 color = texture(tDiffuse, uv);
    vec3 col = color.rgb;
    
    // Bloom - STRONGER at higher scroll
    vec3 bright = max(col - vec3(0.7), 0.0);
    float bloomAmount = mix(0.3, 1.0, uScrollProgress);
    float bloomStrength = length(bright) * bloomAmount;
    
    vec2 pixelSize = 1.0 / uResolution;
    vec3 bloom = vec3(0.0);
    for (int x = -3; x <= 3; x++) {
      for (int y = -3; y <= 3; y++) {
        vec2 offset = vec2(float(x), float(y)) * pixelSize * 4.0;
        vec4 texSample = texture(tDiffuse, uv + offset);
        vec3 sampleBright = max(texSample.rgb - vec3(0.7), 0.0);
        bloom += sampleBright * exp(-float(x*x + y*y) * 0.25);
      }
    }
    bloom /= 49.0;
    col += bloom * bloomStrength * 2.0;
    
    // DRAMATIC Chromatic aberration - 0 to 5 pixels at edges
    vec2 center = vec2(0.5);
    float caAmount = mix(0.0005, 0.006, uScrollProgress * uScrollProgress) + length(uv - center) * 0.004;
    vec2 caOffset = (uv - center) * caAmount;
    
    float r = texture(tDiffuse, uv + caOffset).r;
    float g = texture(tDiffuse, uv).g;
    float b = texture(tDiffuse, uv - caOffset).b;
    col = vec3(r, g, b);
    
    // Vignette - tighter at higher scroll
    float vignette = 1.0 - pow(length(uv - center) * mix(1.2, 1.8, uScrollProgress), 2.0);
    col *= vignette;
    
    // Color grading - more aggressive
    col = saturate(col, mix(1.1, 1.4, uScrollProgress));
    col *= vec3(1.0, 1.05, 1.1);
    
    // Final gamma
    col = pow(col, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;