import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import React, { useState } from 'react';


const TextTab = ({ canvas, tutorialMode, setAddToModel }) => {
  return (
    <div className="p-4">
      <div className="flex gap-2 w-full">
        <TextInput type="text" id="text-input" className="w-full" placeholder="Enter text" />
        <PrimaryButton id="add-text-btn" onClick={() => DesignerFunctions.addText(canvas, setAddToModel)}>Add</PrimaryButton>
      </div>
      <div className="p-4">
        <p className="font-bold">Texts</p>
        <div id="textObjects"></div>
      </div>
      {tutorialMode && (
        <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
          <h6>Text Tab</h6>
          <p>Select one text in the list and it will automatically select it in the canvas. You can add text by using the input above.</p>
        </div>
      )}
    </div>
  );
};

export default TextTab;
