import Authenticated from "@/Layouts/AuthenticatedLayout";
import OrderVariationsPage from "../OrderVariationsPage";
import OrderFormStepTwo from "../OrderFormStepTwo";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function AddSelectedProduct ({auth, products, order }) {

    const { data, setData, post } = useForm({
        order_id: order.id,
        products: [],
        variations: {},
        lineups: [],
        files: [],
        
    });

    const [step, setStep] = useState(1);
    const [transitionClass, setTransitionClass] = useState('');
    const [errors, setErrors] = useState({}); // For storing validation errors

    const validateStep = () => {
        const newErrors = {};
       if (step === 1) {
            if (data.products.length === 0) newErrors.products = 'You must select at least one product.';
        } else if (step === 2) {
            if (Object.keys(data.variations).length === 0) newErrors.variations = 'You must add at least one variation.';
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
            post(route('store.product')); // Ensure you have a named route 'orders.store' in your Laravel routes
        }
    };
    return (
        <>
            <Authenticated user={auth.user} >
            <div className="py-12">
            <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-gray-100">
                <h1 className="font-bold text-2xl font-Panchang text-center">Add Product</h1>
                
                <form onSubmit={handleSubmit}>
                            <div className="mt-4 flex justify-between flex-row-reverse">
                                {step === 2 && (
                                    <PrimaryButton type="submit">
                                        Submit
                                    </PrimaryButton>
                                )}
                                {step !== 2 && (
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
                                    <OrderFormStepTwo
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        nextStep={nextStep}
                                        errors={errors} // Pass errors to the form step
                                    />
                                )}
                                {step === 2 && (
                                    <OrderVariationsPage
                                        data={data}
                                        setData={setData}
                                        prevStep={prevStep}
                                        products={products}
                                        nextStep={nextStep}
                                        errors={errors} // Pass errors to the form step
                                    />
                                )}
                            
                            </div>
                        </form>
                </div>
                </div>
            </Authenticated>
        </>
    )
}