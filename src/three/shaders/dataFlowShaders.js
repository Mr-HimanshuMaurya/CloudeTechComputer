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

// Fragment Shader - Premium Engineered Data Flow Visualization
// Clean, technical, vibrant - designed for IT infrastructure brand
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
  
  // Brand colors - BRIGHT & VIBRANT
  const vec3 BASE_COLOR = vec3(0.035, 0.055, 0.085);       // Deep graphite-navy #090E16
  const vec3 BASE_DEEP = vec3(0.02, 0.035, 0.06);          // Even deeper for contrast
  const vec3 SIGNAL_CYAN = vec3(0.0, 0.92, 0.82);          // Bright signal cyan #00EBCC
  const vec3 SIGNAL_CYAN_SOFT = vec3(0.0, 0.65, 0.58);     // Softer variant
  const vec3 VIOLET = vec3(0.55, 0.5, 1.0);                // Bright violet #8C80FF
  const vec3 VIOLET_BRIGHT = vec3(0.7, 0.65, 1.0);         // Even brighter
  const vec3 AMBER = vec3(1.0, 0.78, 0.35);                // Warm amber #FFC759
  const vec3 WHITE_HOT = vec3(1.0, 0.98, 0.95);            // Near white for highlights
  const vec3 GRID_LINE = vec3(0.05, 0.15, 0.2);            // Subtle grid lines
  
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
  
  // Domain warping - scroll-controlled intensity
  vec2 warp(vec2 p, float t, float scrollProgress) {
    float warpAmount = mix(0.15, 0.6, smoothstep(0.0, 1.0, scrollProgress * 1.5));
    vec2 q = vec2(fbm(p + vec2(t * 0.04, t * 0.025), 4),
                  fbm(p + vec2(t * 0.06, t * 0.035), 4));
    return p + warpAmount * q;
  }
  
  // Clean technical grid pattern
  float gridPattern(vec2 p, float thickness) {
    vec2 grid = abs(fract(p - 0.5) - 0.5);
    float lines = step(grid.x, thickness) + step(grid.y, thickness);
    return min(lines, 1.0);
  }
  
  // Circuit trace - sharp technical lines
  float circuitTrace(vec2 p, float t, float seed, float scrollProgress) {
    float traceScale = mix(4.0, 10.0, scrollProgress);
    vec2 warped = warp(p * traceScale + seed * 100.0, t, scrollProgress);
    
    // Main ridges
    float n = fbm(warped, 5);
    float ridges = 1.0 - abs(n - 0.5) * 2.0;
    ridges = smoothstep(0.75, 1.0, ridges);
    
    // Cross traces
    float crossTrace = fbm(warped * 1.8 + vec2(t * 0.08, -t * 0.06) + seed * 200.0, 3);
    crossTrace = 1.0 - abs(crossTrace - 0.5) * 2.0;
    crossTrace = smoothstep(0.82, 1.0, crossTrace);
    
    float traceWeight = mix(0.7, 1.3, scrollProgress);
    return max(ridges, crossTrace * traceWeight);
  }
  
  // Data packets - clean moving dots
  float dataPacket(vec2 p, float t, float traceSeed, float packetSeed, float scrollProgress) {
    float traceScale = mix(4.0, 10.0, scrollProgress);
    vec2 warped = warp(p * traceScale + traceSeed * 100.0, t, scrollProgress);
    float trace = circuitTrace(p, t, traceSeed, scrollProgress);
    
    if (trace < 0.5) return 0.0;
    
    float packetSpeed = mix(0.25, 0.6, scrollProgress);
    float packetPos = fract(t * packetSpeed + packetSeed * 0.7);
    float dist = abs(warped.y - packetPos);
    float packet = smoothstep(0.015, 0.0, dist) * 0.9;
    
    return packet * mix(0.8, 1.8, scrollProgress);
  }
  
  // Glow function
  float glow(float d, float intensity) {
    return intensity * exp(-d * 15.0);
  }
  
  float cross2d(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
  }
  
  // Rounded rectangle SDF for UI elements
  float roundedRect(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + vec2(radius);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    uv = (uv - 0.5) * aspect + 0.5;
    
    // Scroll-driven transforms
    float scrollDolly = uScrollProgress * 3.5;
    float scrollPanX = sin(uScrollProgress * PI * 1.5) * 0.18;
    float scrollPanY = cos(uScrollProgress * PI * 1.2) * 0.12;
    
    // Mouse influence - stronger at bottom
    float mouseStrength = mix(0.15, 0.5, uScrollProgress);
    vec2 mouseInfluence = (uMouse - 0.5) * mouseStrength;
    
    // Time with scroll offset
    float t = uTime * 0.5 + scrollDolly * 0.4;
    
    // === BASE BACKGROUND - Clean gradient ===
    vec3 color = mix(BASE_COLOR, BASE_DEEP, uScrollProgress * 0.5);
    
    // Subtle radial gradient vignette
    float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - center) * mix(1.0, 1.4, uScrollProgress));
    color = mix(color, BASE_DEEP, (1.0 - vignette) * 0.6);
    
    // === SUBTLE GRID BACKGROUND (technical feel) ===
    float gridScale = mix(8.0, 16.0, uScrollProgress);
    vec2 gridUv = (uv - 0.5) * gridScale + vec2(scrollPanX, scrollPanY) * 20.0;
    float grid = gridPattern(gridUv, 0.003);
    color += GRID_LINE * grid * mix(0.15, 0.4, uScrollProgress);
    
    // === CIRCUIT TRACE LAYERS ===
    float layerCount = uPerformanceLevel >= 2.0 ? 5.0 : (uPerformanceLevel >= 1.0 ? 3.0 : 2.0);
    
    for (int i = 0; i < 5; i++) {
      if (float(i) >= layerCount) break;
      
      float seed = float(i) * 1.9 + 0.4;
      float layerSpeed = 0.12 + float(i) * 0.06;
      float layerScale = mix(1.0 + float(i) * 0.25, 2.5 + float(i) * 0.6, uScrollProgress);
      float layerAlpha = mix(0.12 + float(i) * 0.05, 0.3 + float(i) * 0.12, uScrollProgress);
      
      vec2 layerUv = (uv - 0.5) * layerScale + 0.5;
      layerUv += vec2(scrollPanX, scrollPanY) * float(i + 1) * 0.6;
      layerUv += mouseInfluence * (0.25 + float(i) * 0.1);
      
      float trace = circuitTrace(layerUv, t * layerSpeed, seed, uScrollProgress);
      
      if (trace > 0.0) {
        float layerProgress = float(i) / 4.0;
        // Color shifts from cyan to violet based on layer
        vec3 traceColor = mix(SIGNAL_CYAN, VIOLET_BRIGHT, layerProgress * 0.8 + 0.1);
        
        // Core trace - BRIGHT
        float traceIntensity = mix(3.0, 7.0, uScrollProgress);
        color += traceColor * trace * layerAlpha * traceIntensity;
        
        // Glow - strong and clean
        float glowIntensity = mix(1.0, 3.5, uScrollProgress);
        color += traceColor * glow(1.0 - trace, layerAlpha * glowIntensity);
        
        // Data packets - crisp and visible
        int packetCount = uPerformanceLevel >= 2.0 ? 4 : (uPerformanceLevel >= 1.0 ? 3 : 2);
        for (int p = 0; p < 4; p++) {
          if (p >= packetCount) break;
          float packetSeed = seed + float(p) * 0.3;
          float packet = dataPacket(layerUv, t * layerSpeed, seed, packetSeed, uScrollProgress);
          if (packet > 0.0) {
            vec3 packetColor = mix(AMBER, WHITE_HOT, float(p) * 0.25);
            color += packetColor * packet * 4.0;
            color += packetColor * glow(1.0 - packet, packet * 2.0);
          }
        }
      }
    }
    
    // === CENTRAL CORE NODE - The "Server" ===
    float coreDist = length(uv - vec2(0.5 + scrollPanX, 0.5 + scrollPanY));
    float corePulse = 0.4 + 0.6 * sin(uTime * 2.0 + scrollDolly * 2.5);
    float coreRadius = mix(0.12, 0.28, uScrollProgress);
    float core = smoothstep(coreRadius, 0.0, coreDist) * corePulse * mix(0.5, 1.2, uScrollProgress);
    color += SIGNAL_CYAN * core * mix(1.5, 3.5, uScrollProgress);
    color += VIOLET_BRIGHT * core * mix(0.8, 2.0, uScrollProgress);
    color += WHITE_HOT * core * mix(0.3, 1.0, uScrollProgress); // Hot center
    color += glow(coreDist, corePulse * mix(0.5, 2.0, uScrollProgress));
    
    // Core ring - pulsing outline
    float ringDist = abs(coreDist - coreRadius * 1.15);
    float ring = smoothstep(0.012, 0.0, ringDist) * (0.5 + 0.5 * sin(uTime * 3.0 + scrollDolly * 4.0));
    color += SIGNAL_CYAN * ring * mix(0.4, 1.2, uScrollProgress);
    
    // === ORBITING NODES - Satellite servers ===
    int nodeCount = uPerformanceLevel >= 2.0 ? 6 : (uPerformanceLevel >= 1.0 ? 4 : 3);
    for (int i = 0; i < 6; i++) {
      if (i >= nodeCount) break;
      float angle = float(i) * TAU / float(nodeCount) + uTime * mix(0.04, 0.18, uScrollProgress);
      float radius = mix(0.32, 0.48, uScrollProgress) + 0.08 * sin(uTime * 0.5 + float(i));
      vec2 nodePos = vec2(0.5 + cos(angle) * radius, 0.5 + sin(angle) * radius * 0.75);
      nodePos += vec2(scrollPanX, scrollPanY);
      
      float nodeDist = length(uv - nodePos);
      float nodeSize = mix(0.028, 0.055, uScrollProgress);
      float node = smoothstep(nodeSize, 0.0, nodeDist);
      float nodePulse = 0.5 + 0.5 * sin(uTime * 2.5 + float(i) * 2.1);
      
      vec3 nodeColor = mix(SIGNAL_CYAN, VIOLET, float(i) * 0.18);
      color += nodeColor * node * nodePulse * mix(0.6, 1.5, uScrollProgress);
      color += WHITE_HOT * node * nodePulse * 0.4; // Bright center
      
      // Node ring
      float nodeRing = smoothstep(nodeSize * 1.4, nodeSize * 1.35, nodeDist) * 0.6;
      color += nodeColor * nodeRing * 0.5;
    }
    
    // === CONNECTION LINES - Clean technical lines ===
    if (uPerformanceLevel >= 1.0) {
      for (int i = 0; i < 6; i++) {
        if (i >= nodeCount) break;
        float angle = float(i) * TAU / float(nodeCount) + uTime * mix(0.04, 0.18, uScrollProgress);
        float radius = mix(0.32, 0.48, uScrollProgress) + 0.08 * sin(uTime * 0.5 + float(i));
        vec2 nodePos = vec2(0.5 + cos(angle) * radius, 0.5 + sin(angle) * radius * 0.75);
        nodePos += vec2(scrollPanX, scrollPanY);
        
        vec2 toCore = vec2(0.5 + scrollPanX, 0.5 + scrollPanY) - nodePos;
        float lineDist = abs(cross2d(uv - nodePos, toCore)) / length(toCore);
        float linePos = dot(uv - nodePos, toCore) / dot(toCore, toCore);
        
        if (linePos > 0.0 && linePos < 1.0) {
          float lineThickness = mix(0.004, 0.012, uScrollProgress);
          float lineIntensity = mix(0.15, 0.5, uScrollProgress);
          // Dashed line effect
          float dash = fract(linePos * 12.0 + uTime * 0.5);
          float dashMask = step(0.4, dash);
          float line = smoothstep(lineThickness, 0.0, lineDist) * lineIntensity * dashMask;
          color += SIGNAL_CYAN * line * 0.8;
          color += VIOLET * line * 0.3;
        }
      }
    }
    
    // === MOUSE-REACTIVE GLOW POINT ===
    float mouseDist = length(uv - uMouse);
    float mouseGlow = glow(mouseDist, mix(0.15, 0.5, uScrollProgress));
    color += SIGNAL_CYAN * mouseGlow * 0.6;
    color += VIOLET * mouseGlow * 0.3;
    
    // === SCANLINES - Subtle CRT texture ===
    float scanlines = sin(uv.y * uResolution.y * 0.5 + uTime * 8.0) * mix(0.008, 0.025, uScrollProgress);
    color += vec3(scanlines) * 0.08;
    
    // === FILM GRAIN - Clean, not noisy ===
    float grain = (hash(gl_FragCoord.xy + uTime * 100.0) - 0.5) * mix(0.005, 0.015, uScrollProgress);
    color += vec3(grain);
    
    // === COLOR GRADING - Push brand colors ===
    float grade = mix(1.0, 1.25, uScrollProgress);
    color *= vec3(0.98, grade, grade * 1.05);
    
    // Lift shadows slightly for depth
    color = max(color, BASE_DEEP * 0.3);
    
    // Gamma correction
    color = pow(color, vec3(1.0 / 2.2));
    
    // Final clamp
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Post-processing vertex shader
export const postVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Post-processing fragment - Bloom + Chromatic Aberration + Vignette
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
    
    // === BLOOM - Bright areas bleed beautifully ===
    vec3 bright = max(col - vec3(0.65), 0.0);
    float bloomAmount = mix(0.4, 1.2, uScrollProgress);
    float bloomStrength = length(bright) * bloomAmount;
    
    vec2 pixelSize = 1.0 / uResolution;
    vec3 bloom = vec3(0.0);
    // Wider kernel for smoother bloom
    for (int x = -4; x <= 4; x++) {
      for (int y = -4; y <= 4; y++) {
        vec2 offset = vec2(float(x), float(y)) * pixelSize * 5.0;
        vec4 texSample = texture(tDiffuse, uv + offset);
        vec3 sampleBright = max(texSample.rgb - vec3(0.65), 0.0);
        float weight = exp(-float(x*x + y*y) * 0.18);
        bloom += sampleBright * weight;
      }
    }
    bloom /= 81.0;
    col += bloom * bloomStrength * 2.5;
    
    // === CHROMATIC ABERRATION - Dramatic at edges ===
    vec2 center = vec2(0.5);
    float caAmount = mix(0.0008, 0.008, uScrollProgress * uScrollProgress) + length(uv - center) * 0.005;
    vec2 caOffset = (uv - center) * caAmount;
    
    float r = texture(tDiffuse, uv + caOffset).r;
    float g = texture(tDiffuse, uv).g;
    float b = texture(tDiffuse, uv - caOffset).b;
    col = vec3(r, g, b);
    
    // === VIGNETTE - Cinematic ===
    float vignette = 1.0 - pow(length(uv - center) * mix(1.1, 1.6, uScrollProgress), 2.2);
    col *= vignette;
    
    // === COLOR GRADING - Brand palette push ===
    col = saturate(col, mix(1.15, 1.5, uScrollProgress));
    col *= vec3(0.98, 1.08, 1.12);
    
    // Lift midtones for richness
    col = pow(col, vec3(0.92));
    
    // Final gamma
    col = pow(col, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;