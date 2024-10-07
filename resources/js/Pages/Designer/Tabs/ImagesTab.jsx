import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";


const ImagesTab = ({ canvas, svgFiles, selectedColor, tutorialMode, setAddToModel }) => {
  return (
    <div className="p-4">
      <TextInput type="file" id="upload-image" onChange={() => DesignerFunctions.addImage(canvas, setAddToModel)} />
      <PrimaryButton onClick={() => DesignerFunctions.addImage(canvas)}>Add</PrimaryButton>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {svgFiles.map((svgUrl, index) => (
          <div className="rounded-lg dark:bg-zinc-800 p-2 cursor-pointer" key={index} onClick={() => DesignerFunctions.addSvgToCanvas(svgUrl, selectedColor, canvas)}>
            <img src={svgUrl} alt={`SVG ${index}`} style={{ width: '100px', height: 'auto' }} />
          </div>
        ))}
      </div>
      {tutorialMode && (
        <div className="absolute bottom-20 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 dark:text-gray-100">
          <h6>Images Tab</h6>
          <p>Select one image in the list and it will automatically select it in the canvas. Add shapes or images using our predefined or your custom upload.</p>
        </div>
      )}
    </div>
  );
};

export default ImagesTab;
