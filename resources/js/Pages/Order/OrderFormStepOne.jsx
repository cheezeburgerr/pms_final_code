import React, { useRef, useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { IconUpload, IconX } from '@tabler/icons-react';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@radix-ui/themes';

export default function OrderFormStepOne({ data, setData, nextStep, product_id, image }) {
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // console.log(image)
    const handleFileChange = (e) => {
        const files = e.target.files;
        setData('files', files);


        // Extract file URLs and update the state
        const fileURLs = Array.from(files).map(file => URL.createObjectURL(file));
        setUploadedFiles(fileURLs);
    };

    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles.splice(index, 1);
        setUploadedFiles(updatedFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="mt-4 items-center w-full md:w-1/2">
                <h1 className="mb-4 text-center">Please fill up the details.</h1>
                <div className="mb-4 w-full">
                    <InputLabel for='team_name'>Team Name</InputLabel>
                    <TextInput
                        type="text"
                        name="team_name"
                        id="team_name"
                        placeholder="Name"
                        value={data.team_name}
                        onChange={handleChange}
                        className='w-full'
                    />
                </div>
                <div className="mb-4 w-full">
                <InputLabel for='team_name'>Due Date</InputLabel>
                    <TextInput
                        type="date"
                        name="due_date"
                        id="due_date"
                        placeholder="Due Date"
                        value={data.due_date}
                        onChange={handleChange}
                        className='w-full '
                    />
                </div>
                <div className="mb-4 w-full">
                <InputLabel for='team_name'>Design</InputLabel>
                    <input
                        type="file"
                        name="files"
                        id="files"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div

                        onClick={handleUploadButtonClick}
                        className="block w-full border border-zinc-300 dark:border-zinc-800 rounded-md p-4 text-center cursor-pointer bg-zinc-50 shadow-lg dark:bg-zinc-900"
                    >
                       <div className="text-center flex justify-center flex-col items-center gap-4 opacity-50 border border-zinc-600 p-8 rounded-md">
                       <IconUpload size={56}/>

                       Upload your design here.
                       </div>
                    </div>
                </div>
                {/* Display uploaded image previews */}
                <div className="w-full flex flex-wrap justify-start gap-4 ">
                    {uploadedFiles.map((fileURL, index) => (
                        <div key={index} className="relative w-20 h-20  rounded-lg">
                            <img src={fileURL} alt={`Uploaded Image ${index + 1}`} className="object-cover w-full h-full" />
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="absolute -top-3 -right-3 p-1 bg-zinc-500 text-white rounded-full text-xs hover:bg-red-600 focus:outline-none"
                            >
                                <IconX size={16}/>
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    {image && (
                        <img src={`/storage/${image.image}`} alt="" />
                    )}
                </div>
            </div>
            {/* <div className="mt-4">
                <PrimaryButton type="submit">
                    Next
                </PrimaryButton>
            </div> */}
        </form>
    );
}
