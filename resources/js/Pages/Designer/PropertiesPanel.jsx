import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import * as DesignerFunctions from './DesignerFunctions';

export default function PropertiesPanel({selectedFont, setSelectedFont, selectedObject, strokeWidth, setSelectedObject, setStrokeWidth, skewX, skewY, setSkewX, setSkewY, canvas}) {


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
    return (
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
    )
}