import TextInput from "@/Components/TextInput";
import * as DesignerFunctions from "./DesignerFunctions";
import { CompactPicker } from "react-color";
import InputLabel from "@/Components/InputLabel";
import { IconRadiusTopLeft, IconTrash } from "@tabler/icons-react";
import React, { useState, useEffect } from 'react';
import GradientSlider from "@/Components/GradientSlider";
import { Tooltip } from "flowbite-react";

export default function PropertiesBubble({ selectedObject, setSelectedObject, canvas, selectedColor, setSelectedColor, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, colorStops, setColorStops, rotationAngle, setRotationAngle }) {

    const [pickerType, setPickerType] = useState();
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [propertiesPanel, setPropertiesPanel] = useState(false);
    const [showGradientProperties, setShowGradientProperties] = useState(false);
    const [skewX, setSkewX] = useState(0);
    const [skewY, setSkewY] = useState(0);
    const [radius, setRadius] = useState(0);

    const [selectedFont, setSelectedFont] = useState();
    const handleColorButtonClick = (type) => {
        setShowColorPicker(!showColorPicker);
        // setPropertiesPanel(false);
        setPickerType(type);
    };

    useEffect(() => {
        setPropertiesPanel(false);
        setShowColorPicker(false);
        setShowGradientProperties(false);
        // setShowProperties(false);
    }, [selectedObject]);

    const handleFontChange = (e) => {
        setSelectedFont(e.target.value);
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);
        if (activeObject) {

            activeObject.set('fontFamily', e.target.value);
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

    const handlePropertiesPanel = () => {
        setPropertiesPanel(!propertiesPanel);
        setShowColorPicker(false);
        // setIsExpanded(!isExpanded);
    }

    // console.log(selectedObject);
    return (
        <>
            {selectedObject && (


                <div className="fixed inset-x-20 bottom-20 z-50 p-4 flex flex-col items-center justify-center" >

                    {propertiesPanel && (
                        <>
                            {selectedObject && (
                                <>
                                    <div className='p-2 mb-2 dark:bg-zinc-800 rounded-lg bg-gray-100'>
                                        {selectedObject.text != null && (
                                            <div className="flex gap-x-2">
                                                <TextInput type="text" id='text-value' className={'w-full'} value={selectedObject.text} onChange={(e) => DesignerFunctions.changeText(canvas, e.target.value, setSelectedObject, selectedObject)} />
                                                <select id="fontSelect" className='rounded-md' value={selectedObject.fontFamily} onChange={handleFontChange}>
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
                                                    value={selectedObject.skewX}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"

                                                    onChange={(e) => DesignerFunctions.handleSkewXChange(e.target.value, selectedObject.skewY, setSkewX, canvas)}
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
                                                    value={selectedObject.skewY}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                                    color='teal'
                                                    onChange={(e) => DesignerFunctions.handleSkewYChange(e.target.value, selectedObject.skewX, setSkewY, canvas)}
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
                            ) : null}

                        </>
                    )}
                    {showGradientProperties && (
                        <>
                            <GradientSlider canvas={canvas} selectedObject={selectedObject} setSelectedObject={setSelectedObject} colorStops={colorStops} setColorStops={setColorStops} rotationAngle={rotationAngle} setRotationAngle={setRotationAngle} />
                        </>
                    )}
                    <div className="flex gap-2 items-center">
                        <div className="overflow-x-auto max-w-[calc(100vw-120px)] lg:max-w-full p-2 flex items-center self-center gap-2 align-middle flex-row dark:bg-zinc-800 bg-gray-100 dark:text-gray-100 rounded-lg ">
                            {selectedObject.text != null && (
                                <div className="flex gap-x-2 border-r dark:border-zinc-700 px-2">
                                    <select id="fontSelect" className='rounded-md dark:bg-zinc-900 dark:border-zinc-800' value={selectedObject.fontFamily} onChange={handleFontChange}>
                                        <option value="Arial">Arial</option>
                                        <option value="Bebas">Bebas</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Panchang">Panchang</option>
                                        {/* Add more font options as needed */}
                                    </select>
                                    <TextInput type="text" id='text-value' className={'w-36'} value={selectedObject.text} onChange={(e) => DesignerFunctions.changeText(canvas, e.target.value, setSelectedObject, selectedObject)} />
                                </div>
                            )}
                            {selectedObject.type != 'image' && (
                                <>
                                    <div className="border-r dark:border-zinc-700 flex gap-2 items-center">
                                        <div className="px-2">
                                            <div onClick={() => handleColorButtonClick('fill')} className='h-7 w-7 border-1 cursor-pointer rounded-full' style={{ backgroundColor: selectedColor }} title='Fill Color'></div>
                                        </div>
                                        <button className="text-xs" onClick={() => setShowGradientProperties(!showGradientProperties)}>Add Gradient</button>
                                        <div className="px-2">
                                            <div onClick={() => handleColorButtonClick('stroke')} className='h-7 w-7 border-1 cursor- rounded-full' style={{ backgroundColor: strokeColor }} title='Stroke Color'></div>
                                        </div>
                                    </div>
                                </>
                            )}








                            {/* <button onClick={() => DesignerFunctions.addText2(canvas, setAddToModel)} id="textButton" className='p-1 cursor-pointer'><IconTextCaption /></button> */}
                            {selectedObject.type == 'rect' && (
                                <>
                                    <Tooltip content={
                                        <>
                                            <TextInput type="number" onChange={(e) => DesignerFunctions.handleCornerRadius(canvas, e.target.value, setRadius)} value={selectedObject.rx} />
                                        </>
                                    } trigger="click">
                                        <div className="px-2"><IconRadiusTopLeft /></div>
                                    </Tooltip>

                                </>
                            )}
                            <button className=' text-xs w-full p-2' onClick={handlePropertiesPanel}>Show Properties</button>
                        </div>
                        <div className="p-3 dark:bg-zinc-800 dark:text-gray-100 text-zinc-800 bg-gray-100 rounded-lg">
                            <div onClick={() => DesignerFunctions.deleteSelectedObjects(canvas)} className='cursor-pointer' title='Delete'><IconTrash /></div>
                        </div>
                    </div>


                </div>



            )}




        </>
    )
}