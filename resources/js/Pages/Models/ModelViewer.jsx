import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ModelViewer = ({ path }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    let isMounted = true; // Flag to stop animation on unmount

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    let pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
    backLight.position.set(-1, 2, -2);
    scene.add(backLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(1, 1, 1);
    scene.add(fillLight);

    const material2 = new THREE.MeshStandardMaterial({
      color: 0xefefef,
    });

    const loader = new GLTFLoader();

    loader.load(
      path,
      function (gltf) {
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        gltf.scene.rotation.set(0, -100, 0);
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material = material2;
            if (child.name.includes('cloth')) {
              child.material = material2;
            }
            if (child.name.includes('Avatar')) {
              child.visible = false;
              child.material = material2;
            }
          }
        });
        scene.add(gltf.scene);
        console.log('3D Model loaded.');
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    const animate = function () {
      if (!isMounted) return; // Stop animation if component is unmounted
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false; // Set flag to false to stop the animation loop
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement); // Only remove if the ref is still present
      }
      scene = null;
      camera = null;
      renderer = null;
    };
  }, [path]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default ModelViewer;
