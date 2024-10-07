import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { IconX } from "@tabler/icons-react";
import SecondaryButton from "./SecondaryButton";
import { Card } from "flowbite-react";
import { div } from "three/examples/jsm/nodes/Nodes";

export default function GradientSlider({ canvas, selectedObject, setSelectedObject, colorStops, setColorStops, rotationAngle, setRotationAngle }) {

    //   const [selectedObject, setSelectedObject] = useState(null); // Track selected object

    // Initialize Fabric.js canvas and listen for object selection
    useEffect(() => {
        // Handle object selection
        const handleObjectSelected = (e) => {
            const obj = e.target;
            console.log("Selected Object:", obj); // Debug: check the selected object

            // Check if the selected object has a gradient fill
            if (obj) {
                console.log("Gradient:", obj.fill); // Debug: check gradient

                const gradient = obj.fill;
                if (gradient.colorStops) {
                    const newColorStops = gradient.colorStops.map((stop) => ({
                        offset: stop.offset,
                        color: stop.color,
                    }));

                    setColorStops(newColorStops); // Update color stops for sliders
                    setSelectedObject(obj); // Set the selected object

                    const x2 = gradient.coords.x2;
                    const y2 = gradient.coords.y2;
                    const x1 = gradient.coords.x1;
                    const y1 = gradient.coords.y1;
                    const deltaX = x2 - x1;
                    const deltaY = y2 - y1;
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert to degrees
                    setRotationAngle(angle); // Set initial rotation angle
                    console.log(angle, rotationAngle);

                } else {
                    console.warn("No colorStops found in gradient.");
                    setColorStops([]); // Reset if no gradient
                }
            } else {
                console.warn("Selected object does not have a gradient.");
                // setColorStops([]); // Reset if no gradient
            }
        };


        // Attach event listener
        canvas.on("object:selected", handleObjectSelected);

        // Reset when nothing is selected
        canvas.on("selection:cleared", () => {
            setColorStops([]); // Clear sliders
            setSelectedObject(null); // Clear selected object
            setRotationAngle(0);
        });

        // Cleanup event listeners when component unmounts
        // return () => {
        //   canvas.off("object:selected", handleObjectSelected);
        // };
    }, [canvas]);

    // Update the gradient when color stops change
    useEffect(() => {
        if (selectedObject && colorStops.length > 0) {

            const angleInRadians = rotationAngle * (Math.PI / 180); // Convert to radians
            const x2 = Math.cos(angleInRadians) * selectedObject.width; // Calculate x2
            const y2 = Math.sin(angleInRadians) * selectedObject.height; // Calculate y2

            const gradient = new fabric.Gradient({
                type: "linear",
                gradientUnits: "pixels",
                coords: { x1: 0, y1: 0, x2: x2, y2: y2 },
                colorStops: colorStops.map((stop) => ({
                    offset: stop.offset,
                    color: stop.color,
                })),
            });

            selectedObject.set("fill", gradient);
            canvas.renderAll(); // Re-render canvas to apply changes
        }
    }, [colorStops, rotationAngle, selectedObject, canvas]);

    // Function to handle color change
    const handleColorChange = (index, newColor) => {
        const updatedStops = [...colorStops];
        updatedStops[index].color = newColor;
        setColorStops(updatedStops);
    };

    // Function to handle offset change
    const handleOffsetChange = (index, newOffset) => {
        const updatedStops = [...colorStops];
        updatedStops[index].offset = newOffset;
        setColorStops(updatedStops);
    };

    // Add a new color stop
    const addColorStop = () => {
        setColorStops([...colorStops, { offset: 0.5, color: "#00ff00" }]);
    };

    // Remove a color stop
    const removeColorStop = (index) => {
        const updatedStops = colorStops.filter((_, i) => i !== index);
        setColorStops(updatedStops);
    };


    const handleRotationChange = (event) => {
        setRotationAngle(event.target.value);
    };
    return (
        <Card className='p-1 rounded-lg dark:bg-zinc-900 dark:border-zinc-800'>

            {colorStops.length > 0 ? (

                <div>
                    <input
                        type="range"
                        value={rotationAngle}
                        onChange={handleRotationChange}
                        min="-360"
                        max="360"
                    />
                    {
                        colorStops.map((stop, index) => (
                            <div key={index} style={{ margin: "10px 0" }} className={'flex gap-2'}>
                                <input
                                    type="color"
                                    value={stop.color}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={stop.offset}
                                    onChange={(e) => handleOffsetChange(index, parseFloat(e.target.value))}
                                />
                                <button onClick={() => removeColorStop(index)}><IconX /></button>
                            </div>
                        ))
                    }

                </div>
            ) : (
                <p>Select an object with a gradient to edit its gradient stops.</p>
            )}
            <SecondaryButton onClick={addColorStop}>Add Color</SecondaryButton>
        </Card>
    );
};

