import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({ auth, boxes, design, products }) {
    // Initialize the form with useForm
    const { data, setData, post, progress, errors } = useForm({
        _method: 'put',
        image: design.image,
        name: design.name, // Initialize with current values
        product_id: design.product_id, // Initialize with current values
        description: design.description, // Initialize with current values
    });

    // State to hold the preview URL for the selected image
    const [previewUrl, setPreviewUrl] = useState(`/storage/designs/${design.image}`);

    // Function to handle file input change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file); // Store the selected file in form data
            setPreviewUrl(URL.createObjectURL(file)); // Set the preview URL to the selected file's URL
        }
    };

    // Function to handle input field changes
    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value); // Update the form data with input changes
    };

    // Function to submit the form
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('designs.update', design.id));
    };

    return (
        <EmployeeLayout user={auth.employee}>
            <div className="mb-4 flex justify-between">
                <h1 className="font-bold text-2xl">Edit {design.name}</h1>
                <PrimaryButton type="submit" onClick={handleSubmit}>
                    Update
                </PrimaryButton>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <div className="mb-3 w-full">
                            <InputLabel>Name</InputLabel>
                            <TextInput
                                name="name"
                                value={data.name} // Use `data.name` to allow editing
                                onChange={handleInputChange} // Add the onChange handler
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-2">{errors.name}</div>}
                        </div>

                        <div className="mb-3">
                            <InputLabel>Description</InputLabel>
                            <TextInput
                                name="description"
                                value={data.description} // Use `data.description` to allow editing
                                onChange={handleInputChange} // Add the onChange handler
                            />
                            {errors.description && (
                                <div className="text-red-600 text-sm mt-2">{errors.description}</div>
                            )}
                        </div>

                        <div className="mb-4 w-full">
                            <InputLabel>Product</InputLabel>
                            <select
                                required
                                name="product_id"
                                onChange={handleInputChange}
                                value={data.product_id} // Use `data.product_id` to allow editing
                                className="w-full border-zinc-800 rounded-md dark:bg-zinc-900"
                            >
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.product_name}
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && (
                                <div className="text-red-600 text-sm mt-2">{errors.product_id}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <InputLabel className="block text-sm font-medium text-gray-700">Change Image</InputLabel>
                            <TextInput type="file" accept="image/*" onChange={handleImageChange} />
                            {errors.image && (
                                <div className="text-red-600 text-sm mt-2">
                                    {errors.image}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {previewUrl && (
                            <div className="mb-4 w-full">
                                <p className="mb-3">Design</p>
                                <img
                                    src={previewUrl}
                                    alt="Design Preview"
                                    className="w-64 h-64 object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {progress && (
                        <div className="w-full bg-gray-200 h-2 rounded">
                            <div
                                className="bg-blue-600 h-2 rounded"
                                style={{ width: `${progress.percentage}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            </form>
        </EmployeeLayout>
    );
}
