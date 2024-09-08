import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function UpdatePicture({ }) {

    const user = usePage().props.auth.user;
    const { data, setData, errors, post, processing } = useForm({
        _method: 'put',
        picture: null, // Initialize with null for file input
    });

    const [preview, setPreview] = useState(user.image); // Set initial preview to the current profile picture

    const handlePictureChange = (e) => {
        const file = e.target.files[0];

        // Update the form data
        setData('picture', file);

        // Generate a preview URL for the uploaded file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.picture'), {
            _method: 'put',
        }); // Submit the form to the specified route
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 dark:text-gray-100 flex flex-col  items-center text-center">
            <div>
            
                <img
                    src={`/images/customers/profile/${preview}` || '/images/customers/profile.jpg'} // Display the preview or a default image
                    alt="Profile Picture"
                    className="mt-2 w-32 h-32 rounded-full object-cover"
                />
            </div>

            <div>
                <label className="block text-sm font-medium ">
                    Upload New Profile Picture
                </label>
                <TextInput
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    className="mt-2 block w-full text-sm text-gray-900"
                />
                {errors.picture && (
                    <div className="text-red-600 text-sm mt-1">{errors.picture}</div>
                )}
            </div>


            <div>
                <PrimaryButton
                    type="submit"
                    disabled={processing}
                   
                >
                    {processing ? 'Saving...' : 'Save'}
                </PrimaryButton>
            </div>
        </form>
    );
}
