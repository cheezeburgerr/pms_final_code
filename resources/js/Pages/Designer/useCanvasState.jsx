// useCanvasState.js
import { useState, useRef } from 'react';

const useCanvasState = () => {
    const [svgObject, setSvgObject] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const canvasRef = useRef(null);
    const [strokeColor, setStrokeColor] = useState('#ff00ff');
    const [strokeWidth, setStrokeWidth] = useState(0);
    const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [skewX, setSkewX] = useState(0);
    const [skewY, setSkewY] = useState(0);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [selectedFont, setSelectedFont] = useState('Bebas');
    const [rotationAngle, setRotationAngle] = useState(null);
    return {
        svgObject, setSvgObject,
        showColorPicker, setShowColorPicker,
        canvasRef,
        strokeColor, setStrokeColor,
        strokeWidth, setStrokeWidth,
        showStrokeColorPicker, setShowStrokeColorPicker,
        showAvatarPicker, setShowAvatarPicker,
        uploadedImage, setUploadedImage,
        selectedObject, setSelectedObject,
        canvas, setCanvas,
        skewX, setSkewX,
        skewY, setSkewY,
        selectedLogo, setSelectedLogo,
        selectedColor, setSelectedColor,
        selectedFont, setSelectedFont,
        rotationAngle, setRotationAngle
    };
};

export default useCanvasState;
