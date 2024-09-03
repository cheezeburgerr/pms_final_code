import React, { useState, useRef, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head, router, usePage } from '@inertiajs/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { fabric } from 'fabric';
import TextInput from '@/Components/TextInput';
import ModelViewer from './ModelViewer';

export default function Models({ auth, models }) {
    const { props } = usePage();
    const [modelFile, setModelFile] = useState(null);
    const [modelUrl, setModelUrl] = useState(null);
    const [svgFile, setSvgFile] = useState(null);
    const [name, setName] = useState();
    const modelContainerRef = useRef();
    const fabricCanvasRef = useRef(null);

    useEffect(() => {
        if (modelUrl && fabricCanvasRef.current) {
            // Scene, Camera, Renderer
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
            modelContainerRef.current.appendChild(renderer.domElement);

            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 1);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            // Load Model
            const loader = new GLTFLoader();
            loader.load(
                modelUrl,
                (gltf) => {
                    const texture = new THREE.CanvasTexture(fabricCanvasRef.current);
                    const material = new THREE.MeshBasicMaterial({ map: texture });

                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.material = material;
                        }
                    });

                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(0.5, 0.5, 0.5);
                    scene.add(gltf.scene);

                    console.log('3D model loaded with texture.');
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                }
            );

            // Animation Loop
            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            // Cleanup on unmount
            return () => {
                modelContainerRef.current.removeChild(renderer.domElement);
            };
        }
    }, [modelUrl, fabricCanvasRef]);

    useEffect(() => {
        if (svgFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const canvas = new fabric.Canvas('fabric-canvas');
                fabric.loadSVGFromURL(e.target.result, (objects, options) => {
                    const svg = fabric.util.groupSVGElements(objects, options);
                    svg.scaleToWidth(canvas.width);
                    svg.scaleToHeight(canvas.height);
                    canvas.add(svg);
                    canvas.renderAll();
                    fabricCanvasRef.current = canvas.getElement();
                    console.log('SVG loaded into Fabric.js canvas.');
                });
            };
            reader.readAsDataURL(svgFile);
        }
    }, [svgFile]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setModelFile(file);

        const url = URL.createObjectURL(file);
        setModelUrl(url);
    };

    const handleSvgChange = (e) => {
        const file = e.target.files[0];
        setSvgFile(file);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('model', modelFile);
        formData.append('canvas', svgFile);

        try {
            await router.post(route('models.store'), formData); // Using Inertia's post method
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading the model:', error);
        }
    };

    return (
        <EmployeeLayout
            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Models</h2>}
        >
            <Head title="Models" />

            <div className="flex justify-between">
                <h1 className='text-2xl font-bold mb-8'>Add Model</h1>
            </div>

            <div className="dark:text-gray-100">
                <TextInput onChange={(e) => setName(e.target.value)}/>
                <input type="file" accept=".glb,.gltf,.obj" onChange={handleFileChange} />
                <input type="file" accept=".svg" onChange={handleSvgChange} />

                {modelFile && (
                    <>
                      
                    </>
                )}
                {modelUrl && (
                    <div>
                        <div ref={modelContainerRef} id="model-container" className='w-[100px] h-[500px]'></div>
                        <PrimaryButton onClick={handleFileUpload}>Upload Model</PrimaryButton>
                    </div>
                )}
                {svgFile && (
                    <canvas id="fabric-canvas" width="512" height="512" className="hidden"></canvas>
                )}
            </div>
        </EmployeeLayout>
    );
}
