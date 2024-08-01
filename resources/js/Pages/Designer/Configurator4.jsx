import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import * as THREE from 'three';
import { useEffect, useState, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { fabric } from 'fabric';
import Stats from 'three/examples/jsm/libs/stats.module';

export default function Configurator({ auth, products }) {
    const [svgObject, setSvgObject] = useState(null);
    const canvasRef = useRef(null);

    const containerWidth = 1000;
    const containerHeight = 1000;
    useEffect(() => {

              // Event listeners for color pickers
              const baseColorPicker = document.getElementById('base-color-picker');
              const trimmingColorPicker = document.getElementById('trimming-color-picker');
              const sideColorPicker = document.getElementById('sides-color-picker');


        const canvas = new fabric.Canvas('canvas', { width: 1000, height: 1000, preserveObjectStacking: true });

        const rectangle = new fabric.Rect({
            left: containerWidth / 2 - 50, // Half of rectangle width subtracted from canvas center
            top: containerHeight / 2 - 50, // Half of rectangle height subtracted from canvas center
            fill: "#00ffff",
            width: 100,
            height: 100,
            transparentCorners: false,
            centeredScaling: true,
        });

        canvas.add(rectangle);

        // Rest of your code...



        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const onClickPosition = new THREE.Vector2();

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.01, 1000);
        // camera.position.z = 50;
        camera.position.set(0, 0, 50);

        const container = document.getElementById("renderer");
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);


        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 0, 100);
        scene.add(spotLight);


        const texture = new THREE.Texture(document.getElementById("canvas"));
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const material = new THREE.MeshStandardMaterial({ map: texture });

        material.map.repeat.y = -1;
        material.map.offset.y = 1;

        const axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );
        const loader = new GLTFLoader();

        loader.load('/model/tshirt(4)/scene1.glb', function (gltf) {
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.scale.set(0.5, 0.5, 0.5);
            gltf.scene.rotation.set(0, 0, 0);
            gltf.scene.traverse(child => {
                if (child.isMesh) {
                    child.material = material;
                }
            })
            scene.add(gltf.scene);
            console.log('3d Model loaded.')
        }, undefined, function (error) {
            console.error(error);
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        // Load SVG content
        fabric.loadSVGFromURL('/texture-01.svg', function (objects, options) {
            const svg = fabric.util.groupSVGElements(objects, options);

            // Set the size of the SVG object
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const scaleX = canvasWidth / svg.width;
            const scaleY = canvasHeight / svg.height;
            const scaleToFit = Math.min(scaleX, scaleY);

            // Set the size of the SVG object to fit into the canvas
            svg.set({
                scaleX: scaleToFit,
                scaleY: scaleToFit,
                top: canvasHeight / 2 - svg.height * scaleToFit / 2,
                left: canvasWidth / 2 - svg.width * scaleToFit / 2,
                selectable: false
            });


            canvas.add(svg);
            canvas.sendToBack(svg);




            setSvgObject(svg);

            canvas.renderAll();
            // Apply initial colors based on IDs
            // applyColorsToSvg(baseColorPicker, trimmingColorPicker, sideColorPicker);
        });

         function applyColorsToSvg(color, text) {
            canvas.getObjects().forEach(function (object) {
                if (object.type === 'group') {
                    // Traverse the group objects
                    object._objects.forEach(function (innerObject) {
                        if (innerObject.id === text) {
                            innerObject.set({ fill: color });
                        }
                    });
                    canvas.renderAll();
                }
            });
        }


        // Function to apply colors to SVG based on color pickers


        const stats = Stats();
        document.body.appendChild(stats.dom);

        const animate = () => {
            stats.update();
            controls.update();

            window.requestAnimationFrame(animate);
            texture.needsUpdate = true;
            renderer.render(scene, camera);
        };





        animate();



        baseColorPicker.addEventListener('input', function () {
            applyColorsToSvg(baseColorPicker.value, 'BASE');
        });

        trimmingColorPicker.addEventListener('input', function () {
            applyColorsToSvg(trimmingColorPicker.value,  'TRIMMING');
        });

        sideColorPicker.addEventListener('input', function () {
            applyColorsToSvg(sideColorPicker.value, 'SIDES');
        });

        // Function to apply colors to SVG based on color pickers


        fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
            console.log('BEG getPointer');
            if (this._absolutePointer && !ignoreZoom) {
                return this._absolutePointer;
            }
            if (this._pointer && ignoreZoom) {
                return this._pointer;
            }
            var pointer = fabric.util.getPointer(e),
                upperCanvasEl = this.upperCanvasEl,
                bounds = upperCanvasEl.getBoundingClientRect(),
                boundsWidth = bounds.width || 0,
                boundsHeight = bounds.height || 0,
                cssScale;

            if (!boundsWidth || !boundsHeight) {
                if ('top' in bounds && 'bottom' in bounds) {
                    boundsHeight = Math.abs(bounds.top - bounds.bottom);
                }
                if ('right' in bounds && 'left' in bounds) {
                    boundsWidth = Math.abs(bounds.right - bounds.left);
                }
            }
            this.calcOffset();
            pointer.x = pointer.x - this._offset.left;
            pointer.y = pointer.y - this._offset.top;
            /* BEGIN PATCH CODE */
            if (e.target !== this.upperCanvasEl) {
                var positionOnScene = getPositionOnScene(container, e);
                console.log('positionOnScene:', positionOnScene);
                pointer.x = positionOnScene.x;
                pointer.y = positionOnScene.y;
            }
            /* END PATCH CODE */
            console.log('pointer1:', pointer);
            if (!ignoreZoom) {
                pointer = this.restorePointerVpt(pointer);
            }

            if (boundsWidth === 0 || boundsHeight === 0) {
                cssScale = { width: 1, height: 1 };
            }
            else {
                cssScale = {
                    width: upperCanvasEl.width / boundsWidth,
                    height: upperCanvasEl.height / boundsHeight
                };
            }

            return {
                x: pointer.x * cssScale.width,
                y: pointer.y * cssScale.height
            };
        }

        container.addEventListener("mousedown", onMouseEvt, false);

        // Mouse event handler
        function onMouseEvt(evt) {
            evt.preventDefault();
            const positionOnScene = getPositionOnScene(container, evt);
            if (positionOnScene) {
                const canvasRect = canvas._offset;
                const simEvt = new MouseEvent(evt.type, {
                    clientX: canvasRect.left + positionOnScene.x,
                    clientY: canvasRect.top + positionOnScene.y
                });
                canvas.upperCanvasEl.dispatchEvent(simEvt);
            }
        }

        // Function to convert mouse coordinates to scene coordinates
        function getPositionOnScene(sceneContainer, evt) {
            const array = getMousePosition(sceneContainer, evt.clientX, evt.clientY);
            onClickPosition.fromArray(array);
            const intersects = getIntersects(onClickPosition, scene.children);
            if (intersects.length > 0 && intersects[0].uv) {
                const uv = intersects[0].uv;
                const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();
                const realX = uv.x * canvasRect.width;
                const realY = uv.y * canvasRect.height;
                return {
                    x: realX,
                    y: realY
                };
            }
            return null;
        }


        function getRealPosition(axis, value) {
            const CORRECTION_VALUE = axis === "x" ? 4.5 : 5.5;
            return Math.round(value * 2000) - CORRECTION_VALUE;
        }
        // Function to convert mouse coordinates to canvas coordinates
        function getMousePosition(dom, x, y) {
            const rect = dom.getBoundingClientRect();
            return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
        }

        // Function to get intersection points
        function getIntersects(point, objects) {

            mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
            raycaster.setFromCamera(mouse, camera);
            return raycaster.intersectObjects(objects);
        }

        // Function to convert UV coordinates to real position


        // Event listener for fabric.js canvas object selection
        canvas.on('selection:created', function () {
            // Disable OrbitControls when an object is selected
            controls.enabled = false;
        });

        // Event listener for fabric.js canvas object deselection
        canvas.on('selection:cleared', function () {
            // Enable OrbitControls when no object is selected
            controls.enabled = true;
        });

        console.log(canvas.getObjects());
        // Return cleanup function
        return () => {
            container.removeEventListener("mousedown", onMouseEvt);
        };


        return () => {
            // Cleanup if necesmsary
        };
    }, []);

    const handleChangeColor = (value, text) => {
        console.log(value);
    }

    return (
        <>
            <div className='justify-start'>
              <div className="flex">
              <div id="renderer" style={{ width: '1000px', height: '1000px' }}></div>
                <canvas id='canvas' style={{ display: 'block', position: 'absolute', top: 0}} ></canvas>
              </div>
                <div className='p-4 border-2'>
                    <div>
                        <input type="text" id="text-input" placeholder="Enter text" />
                        <button id="add-text-btn">Add Text</button>
                    </div>
                    <div>
                        <label htmlFor="base-color-picker">Base Color:</label>
                        <input type="color" id="base-color-picker" defaultValue="#00ffff" />
                    </div>
                    <div>
                        <label htmlFor="trimming-color-picker">Trimming Color:</label>
                        <input type="color" id="trimming-color-picker" defaultValue="#ff00ff" />
                    </div>
                    <div>
                        <label htmlFor="sides-color-picker">Sides Color:</label>
                        <input type="color" id="sides-color-picker" defaultValue="#ffff00" />
                    </div>
                </div>
            </div>

        </>
    );
}
