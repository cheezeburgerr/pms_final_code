
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
import { ChromePicker, CompactPicker } from 'react-color';
import InputLabel from '@/Components/InputLabel';
import { IconArrowBack, IconArrowForward, IconArrowLeft, IconArrowRight, IconChevronLeft, IconChevronRight, IconColorPicker, IconColorSwatch, IconDeviceFloppy, IconInfoCircle, IconLetterCase, IconLetterT, IconMan, IconPencil, IconPhoto, IconQuestionMark, IconShape, IconShirt, IconTextCaption, IconTrash, IconUpload } from '@tabler/icons-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import useCanvasState from './useCanvasState';
import { router } from '@inertiajs/react';
import PropertiesPanel from './PropertiesPanel';
import Dropdown from '@/Components/Dropdown';



export default function Configurator({ auth, product }) {

    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);


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



    const saveCanvasState = (canvas) => {
        const jsonState = canvas.toJSON(['id', 'selectable']);
        setUndoStack((prev) => [...prev, jsonState]);
        setRedoStack([]); // Clear redo stack on new action
    };

    const [showProperties, setShowProperties] = useState(false);
    const [avatarColor, setAvatarColor] = useState("#FFDBAC");
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight-200;

    const [tutorialMode, setTutorialMode] = useState(false);
    const [addToModel, setAddToModel] = useState(false);
    const [pickerType, setPickerType] = useState();
    const inputRef = useRef(null);
    const uploadRef = useRef(null);
    useEffect(() => {


        fabric.fonts = {
            'Bebas': {
                normal: 'Bebas',

            },
            'Panchang': {
                normal: 'Panchang',

            }
        };


        const canvas = new fabric.Canvas('canvas', { width: 1000, height: 1000, preserveObjectStacking: true, selection: false, });
        canvas.on('object:modified', saveCanvasState.bind(this, canvas));



        const deleteIcon = "data:image/svg+xml;base64,PHN2ZyB..."; // Add your base64 SVG icon

        fabric.Object.prototype.cornerSize = 20;
        fabric.Object.prototype.cornerColor = 'gray';
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.padding = 10;
        setCanvas(canvas);

        const handleSelectionEvent = () => {
            const active = canvas.getActiveObject();
            console.log(active.get('fill'));
            // setShowProperties(true);
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
            'object:moving': function (e) {
                e.target.opacity = 0.5;
            },
            'object:modified': function (e) {
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


        const rect = new fabric.Rect({
            left: 200, // Half of rectangle width subtracted from canvas center
            top: 800, // Half of rectangle height subtracted from canvas center
            fill: "#00ffff",
            width: 100,
            height: 100,
            transparentCorners: false,
            centeredScaling: true,
        });

        console.log(rect);
        
        rect.setGradient('fill', {
            x1: -rect.width / 2,
            y1: -rect.height / 2,
            x2: rect.width / 2,
            y2: rect.height / 2,
            colorStops: {
            0: "black",
            0.5: "red",
            1: "blue"
            }
            });  


            // canvas.add(rect);
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


        return () => {

        };


    }, []);



    const svgFiles = [
        // '/logos/Logo_NIKE.svg',
        '/logos/adidas.svg',
        '/logos/puma.svg',
        // Add more SVG file paths as needed
    ];


    const undo = () => {
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            document.getElementById('colorPickerContainer').innerHTML = " ";
            setRedoStack((prev) => [...prev, canvas.toJSON(['id', 'selectable'])]); // Save current state for redo
            canvas.loadFromJSON(lastState, canvas.renderAll.bind(canvas), (o, object) => {
                console.log(object.id);
                if (object.id === 'ZONES') {
                    const childObjects = object.getObjects();
                    childObjects.forEach((child) => {
                        DesignerFunctions.createColorPicker(child, canvas);
                    });
                }

            });
            setUndoStack([...undoStack]); // Update state
        }
    };

    const redo = () => {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            setUndoStack((prev) => [...prev, canvas.toJSON(['id', 'selectable'])]); // Save current state for undo
            canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas), (o, object) => {
                console.log(object.id);
                if (object.id === 'ZONES') {
                    const childObjects = object.getObjects();
                    childObjects.forEach((child) => {
                        DesignerFunctions.createColorPicker(child, canvas);
                    });
                }

            });
            setRedoStack([...redoStack]); // Update state
        }
    };
    const saveAsJSON = () => {
        const canvass = canvas;
        const json = JSON.stringify(canvas.toJSON(['id', 'selectable']));


        const blob = new Blob([json], { type: 'application/json' });

        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'canvas.json';


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
        document.getElementById('colorPickerContainer').innerHTML = " ";

        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), (o, object) => {
            console.log(object.id);
            if (object.id === 'ZONES') {
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

    const handleUploadImageClick = () => {
        uploadRef.current.click();
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

    const [isExpanded, setIsExpanded] = useState(true);
    const [isExpanded2, setIsExpanded2] = useState(true);
    const [isExpanded3, setIsExpanded3] = useState(true);  // State for expanding/retracting the toolbar
    const inputRef2 = useRef(null); // Reference for the file input

    const [tab, setShowTab] = useState();


    const [propertiesPanel, setPropertiesPanel] = useState(false);


    const handlePropertiesPanel = () => {
        setPropertiesPanel(!propertiesPanel);
        // setIsExpanded(!isExpanded);
    }

    const toggleToolbar = () => {
        setIsExpanded(!isExpanded); // Toggle the toolbar's visibility
    };

    const [activeTab, setActiveTab] = useState(null);

    const toggleTab = (tab) => {
        if (activeTab === tab) {
            setShowProperties(false); // Hide if the same tab is clicked
            setActiveTab(null); // Reset the active tab
        } else {
            setShowProperties(true); // Show properties if a different tab is clicked
            setActiveTab(tab); // Set the clicked tab as active
        }
    };
    return (
        <>


            {
                selectedObject && (
                    <>
                        <div className="fixed inset-x-20 bottom-10 z-50 p-4 flex flex-col items-center justify-center" >
                            {<>

                            </>}
                            {propertiesPanel && (
                                <>
                                    {selectedObject && (
                                        <>
                                            <div className='p-2 dark:bg-zinc-800 rounded-lg bg-gray-100'>
                                                {selectedObject.text != null && (
                                                    <div className="flex gap-x-2">
                                                        <TextInput type="text" id='text-value' className={'w-full'} value={selectedObject.text} onChange={(e) => DesignerFunctions.changeText(canvas, e.target.value, setSelectedObject, selectedObject)} />
                                                        <select id="fontSelect" className='rounded-md' value={selectedFont} onChange={handleFontChange}>
                                                            <option value="Arial">Arial</option>
                                                            <option value="Bebas">Bebas</option>
                                                            <option value="Verdana">Verdana</option>
                                                            <option value="Times New Roman">Times New Roman</option>
                                                            <option value="Panchang">Panchang</option>
                                                            {/* Add more font options as needed */}
                                                        </select>
                                                    </div>
                                                )}

                                                <div className='p-4 flex gap-2'>
                                                    <div>
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
                                                    </div>
                                                    <div>
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

                                            </div>
                                        </>
                                    )
                                    }
                                </>
                            )}
                            {showColorPicker && (
                                <>
                                    {pickerType == 'fill' ? (
                                        <CompactPicker color={selectedColor} onChange={(color) => DesignerFunctions.handleFillColorChange(color, canvas, setSelectedColor)} />
                                    ) : pickerType == 'stroke' ? (
                                        <div className='flex gap-2'>
                                            <CompactPicker color={strokeColor} onChange={(color) => DesignerFunctions.handleStrokeColorChange(color, canvas, setStrokeColor)} />
                                            <div>
                                                <InputLabel htmlFor="strokeWidth">Stroke Width:</InputLabel>
                                                <TextInput
                                                    type="number"
                                                    id="strokeWidth"
                                                    value={strokeWidth}
                                                    onChange={handleStrokeWidthChange}
                                                    min="0"
                                                    className='w-16'
                                                />
                                            </div>
                                        </div>
                                    ) : <ChromePicker color={avatarColor} onChange={(color) => changeAvatarColor(color, setAvatarColor)} />}

                                </>
                            )}
                            <div className="flex flex-row dark:bg-zinc-800 bg-gray-100 dark:text-gray-100 m-4 rounded-lg px-4">
                                {selectedObject.text != null && (
                                    <div className="flex gap-x-2">
                                        <TextInput type="text" id='text-value' className={'w-36'} value={selectedObject.text} onChange={(e) => DesignerFunctions.changeText(canvas, e.target.value, setSelectedObject, selectedObject)} />
                                    </div>
                                )}
                                <div className="p-2">
                                    <div onClick={() => handleColorButtonClick('fill')} className='h-7 w-7 border-1 cursor-pointer rounded-full' style={{ backgroundColor: selectedColor }} title='Fill Color'></div>
                                </div>

                                <div className="p-2">
                                    <div onClick={() => handleColorButtonClick('stroke')} className='h-7 w-7 border-1 cursor- rounded-full' style={{ backgroundColor: strokeColor }} title='Stroke Color'></div>
                                </div>

                                <div className="p-2">
                                    <div onClick={() => DesignerFunctions.deleteSelectedObjects(canvas)} className='cursor-pointer' title='Delete'><IconTrash /></div>
                                </div>


                                {/* <button onClick={() => DesignerFunctions.addText2(canvas, setAddToModel)} id="textButton" className='p-1 cursor-pointer'><IconTextCaption /></button> */}
                                <button className='px-2 text-xs w-full' onClick={handlePropertiesPanel}>Show Properties</button>
                            </div>
                        </div>
                    </>
                )
            }


            {addToModel && (
                <>
                    <div className="absolute top-40 inset-x-0">
                        <div className="flex justify-center text-cent">

                            <p className="bg-aqua p-4 rounded-lg">Click any part of the model to add the object.</p>
                        </div>
                    </div>

                </>
            )}
            <div id="to_save" className={`fixed z-50 hidden bottom-0 bg-green-500`} ></div>
            <div className="z-[99999] p-2 pl-8 lg:px-24 dark:bg-aqua space-x-1 bg-aqua flex gap-3 items-center">
                {/* <p>Configurator</p> */}
                <button onClick={undo} className='cursor-pointer'><IconArrowBack /></button>
                <button onClick={redo}><IconArrowForward /></button>
                <Dropdown className=''>
                    <Dropdown.Trigger>
                        <span className="inline-flex rounded-md">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 dark:bg-transparent hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                            >
                                <IconDeviceFloppy color='black' />
                            </button>
                        </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content className='rounded-none p-2 dark:text-gray-100'>
                        <div className="p-2 space-y-2 dark:text-gray-100">
                            <div className='cursor-pointer' onClick={() => saveAsImage()}>Save as Image</div>
                            <div className='cursor-pointer' onClick={() => saveAsJSON()}>Save as File</div>
                        </div>
                    </Dropdown.Content>
                </Dropdown>
                <div className="p-2 rounded-full  cursor-pointer" title='Load' onClick={() => handleUploadButtonClick()}>
                    <IconUpload />
                </div>
                <input type="file" accept=".json" onChange={handleFileUpload} ref={inputRef} className='hidden' />
                <div className="" onClick={() => setTutorialMode(!tutorialMode)}>
                    <IconQuestionMark color='teal' />
                </div>
            </div>
            <div className='lg:flex gap-4 '>
                <div className="flex">
                <div id="renderer" style={{ width: `${containerWidth}`, height: `${containerWidth}` }} className='dark:bg-gradient-to-b from-zinc-950 to-zinc-900 cursor-move'></div>
                </div>
                <div className='w-full h-[500px] bg-gray-900'>

                </div>
            </div>

            {tutorialMode && (
                <>
                    <div onClick={() => setTutorialMode(!tutorialMode)} className="bg-zinc-900/70 fixed top-0 left-0 w-screen h-screen"></div>
                </>
            )}
            <div className='block'>
                <canvas id='canvas' style={{ display: 'block' }} className='sticky top-0'></canvas>
            </div>
            <div className='p-1'>
                <div className={` transition-all duration-300 h-full fixed inset-y-0 flex flex-col gap-4 items-start justify-center right-0 top-0 p-2`}>


                    <div className={`mt-4  ${isExpanded ? 'translate-x-0' : 'translate-x-[60px]'} transition-all dark:text-gray-100  me-2 flex flex-row items-center justify-center`}>

                        <button
                            onClick={toggleToolbar}
                            className="p-2 text-gray-800 bg-gray-100 dark:bg-zinc-800 rounded-l-lg dark:text-white z-50"
                            title={isExpanded ? 'Collapse Toolbar' : 'Expand Toolbar'}
                        >
                            {!isExpanded ? <IconChevronLeft /> : <IconChevronRight />} {/* Use an icon or text for toggle */}
                        </button>
                        <div className="flex flex-col gap-4 items-center bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">

                            {tutorialMode && (
                                <div className="bg-gray-50 absolute -left-[250px] w-[200px] top-0 dark:bg-zinc-900 rounded-lg p-4">
                                    <h6>Avatar</h6>
                                    <p className='text-xs'>Click the Avatar Icon to show/hide the person.</p>
                                    <p className='text-xs'>You can edit its color by clicking the avatar color button.</p>
                                </div>
                            )}
                            <button onClick={() => toggleVisibility()} className='dark:text-gray-100'><IconMan /></button>
                            <div className="p-2">
                                <div onClick={() => handleColorButtonClick('avatar')} className='h-5 w-5 border-1 cursor-pointer' style={{ backgroundColor: avatarColor }} title='Avatar Color'></div>
                            </div>

                        </div>


                    </div>
                    <div className={` ${isExpanded2 ? 'translate-x-0' : 'translate-x-[60px]'} lg:hidden transition-all dark:text-gray-100  me-2 flex flex-row items-center justify-center`}>


                        <button
                            onClick={() => setIsExpanded2(!isExpanded2)}
                            className="p-2 text-gray-800 bg-gray-100 dark:bg-zinc-800 rounded-l-lg dark:text-white z-50"
                            title={isExpanded2 ? 'Collapse Toolbar' : 'Expand Toolbar'}
                        >
                            {!isExpanded2 ? <IconChevronLeft /> : <IconChevronRight />} {/* Use an icon or text for toggle */}
                        </button>

                        <div className="flex flex-col gap-4 items-center bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                            {tutorialMode && (
                                <div className="bg-gray-50 absolute -left-[350px] w-[300px] bottom-0 dark:bg-zinc-900 rounded-lg p-4">
                                    <h6>Elements</h6>
                                    <p className='text-xs'>Click elements and add it to the model.</p>
                                    <p className='text-xs'>Once placed, its properties will appear below.</p>
                                </div>
                            )}
                            <button onClick={() => DesignerFunctions.addRect(canvas, setAddToModel, saveCanvasState)} id="rect-button" className='p-2 cursor-pointer'>
                                <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" title='Rectangle Tool'>
                                    <rect width="15" height="15" fill="white" stroke='black' strokeWidth={1} />
                                </svg>
                            </button>

                            <button onClick={() => DesignerFunctions.addCircle(canvas, setAddToModel)} id="circle-button" className='p-2 cursor-pointer'><svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" title='Circle Tool'>
                                <circle r="7.5" cx="7.5" cy="7.5" fill='white' stroke='black' strokeWidth={1} />
                            </svg></button>
                            <button onClick={() => DesignerFunctions.addText2(canvas, setAddToModel)} id="textButton" className='p-1 cursor-pointer'><IconLetterCase /></button>
                            {/* <TextInput type='file' id='upload-image' onChange={() => DesignerFunctions.addImage(canvas, setAddToModel)} /> */}
                            <div className="p-2 rounded-full  cursor-pointer" title='Upload Image' onClick={() => handleUploadImageClick()}>
                                <IconUpload />
                            </div>
                            <input type="file" id='upload-image' onChange={() => DesignerFunctions.addImage(canvas, setAddToModel)} ref={uploadRef} className='hidden' />


                        </div>


                    </div>

                </div>
                <div className="absolute inset-x-0 lg:right-auto left-0 lg:inset-y-0  bottom-0  flex flex-col-reverse lg:flex-row  items-center justify-center ">

                    <div className='dark:text-gray-100 w-full lg:w-auto flex lg:flex-col lg:gap-16 justify-center items-center dark:bg-zinc-800 bg-gray-100 rounded-lg p-2 h-full'>

                        <div className='text-center flex flex-col items-center w-full cursor-pointer' onClick={() => toggleTab('1')}>
                            <IconColorSwatch />
                            <small>Cloth</small>
                        </div>
                        <div className='text-center flex flex-col items-center w-full cursor-pointer' onClick={() => toggleTab('2')}>
                            <IconShape />
                            <small>Objects</small>
                        </div>
                        <div className='text-center flex flex-col items-center w-full cursor-pointer' onClick={() => toggleTab('3')}>
                            <IconShirt />
                            <small>Designs</small>
                        </div>
                        <div className='text-center flex flex-col items-center w-full cursor-pointer' onClick={() => toggleTab('4')}>
                            <IconLetterCase />
                            <small>Text</small>
                        </div>
                        <div className='text-center flex flex-col items-center w-full cursor-pointer' onClick={() => toggleTab('3')}>
                            <IconPhoto />
                            <small>Images</small>
                        </div>

                    </div>
                    <div className={`${showProperties ? 'block' : 'hidden'} bg-gray-100 dark:bg-zinc-800 dark:text-gray-100 p-6 rounded-lg lg:rounded-none shadow-lg lg:min-h-[calc(100vh-100px)] mt-32 border-l border-zinc-300 dark:border-zinc-700 lg:min-w-[250px] lg:max-w-[250px]`}>
                        <div className={`${activeTab === '1' ? 'block' : 'hidden'}`}>
                            <p className="font-bold">Cloth Colors</p>
                            <small className='mb-2'>Adjust colors in each part of the model</small>
                            <div id="colorPickerContainer" className='flex lg:block'></div>

                        </div>

                        <div className={`${activeTab === '2' ? 'block' : 'hidden'} `}>
                            <p className="font-bold">Objects</p>
                            <div id="shapes"></div>
                            <div className='grid grid-cols-2'>
                                {svgFiles.map((svgUrl, index) => (
                                    <div className='rounded-lg dark:bg-zinc-800 p-2 cursor-pointer' key={index} style={{ margin: '10px', cursor: 'pointer' }} onClick={() => DesignerFunctions.addSvgToCanvas(svgUrl, selectedColor, canvas, setAddToModel)}>
                                        <img src={svgUrl} alt={`SVG ${index}`} style={{ width: '100px', height: 'auto' }} />
                                    </div>
                                ))}
                            </div>
                            <p className="font-bold mb-1">Shapes</p>
                            <div className="grid grid-cols-2">
                                <button onClick={() => DesignerFunctions.addRect(canvas, setAddToModel, saveCanvasState)} id="rect-button" className='p-2 cursor-pointer'>
                                    <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" title='Rectangle Tool'>
                                        <rect width="25" height="25" fill="white" stroke='black' strokeWidth={1} />
                                    </svg>
                                </button>

                                <button onClick={() => DesignerFunctions.addCircle(canvas, setAddToModel)} id="circle-button" className='p-2 cursor-pointer'><svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" title='Circle Tool'>
                                    <circle r="15" cx="15" cy="15" fill='white' stroke='black' strokeWidth={1} />
                                </svg></button>
                            </div>

                            <div id="shapes"></div>
                        </div>

                        <div className={`${activeTab === '3' ? 'block' : 'hidden'}  lg:h-[calc(100vh/2)] overflow-y-auto`}>
                            <div id="images"></div>
                            <p className='mb-2'>Designs</p>
                            <div className="flex overflow-x-auto lg:grid grid-cols-2 gap-2 w-full">
                                {product.designs.map(design => (
                                    <div
                                        key={design.id} // Ensure a unique key if it's in a loop
                                        className="min-w-[50px] rounded-lg dark:bg-zinc-700 p-2 cursor-pointer"
                                        onClick={() => DesignerFunctions.changeDesign(canvas, `/storage/${design.file}`)}
                                    >
                                        <img
                                            src={`/storage/${design.file}`}
                                            alt={design.name}
                                            className="h-12 lg:h-24"
                                        />
                                        {/* {design.name} */}
                                    </div>
                                ))}
                            </div>


                        </div>
                        <div className={`${activeTab === '4' ? 'block' : 'hidden'}  lg:h-[calc(100vh/2)] overflow-y-auto`}>

                            <p className='mb-2'>Text</p>
                            <div className='flex gap-2 w-full'>
                                <TextInput type="text" id="text-input" className='w-full' placeholder="Enter text" />
                                <PrimaryButton id="add-text-btn" onClick={() => DesignerFunctions.addText(canvas, setAddToModel)}>Add</PrimaryButton>
                            </div>
                            <div id="textObjects"></div>


                        </div>
                    </div>


                </div>




            </div>

            {/* <PropertiesPanel selectedFont={selectedFont} selectedObject={selectedObject} canvas={canvas} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} skewX={skewX} skewY={skewY} setSkewX={setSkewX} setSkewY={setSkewY} setSelectedFont={setSelectedFont} setSelectedObject={setSelectedObject} /> */}

        </>
    );


}

