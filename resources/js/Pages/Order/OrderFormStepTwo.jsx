// OrderFormStepTwo.js
import React, { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';

export default function OrderFormStepTwo({ data, setData, prevStep, nextStep, products }) {
    const [selectedProducts, setSelectedProducts] = useState(data.products || []);

    const handleProductClick = (productId, productName, productPrice) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.some(product => product.id === productId)) {
                return prevSelected.filter(product => product.id !== productId);
            } else {
                return [...prevSelected, { id: productId, product_name: productName ,price: productPrice }];
            }
        });
    };

    useEffect(() => {
        setData('products', selectedProducts);

        console.log(data)
    }, [selectedProducts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <form>
            <h3 className="font-semibold text-lg mb-4">Select Products</h3>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                {products.map(product => (
                    <div
                        key={product.id}
                        className={`rounded-md p-4 cursor-pointer ${selectedProducts.some(selectedProduct => selectedProduct.id === product.id) ? 'bg-aqua' : 'bg-zinc-100 dark:bg-zinc-900'}`}
                        onClick={() => handleProductClick(product.id, product.product_name, product.product_price)}
                    >
                        <img src={`/images/products/${product.image}`} alt="" className='rounded-md'/>
                        <div className="flex justify-between">
                            <div className='flex gap-2 items-center'>
                            <Checkbox  checked={selectedProducts.some(selectedProduct => selectedProduct.id === product.id)}/>
                            <p className='font-bold text-lg'>{product.product_name}</p>
                            </div>
                            <p>{product.product_price}.00</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Add buttons for navigation */}
            {/* <div className="mt-4 flex justify-between">
                <PrimaryButton type="button" onClick={prevStep}>
                    Back
                </PrimaryButton>
                <PrimaryButton type="button" onClick={handleSubmit}>
                    Next
                </PrimaryButton>
            </div> */}
        </form>
    );
}
