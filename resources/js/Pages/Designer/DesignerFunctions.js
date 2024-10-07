import { act } from "react";
import { ConstNode } from "three/examples/jsm/nodes/Nodes";
import { color } from "three/examples/jsm/nodes/shadernode/ShaderNode";
// import * as fabric from 'fabric';
export function hello() {
    return (
        console.log('this is from my outside')
    )
}


export function createColorPicker(obj, canvas) {

console.log(obj);
if(obj.type !== 'path'){
    return null;
}
    if (obj.id !== 'BG') {
        var colorPickerId = 'colorPicker_' + obj.id;
        var colorContainer = document.createElement('div');
        colorContainer.classList.add('w-full', 'text-center', 'lg:flex', 'mb-1');
        var colorPickerInput = document.createElement('input');
        colorPickerInput.classList.add('me-4');
        colorPickerInput.type = 'color';

        var colorText = document.createElement('p');
        colorText.classList.add('me-4', 'dark:text-gray-100', 'text-xs');
        colorText.textContent = obj.id;
        colorPickerInput.id = colorPickerId;
        colorPickerInput.value = obj.fill;
        const cont = document.getElementById('colorPickerContainer');
        cont.classList.add('lg:block');
        // cont.innerHTML = "";
        colorContainer.appendChild(colorPickerInput);

        
        colorContainer.appendChild(colorText);

        
        cont.appendChild(colorContainer);

        // Listen for color changes and update canvas
        colorPickerInput.addEventListener('input', function () {
            var newColor = this.value;
            obj.set('fill', newColor);
            canvas.renderAll();
        });


    }
}

export function displayShapes(canvas) {
    var shapesDiv = document.getElementById('shapes');
    shapesDiv.innerHTML = ""; // Clear previous content

    canvas.getObjects().forEach(function (object, index) {

        // Create a div to hold each shape and its delete button
        if (object.type !== 'text' && object.type !== 'i-text' && object.id !== 'ZONES') {
            // Create a div to hold each shape and its delete button
            var shapeDiv = document.createElement('div');
            shapeDiv.classList.add('flex', 'items-center', 'mb-2', 'w-full', 'bg-gray-50', 'dark:bg-zinc-800',  'rounded-md', 'text-zinc-700', 'dark:text-gray-100','p-2', 'hover:bg-gray-900');
            // Display shape type
            var shapeType = document.createElement('span');
            shapeType.textContent = object.type;
            shapeType.classList.add('font-bold', 'w-full');
            shapeDiv.appendChild(shapeType);

            // Create a delete button
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('font-bold', 'px-2', 'py-1', 'rounded', 'ml-2');
            deleteButton.onclick = function () {
                event.stopPropagation();
                canvas.remove(object);
                displayShapes(canvas); // Update the displayed shapes after deletion
            };
            shapeDiv.appendChild(deleteButton);
            shapeDiv.onclick = function () {
                canvas.setActiveObject(object);
                canvas.requestRenderAll();
            };
            shapesDiv.appendChild(shapeDiv);
        }
    });
}



export function displayTextObjects(canvas) {
    var textObjectsDiv = document.getElementById('textObjects');
    textObjectsDiv.innerHTML = ""; // Clear previous content


    // console.log(canvas)
    canvas.getObjects().forEach(function (object, index) {


        if (object.type === 'text' || object.type === 'i-text') {
            var textContent = object.text;

            // Create a container div to hold text and delete button
            var containerDiv = document.createElement('div');
            containerDiv.classList.add('flex', 'items-center', 'mb-2', 'w-full', 'bg-gray-50', 'dark:bg-zinc-800',  'rounded-md', 'text-zinc-700', 'dark:text-gray-100','p-2', 'hover:bg-gray-900'); // Add Tailwind classes for styling


            // Create span for text
            var textNode = document.createElement('span');
            textNode.textContent = textContent;
            textNode.classList.add('font-bold', 'w-full'); // Add Tailwind classes for styling
            containerDiv.appendChild(textNode);

            // Create a delete button
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function () {
                event.stopPropagation();
                canvas.remove(object);
                canvas.renderAll();
                displayTextObjects(canvas);
            };
            deleteButton.classList.add('font-bold', 'px-2', 'py-1', 'rounded', 'ml-2'); // Add Tailwind classes for styling
            containerDiv.appendChild(deleteButton);


            containerDiv.onclick = function () {
                canvas.setActiveObject(object);
                canvas.requestRenderAll();

            };
            textObjectsDiv.appendChild(containerDiv);
        }
    });
}

export function displayObjects(canvas) {
    var layersDiv = document.getElementById('layers');
    
    layersDiv.innerHTML = ""; // Clear previous content

    if(canvas) {
        canvas.getObjects().forEach(function (object, index) {

            console.log(object);
            if (object.id != 'ZONES') {
                var textContent = object.name;
    
                // Create a container div to hold text and delete button
                var containerDiv = document.createElement('div');
                containerDiv.classList.add('flex', 'items-center', 'mb-2', 'w-full', 'bg-gray-50', 'dark:bg-zinc-800',  'rounded-md', 'text-zinc-700', 'dark:text-gray-100','p-2', 'hover:bg-gray-900'); // Add Tailwind classes for styling
    
    
                // Create span for text
                var textNode = document.createElement('span');
                textNode.textContent = textContent;
                textNode.classList.add('font-bold', 'w-full'); // Add Tailwind classes for styling
                containerDiv.appendChild(textNode);
    
                // Create a delete button
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function () {
                    event.stopPropagation();
                    canvas.remove(object);
                    canvas.renderAll();
                    displayTextObjects(canvas);
                };
                deleteButton.classList.add('font-bold', 'px-2', 'py-1', 'rounded', 'ml-2'); // Add Tailwind classes for styling
                containerDiv.appendChild(deleteButton);
    
    
                containerDiv.onclick = function () {
                    canvas.setActiveObject(object);
                    canvas.requestRenderAll();
    
                };
                layersDiv.appendChild(containerDiv);
            }
        });
    }
}

export function displayImages(canvas) {
    var imageObjectsDiv = document.getElementById('images');
    imageObjectsDiv.innerHTML = ""; // Clear previous content


    // console.log(canvas)
    canvas.getObjects().forEach(function (object, index) {


        if (object.type === 'image') {
            var textContent = object.type;

            // Create a container div to hold text and delete button
            var containerDiv = document.createElement('div');
            containerDiv.classList.add('flex', 'items-center', 'mb-2', 'w-full', 'bg-gray-50', 'dark:bg-zinc-800',  'rounded-md', 'text-zinc-700', 'dark:text-gray-100','p-2', 'hover:bg-gray-900'); // Add Tailwind classes for styling

            // Create span for text
            var textNode = document.createElement('span');
            textNode.textContent = textContent;
            textNode.classList.add('font-bold', 'w-full'); // Add Tailwind classes for styling
            containerDiv.appendChild(textNode);

            // Create a delete button
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function () {
                event.stopPropagation();
                canvas.remove(object);
                canvas.requestRenderAll();
                displayImages(canvas); // Update the displayed text objects after deletion
            };
            deleteButton.classList.add('font-bold', 'px-2', 'py-1', 'rounded', 'ml-2'); // Add Tailwind classes for styling
            containerDiv.appendChild(deleteButton);
            containerDiv.onclick = function () {
                canvas.setActiveObject(object);
                canvas.requestRenderAll();
            };
            imageObjectsDiv.appendChild(containerDiv);
        }
    });
}

export function addRect(canvas, setAddToModel, setCanvasState) {
    // var text = document.getElementById('text-input').value;
    setAddToModel(true);
    console.log('rect clicked');
    // Set canvas selection mode to 'mouse' to enable selection
    canvas.selection = 'mouse';

    var gradient = new fabric.Gradient({
        type: 'linear', // or 'radial' for radial gradient
        gradientUnits: 'pixels', // or 'percentage'
        coords: { x1: 40, y1: 100, x2: 100, y2: 0 }, // Starting and ending coordinates
        colorStops: [
          { offset: 0, color: '#0000ff' },
          { offset: 1, color: '#00ffff' },
          
        ]
      });
    // Listen for click event to place the text
    canvas.on('mouse:down', function (event) {
        var pointer = canvas.getPointer(event.e);
        var shape = new fabric.Rect({
            left: pointer.x, // Half of rectangle width subtracted from canvas center
            top: pointer.y, // Half of rectangle height subtracted from canvas center
            fill: gradient,
            name: "Rectangle",
            width: 100,
            height: 100,
            transparentCorners: false,
            centeredScaling: true,
        });

        canvas.add(shape);


        console.log(canvas.getObjects());

        // Remove event listener after placing the text
        canvas.off('mouse:down');

        displayShapes(canvas);
        setAddToModel(false);
        setCanvasState(canvas);
    });
    

}

export function draw(canvas) {
    canvas.selection = 'mouse';


    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    canvas.on('selection:created', function () {
        // Disable OrbitControls when an object is selected
        controls.enabled = false;
    });
    // Set brush properties (optional)
    canvas.freeDrawingBrush.color = 'red'; // Set the drawing color
    canvas.freeDrawingBrush.width = 5;

}
export function addCircle(canvas, setAddToModel) {
    // var text = document.getElementById('text-input').value;
    setAddToModel(true);
    console.log('rect clicked');
    // Set canvas selection mode to 'mouse' to enable selection
    canvas.selection = 'mouse';


    // Listen for click event to place the text
    canvas.on('mouse:down', function (event) {
        var pointer = canvas.getPointer(event.e);
        var shape = new fabric.Circle({
            left: pointer.x, // Half of rectangle width subtracted from canvas center
            top: pointer.y, // Half of rectangle height subtracted from canvas center
            fill: "#00ffff",
            radius: 50,
            transparentCorners: false,
            centeredScaling: true,
        });

        canvas.add(shape);


        console.log(canvas.getObjects());

        // Remove event listener after placing the text
        canvas.off('mouse:down');

        displayShapes(canvas);
        setAddToModel(false);
    });

}

export function loadSvg(path, canvas) {

    console.log(path)

    fabric.loadSVGFromURL(`/storage/canvas/${path}`, function (objects, options) {
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
            selectable: false,

        });


        canvas.add(svg);

        svg.id = "ZONES";
        canvas.sendToBack(svg);
        // setSvgObject(svg);

        canvas.renderAll();

        svg.forEachObject(function (obj) {
            console.log(obj);
            createColorPicker(obj, canvas);

        });
    })

    // loadText(canvas);

}

export function changeDesign(canvas, value) {


    canvas.forEachObject(function (obj) {
        if(obj.id === 'ZONES'){
            canvas.remove(obj);
        }

    });
    fabric.loadSVGFromURL(value, function (objects, options) {
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
            selectable: false,

        });


        canvas.add(svg);

        svg.id = "ZONES";
        canvas.sendToBack(svg);
        // setSvgObject(svg);

        canvas.renderAll();

        const cont = document.getElementById('colorPickerContainer');
    cont.innerHTML = "";
        svg.forEachObject(function (obj) {
            console.log(obj);
            createColorPicker(obj, canvas);

        });
    })



}


export function uploadImage(canvas, imageUrl) {

    canvas.selection = 'mouse';


    // Listen for click event to place the text
    canvas.on('mouse:down', function (event) {
        var pointer = canvas.getPointer(event.e);

        fabric.Image.fromURL(imageUrl, function (img) {
            img.scaleToWidth(300);
            img.set({
                left: pointer.x,
                top: pointer.y,

            });
            canvas.add(img);

            canvas.off('mouse:down');

            displayImages(canvas);

        });

    });
}


export function addText(canvas, setAddToModel) {

    var text = document.getElementById('text-input').value;
    if (text) {
        // Set canvas selection mode to 'mouse' to enable selection
        canvas.selection = 'mouse';

        setAddToModel(true);
        // Listen for click event to place the text
        canvas.on('mouse:down', function (event) {
            var pointer = canvas.getPointer(event.e);
            var newText = new fabric.IText(text, {
                left: pointer.x,
                top: pointer.y,
                fontFamily: 'Bebas', // Change the font family as needed
                fontSize: 80, // Change the font size as needed
                fill: '#ffffff' // Change the text color as needed
            });
            canvas.add(newText);


            // Remove event listener after placing the text
            canvas.off('mouse:down');
            displayTextObjects(canvas);
            // Clear text input
            document.getElementById('text-input').value = '';
            canvas.renderAll();
            setAddToModel(false);
        });

    }
}

export function addText2(canvas, setAddToModel) {

    var text = 'Text';
    if (text) {
        // Set canvas selection mode to 'mouse' to enable selection
        canvas.selection = 'mouse';

        setAddToModel(true);
        // Listen for click event to place the text
        canvas.on('mouse:down', function (event) {
            var pointer = canvas.getPointer(event.e);
            var newText = new fabric.IText(text, {
                left: pointer.x,
                top: pointer.y,
                fontFamily: 'Bebas', // Change the font family as needed
                fontSize: 80, // Change the font size as needed
                fill: '#ffffff' // Change the text color as needed
            });
            canvas.add(newText);


            // Remove event listener after placing the text
            canvas.off('mouse:down');
            displayTextObjects(canvas);
            // Clear text input
            document.getElementById('text-input').value = '';
            canvas.renderAll();
            setAddToModel(false);
        });

    }
}


export function loadText(canvas) {
    var newText = new fabric.IText("TEAM NAME", {
        left: 390,
        top: 650,

        fontFamily: 'Impact', // Change the font family as needed
        fontSize: 90, // Change the font size as needed
        fill: '#ffffff',
        textAlign: 'center', // Change the text color as needed
    });
    canvas.add(newText);


    newText.set({ fontFamily: 'Bebas' });

    var newText = new fabric.IText("00", {
        left: 500,
        top: 750,

        fontFamily: 'Impact', // Change the font family as needed
        fontSize: 150, // Change the font size as needed
        fill: '#ffffff',
        textAlign: 'center', // Change the text color as needed
    });
    canvas.add(newText);


    newText.set({ fontFamily: 'Bebas' });


    var newText = new fabric.IText("00", {
        left: 1440,
        top: 650,

        fontFamily: 'Impact', // Change the font family as needed
        fontSize: 300, // Change the font size as needed
        fill: '#ffffff',
        textAlign: 'center', // Change the text color as needed
    });
    canvas.add(newText);


    newText.set({ fontFamily: 'Bebas' });


    var newText = new fabric.IText("SURNAME", {
        left: 1440,
        top: 600,

        fontFamily: 'Impact', // Change the font family as needed
        fontSize: 80, // Change the font size as needed
        fill: '#ffffff',
        textAlign: 'center', // Change the text color as needed
    });
    canvas.add(newText);


    newText.set({ fontFamily: 'Bebas' });
}



 export function deleteSelectedObjects(canvas) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      displayImages(canvas);
      displayShapes(canvas);
      displayTextObjects(canvas);

    }
  }

  export function changeText(canvas, text, setSelectedObject, selectedObject) {

    const active = canvas.getActiveObject();
    if(active) {
        setSelectedObject({ ...selectedObject, text: text });
        active.set('text', text);
        canvas.requestRenderAll();
    }
  }

  export function addSvgToCanvas  (svgUrl, color, canvas, setAddToModel)  {

    setAddToModel(true);
    console.log('rect clicked');
    // Set canvas selection mode to 'mouse' to enable selection
    canvas.selection = 'mouse';


    // Listen for click event to place the text
    canvas.on('mouse:down', function (event) {
        var pointer = canvas.getPointer(event.e);

        fabric.loadSVGFromURL(svgUrl, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);
            obj.set({
                left: pointer.x,
                top: pointer.y,
                scaleX: 0.1,
                scaleY: 0.1,
            });
            obj.forEachObject(function (obj) {
                console.log(obj);
                obj.set('fill', color)

            });
            canvas.add(obj);
            canvas.off('mouse:down');
            canvas.renderAll();
        });
        setAddToModel(false);
    });

    

};
export function handleStrokeColorChange  (color, canvas, setStrokeColor) {
    setStrokeColor(color.hex);

    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(obj => {
        if (obj.type === 'group') {
            obj.forEachObject(function (obj) {
                console.log(obj);
                obj.set('stroke', color.hex);
            });
        } else {
            obj.set('stroke', color.hex);

        }
    });

    canvas.renderAll();
};



export function handleFillColorChange  (color, canvas, setSelectedColor) {
    setSelectedColor(color.hex);
    // console.log(color.hex);
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach(obj => {
            if (obj.type === 'group') {
                obj.forEachObject(function (obj) {
                    console.log(obj);
                    obj.set('fill', color.hex)

                });
            }
            else {
                obj.set('fill', color.hex);
            }
        });

        canvas.renderAll();
};


export function addImage (canvas, setAddToModel) {
    const fileInput = document.getElementById('upload-image');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    const imageUrl = event.target.result;
                    uploadImage(canvas, imageUrl);
                };
                reader.readAsDataURL(file);
                setAddToModel(true);

                canvas.on("mouse:down", function(event){
                    setAddToModel(false);
                })
            } else {
                console.log('No file selected.');
            }
}


export function skewSelectedObjects  (skewX, skewY, canvas)  {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set('skewX', skewX);
        activeObject.set('skewY', skewY);
        canvas.requestRenderAll();
    }
};


export function handleSkewXChange  (valueX, skewY, setSkewX, canvas)  {
    const value = parseFloat(valueX);
    console.log(valueX);
    setSkewX(value);
    skewSelectedObjects(value, skewY, canvas);
};

export function handleSkewYChange  (valueY, skewX, setSkewY, canvas)  {
    const value = parseFloat(valueY);
    setSkewY(value);
    skewSelectedObjects(skewX, value, canvas);
};


export function handleCornerRadius (canvas, value, setRadius) {
    const activeObject = canvas.getActiveObject();
    activeObject.set({
        rx: value,
        ry: value
    });

    setRadius(value);
    canvas.requestRenderAll();
}

