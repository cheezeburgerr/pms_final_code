import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrderFormStepOne from './Order/OrderFormStepOne';
import OrderFormStepTwo from './Order/OrderFormStepTwo';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OrderVariationsPage from './Order/OrderVariationsPage';
import PrimaryButton from '@/Components/PrimaryButton';
import LineupForm from './Order/LineupForm';
import Modal from '@/Components/Modal';
import Checkbox from '@/Components/Checkbox';

export default function OrderForm({ auth, products, product_id, image, design }) {
    const { data, setData, post } = useForm({
        team_name: '',
        due_date: '',
        products: [],
        variations: {},
        lineups: [],
        files: [],
        selectedPic: image && image.image,
        selectedDesign: design && design,
    });

    const [policyModal, setPolicyModal] = useState(true);
    const [policyAgreed, setPolicyAgreed] = useState(false);

    const [step, setStep] = useState(1);
    const [transitionClass, setTransitionClass] = useState('');
    const [errors, setErrors] = useState({}); // For storing validation errors

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!data.team_name) newErrors.team_name = 'Team name is required.';
            if (!data.due_date) newErrors.due_date = 'Due date is required.';
        } else if (step === 2) {
            if (data.products.length === 0) newErrors.products = 'You must select at least one product.';
        } else if (step === 3) {
            if (Object.keys(data.variations).length === 0) newErrors.variations = 'You must add at least one variation.';
        } else if (step === 4) {
            if (data.lineups.length === 0) newErrors.lineups = 'You must provide the lineup details.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // If no errors, validation passed
    };

    const nextStep = () => {
        if (validateStep()) {
            setTransitionClass('translate-y-full');
            setTimeout(() => {
                setStep(step + 1);
                setTransitionClass('-translate-y-full');
                setTimeout(() => setTransitionClass('translate-y-0'), 50);
            }, 300);
        }
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
        if (validateStep()) {
            post(route('orders.store')); // Ensure you have a named route 'orders.store' in your Laravel routes
        }
    };

    const progressPercentage = (step / 4) * 100;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Order</h2>}
        >
            <Head title="Order" />


<Modal show={policyModal}>
    <div className="p-4">
        <h1 className="font-bold mb-4 text-lg">Our Policy</h1>
        <p className='mb-4'>Before we proceed to order page, we want to make sure that you have read our policy and regulations in our company. </p>
        <div className='mb-2'>
        <Checkbox onChange={() => setPolicyAgreed(!policyAgreed)}/><span className='opacity-50 ml-3'>I agree to the policy and regulations of the company.</span>
        </div>
        <div className='flex justify-end'>
            <PrimaryButton disabled={!policyAgreed} onClick={() => setPolicyModal(false)}>Proceed</PrimaryButton>
        </div>
    </div>
</Modal>
            <div className="py-12">
                <div className="my-4 relative w-full">
                

                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-gray-200">
                <div className="overflow-hidden h-1 text-xs flex   mb-4">
                        <div
                            style={{ width: `${progressPercentage}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-aqua transition-all duration-500"
                        ></div>
                    </div>
                    <h1 className="font-bold text-2xl text-center font-Panchang">Order</h1>
                    <div className="container overflow-hidden p-4">
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4 flex justify-between flex-row-reverse">
                                {step === 4 && (
                                    <PrimaryButton type="submit">
                                        Submit
                                    </PrimaryButton>
                                )}
                                {step !== 4 && (
                                    <PrimaryButton type="button" onClick={nextStep}>
                                        Next
                                    </PrimaryButton>
                                )}
                                {step !== 1 && (
                                    <PrimaryButton type="button" onClick={prevStep}>
                                        Back
                                    </PrimaryButton>
                                )}


                            </div>
                            <div className={`transform transition-transform duration-300 ${transitionClass} py-4`}>
                                {step === 1 && (
                                    <OrderFormStepOne
                                        data={data}
                                        setData={setData}
                                        nextStep={nextStep}
                                        product_id={product_id ? product_id : null}
                                        image={image ? image : null}
                                        selDesign={design ? design : null}
                                        errors={errors} // Pass errors to the form step
                                    />
                                )}
                                {step === 2 && (
                                    <OrderFormStepTwo
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        nextStep={nextStep}
                                        errors={errors} // Pass errors to the form step
                                    />
                                )}
                                {step === 3 && (
                                    <OrderVariationsPage
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        nextStep={nextStep}
                                        errors={errors} // Pass errors to the form step
                                    />
                                )}
                                {step === 4 && (
                                    <LineupForm
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        errors={errors} // Pass errors to the form step
                                    />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
