import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { IconX } from '@tabler/icons-react';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function DesignInfo({ design, auth }) {
    const [imageFile, setImageFile] = useState(null);

    // useEffect(() => {
    //     const fetchImage = async () => {
    //         try {
    //             const response = await fetch(`/storage/${design.image}`);
    //             const blob = await response.blob();
                
    //             // Convert blob to file (optional)
    //             const file = new File([blob], "image.jpg", { type: blob.type });
                
    //             // Set the file to state or use it directly
    //             setImageFile(file);
    //         } catch (error) {
    //             console.error("Error fetching image:", error);
    //         }
    //     };

        
    //     fetchImage();
        
    // }, []);

    console.log(imageFile)
    const handleOrder = (productId) => {
        const formData = new FormData();
        formData.append('product_id', productId);
        formData.append('image', design.id);
    
        router.post(`/order`, formData);
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="TJM Sportswear" />

            <div className="py-12 dark:text-gray-100">
                <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <img src={ `/storage/${design.image}`} alt="" className='w-1/2 h-80 object-cover rounded-lg' />
                        <div className='w-1/2'>
                            <h1 className='text-xl font-bold w-full '>{design.name}</h1>
                            <p className="font-bold text-aqua mb-4">{design.product.product_price.toFixed(2)}</p>
                            <div className='mb-4'>
                                <p>{design.product.product_name}</p>
                                <div className="flex gap-4 justify-between w-full">
                                {design.product.categories.map(cat => (
                                    <>
                                 <div>
                                 <p >{cat.category_name}</p>
                                   {cat.variation.map(v => (
                                    <>
                                        <p className='opacity-50'>{v.variation_name}</p>
                                    </>
                                   ))}
                                 </div>
                                    </>
                                ))}
                                </div>
                            </div>
                            <PrimaryButton onClick={() => handleOrder(design.product.id)}>Order</PrimaryButton>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}