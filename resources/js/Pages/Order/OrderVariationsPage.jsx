import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import { Radio } from 'flowbite-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function OrderVariationsPage({ data, setData, selectedProducts, prevStep, products, errors }) {

    data.products = data.products || [];
    data.prices = data.prices || {};

    const [selectedVariations, setSelectedVariations] = useState(data.variations || {});


    const handleVariationSelect = (categoryId, variationId, productId) => {


        setSelectedVariations(prevState => ({
            ...prevState,
            [categoryId]: variationId
        }));

        const updatedVariations = {
            ...selectedVariations,
            [categoryId]: variationId
        };


        setData({
            ...data,
            variations: updatedVariations,
            products: data.products.map(product => {
                if (product.id === productId) {
                    const selectedProduct = products.find(p => p.id === productId);
                    const subtotal = calculateProductPrice(selectedProduct, { ...updatedVariations, [categoryId]: variationId });
                    return { ...product, subtotal };
                }
                return product;
            })
        });

        console.log(data);
    };


    const calculateProductPrice = (product, variations) => {
        let productPrice = product.product_price;


        product.categories.forEach(category => {

            const selectedVariationId = variations[category.id];
            if (selectedVariationId) {

                const selectedVariation = category.variation.find(variation => variation.id === selectedVariationId);
                productPrice += selectedVariation.variation_price;
            }
        });

        return productPrice;
    };

    return (
        <div>
            <h2 className='mb-6'>Select Variations</h2>
            <form>
            {errors.variations && <InputError message={errors.variations}/>}
                <div className='grid md:grid-cols-2 gap-6'>
                    {data.products.map(productId => {
                        const selectedProduct = products.find(product => product.id === productId.id);

                        if (!selectedProduct) return null;

                        return (
                            <div key={productId} className='rounded-md p-4 bg-zinc-100 dark:bg-zinc-900 mb-4'>
                                <h3 className='mb-2 opacity-50'>For {selectedProduct.product_name}</h3>

                                <div className="gap-4">
                                    {selectedProduct.categories.map(category => (
                                        <div key={category.id} className='w-full'>
                                            <h4>{category.category_name}</h4>

                                            <div className="flex mb-2">
                                                {category.variation.map(variation => (
                                                    <div key={variation.id} className=' flex gap-4 items-center justify-center  w-full rounded-md border border-1 border-zinc-500 p-4'>
                                                        <TextInput
                                                            type="radio"
                                                            id={`variation-${variation.id}`}
                                                            name={category.id}
                                                            value={variation.id}
                                                            data-price={variation.variation_price}
                                                            className='mr-1 text-aqua'
                                                            checked={selectedVariations[category.id] === variation.id}
                                                            onChange={() => handleVariationSelect(category.id, variation.id, selectedProduct.id)}
                                                        />
                                                        <InputLabel htmlFor={`variation-${variation.id}`} className='truncate text-xs'>{variation.variation_name}</InputLabel>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p>Total Price: Php {calculateProductPrice(selectedProduct, selectedVariations).toFixed(2)}</p>

                                {/* <p>Subtotal: Php {(selectedProduct.subtotal || 0).toFixed(2)}</p> */}
                            </div>
                        );
                    })}
                </div>
            </form>
        </div>
    );
}
