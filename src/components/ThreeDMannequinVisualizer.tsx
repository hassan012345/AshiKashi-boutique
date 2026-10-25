import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  GarmentCategory, 
  NecklineType, 
  SleeveType, 
  BottomType,
  HemLength 
} from '../types/stitching';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Sparkles, Eye, Camera } from 'lucide-react';

interface ThreeDMannequinVisualizerProps {
  garmentId: GarmentCategory;
  neckline: NecklineType;
  sleeve: SleeveType;
  bottomStyle?: BottomType;
  length: HemLength;
  fabricColorHex: string;
  fabricName: string;
}

export const ThreeDMannequinVisualizer: React.FC<ThreeDMannequinVisualizerProps> = ({
  garmentId,
  neckline,
  sleeve,
  bottomStyle = 'patiala_shalwar',
  length,
  fabricColorHex,
  fabricName,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [showDupatta, setShowDupatta] = useState(false);
  const [activeAngle, setActiveAngle] = useState<'front' | 'three_quarter' | 'side' | 'back' | 'neck_zoom' | null>('three_quarter');
  const [hasInteracted, setHasInteracted] = useState(false);

  // References to Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const dupattaGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const fabricTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Flag to manage smooth camera transitions without fighting user manual OrbitControls or 360° turntable
  const isTransitioningRef = useRef<boolean>(false);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.1, 0.28, 3.4));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -0.20, 0));

  // Generate procedural woven cloth micro-texture
  const getFabricTexture = useCallback(() => {
    if (fabricTextureRef.current) return fabricTextureRef.current;
    
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 128, 128);

    // Subtle cross-weave threads
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let i = 0; i < 128; i += 4) {
      ctx.fillRect(i, 0, 2, 128);
      ctx.fillRect(0, i, 128, 2);
    }

    // Micro noise grains
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let x = 0; x < 128; x += 8) {
      for (let y = 0; y < 128; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 24);
    texture.colorSpace = THREE.SRGBColorSpace;
    fabricTextureRef.current = texture;
    return texture;
  }, []);

  // Cleanup helper for geometries and materials
  const disposeObjectHierarchy = (obj: THREE.Object3D) => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  };

  // Mount Three.js Scene and Mannequin Anatomy
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xFAF9F6);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.1, 0.28, 3.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Studio Environment lighting reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // OrbitControls: Full 360 degree rotation with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.5;
    controls.maxDistance = 5.2;
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.08; // Prevent flipping beneath floor
    // Center target on torso/dress midpoint (-0.20) for optimal full-body framing
    controls.target.set(0, -0.20, 0);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2.0;

    // When the user starts dragging to manually rotate or zoom, stop programmatic transition
    controls.addEventListener('start', () => {
      isTransitioningRef.current = false;
      setActiveAngle(null);
      setHasInteracted(true);
    });

    controlsRef.current = controls;

    // 4-Point Studio Lighting Rig (Vibrant, Clear, and True to Fabric Color)
    // 1. Direct frontal key fill - makes neckline, buttons, trims, and fabric texture clearly visible
    const frontKey = new THREE.DirectionalLight(0xFFFFFF, 1.25);
    frontKey.position.set(0, 1.4, 3.8);
    scene.add(frontKey);

    // 2. High warm key light with soft shadow casting
    const keyLight = new THREE.DirectionalLight(0xFFF8EE, 1.35);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // 3. Cool soft fill light to soften contrast
    const fillLight = new THREE.DirectionalLight(0xEEF3F8, 0.85);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // 4. Back rim light for crisp silhouette separation
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.15);
    rimLight.position.set(0, 2.5, -3.8);
    scene.add(rimLight);

    // 5. Ambient studio ground fill
    const ambientLight = new THREE.HemisphereLight(0xFFFAF2, 0xD7C6B8, 0.75);
    scene.add(ambientLight);

    // Studio Ground Grounding & Contact Shadow
    const floorGeo = new THREE.CircleGeometry(1.65, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xF3EDE4,
      roughness: 0.92,
      metalness: 0.02,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.45;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Soft Radial Contact Shadow
    const shadowGeo = new THREE.CircleGeometry(0.58, 36);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x362F28,
      transparent: true,
      opacity: 0.26,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -1.445;
    scene.add(contactShadow);

    // ==========================================
    // REALISTIC SARTORIAL DRESS FORM (MANNEQUIN)
    // ==========================================
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);

    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3A2416,
      roughness: 0.28,
      metalness: 0.12,
    });

    const brushedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.25,
      metalness: 0.88,
    });

    const linenDummyMat = new THREE.MeshStandardMaterial({
      color: 0xEDE5D8,
      roughness: 0.88,
      metalness: 0.02,
    });

    const seamTapeMat = new THREE.MeshBasicMaterial({
      color: 0x4A3E36,
      transparent: true,
      opacity: 0.45,
    });

    // 1. Turned Walnut Pedestal & Tripod Legs
    const poleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 1.48, 24),
      brushedBrassMat
    );
    poleMesh.position.y = -0.72;
    mannequinGroup.add(poleMesh);

    // Adjustment thumbscrew collar on pole
    const collarMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.05, 20),
      brushedBrassMat
    );
    collarMesh.position.y = -0.65;
    mannequinGroup.add(collarMesh);

    const wingScrew = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.02, 0.015),
      brushedBrassMat
    );
    wingScrew.position.set(0.045, -0.65, 0);
    mannequinGroup.add(wingScrew);

    // Turned wooden urn center
    const urnMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.095, 0.24, 24),
      walnutWoodMat
    );
    urnMesh.position.y = -1.33;
    mannequinGroup.add(urnMesh);

    // 3 Elegant curved tripod legs with brass tips
    for (let i = 0; i < 3; i++) {
      const legAngle = (i * Math.PI * 2) / 3;
      const legCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.32, 0),
        new THREE.Vector3(Math.cos(legAngle) * 0.18, -1.36, Math.sin(legAngle) * 0.18),
        new THREE.Vector3(Math.cos(legAngle) * 0.36, -1.43, Math.sin(legAngle) * 0.36),
      ]);
      const legMesh = new THREE.Mesh(
        new THREE.TubeGeometry(legCurve, 16, 0.022, 10, false),
        walnutWoodMat
      );
      mannequinGroup.add(legMesh);

      // Brass foot sabot
      const sabot = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 12, 12),
        brushedBrassMat
      );
      sabot.position.set(Math.cos(legAngle) * 0.36, -1.43, Math.sin(legAngle) * 0.36);
      mannequinGroup.add(sabot);
    }

    // 2. Neck Cap & Turned Finial
    const neckCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.072, 0.082, 0.06, 32),
      brushedBrassMat
    );
    neckCollar.position.y = 0.85;
    mannequinGroup.add(neckCollar);

    const finial = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 24, 24),
      walnutWoodMat
    );
    finial.scale.set(1, 1.25, 1);
    finial.position.y = 0.92;
    mannequinGroup.add(finial);

    // 3. Anatomical Contoured Torso (Tailor's Dress Form Lathe Geometry)
    const lathePoints: THREE.Vector2[] = [
      new THREE.Vector2(0.068, 0.84),  // neck top
      new THREE.Vector2(0.074, 0.76),  // neck mid
      new THREE.Vector2(0.092, 0.69),  // base of neck
      new THREE.Vector2(0.180, 0.63),  // clavicle / shoulder slope
      new THREE.Vector2(0.245, 0.57),  // upper bust
      new THREE.Vector2(0.258, 0.50),  // bust apex
      new THREE.Vector2(0.242, 0.42),  // underbust
      new THREE.Vector2(0.200, 0.32),  // ribcage
      new THREE.Vector2(0.182, 0.22),  // natural waist
      new THREE.Vector2(0.198, 0.12),  // high hip
      new THREE.Vector2(0.235, 0.02),  // hip swell
      new THREE.Vector2(0.252, -0.09), // full hip
      new THREE.Vector2(0.246, -0.20), // lower hip
      new THREE.Vector2(0.210, -0.30), // thigh cut
      new THREE.Vector2(0.040, -0.32), // base closure
      new THREE.Vector2(0.000, -0.32)
    ];

    const torsoGeo = new THREE.LatheGeometry(lathePoints, 48);
    // Scale on Z to create authentic feminine oval torso cross-section
    torsoGeo.scale(1.04, 1.0, 0.80);
    const torsoMesh = new THREE.Mesh(torsoGeo, linenDummyMat);
    torsoMesh.castShadow = !isSoftwareGl;
    torsoMesh.receiveShadow = !isSoftwareGl;
    mannequinGroup.add(torsoMesh);

    // Turned wooden shoulder caps / armhole stubs
    const leftArmStub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.02, 24),
      walnutWoodMat
    );
    leftArmStub.position.set(-0.25, 0.56, 0);
    leftArmStub.rotation.z = Math.PI / 2;
    mannequinGroup.add(leftArmStub);

    const rightArmStub = leftArmStub.clone();
    rightArmStub.position.x = 0.25;
    mannequinGroup.add(rightArmStub);

    // Sartorial Seam Tape Markings (Center front & Waistline tape)
    const centerFrontLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.005, 1.05, 0.005),
      seamTapeMat
    );
    centerFrontLine.position.set(0, 0.28, 0.21);
    mannequinGroup.add(centerFrontLine);

    const waistTape = new THREE.Mesh(
      new THREE.TorusGeometry(0.184, 0.006, 8, 36),
      seamTapeMat
    );
    waistTape.scale.set(1.04, 0.80, 1);
    waistTape.position.y = 0.22;
    waistTape.rotation.x = Math.PI / 2;
    mannequinGroup.add(waistTape);

    // Garment Meshes Container
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;
    scene.add(garmentGroup);

    // Dupatta Container
    const dupattaGroup = new THREE.Group();
    dupattaGroupRef.current = dupattaGroup;
    scene.add(dupattaGroup);

    // Render loop with smooth camera damping that never fights 360° turntable or manual OrbitControls
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Only interpolate camera when an angle preset or zoom button was actively requested
      if (isTransitioningRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.08);

        // Check if camera reached target threshold
        if (
          cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.012 &&
          controlsRef.current.target.distanceTo(targetLookAtRef.current) < 0.012
        ) {
          cameraRef.current.position.copy(targetCamPosRef.current);
          controlsRef.current.target.copy(targetLookAtRef.current);
          isTransitioningRef.current = false;
        }
      }

      // Always update OrbitControls (supports autoRotate turntable and smooth user drag)
      controlsRef.current?.update();

      renderer.render(scene, camera);
    };
    animate();

    // ResizeObserver for reliable canvas sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      disposeObjectHierarchy(scene);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update Procedural Pakistani Garment Meshes whenever configuration changes
  useEffect(() => {
    const garmentGroup = garmentGroupRef.current;
    if (!garmentGroup) return;

    // Clean existing meshes
    while (garmentGroup.children.length > 0) {
      const child = garmentGroup.children[0];
      disposeObjectHierarchy(child);
      garmentGroup.remove(child);
    }

    const fabricColor = new THREE.Color(fabricColorHex);

    // True-to-Swatch Pure Fabric Material (Restored from previous version)
    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: fabricColor,
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    // Antique Gold Gota / Tilla Thread Trim Material
    const goldGotaMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.22,
      metalness: 0.88,
      side: THREE.DoubleSide,
    });

    // Secondary tonal silk trim
    const toneTrimMaterial = new THREE.MeshStandardMaterial({
      color: fabricColor.clone().multiplyScalar(0.76),
      roughness: 0.35,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });

    const isBlouse = garmentId === 'saree_blouse';
    const isFrock = garmentId === 'kalidar_frock';
    const isMaxi = garmentId === 'formal_maxi';
    const isAngrakha = garmentId === 'angrakha_gharara';
    const isKameez = garmentId === 'shalwar_kameez' || garmentId === 'kurti_trouser';

    // 1. BODICE SHELL
    const bodiceHeight = isBlouse ? 0.36 : (isFrock || isAngrakha) ? 0.44 : 0.65;
    const bodiceGeo = new THREE.CylinderGeometry(0.270, isBlouse ? 0.225 : 0.216, bodiceHeight, 36, 1, true);
    bodiceGeo.scale(1.15, 1.0, 0.86);
    const bodiceMesh = new THREE.Mesh(bodiceGeo, fabricMaterial);
    bodiceMesh.position.y = isBlouse ? 0.47 : (isFrock || isAngrakha) ? 0.44 : 0.35;
    garmentGroup.add(bodiceMesh);

    // ==========================================
    // 2. PAKISTANI NECKLINE (گلا) 3D ARCHITECTURE
    // ==========================================
    const renderNecklineMesh = () => {
      switch (neckline) {
        case 'sherwani_collar': {
          // Ban Collar / Sherwani Stand with crisp front V-slit
          const banGeo = new THREE.CylinderGeometry(0.090, 0.095, 0.08, 36, 1, true, 0.3, Math.PI * 1.8);
          const banCollar = new THREE.Mesh(banGeo, goldGotaMaterial);
          banCollar.position.y = 0.77;
          garmentGroup.add(banCollar);

          // Front V-slit placket
          const placketGeo = new THREE.BoxGeometry(0.042, 0.32, 0.016);
          const placket = new THREE.Mesh(placketGeo, goldGotaMaterial);
          placket.position.set(0, 0.58, 0.205);
          garmentGroup.add(placket);

          // Pearl / Potli button drops (۴ عدد پوٹلی بٹن)
          for (let b = 0; b < 4; b++) {
            const btn = new THREE.Mesh(
              new THREE.SphereGeometry(0.009, 14, 14),
              new THREE.MeshStandardMaterial({ color: 0xFFFAF2, roughness: 0.15, metalness: 0.4 })
            );
            btn.position.set(0, 0.70 - b * 0.065, 0.218);
            garmentGroup.add(btn);
          }
          break;
        }

        case 'sweetheart': {
          // Paan Gala (پان گلا / سویٹ ہارٹ شیپ)
          const sweetheartCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.16, 0.69, 0.16),
            new THREE.Vector3(-0.09, 0.63, 0.19),
            new THREE.Vector3(0, 0.55, 0.205),
            new THREE.Vector3(0.09, 0.63, 0.19),
            new THREE.Vector3(0.16, 0.69, 0.16),
          ]);
          const tube = new THREE.Mesh(
            new THREE.TubeGeometry(sweetheartCurve, 28, 0.016, 10, false),
            goldGotaMaterial
          );
          garmentGroup.add(tube);
          break;
        }

        case 'angrakha_wrap': {
          // Royal Angrakha Diagonal Overlap with hanging Latkan tassels
          const angCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.17, 0.72, 0.13),
            new THREE.Vector3(-0.05, 0.58, 0.19),
            new THREE.Vector3(0.12, 0.38, 0.205),
          ]);
          const angTube = new THREE.Mesh(
            new THREE.TubeGeometry(angCurve, 24, 0.018, 10, false),
            goldGotaMaterial
          );
          garmentGroup.add(angTube);

          // Silk tie-up knot
          const knot = new THREE.Mesh(
            new THREE.TorusGeometry(0.016, 0.006, 8, 16),
            goldGotaMaterial
          );
          knot.position.set(0.12, 0.38, 0.22);
          garmentGroup.add(knot);

          // Hanging silk Dori and Latkan drops (لتکن)
          const tasselCordCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.12, 0.38, 0.22),
            new THREE.Vector3(0.14, 0.28, 0.225),
            new THREE.Vector3(0.13, 0.20, 0.22),
          ]);
          const cord = new THREE.Mesh(
            new THREE.TubeGeometry(tasselCordCurve, 12, 0.004, 6, false),
            goldGotaMaterial
          );
          garmentGroup.add(cord);

          const tasselBell = new THREE.Mesh(
            new THREE.ConeGeometry(0.018, 0.045, 14),
            goldGotaMaterial
          );
          tasselBell.position.set(0.13, 0.18, 0.22);
          tasselBell.rotation.x = Math.PI;
          garmentGroup.add(tasselBell);
          break;
        }

        case 'boat_neck': {
          // Kashti Gala (کشتی گلا / چوڑا بوٹ نیک)
          const boatCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.25, 0.71, 0.06),
            new THREE.Vector3(-0.12, 0.69, 0.15),
            new THREE.Vector3(0, 0.68, 0.18),
            new THREE.Vector3(0.12, 0.69, 0.15),
            new THREE.Vector3(0.25, 0.71, 0.06),
          ]);
          const boatMesh = new THREE.Mesh(
            new THREE.TubeGeometry(boatCurve, 28, 0.016, 10, false),
            goldGotaMaterial
          );
          garmentGroup.add(boatMesh);
          break;
        }

        case 'keyhole_dori': {
          // Teardrop Keyhole opening with dori tie-ups
          const keyholeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.04, 0.68, 0.18),
            new THREE.Vector3(-0.065, 0.59, 0.20),
            new THREE.Vector3(0, 0.53, 0.205),
            new THREE.Vector3(0.065, 0.59, 0.20),
            new THREE.Vector3(0.04, 0.68, 0.18),
          ]);
          const keyhole = new THREE.Mesh(
            new THREE.TubeGeometry(keyholeCurve, 24, 0.014, 8, false),
            goldGotaMaterial
          );
          garmentGroup.add(keyhole);

          // Hanging pearls at base of keyhole
          const bead = new THREE.Mesh(
            new THREE.SphereGeometry(0.014, 12, 12),
            goldGotaMaterial
          );
          bead.position.set(0, 0.51, 0.215);
          garmentGroup.add(bead);
          break;
        }

        case 'round_patti': {
          // Round neck with embroidered button patti
          const roundCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.14, 0.70, 0.15),
            new THREE.Vector3(0, 0.59, 0.205),
            new THREE.Vector3(0.14, 0.70, 0.15),
          ]);
          const roundMesh = new THREE.Mesh(
            new THREE.TubeGeometry(roundCurve, 22, 0.016, 8, false),
            goldGotaMaterial
          );
          garmentGroup.add(roundMesh);

          const patti = new THREE.Mesh(
            new THREE.BoxGeometry(0.042, 0.24, 0.014),
            goldGotaMaterial
          );
          patti.position.set(0, 0.47, 0.208);
          garmentGroup.add(patti);

          for (let b = 0; b < 3; b++) {
            const btn = new THREE.Mesh(
              new THREE.SphereGeometry(0.007, 10, 10),
              new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
            );
            btn.position.set(0, 0.54 - b * 0.07, 0.218);
            garmentGroup.add(btn);
          }
          break;
        }

        case 'square_cut': {
          // Chokor Gala (چوکور گلا / رائٹ اینگل)
          const sqPoints = [
            new THREE.Vector3(-0.16, 0.70, 0.12),
            new THREE.Vector3(-0.13, 0.57, 0.19),
            new THREE.Vector3(0.13, 0.57, 0.19),
            new THREE.Vector3(0.16, 0.70, 0.12),
          ];
          const sqCurve = new THREE.CatmullRomCurve3(sqPoints);
          const sqMesh = new THREE.Mesh(
            new THREE.TubeGeometry(sqCurve, 24, 0.016, 8, false),
            goldGotaMaterial
          );
          garmentGroup.add(sqMesh);
          break;
        }
      }
    };
    renderNecklineMesh();

    // ==========================================
    // 3. PAKISTANI SLEEVE (آستین) 3D ARCHITECTURE
    // ==========================================
    const renderSleeveMeshes = () => {
      switch (sleeve) {
        case 'choori_daar': {
          // Gathered Choori Daar Sleeves (چوڑی دار آستین)
          const slvLength = 0.68;
          const slvGeo = new THREE.CylinderGeometry(0.090, 0.062, slvLength, 24);

          const leftSlv = new THREE.Mesh(slvGeo, fabricMaterial);
          leftSlv.position.set(-0.36, 0.32, 0);
          leftSlv.rotation.z = 0.16;
          garmentGroup.add(leftSlv);

          // 6 Choori Gathers at wrist (چھ چوڑیاں)
          for (let c = 0; c < 6; c++) {
            const ringGeo = new THREE.TorusGeometry(0.065, 0.008, 8, 20);
            const ring = new THREE.Mesh(ringGeo, toneTrimMaterial);
            ring.position.set(-0.41, 0.08 - c * 0.024, 0);
            ring.rotation.z = 0.16;
            garmentGroup.add(ring);
          }

          const rightSlv = new THREE.Mesh(slvGeo, fabricMaterial);
          rightSlv.position.set(0.36, 0.32, 0);
          rightSlv.rotation.z = -0.16;
          garmentGroup.add(rightSlv);

          for (let c = 0; c < 6; c++) {
            const ringGeo = new THREE.TorusGeometry(0.065, 0.008, 8, 20);
            const ring = new THREE.Mesh(ringGeo, toneTrimMaterial);
            ring.position.set(0.41, 0.08 - c * 0.024, 0);
            ring.rotation.z = -0.16;
            garmentGroup.add(ring);
          }
          break;
        }

        case 'bell_bottom': {
          // Flared Bell Bottom Sleeves (بیل باٹم آستین)
          const bellGeo = new THREE.CylinderGeometry(0.088, 0.20, 0.55, 28);

          const leftBell = new THREE.Mesh(bellGeo, fabricMaterial);
          leftBell.position.set(-0.38, 0.34, 0);
          leftBell.rotation.z = 0.20;
          garmentGroup.add(leftBell);

          const leftLace = new THREE.Mesh(
            new THREE.TorusGeometry(0.202, 0.016, 10, 28),
            goldGotaMaterial
          );
          leftLace.position.set(-0.43, 0.08, 0);
          leftLace.rotation.x = Math.PI / 2;
          garmentGroup.add(leftLace);

          const rightBell = new THREE.Mesh(bellGeo, fabricMaterial);
          rightBell.position.set(0.38, 0.34, 0);
          rightBell.rotation.z = -0.20;
          garmentGroup.add(rightBell);

          const rightLace = leftLace.clone();
          rightLace.position.x = 0.43;
          garmentGroup.add(rightLace);
          break;
        }

        case 'kurta_cut': {
          // Straight Pakistani Kurta Sleeve with cuff slit (سیدھی کرتا آستین)
          const kurtaSlvGeo = new THREE.CylinderGeometry(0.092, 0.078, 0.55, 24);

          const leftKurta = new THREE.Mesh(kurtaSlvGeo, fabricMaterial);
          leftKurta.position.set(-0.36, 0.35, 0);
          leftKurta.rotation.z = 0.16;
          garmentGroup.add(leftKurta);

          const leftCuff = new THREE.Mesh(
            new THREE.TorusGeometry(0.082, 0.012, 10, 24),
            goldGotaMaterial
          );
          leftCuff.position.set(-0.40, 0.085, 0);
          leftCuff.rotation.x = Math.PI / 2;
          garmentGroup.add(leftCuff);

          const rightKurta = new THREE.Mesh(kurtaSlvGeo, fabricMaterial);
          rightKurta.position.set(0.36, 0.35, 0);
          rightKurta.rotation.z = -0.16;
          garmentGroup.add(rightKurta);

          const rightCuff = leftCuff.clone();
          rightCuff.position.x = 0.40;
          garmentGroup.add(rightCuff);
          break;
        }

        case 'bishop_cuff': {
          // Voluminous Bishop Blouson with pearl cuff (بیلون آستین)
          const bishopGeo = new THREE.SphereGeometry(0.155, 24, 24);
          bishopGeo.scale(0.85, 2.2, 0.95);

          const leftBishop = new THREE.Mesh(bishopGeo, fabricMaterial);
          leftBishop.position.set(-0.36, 0.34, 0);
          leftBishop.rotation.z = 0.18;
          garmentGroup.add(leftBishop);

          const cuffGeo = new THREE.CylinderGeometry(0.056, 0.060, 0.08, 24);
          const leftCuff = new THREE.Mesh(cuffGeo, goldGotaMaterial);
          leftCuff.position.set(-0.41, 0.08, 0);
          leftCuff.rotation.z = 0.18;
          garmentGroup.add(leftCuff);

          const rightBishop = new THREE.Mesh(bishopGeo, fabricMaterial);
          rightBishop.position.set(0.36, 0.34, 0);
          rightBishop.rotation.z = -0.18;
          garmentGroup.add(rightBishop);

          const rightCuff = leftCuff.clone();
          rightCuff.position.x = 0.41;
          rightCuff.rotation.z = -0.18;
          garmentGroup.add(rightCuff);
          break;
        }

        case 'cape_sleeve': {
          // Royal Split Cape Sleeves (کیپ آستین)
          const capeGeo = new THREE.CylinderGeometry(0.12, 0.30, 1.15, 28, 1, true, 0, Math.PI);
          const leftCape = new THREE.Mesh(capeGeo, fabricMaterial);
          leftCape.position.set(-0.38, 0.08, 0);
          leftCape.rotation.y = Math.PI / 2;
          garmentGroup.add(leftCape);

          const rightCape = new THREE.Mesh(capeGeo, fabricMaterial);
          rightCape.position.set(0.38, 0.08, 0);
          rightCape.rotation.y = -Math.PI / 2;
          garmentGroup.add(rightCape);
          break;
        }

        case 'sleeveless': {
          // Sleeveless armhole with gold magzi piping (بغیر آستین)
          const leftRing = new THREE.TorusGeometry(0.13, 0.014, 12, 32);
          const leftArmhole = new THREE.Mesh(leftRing, goldGotaMaterial);
          leftArmhole.position.set(-0.27, 0.54, 0);
          leftArmhole.rotation.y = Math.PI / 2;
          garmentGroup.add(leftArmhole);

          const rightArmhole = leftArmhole.clone();
          rightArmhole.position.x = 0.27;
          garmentGroup.add(rightArmhole);
          break;
        }
      }
    };
    renderSleeveMeshes();

    // ==========================================
    // 4. LOWER SILHOUETTE & PAKISTANI BOTTOMS
    // ==========================================
    if (isBlouse) {
      // Saree Blouse hem & back latkan dori
      const waistHemGeo = new THREE.TorusGeometry(0.22, 0.016, 12, 36);
      waistHemGeo.scale(1.15, 0.85, 1);
      const waistHem = new THREE.Mesh(waistHemGeo, goldGotaMaterial);
      waistHem.position.y = 0.28;
      waistHem.rotation.x = Math.PI / 2;
      garmentGroup.add(waistHem);

      // Deep back tie-up with latkans (پشت لتکن)
      const doriCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.08, 0.46, -0.19),
        new THREE.Vector3(0, 0.38, -0.23),
        new THREE.Vector3(0.08, 0.46, -0.19),
      ]);
      const doriMesh = new THREE.Mesh(
        new THREE.TubeGeometry(doriCurve, 16, 0.008, 6, false),
        goldGotaMaterial
      );
      garmentGroup.add(doriMesh);
    } else if (isFrock) {
      // 32-Kali Flared Anarkali Frock (۳۲ کلیاں فراک)
      const skirtHeight = 1.38;
      const flareRadius = 0.80;
      const skirtGeo = new THREE.CylinderGeometry(0.20, flareRadius, skirtHeight, 36, 1, true);
      skirtGeo.scale(1.1, 1.0, 0.9);
      const skirtMesh = new THREE.Mesh(skirtGeo, fabricMaterial);
      skirtMesh.position.y = 0.22 - skirtHeight / 2;
      garmentGroup.add(skirtMesh);

      // 16 Raised Kali panel seam lines (کلیاں)
      for (let k = 0; k < 16; k++) {
        const kAngle = (k * Math.PI * 2) / 16;
        const kaliCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(kAngle) * 0.21 * 1.1, 0.22, Math.sin(kAngle) * 0.21 * 0.9),
          new THREE.Vector3(Math.cos(kAngle) * 0.48 * 1.1, -0.45, Math.sin(kAngle) * 0.48 * 0.9),
          new THREE.Vector3(Math.cos(kAngle) * flareRadius * 1.1, 0.22 - skirtHeight, Math.sin(kAngle) * flareRadius * 0.9),
        ]);
        const kaliSeam = new THREE.Mesh(
          new THREE.TubeGeometry(kaliCurve, 12, 0.004, 4, false),
          toneTrimMaterial
        );
        garmentGroup.add(kaliSeam);
      }

      // Wide Gota Patti Daman Ghera Border (گوٹا پٹی دامن)
      const gheraGota = new THREE.Mesh(
        new THREE.TorusGeometry(flareRadius * 1.04, 0.026, 12, 40),
        goldGotaMaterial
      );
      gheraGota.position.y = 0.22 - skirtHeight;
      gheraGota.rotation.x = Math.PI / 2;
      garmentGroup.add(gheraGota);

      // Churidar gathers showing at ankles (چوڑی دار پاجامہ)
      const churidarGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.35, 20);
      const leftChuri = new THREE.Mesh(churidarGeo, toneTrimMaterial);
      leftChuri.position.set(-0.10, -1.25, 0);
      const rightChuri = new THREE.Mesh(churidarGeo, toneTrimMaterial);
      rightChuri.position.set(0.10, -1.25, 0);
      garmentGroup.add(leftChuri);
      garmentGroup.add(rightChuri);
    } else if (isMaxi) {
      // Floor-length Formal Bridal Maxi (فرش برائیڈل میکسی)
      const maxiHeight = 1.58;
      const flareRadius = 0.88;
      const maxiGeo = new THREE.CylinderGeometry(0.20, flareRadius, maxiHeight, 40, 1, true);
      maxiGeo.scale(1.15, 1.0, 0.95);
      const maxiMesh = new THREE.Mesh(maxiGeo, fabricMaterial);
      maxiMesh.position.y = 0.20 - maxiHeight / 2;
      garmentGroup.add(maxiMesh);

      // Heavy Velvet / Gota Daman Border (چوڑا بارڈر)
      const borderMesh = new THREE.Mesh(
        new THREE.TorusGeometry(flareRadius * 1.06, 0.040, 12, 40),
        goldGotaMaterial
      );
      borderMesh.position.y = 0.20 - maxiHeight;
      borderMesh.rotation.x = Math.PI / 2;
      garmentGroup.add(borderMesh);
    } else if (isAngrakha) {
      // Angrakha Kurti + Two-tier Flared Gharara (انگرکھا اور دو تہہ غرارہ)
      const angHeight = 0.65;
      const angKurtiGeo = new THREE.CylinderGeometry(0.20, 0.38, angHeight, 32);
      angKurtiGeo.scale(1.15, 1.0, 0.85);
      const angKurti = new THREE.Mesh(angKurtiGeo, fabricMaterial);
      angKurti.position.y = 0.22 - angHeight / 2;
      garmentGroup.add(angKurti);

      // Gharara Knee Band / Gota Ruche (گوٹا گوٹھ)
      const leftGhararaTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.12, 0.35, 20),
        toneTrimMaterial
      );
      leftGhararaTop.position.set(-0.14, -0.32, 0);
      const rightGhararaTop = leftGhararaTop.clone();
      rightGhararaTop.position.x = 0.14;
      garmentGroup.add(leftGhararaTop);
      garmentGroup.add(rightGhararaTop);

      // Knee Joint Gota Ring
      const leftKneeBand = new THREE.Mesh(
        new THREE.TorusGeometry(0.135, 0.015, 8, 24),
        goldGotaMaterial
      );
      leftKneeBand.position.set(-0.14, -0.49, 0);
      leftKneeBand.rotation.x = Math.PI / 2;
      const rightKneeBand = leftKneeBand.clone();
      rightKneeBand.position.x = 0.14;
      garmentGroup.add(leftKneeBand);
      garmentGroup.add(rightKneeBand);

      // Flared Gharara Bottom Bell Tier (غرارے کا گھیر)
      const ghararaFlareGeo = new THREE.CylinderGeometry(0.12, 0.34, 0.75, 28);
      const leftGhararaFlare = new THREE.Mesh(ghararaFlareGeo, fabricMaterial);
      leftGhararaFlare.position.set(-0.18, -0.87, 0);
      const rightGhararaFlare = new THREE.Mesh(ghararaFlareGeo, fabricMaterial);
      rightGhararaFlare.position.set(0.18, -0.87, 0);
      garmentGroup.add(leftGhararaFlare);
      garmentGroup.add(rightGhararaFlare);
    } else {
      // Classic Shalwar Kameez or Kurti with Cigarette Pants (شلوار قمیض)
      const kameezHeight = length === 'knee_length' ? 0.78 : 0.96;
      const kameezGeo = new THREE.CylinderGeometry(0.20, 0.27, kameezHeight, 32);
      kameezGeo.scale(1.15, 1.0, 0.85);
      const kameezMesh = new THREE.Mesh(kameezGeo, fabricMaterial);
      kameezMesh.position.y = 0.18 - kameezHeight / 2;
      garmentGroup.add(kameezMesh);

      // Side Chaak Gold Magzi Piping (چاک مغزی)
      const leftChaak = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, kameezHeight * 0.58, 0.015),
        goldGotaMaterial
      );
      leftChaak.position.set(-0.25, 0.10 - kameezHeight / 2, 0);
      const rightChaak = leftChaak.clone();
      rightChaak.position.x = 0.25;
      garmentGroup.add(leftChaak);
      garmentGroup.add(rightChaak);

      // Front Daman Gota Patti Border (دامن پٹی)
      const damanBorder = new THREE.Mesh(
        new THREE.BoxGeometry(0.53, 0.038, 0.022),
        goldGotaMaterial
      );
      damanBorder.position.set(0, 0.18 - kameezHeight, 0.205);
      garmentGroup.add(damanBorder);

      // Bottom Silhouette: Patiala Shalwar OR Cigarette Pants OR Tulip
      if (bottomStyle === 'patiala_shalwar') {
        // High-pleated voluminous Patiala Shalwar (پٹیالہ شلوار)
        const patialaGeo = new THREE.SphereGeometry(0.24, 24, 24);
        patialaGeo.scale(1.25, 2.2, 1.15);

        const leftShalwar = new THREE.Mesh(patialaGeo, fabricMaterial);
        leftShalwar.position.set(-0.16, -0.72, 0);
        const rightShalwar = new THREE.Mesh(patialaGeo, fabricMaterial);
        rightShalwar.position.set(0.16, -0.72, 0);
        garmentGroup.add(leftShalwar);
        garmentGroup.add(rightShalwar);

        // Stiffened Canvas Pancha with Gold Tilla Stitch (پانچہ)
        const leftPancha = new THREE.Mesh(
          new THREE.CylinderGeometry(0.092, 0.092, 0.08, 20),
          goldGotaMaterial
        );
        leftPancha.position.set(-0.16, -1.35, 0);
        const rightPancha = leftPancha.clone();
        rightPancha.position.x = 0.16;
        garmentGroup.add(leftPancha);
        garmentGroup.add(rightPancha);
      } else {
        // Straight Cigarette Pants with Pintex Tucks (سگریٹ پینٹس)
        const trouserGeo = new THREE.CylinderGeometry(0.11, 0.082, 1.25, 24);
        const leftTrouser = new THREE.Mesh(trouserGeo, toneTrimMaterial);
        leftTrouser.position.set(-0.13, -0.75, 0);
        const rightTrouser = new THREE.Mesh(trouserGeo, toneTrimMaterial);
        rightTrouser.position.set(0.13, -0.75, 0);
        garmentGroup.add(leftTrouser);
        garmentGroup.add(rightTrouser);

        // 3 Pintex Pleat Rings at hem
        for (let p = 0; p < 3; p++) {
          const pintexRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.085, 0.005, 8, 20),
            goldGotaMaterial
          );
          pintexRing.position.set(-0.13, -1.26 - p * 0.024, 0);
          pintexRing.rotation.x = Math.PI / 2;
          const rightPintex = pintexRing.clone();
          rightPintex.position.x = 0.13;
          garmentGroup.add(pintexRing);
          garmentGroup.add(rightPintex);
        }
      }
    }

  }, [garmentId, neckline, sleeve, bottomStyle, length, fabricColorHex, getFabricTexture]);

  // Update Procedural Draped Dupatta (دوپٹہ)
  useEffect(() => {
    const dupattaGroup = dupattaGroupRef.current;
    if (!dupattaGroup) return;

    while (dupattaGroup.children.length > 0) {
      const child = dupattaGroup.children[0];
      disposeObjectHierarchy(child);
      dupattaGroup.remove(child);
    }

    if (!showDupatta || garmentId === 'saree_blouse') return;

    // Sheer Chiffon/Organza Dupatta Material
    const dupattaColor = new THREE.Color(fabricColorHex).offsetHSL(0.02, 0.05, 0.05);
    const chiffonMaterial = new THREE.MeshPhysicalMaterial({
      color: dupattaColor,
      roughness: 0.25,
      transmission: 0.55,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    });

    const dupattaGoldGota = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.25,
      metalness: 0.85,
    });

    // Elegant Left-Shoulder Cascading Pakistani Dupatta Drape
    const drapeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.32, -0.30, -0.15), // back tail
      new THREE.Vector3(-0.28, 0.25, -0.12),
      new THREE.Vector3(-0.25, 0.65, 0.02),  // shoulder crest
      new THREE.Vector3(-0.18, 0.45, 0.22),  // chest crossover
      new THREE.Vector3(0.02, 0.15, 0.24),   // front waist fold
      new THREE.Vector3(0.18, -0.25, 0.22),  // lower front drape
      new THREE.Vector3(0.25, -0.75, 0.20),  // daman drop
    ]);

    const drapeGeo = new THREE.TubeGeometry(drapeCurve, 36, 0.08, 12, false);
    drapeGeo.scale(1.2, 0.25, 1.0);
    const drapeMesh = new THREE.Mesh(drapeGeo, chiffonMaterial);
    dupattaGroup.add(drapeMesh);

    // Gota Kinari Border Ribbon along outer edge
    const borderCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, -0.30, -0.15),
      new THREE.Vector3(-0.30, 0.66, 0.02),
      new THREE.Vector3(-0.16, 0.43, 0.23),
      new THREE.Vector3(0.26, -0.75, 0.20),
    ]);
    const border = new THREE.Mesh(
      new THREE.TubeGeometry(borderCurve, 28, 0.012, 8, false),
      dupattaGoldGota
    );
    dupattaGroup.add(border);

  }, [showDupatta, garmentId, fabricColorHex]);

  // Smooth Camera Preset Controller
  const setCameraAngle = (angle: 'front' | 'three_quarter' | 'side' | 'back' | 'neck_zoom') => {
    setActiveAngle(angle);
    setHasInteracted(true);

    // Stop continuous turntable when a specific angle is clicked
    if (isRotating && controlsRef.current) {
      setIsRotating(false);
      controlsRef.current.autoRotate = false;
    }

    switch (angle) {
      case 'front':
        targetCamPosRef.current.set(0, 0.08, 3.55);
        targetLookAtRef.current.set(0, -0.20, 0);
        break;
      case 'three_quarter':
        targetCamPosRef.current.set(2.1, 0.28, 3.25);
        targetLookAtRef.current.set(0, -0.20, 0);
        break;
      case 'side':
        targetCamPosRef.current.set(3.55, 0.10, 0.0);
        targetLookAtRef.current.set(0, -0.20, 0);
        break;
      case 'back':
        targetCamPosRef.current.set(0, 0.08, -3.55);
        targetLookAtRef.current.set(0, -0.20, 0);
        break;
      case 'neck_zoom':
        targetCamPosRef.current.set(0, 0.58, 1.55);
        targetLookAtRef.current.set(0, 0.52, 0.12);
        break;
    }
    isTransitioningRef.current = true;
  };

  const toggleAutoRotate = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    const newState = !isRotating;
    setIsRotating(newState);
    setHasInteracted(true);
    isTransitioningRef.current = false;
    controls.autoRotate = newState;
    controls.autoRotateSpeed = 2.0;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    setHasInteracted(true);
    const factor = direction === 'in' ? 0.82 : 1.22;
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
    if (offset.length() < 1.4 || offset.length() > 5.5) return;
    targetCamPosRef.current.copy(controls.target).add(offset);
    targetLookAtRef.current.copy(controls.target);
    isTransitioningRef.current = true;
  };

  const handleResetView = () => {
    setCameraAngle('three_quarter');
  };

  return (
    <div className="relative w-full bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm overflow-hidden flex flex-col items-center shadow-xs">
      
      {/* 3D Viewport Header: Title & Quick Actions */}
      <div className="w-full px-4 py-2.5 bg-white/95 backdrop-blur-xs border-b border-[#EAE5DD] flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-[#1A1A1A]">3D Sartorial Mannequin</span>
          <span className="text-[#8C7A6B]">·</span>
          <span className="text-[11px] text-[#78716C] capitalize truncate max-w-[170px]">
            {neckline.replace(/_/g, ' ')} & {sleeve.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Controls: Turntable & Dupatta Toggle */}
        <div className="flex items-center gap-2">
          {garmentId !== 'saree_blouse' && (
            <button
              onClick={() => setShowDupatta(!showDupatta)}
              title="Toggle Chiffon Dupatta Drape"
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors ${
                showDupatta 
                  ? 'bg-[#F4F1EA] text-[#7D5A44] border-[#D5CBBF] font-semibold' 
                  : 'bg-white text-[#78716C] border-[#E6E0D6] hover:bg-[#FAF9F6]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>{showDupatta ? 'Dupatta: On' : 'Dupatta: Off'}</span>
            </button>
          )}

          <button
            onClick={toggleAutoRotate}
            title={isRotating ? 'Pause 360° Turntable' : 'Start 360° Turntable Spin'}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors ${
              isRotating 
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                : 'bg-white text-[#57534E] border-[#D5CBBF] hover:bg-[#FAF9F6]'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Spinning 360°' : '360° Turntable'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className="w-full h-[420px] relative cursor-grab active:cursor-grabbing bg-[#FAF9F6]"
      />

      {/* Subtle 360° Rotation Guidance */}
      {!hasInteracted && (
        <div className="absolute bottom-16 bg-[#1A1A1A]/80 text-[#FAF9F6] text-[10px] px-3 py-1 rounded-full pointer-events-none z-10 flex items-center gap-1.5 shadow-sm">
          <span>✦ Drag to rotate 360° · Scroll to zoom</span>
        </div>
      )}

      {/* Sartorial Badges with Clean English Terminology */}
      <div className="absolute top-14 left-4 pointer-events-none z-10 space-y-1.5 max-w-[210px]">
        <div className="bg-white/95 backdrop-blur-xs border border-[#E6E0D6] rounded-sm px-3 py-1.5 shadow-2xs space-y-0.5">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider">
            Neckline / Gala
          </div>
          <div className="font-semibold text-xs text-[#1A1A1A] capitalize">
            {neckline.replace(/_/g, ' ')}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xs border border-[#E6E0D6] rounded-sm px-3 py-1.5 shadow-2xs space-y-0.5">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider">
            Aastin / Sleeves
          </div>
          <div className="font-semibold text-xs text-[#1A1A1A] capitalize">
            {sleeve.replace(/_/g, ' ')}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xs border border-[#E6E0D6] rounded-sm px-3 py-1.5 shadow-2xs space-y-0.5">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider">
            Bottom / Shalwar
          </div>
          <div className="font-semibold text-xs text-[#1A1A1A] capitalize">
            {bottomStyle.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {/* Camera Angle & Zoom Toolbar at bottom */}
      <div className="w-full p-2.5 bg-[#F4F1EA] border-t border-[#EAE5DD] flex flex-wrap items-center justify-between gap-2 text-xs z-10">
        <div className="flex items-center gap-1">
          {[
            { id: 'front', label: 'Front' },
            { id: 'three_quarter', label: '3/4 Angle' },
            { id: 'side', label: 'Side' },
            { id: 'back', label: 'Back' },
            { id: 'neck_zoom', label: 'Collar Zoom' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCameraAngle(item.id as any)}
              className={`px-2 py-1 text-[11px] font-medium rounded-sm transition-colors whitespace-nowrap ${
                activeAngle === item.id
                  ? 'bg-white text-[#1A1A1A] shadow-2xs font-semibold'
                  : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Zoom & Reset controls */}
        <div className="flex items-center gap-1 text-[#78716C]">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-sm hover:bg-white hover:text-[#1A1A1A] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-sm hover:bg-white hover:text-[#1A1A1A] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-sm hover:bg-white hover:text-[#1A1A1A] transition-colors"
            title="Reset 3D View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
