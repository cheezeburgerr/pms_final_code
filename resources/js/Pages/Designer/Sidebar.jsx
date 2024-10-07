import React, { useState } from 'react';

import PropertiesPanel from './PropertiesPanel';

import { Tabs } from 'flowbite-react';
import TextTab from './Tabs/TextTab';
import ImagesTab from './Tabs/ImagesTab';
import PrimaryButton from '@/Components/PrimaryButton';

const Sidebar = ({ showProperties, tutorialMode, selectedObject, selectedFont, canvas, strokeWidth, setStrokeWidth, skewX, skewY, setSkewX, setSkewY, setSelectedFont, setSelectedObject, svgFiles, product, proceedToOrder }) => {


    useEffect(() => {
        if (showProperties) {
          // Example: Access the div with id 'colorPickerContainer' when sidebar is visible
          const colorPickerContainer = document.getElementById('colorPickerContainer');
          if (colorPickerContainer) {
            console.log('Found colorPickerContainer:', colorPickerContainer);
            // You can now modify or interact with the element
            // ExternalFunction(colorPickerContainer); // Call your external function here
          }
        }
      }, [showProperties]); // Re-run the effect when `showProperties` changes
  return (
    <div className={`lg:m-5 rounded-lg w-full lg:w-1/3 2xl:w-1/4 fixed right-0 lg:h-screen bottom-0 transition-all lg:top-10 bg-gray-100 dark:bg-zinc-900 ${showProperties ? 'h-[calc(100vh-500px)] translate-y-0' : 'translate-y-full lg:translate-y-0'} overflow-y-scroll no-scrollbar`}>
      <div className="w-screen lg:w-full rounded-lg transition-all lg:h-full">
        <Tabs aria-label="Full width tabs" style="fullWidth" className="dark:bg-zinc-900">
          <Tabs.Item title="Properties" active={false}>
            <div className="p-4 dark:text-gray-100">
              <p className="mb-4">Cloth Parts Colors</p>
              <div id="colorPickerContainer" className="h-full"></div>
              {tutorialMode && (
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                  <h6>Cloth Colors</h6>
                  <p>Click the color picker to change specific parts of the cloth</p>
                </div>
              )}
            </div>
            {selectedObject ? (
              <PropertiesPanel {...{ selectedFont, selectedObject, canvas, strokeWidth, setStrokeWidth, skewX, skewY, setSkewX, setSkewY, setSelectedFont, setSelectedObject }} />
            ) : (
              <p className="text-center dark:text-gray-100">Select an object in the model.</p>
            )}
          </Tabs.Item>

          <Tabs.Item title="Text" active={true}>
            <TextTab canvas={canvas} tutorialMode={tutorialMode} setAddToModel={() => {}} />
          </Tabs.Item>

          <Tabs.Item title="Images">
            <ImagesTab {...{ canvas, svgFiles, selectedColor: '#000', tutorialMode, setAddToModel: () => {}}} />
          </Tabs.Item>

          <Tabs.Item title="Designs">
            <div className="p-5 grid grid-cols-4 gap-4">
              {product.designs.map(design => (
                <div key={design.id} className="rounded-lg dark:bg-zinc-800 p-2 cursor-pointer" onClick={() => DesignerFunctions.changeDesign(canvas, `/storage/${design.file}`)}>
                  <img src={`/storage/${design.file}`} alt={design.name} />
                </div>
              ))}
            </div>
            {tutorialMode && (
              <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
                <h6>Designs Tab</h6>
                <p>Select one design in the list and it will automatically change the design of the cloth.</p>
              </div>
            )}
          </Tabs.Item>
        </Tabs>

        {/* <div className="fixed bottom-20 right-10">
          <PrimaryButton onClick={proceedToOrder}>Proceed to Order</PrimaryButton>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
