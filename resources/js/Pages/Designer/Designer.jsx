import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from 'react';
import JerseyDesigner from './JDesigner';
import Configurator from './ApparelConfigurator3';
import ModelViewer from '../Models/ModelViewer';

export default function Designer({ auth, products }) {
    const [selectedModel, setSelectedModel] = useState();

    const handleSelectProduct = (product) => {
        setSelectedModel(product);
    }

    useEffect(() => {
        console.log(selectedModel);
    }, [selectedModel]);

    return (
        <>
            <Authenticated user={auth.user}>
                {selectedModel ?
                    <>
                        <Configurator product={selectedModel}/>
                    </>
                    :
                    <>
                        <div className="py-12 dark:text-gray-200">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="text-center mb-4">
                                    <h1 className="font-bold uppercase text-2xl">Select a product</h1>
                                </div>
                                <div className="lg:grid grid-cols-3 gap-4">
                                    {products.map(product => (
                                        <div key={product.id} className='w-full dark:bg-zinc-900 bg-gray-100 rounded-lg p-4 text-center cursor-pointer' onClick={() => handleSelectProduct(product)}>
                                            {/* <img src={product.image ? `/images/products/${product.image}` : '/images/placeholder.png'} alt="" className='rounded-md mb-4' /> */}
                                            <ModelViewer path={`/storage/models/${product.path}`}/>
                                            <p>{product.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </>
                }

            </Authenticated>
        </>
    );
}

