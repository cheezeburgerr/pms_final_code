import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    color
} from 'three/examples/jsm/nodes/Nodes';


var avatar;


export function toggleVisibility() {

    if (avatar) {
        avatar.visible = !avatar.visible;
    }
}

export function changeAvatarColor(color, setAvatarColor) {

    if (avatar) {
        avatar.material.color.set(color.hex);
        setAvatarColor(color.hex)
    }
}

// import * as fabric from 'fabric';
export function init(path, canvas, containerWidth, containerHeight) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClickPosition = new THREE.Vector2();
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Detect mobile devices

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.01, 1000);
    camera.position.set(0, 0, 50);

    const container = document.getElementById("renderer");
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    const pixelRatio = isMobile ? 1 : window.devicePixelRatio;
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(pixelRatio);

    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.01, 1000);
    camera2.position.set(0, 0, 75);

    const container2 = document.getElementById("to_save");
    const renderer2 = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true
    });

    renderer2.setClearColor(0xeeeeee, 1);
    renderer2.setSize(1920, 1080);
    renderer2.setPixelRatio(pixelRatio);

    // Add a texture for the second scene
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/TJM_LOGO.png', (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(13, 7);
        const planeMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = 0;
        plane.position.z = -5;
        scene2.add(plane);
    });

    var group = new THREE.Group();
    scene.add(group);

    var group2 = new THREE.Group();
    scene2.add(group2);

    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    container.appendChild(renderer.domElement);
    container2.appendChild(renderer2.domElement);

    // Lighting setup for the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.4);
    scene2.add(ambientLight2);

    // Get the canvas element and apply it as a texture
    const texture = new THREE.CanvasTexture(document.getElementById("canvas")); // Use CanvasTexture instead of Texture
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.1
    });

    const material2 = new THREE.MeshPhysicalMaterial({
        color: 0xFFDBAC
    });

    material.map.repeat.y = -1;
    material.map.offset.y = 1;

    // Load your models into the scene
    loadModel(path, material, material2, group);
    loadModel2(path, material, group2);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 25;
    controls.maxDistance = 50;
    controls.enablePan = false;

    // Window resize handler
    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight - 122;  // Deduct 200 pixels from the height

        camera.aspect = width / height;           // Calculate the aspect ratio correctly
        camera.updateProjectionMatrix();          // Update the projection matrix

        renderer.setSize(width, height);          // Update the renderer size with the new height
        // renderer2.setSize(width, height);      // If needed for second renderer, uncomment this
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(onWindowResize, 200); // Throttle to 200ms
    });

    // Ensure the texture is updated whenever the canvas content changes
    const updateCanvasTexture = () => {
        texture.needsUpdate = true;
    };


    // var zoomer = document.querySelector('#zoom input');
    // zoomer.value = camera.position.length();
    // zoomer.addEventListener('input', function (e) {
    //     var zoomDistance = Number(zoomer.value),
    //         currDistance = camera.position.length(),
    //         factor = currDistance / zoomDistance; // Invert the factor to reverse the zoom

    //     camera.position.x *= factor;
    //     camera.position.y *= factor;
    //     camera.position.z *= factor;
    // });


    // Assuming your canvas element is dynamic, listen for changes
    // texture.addEventListener('change', updateCanvasTexture);
    // canvas.on('object:modified', updateCanvasTexture);
    // canvas.on('object:moving', updateCanvasTexture);
    // canvas.on('selection:created', updateCanvasTexture);
    // canvas.on('selection:cleared', updateCanvasTexture);
    // canvas.on('mouse:down', updateCanvasTexture);
    // canvas.on('mouse:up', updateCanvasTexture);
    // canvas.on('mouse:move', updateCanvasTexture);
    canvas.on('after:render', updateCanvasTexture);

    // Animation loop


    const animate = () => {
        controls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        renderer2.render(scene2, camera2);
    };

    animate();







    // fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
    //     console.log('BEG getPointer');
    //     if (this._absolutePointer && !ignoreZoom) {
    //         return this._absolutePointer;
    //     }
    //     if (this._pointer && ignoreZoom) {
    //         return this._pointer;
    //     }
    //     var pointer = fabric.util.getPointer(e),
    //         upperCanvasEl = this.upperCanvasEl,
    //         bounds = upperCanvasEl.getBoundingClientRect(),
    //         boundsWidth = bounds.width || 0,
    //         boundsHeight = bounds.height || 0,
    //         cssScale;

    //     if (!boundsWidth || !boundsHeight) {
    //         if ('top' in bounds && 'bottom' in bounds) {
    //             boundsHeight = Math.abs(bounds.top - bounds.bottom);
    //         }
    //         if ('right' in bounds && 'left' in bounds) {
    //             boundsWidth = Math.abs(bounds.right - bounds.left);
    //         }
    //     }
    //     this.calcOffset();
    //     pointer.x = pointer.x - this._offset.left;
    //     pointer.y = pointer.y - this._offset.top;
    //     /* BEGIN PATCH CODE */
    //     if (e.target !== this.upperCanvasEl) {
    //         var positionOnScene = getPositionOnScene(container, e);
    //         console.log('positionOnScene:', positionOnScene);
    //         pointer.x = positionOnScene.x;
    //         pointer.y = positionOnScene.y;
    //     }
    //     /* END PATCH CODE */
    //     console.log('pointer1:', pointer);
    //     if (!ignoreZoom) {
    //         pointer = this.restorePointerVpt(pointer);
    //     }

    //     if (boundsWidth === 0 || boundsHeight === 0) {
    //         cssScale = {
    //             width: 1,
    //             height: 1
    //         };
    //     } else {
    //         cssScale = {
    //             width: upperCanvasEl.width / boundsWidth,
    //             height: upperCanvasEl.height / boundsHeight
    //         };
    //     }

    //     return {
    //         x: pointer.x * cssScale.width,
    //         y: pointer.y * cssScale.height
    //     };
    // }

    fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
        if (this._absolutePointer && !ignoreZoom) {
            return this._absolutePointer;
        }
        if (this._pointer && ignoreZoom) {
            return this._pointer;
        }
        var simEvt;
        if (e.touches != undefined) {
            simEvt = new MouseEvent({
                touchstart: "mousedown",
                touchmove: "mousemove",
                touchend: "mouseup"
            }[e.type], {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 1,
                screenX: Math.round(e.changedTouches[0].screenX),
                screenY: Math.round(e.changedTouches[0].screenY),
                clientX: Math.round(e.changedTouches[0].clientX),
                clientY: Math.round(e.changedTouches[0].clientY),
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button: 0,
                relatedTarget: null
            });
            var pointer = fabric.util.getPointer(simEvt),
                upperCanvasEl = this.upperCanvasEl,
                bounds = upperCanvasEl.getBoundingClientRect(),
                boundsWidth = bounds.width || 0,
                boundsHeight = bounds.height || 0,
                cssScale;
        } else {
            var pointer = fabric.util.getPointer(e),
                upperCanvasEl = this.upperCanvasEl,
                bounds = upperCanvasEl.getBoundingClientRect(),
                boundsWidth = bounds.width || 0,
                boundsHeight = bounds.height || 0,
                cssScale;
        }
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
            var positionOnScene;
            if (isMobile == true) {
                positionOnScene = getPositionOnSceneTouch(container, e);
                if (positionOnScene) {
                    //   console.log(positionOnScene);
                    pointer.x = positionOnScene.x;
                    pointer.y = positionOnScene.y;
                }
            } else {
                positionOnScene = getPositionOnScene(container, e);
                if (positionOnScene) {
                    //   console.log(positionOnScene);
                    pointer.x = positionOnScene.x;
                    pointer.y = positionOnScene.y;
                }
            }
        }
        /* END PATCH CODE */
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

    if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
            navigator.userAgent,
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            navigator.userAgent.substr(0, 4),
        )
    ) {
        isMobile = true;
        container.addEventListener("touchstart", onTouch, false);
    }
    /**
     * Event handler
     */

    function onTouch(evt) {
        evt.preventDefault();
        const positionOnScene = getPositionOnSceneTouch(container, evt);
        if (positionOnScene) {
            const canvasRect = canvas._offset;
            const simEvt = new MouseEvent(evt.type, {
                clientX: canvasRect.left + positionOnScene.x,
                clientY: canvasRect.top + positionOnScene.y,
            });
            canvas.upperCanvasEl.dispatchEvent(simEvt);
        }
    }

    function getPositionOnSceneTouch(sceneContainer, evt) {
        var array = getMousePosition(sceneContainer, evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
        onClickPosition.fromArray(array);
        //   console.log(scene);
        var intersects = getIntersects(onClickPosition, scene.children);
        if (intersects.length > 0 && intersects[0].uv) {
            var uv = intersects[0].uv;
            intersects[0].object.material.map.transformUv(uv);
            var circle = new fabric.Circle({
                radius: 3,
                left: getRealPosition("x", uv.x),
                top: getRealPosition("y", uv.y),
                fill: "white",
            });
            // canvas.add(circle);
            // getUv = uv;
            return {
                x: getRealPosition("x", uv.x),
                y: getRealPosition("y", uv.y),
            };
        }
        return null;
    }

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
                x: getRealPosition('x', uv.x),
                y: getRealPosition('y', uv.y),
            };
        }
        return null;
    }


    function getRealPosition(axis, value) {
        const CORRECTION_VALUE = axis === "x" ? 4.5 : 5.5;
        return Math.round(value * 1000) - CORRECTION_VALUE;
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


    canvas.on('selection:created', function () {
        controls.enabled = false;
    });

    canvas.on('selection:cleared', function () {
        controls.enabled = true;
    });

    canvas.on('object:modified', function () {
        controls.enabled = true;
    });
    canvas.on('object:scaling', function () {
        controls.enabled = false;
    });
    canvas.on('object:moving', function () {
        controls.enabled = false;
    });
    canvas.on('object:rotating', function () {
        controls.enabled = false;
    });
    // canvas.on('mouse:down', function () {
    //     controls.enabled = false;
    // });
    // canvas.on('mouse:up', function () {
    //     controls.enabled = true;
    // });
    // // canvas.on('mouse:move', function () {
    //     controls.enabled = true;
    // });


    // console.log(canvas.getObjects());

    return () => {
        container.removeChild(renderer.domElement);
    };

}
export function loadModel(path, material, material2, group) {
    const loader = new GLTFLoader();

    loader.load(`/storage/models/${path}`, function (gltf) {
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(3, 3, 3);
        gltf.scene.rotation.set(0, -100, 0);
        gltf.scene.traverse(child => {
            if (child.isMesh) {

                child.material = material;
                if (child.name.includes('cloth')) {
                    child.material = material;
                }
                if (child.name.includes('Avatar')) {
                    child.material = material2;
                    avatar = child;
                    avatar.visible = false;
                }
            }
        })
        group.add(gltf.scene);
        console.log('3d Model loaded.')
    }, undefined, function (error) {
        console.error(error);
    });
}


export function loadModel2(path, material, group2) {
    const loader = new GLTFLoader();

    loader.load(`/storage/models/${path}`, function (gltf) {
        gltf.scene.position.set(-15, 0, 0);
        gltf.scene.scale.set(4, 4, 4);
        gltf.scene.rotation.set(0, -150, 0);
        gltf.scene.traverse(child => {
            if (child.isMesh) {

                child.material = material;
                if (child.name.includes('cloth')) {
                    child.material = material;
                }
                if (child.name.includes('Avatar')) {
                    child.visible = false;
                }
            }
        })
        group2.add(gltf.scene);
        console.log('3d Model loaded.')
    }, undefined, function (error) {
        console.error(error);
    });

    const loader2 = new GLTFLoader();

    loader2.load(`/storage/models/${path}`, function (gltf) {
        gltf.scene.position.set(15, 0, 0);
        gltf.scene.scale.set(4, 4, 4);
        gltf.scene.rotation.set(0, 500, 0);
        gltf.scene.traverse(child => {
            if (child.isMesh) {

                child.material = material;
                if (child.name.includes('cloth')) {
                    child.material = material;
                }
                if (child.name.includes('Avatar')) {
                    child.visible = false;
                }
            }
        })
        group2.add(gltf.scene);
        console.log('3d Model loaded.')
    }, undefined, function (error) {
        console.error(error);
    });
}

