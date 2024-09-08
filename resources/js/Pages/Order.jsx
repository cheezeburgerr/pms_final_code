import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrderFormStepOne from './Order/OrderFormStepOne';
import OrderFormStepTwo from './Order/OrderFormStepTwo';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OrderVariationsPage from './Order/OrderVariationsPage';
import PrimaryButton from '@/Components/PrimaryButton';
import LineupForm from './Order/LineupForm';

export default function OrderForm({ auth, products, product_id, image }) {
    const { data, setData, post } = useForm({
        team_name: '',
        due_date: '',
        products: [],
        variations: {},
        lineups: [],
        files: [],
        selectedPic: image && image.image
    });


    console.log(image)
    const [step, setStep] = useState(1);
    const [transitionClass, setTransitionClass] = useState('');

    const nextStep = () => {
        setTransitionClass('translate-y-full');
        setTimeout(() => {
            setStep(step + 1);
            setTransitionClass('-translate-y-full');
            setTimeout(() => setTransitionClass('translate-y-0'), 50);
        }, 300);
    };

    const prevStep = () => {
        setTransitionClass('-translate-y-full');
        setTimeout(() => {
            setStep(step - 1);
            setTransitionClass('translate-y-full');
            setTimeout(() => setTransitionClass('translate-y-0'), 50);
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.store')); // Ensure you have a named route 'orders.store' in your Laravel routes
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Order</h2>}
        >
            <Head title="Order" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-gray-200">
                    <h1 className='font-bold text-2xl text-center'>Order</h1>
                    <div className="container overflow-hidden p-4">
                        <form onSubmit={handleSubmit}>
                            <div className={`transform transition-transform duration-300 ${transitionClass}`}>
                                {step === 1 && (
                                    <OrderFormStepOne
                                        data={data}
                                        setData={setData}
                                        nextStep={nextStep}
                                        product_id={product_id ? product_id : null}
                                        image = {image ? image : null}
                                    />
                                )}
                                {step === 2 && (
                                    <OrderFormStepTwo
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        nextStep={nextStep}
                                    />
                                )}
                                {step === 3 && (
                                    <OrderVariationsPage
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        nextStep={nextStep}
                                    />
                                )}
                                {step === 4 && (
                                    <LineupForm
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                    />
                                )}
                            </div>
                            <div className="mt-4 flex justify-between">
                                {step !== 1 && (
                                    <PrimaryButton type="button" onClick={prevStep}>
                                        Back
                                    </PrimaryButton>
                                )}
                                {step !== 4 && (
                                    <PrimaryButton type="button" onClick={nextStep}>
                                        Next
                                    </PrimaryButton>
                                )}
                                {step === 4 && (
                                    <PrimaryButton type="submit">
                                        Submit
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
