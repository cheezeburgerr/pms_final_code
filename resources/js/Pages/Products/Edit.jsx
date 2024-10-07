import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { IconX } from '@tabler/icons-react';
import SecondaryButton from '@/Components/SecondaryButton';
import BackButton from '@/Components/BackButton';

export default function EditProduct({ auth, product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        avatar: null,
        product_name: product.product_name,
        product_price: product.product_price,
        image: product.image,
        categories: product.categories.map(category => ({
            category_id: category.id,
            category_name: category.category_name,
            variations: category.variation.map(variation => ({
                variation_id: variation.id,
                variation_name: variation.variation_name,
                variation_price: variation.variation_price
            }))
        }))
    });

    const [imagePreview, setImagePreview] = useState(`/images/products/${product.image}`);

    const addCategory = () => {
        setData('categories', [...data.categories, { category_name: '', variations: [{ variation_name: '', variation_price: '' }] }]);
    };

    const removeCategory = (index) => {
        setData('categories', data.categories.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (index, event) => {
        const newCategories = [...data.categories];
        newCategories[index].category_name = event.target.value;
        setData('categories', newCategories);
    };

    const addVariation = (categoryIndex) => {
        const newCategories = [...data.categories];
        newCategories[categoryIndex].variations.push({ variation_name: '', variation_price: '' });
        setData('categories', newCategories);
    };

    const removeVariation = (categoryIndex, variationIndex) => {
        const newCategories = [...data.categories];
        newCategories[categoryIndex].variations.splice(variationIndex, 1);
        setData('categories', newCategories);
    };

    const handleVariationChange = (categoryIndex, variationIndex, event) => {
        const newCategories = [...data.categories];
        newCategories[categoryIndex].variations[variationIndex][event.target.name] = event.target.value;
        setData('categories', newCategories);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form data:', data); // Log the form data
        post(route('products.update', product.id), {
            _method: 'put',
        })

    };

    return (
        <AdminLayout
            user={auth.admin}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Product</h2>}
        >
            <Head title="Edit Product" />

            <div className="dark:text-gray-100">
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center  mb-8">
                    <div className='flex gap-4 items-center'>
                    <BackButton/>
                    <h1 className='text-2xl font-bold'>Edit Product</h1>
                    </div>
                    <PrimaryButton type="submit" disabled={processing} className='float-right'>
                        Submit
                    </PrimaryButton>
                </div>

                
                    <div className="lg:flex gap-4">
                    <div className="columns mb-4 lg:w-1/4 bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg border border-gray-300/75 dark:border-zinc-800 shadow-sm">
                        <div className="mb-4">
                            <InputLabel htmlFor="product_name">Product Name</InputLabel>
                            <TextInput
                                type="text"
                                name="product_name"
                                id="product_name"
                                value={data.product_name}
                                onChange={e => setData('product_name', e.target.value)}
                            />
                            {errors.product_name && <div className="text-red-500">{errors.product_name}</div>}
                        </div>
                        <div className="mb-4">
                            <InputLabel htmlFor="product_price">Product Price</InputLabel>
                            <TextInput
                                type="number"
                                name="product_price"
                                id="product_price"
                                value={data.product_price}
                                onChange={e => setData('product_price', e.target.value)}
                            />
                            {errors.product_price && <div className="text-red-500">{errors.product_price}</div>}
                        </div>
                    </div>

                    <div className="mb-8 bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg border border-gray-300/75 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Categories</h3>
                        {data.categories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="mb-6">
                                <h1 className='font-bold mb-2'>Category {categoryIndex + 1}</h1>
                                <div className="flex items-center mb-2">
                                    <TextInput
                                        type="text"
                                        name="category_name"
                                        placeholder="Category Name"
                                        value={category.category_name}
                                        onChange={(e) => handleCategoryChange(categoryIndex, e)}
                                    />
                                    <SecondaryButton type="button" onClick={() => removeCategory(categoryIndex)} className="ml-2">
                                    <IconX/>
                                    </SecondaryButton>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-sm font-semibold mb-2">Variations</h4>
                                    {category.variations.map((variation, variationIndex) => (
                                        <div key={variation.id} className="flex items-start md:items-center mb-2 gap-4">
                                            <div className="md:flex gap-2">
                                            <div className='mb-2'>
                                                <p>Variation {variationIndex + 1}</p>
                                                <TextInput
                                                type="text"
                                                name="variation_name"
                                                placeholder="Variation Name"
                                                value={variation.variation_name}
                                                onChange={(e) => handleVariationChange(categoryIndex, variationIndex, e)}
                                            />
                                            </div>
                                            <div className='mb-2'>
                                                <p>Price</p>
                                                <TextInput
                                                type="number"
                                                name="variation_price"
                                                placeholder="Variation Price"
                                                value={variation.variation_price}
                                                onChange={(e) => handleVariationChange(categoryIndex, variationIndex, e)}
                                                
                                            />
                                            </div>
                                            </div>
                                            <SecondaryButton
                                                type="button"
                                                onClick={() => removeVariation(categoryIndex, variationIndex)}
                                                
                                            >
                                                <IconX/>
                                            </SecondaryButton>
                                        </div>
                                    ))}
                                    <PrimaryButton type="button" onClick={() => addVariation(categoryIndex)}>
                                        Add Variation
                                    </PrimaryButton>
                                </div>
                            </div>
                        ))}
                        <PrimaryButton type="button" onClick={addCategory}>
                            Add Category
                        </PrimaryButton>
                    </div>
                    <div className='bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg border border-gray-300/75 dark:border-zinc-800 shadow-sm'>
                    <p  className='font-bold text-lg mb-2'>Product Image</p>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                            />
                    {imagePreview && (
                                <div className="mt-4">
                                    <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-md"/>
                                </div>
                            )}
                    </div>
                    </div>

                    
                </form>
            </div>
        </AdminLayout>
    );
}
