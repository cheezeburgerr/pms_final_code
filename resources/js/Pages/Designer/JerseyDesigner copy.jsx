
import * as THREE from 'three';
import { useEffect, useState, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as fabric from 'fabric';
import { fabric } from 'fabric';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Card, Popover, Tabs, Tooltip } from 'flowbite-react';
import * as DesignerFunctions from './DesignerFunctions';
import { changeAvatarColor, init, toggleVisibility } from './Load3D';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { ChromePicker } from 'react-color';
import InputLabel from '@/Components/InputLabel';
import { IconDeviceFloppy, IconInfoCircle, IconMan, IconPencil, IconPhoto, IconQuestionMark, IconTextCaption, IconUpload } from '@tabler/icons-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import useCanvasState from './useCanvasState';
import { router } from '@inertiajs/react';



export default function Configurator({ auth, product }) {


    const {
        svgObject, setSvgObject,
        showColorPicker, setShowColorPicker,
        showAvatarPicker, setShowAvatarPicker,
        canvasRef,
        strokeColor, setStrokeColor,
        strokeWidth, setStrokeWidth,
        showStrokeColorPicker, setShowStrokeColorPicker,
        uploadedImage, setUploadedImage,
        selectedObject, setSelectedObject,
        canvas, setCanvas,
        skewX, setSkewX,
        skewY, setSkewY,
        selectedLogo, setSelectedLogo,
        selectedColor, setSelectedColor,
        selectedFont, setSelectedFont,

    } = useCanvasState();


    const [showProperties, setShowProperties] = useState(false);
    const [avatarColor, setAvatarColor] = useState("#FFDBAC");
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const [tutorialMode, setTutorialMode] = useState(false);
    const [addToModel, setAddToModel] = useState(false);
    const [pickerType, setPickerType] = useState();
    const inputRef = useRef(null);
    useEffect(() => {


        fabric.fonts = {
            'Bebas': {
                normal: 'Bebas',

            }
        };


        const canvas = new fabric.Canvas('canvas', { width: 2000, height: 2000, preserveObjectStacking: true, selection: false,  });

        setCanvas(canvas);

        const handleSelectionEvent = () => {
            const active = canvas.getActiveObject();
            console.log(active.get('fill'));
            setShowProperties(true);
            setSelectedObject(active);
            setSkewX(active.get('skewX'));
            setSkewY(active.get('skewY'));
            setStrokeWidth(active.get('strokeWidth'));
            setSelectedColor(active.get('fill') ? active.get('fill') : '#000000');
            setStrokeColor(active.get('stroke') ? active.get('stroke') : '#000000');
        }

        canvas.on('selection:created', () => {
            handleSelectionEvent()
        })

        canvas.on('selection:updated', () => {
            handleSelectionEvent()
        })

        canvas.on('selection:cleared', (e) => {
            setShowProperties(false);
            setSelectedObject(null);
        })

        canvas.on({
            'object:moving': function(e) {
              e.target.opacity = 0.5;
            },
            'object:modified': function(e) {
              e.target.opacity = 1;
            }
          });
          
        const handleFileUpload = (file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target.result);
            };
            reader.readAsDataURL(file);

            console.log('hello');
        };





        DesignerFunctions.loadSvg(product.canvas_path, canvas);



        init(product.path, canvas, containerWidth, containerHeight);
        DesignerFunctions.displayShapes(canvas);

        console.log(canvas.getObjects());
        console.log(JSON.stringify(canvas));


        DesignerFunctions.displayTextObjects(canvas);
        DesignerFunctions.displayImages(canvas);




        document.addEventListener('keydown', function (e) {
            if (e.key === 'Delete') {
                DesignerFunctions.deleteSelectedObjects(canvas);
            }
        });

        //   document.getElementById('save-button').addEventListener('click', saveAsJSON);
        // canvas.on("mouse:down", (e) => {

        //     if (e.target && e.target.text || e.target && e.target._element) {
        //         controls.enabled = false;
        //     } else {
        //         controls.enabled = true;
        //     }
        // })

        // canvas.on("selection:update", (e) => {
        //     controls.enabled = false;
        // })
        // canvas.on("mouse:up", (e) => {
        //     controls.enabled = true;
        // })
        // Return cleanup function
        return () => {

        };


    }, []);



    const svgFiles = [
        '/logos/Logo_NIKE.svg',
        '/logos/adidas.svg',
        '/logos/puma.svg',
        // Add more SVG file paths as needed
    ];


    const saveAsJSON = () => {
        const canvass = canvas;
        const json = JSON.stringify(canvas.toJSON(['id', 'selectable']));

        // console.log(json);
        // Create a blob from the JSON data
        const blob = new Blob([json], { type: 'application/json' });

        // Create a temporary anchor element
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'canvas.json';

        // Click the anchor element to trigger the download
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = e.target.result;
                loadCanvasFromJSON(json);
            };
            reader.readAsText(file);
        }
    };

    const loadCanvasFromJSON = (json) => {
        canvas.clear();
        document.getElementById('colorPickerContainer').innerHTML=" ";

        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), (o, object) => {
            console.log(object.id);
            if(object.id === 'ZONES'){
                const childObjects = object.getObjects();
                childObjects.forEach((child) => {
                    DesignerFunctions.createColorPicker(child, canvas);
                });
            }

        });
        // console.log('Canvas loaded:', json);
        DesignerFunctions.displayTextObjects(canvas);
        DesignerFunctions.displayImages(canvas);
        DesignerFunctions.displayShapes(canvas);
    };


    const handleUploadButtonClick = () => {
        inputRef.current.click();
    };

    const handleColorButtonClick = (type) => {
        setShowColorPicker(!showColorPicker);
        setPickerType(type);
    };

    const handleStrokeButtonClick = () => {
        setShowStrokeColorPicker(!showStrokeColorPicker);
    };

    const handleAvatarColorClick = () => {
        setShowAvatarPicker(!showAvatarPicker);
    };



    const handleSkewXChange = (e) => {
        const value = parseFloat(e.target.value);
        setSkewX(value);
        skewSelectedObjects(value, skewY);
    };

    const handleSkewYChange = (e) => {
        const value = parseFloat(e.target.value);
        setSkewY(value);
        skewSelectedObjects(skewX, value);
    };


    const handleFontChange = (e) => {
        setSelectedFont(e.target.value);
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);
        if (activeObject) {

            activeObject.set('fontFamily', e.target.value);
            canvas.requestRenderAll();
        }
    };
    const skewSelectedObjects = (skewX, skewY) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('skewX', skewX);
            activeObject.set('skewY', skewY);
            canvas.requestRenderAll();
        }
    };


    const handleStrokeWidthChange = (e) => {
        const width = parseInt(e.target.value);
        setStrokeWidth(width);

        const activeObject = canvas.getActiveObject();

        if (activeObject) {
            // activeObject.set('stroke', strokeColor)
            activeObject.set('strokeWidth', width);
            canvas.requestRenderAll();
        }
    };

    const saveAsImage = () => {
        const mount = document.getElementById("to_save");
        if (!mount) return;

        const canvas = mount.querySelector('canvas');
        if (!canvas) return;


        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        console.log(dataUrl)
        link.href = dataUrl;
        link.download = 'threejs-scene.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const proceedtoOrder = () => {
        const mount = document.getElementById("to_save");
        if (!mount) return;
      
        const canvas = mount.querySelector('canvas');
        if (!canvas) return;
      

        const dataUrl = canvas.toDataURL('image/png');
      
 
        router.post('/design_order', {
          data: { image_data: dataUrl } 
        });
      };
    return (
        <>

            <div className="z-50 p-4 rounded-full dark:bg-zinc-800 bg-gray-50 fixed left-10 bottom-10" onClick={() => setTutorialMode(!tutorialMode)}>
                <IconQuestionMark color='teal' />
            </div>
            {addToModel && (
                <div className="absolute bottom-20 inset-x-0">
                    <div className="flex justify-center text-cent">

                    <p className="bg-aqua p-4 rounded-lg">Click any part of the model to add the object.</p>
                </div>
                </div>
            )}
            <div id="to_save" className={`fixed z-50 hidden bottom-0 bg-green-500`} ></div>
            <div id="renderer" style={{ width: `${containerWidth}`, height: `${containerWidth}` }} className='dark:bg-gradient-to-b from-zinc-950 to-zinc-900 cursor-move'></div>
            {tutorialMode && (
                <>
                    <div onClick={() => setTutorialMode(!tutorialMode)} className="bg-zinc-900/70 fixed top-0 left-0 w-screen h-screen"></div>
                </>
            )}
            <div className='hidden'>
                <canvas id='canvas' style={{ display: 'none' }} className='sticky top-0'></canvas>
            </div>
            <div className='p-1'>
                <div id="tools" className=' fixed top-24 left-5 flex gap-x-4 items-start dark:text-gray-100'>
                    {/* <input type="color" id="set-color" /> */}

                    <div className="relative">
                        <div className="flex flex-col gap-2">
                            <div className={'rounded-lg flex flex-col items-center bg-gray-100 dark:bg-zinc-900 py-2'}>
                                <div className="p-2">
                                    <div onClick={() => handleColorButtonClick('fill')} className='h-5 w-5 border-1 cursor-pointer' style={{ backgroundColor: selectedColor }} title='Fill Color'></div>
                                </div>
                                <div className="p-2">
                                    <div onClick={() => handleColorButtonClick('stroke')} className='h-5 w-5 border-1 cursor-pointer' style={{ backgroundColor: strokeColor }} title='Stroke Color'></div>
                                </div>
                                <button onClick={() => DesignerFunctions.addRect(canvas, setAddToModel)} id="rect-button" className='p-2 cursor-pointer'><svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" title='Rectangle Tool'>
                                    <rect width="15" height="15" fill="white" />
                                </svg></button>
                                <button onClick={() => DesignerFunctions.addCircle(canvas, setAddToModel)} id="circle-button" className='p-2 cursor-pointer'><svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" title='Circle Tool'>
                                    <circle r="7.5" cx="7.5" cy="7.5" fill='white' />
                                </svg></button>
                                <button onClick={() => DesignerFunctions.draw(canvas)} id="draw-button" className='p-1 cursor-pointer' title='Draw'><IconPencil  /></button>
                                <button onClick={() => DesignerFunctions.addText2(canvas, setAddToModel)} id="textButton" className='p-1 cursor-pointer'><IconTextCaption  /></button>


                            </div>
                            <div className="p-1 py-3 rounded-lg dark:bg-zinc-900 bg-gray-100 flex flex-col gap-2 justify-center items-center relative">
                            {tutorialMode && (
                            <>
                                <div className="bg-gray-50 absolute left-[60px] w-[300px] top-0 dark:bg-zinc-900 rounded-lg p-4">
                                    <h6>Avatar</h6>
                                    <p>Click the Avatar Icon to show/hide the person.</p>
                                    <p>You can edit its color by clicking the avatar color button.</p>
                                </div>
                            </>
                        )}
                                <button onClick={() => toggleVisibility()}><IconMan /></button>
                                <div className="p-2">
                                    <div onClick={() => handleColorButtonClick('avatar')} className='h-5 w-5 border-1 cursor-pointer' style={{ backgroundColor: avatarColor }} title='Fill Color'></div>
                                </div>
                            </div>
                            <div className="p-4 rounded-full bg-aqua cursor-pointer text-white" title='Save as Image' onClick={() => saveAsImage()}><IconPhoto/></div>
                            <div className="p-4 rounded-full dark:bg-zinc-800 bg-gray-100 cursor-pointer text-gray-800 dark:text-white" title='Save as JSON' onClick={() => saveAsJSON()}><IconDeviceFloppy/></div>
                            <div className="p-4 rounded-full dark:bg-zinc-800 bg-gray-100 cursor-pointer text-gray-800 dark:text-white" title='Load' onClick={() => handleUploadButtonClick()}><IconUpload/></div>
                            <input type="file" accept=".json" onChange={handleFileUpload} ref={inputRef} className='hidden'/>

                        </div>




                        {tutorialMode && (
                            <>
                                <div className="bg-gray-50 absolute left-[60px] w-[200px] top-0 dark:bg-zinc-900 rounded-lg p-4">
                                    <h6>Toolset</h6>
                                    <p>Set of tools which are handful for adding, modifying and editing elements inside the cloth.</p>
                                </div>
                            </>
                        )}
                    </div>
                    {showColorPicker && (
                            <>
                                {pickerType == 'fill' ? (
                                <ChromePicker color={selectedColor} onChange={(color) => DesignerFunctions.handleFillColorChange(color, canvas, setSelectedColor)} />
                            ) : pickerType == 'stroke' ? (
                                <ChromePicker color={strokeColor} onChange={(color) => DesignerFunctions.handleStrokeColorChange(color, canvas, setStrokeColor)} />
                            ) :    <ChromePicker color={avatarColor} onChange={(color) => changeAvatarColor(color, setAvatarColor)} />}

                            </>
                        )}
                        {/* {showStrokeColorPicker && (
                            <ChromePicker color={strokeColor} onChange={(color) => DesignerFunctions.handleStrokeColorChange(color, canvas, setStrokeColor)} />
                        )}
                        {showAvatarPicker && (
                            <ChromePicker color={avatarColor} onChange={(color) => changeAvatarColor(color, setAvatarColor)} />
                        )} */}
                </div>

                <div className={`lg:m-5 rounded-lg w-full lg:w-1/3 2xl:w-1/4 fixed right-0 lg:h-screen bottom-0 transition-all lg:top-10 bg-gray-100 dark:bg-zinc-900   ${showProperties ? 'h-[calc(100vh-500px)] translate-y-0' : 'translate-y-full lg:translate-y-0'} overflow-y-scroll no-scrollbar`}>

                    <div className="text-center">
                        <button onClick={() => setShowProperties(!showProperties)} className='p-1 cursor-pointer'><IconInfoCircle  size={32} className={`lg:hidden`} /></button>
                    </div>
                    <div className={`w-screen lg:w-full rounded-lg transition-all lg:h-full `}>
                        <div className="bg-gray-100 mb-4">
                            <Tabs aria-label="Full width tabs" style="fullWidth" className='dark:bg-zinc-900'>
                                <Tabs.Item active title="Properties" className='dark:text-gray-100'>


                                    <div className="p-4 dark:text-gray-100">
                                        <p className='mb-4'>Cloth Parts Colors</p>
                                        <div id='colorPickerContainer' className='h-full'></div>
                                        {tutorialMode && (
                                        <>
                                            <div className=" bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                                                <h6>Cloth Colors</h6>
                                                <p>Click the color picker to change specific parts of the cloth</p>
                                            </div>
                                        </>
                                    )}
                                    </div>
                                    {selectedObject ? (
                                        <>
                                            <div className='p-4'>
                                                {selectedObject.text != null && (
                                                    <div className="flex gap-x-2">
                                                        <TextInput type="text" id='text-value' className={'w-full'} value={selectedObject.text} onChange={(e) => DesignerFunctions.changeText(canvas, e.target.value, setSelectedObject, selectedObject)} />
                                                        <select id="fontSelect" className='rounded-md' value={selectedFont} onChange={handleFontChange}>
                                                            <option value="Arial">Arial</option>
                                                            <option value="Bebas">Bebas</option>
                                                            <option value="Verdana">Verdana</option>
                                                            <option value="Times New Roman">Times New Roman</option>
                                                            {/* Add more font options as needed */}
                                                        </select>
                                                    </div>
                                                )}
                                                <div style={{ marginTop: '20px' }}>
                                                    <InputLabel htmlFor="strokeWidth">Stroke Width:</InputLabel>
                                                    <TextInput
                                                        type="number"
                                                        id="strokeWidth"
                                                        value={strokeWidth}
                                                        onChange={handleStrokeWidthChange}
                                                        min="0"
                                                    />
                                                </div>
                                                <div className='p-4'>
                                                    <InputLabel>Skew X</InputLabel>
                                                    <input
                                                        type="range"
                                                        id="skewX"
                                                        min="-10"
                                                        max="10"
                                                        step="0.1"
                                                        value={skewX}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"

                                                        onChange={(e) => DesignerFunctions.handleSkewXChange(e.target.value, skewY, setSkewX, canvas)}
                                                    />
                                                    <InputLabel>Skew Y</InputLabel>
                                                    <input
                                                        type="range"
                                                        id="skewY"
                                                        min="-10"
                                                        max="10"
                                                        step="0.1"
                                                        value={skewY}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                                        color='teal'
                                                        onChange={(e) => DesignerFunctions.handleSkewYChange(e.target.value, skewX, setSkewY, canvas)}
                                                    />

                                                </div>

                                            </div>
                                        </>
                                    ) : (

                                        <>
                                            <p className='text-center dark:text-gray-100'>Select an object in the model.</p>
                                        </>
                                    )}
                                    <div className="p-4">
                                    {tutorialMode && (
                                        <>
                                            <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                                                <h6>Properties Tab</h6>
                                                <p>Here, you can modify your objects. Select or click one object in your model and its properties will appear.</p>
                                            </div>
                                        </>
                                    )}
                                    </div>

                                </Tabs.Item>
                                <Tabs.Item title="Text">
                                    <div className="p-4">
                                        <div className='flex gap-2 w-full'>
                                            <TextInput type="text" id="text-input" className='w-full' placeholder="Enter text" />
                                            <PrimaryButton id="add-text-btn"  onClick={() => DesignerFunctions.addText(canvas, setAddToModel)}>Add</PrimaryButton>
                                        </div>
                                        <div className='p-4'>
                                            <p className="font-bold">Texts</p>
                                            <div id="textObjects"></div>
                                        </div>
                                        {tutorialMode && (
                                        <>
                                            <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                                                <h6>Text Tab</h6>
                                                <p>Select one text in the list and it will automatically select it in the canvas. You can add text by using the input above.</p>
                                            </div>
                                        </>
                                    )}
                                    </div>
                                </Tabs.Item>
                                <Tabs.Item title="Objects" >
                                    <div className='p-4'>

                                        <div id="shapes"></div>
                                        {tutorialMode && (
                                        <>
                                            <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                                                <h6>Objects Tab</h6>
                                                <p>Select one objects in the list and it will automatically select it in the canvas. This is the tabs for shapes.</p>
                                            </div>
                                        </>
                                    )}
                                    </div>
                                </Tabs.Item>
                                <Tabs.Item title="Images" >
                                    <div className="p-4">
                                        <TextInput type='file' id='upload-image' onChange={() => DesignerFunctions.addImage(canvas, setAddToModel)}/>
                                        <PrimaryButton onClick={() => DesignerFunctions.addImage(canvas)}>Add</PrimaryButton>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {svgFiles.map((svgUrl, index) => (
                                                <div className='rounded-lg dark:bg-zinc-800 p-2 cursor-pointer' key={index} style={{ margin: '10px', cursor: 'pointer' }} onClick={() => DesignerFunctions.addSvgToCanvas(svgUrl, selectedColor, canvas)}>
                                                    <img src={svgUrl} alt={`SVG ${index}`} style={{ width: '100px', height: 'auto' }} />
                                                </div>
                                            ))}
                                        </div>
                                        <div id="images"></div>
                                        {tutorialMode && (
                                        <>
                                            <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                                                <h6>Images Tab</h6>
                                                <p>Select one image in the list and it will automatically select it in the canvas. Add shapes or images using our predefined our your custom upload.</p>
                                            </div>
                                        </>
                                    )}
                                    </div>
                                </Tabs.Item>
                                <Tabs.Item title="Designs" >
                                    {/* <button onClick={() => DesignerFunctions.changeDesign(canvas, '/designs/BLUE-WHITE-JERSEY.svg')}>Change</button> */}
                                    <div className="p-5 grid grid-cols-4 gap-4">
                                    {product.designs.map(design => (
                                        <>
                                            <div className='rounded-lg dark:bg-zinc-800 p-2 cursor-pointer' onClick={() => DesignerFunctions.changeDesign(canvas, `/storage/${design.file}`)}>
                                                
                                            <img src={`/storage/${design.file}`} alt={design.name} />
                                            {/* {design.name} */}
                                            </div>
                                        </>
                                    ))}
                                    </div>
                                    <div className="p-4">
                                    {tutorialMode && (
                                        <>
                                            <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                                                <h6>Designs Tab</h6>
                                                <p>Select one design in the list and it will automatically change the design of the cloth.</p>
                                            </div>
                                        </>
                                    )}
                                    </div>
                                </Tabs.Item>
                            </Tabs>
                            
                        </div>
                        <div className='fixed bottom-20 right-10'>
                                <PrimaryButton onClick={() => proceedtoOrder()}>Proceed to Order</PrimaryButton>
                            </div>
                        <>


                        </>

                    </div>

                </div>


            </div>


        </>
    );


}

