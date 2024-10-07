import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { IconArrowDown, IconArrowUpLeft, IconArrowUpRight } from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import { Card, Toast } from 'flowbite-react';
import ProductCarousel from '@/Components/ProductCarousel';
import "react-multi-carousel/lib/styles.css";

export default function Dashboard({ auth, products, designs }) {

    const { props } = usePage();
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // Make the header sticky with 'sticky' and 'top-0' classes
                <div className="sticky top-0 bg-white dark:bg-gray-900 z-50 py-4">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="TJM Sportswear" />

            {props.flash.success && (
                <div className="fixed bottom-10 left-10 z-50">
                    <Toast>
                        <span>{props.flash.success}</span>
                        <Toast.Toggle />
                    </Toast>
                </div>
            )}

            <div className='p-4 py-12 lg:py-24  dark:text-gray-100 text-center sticky top-0 bg-zinc-950 '>
                <h1 className='text-5xl md:text-5xl lg:text-6xl tracking-tight font-black uppercase font-Panchang text-gray-100'>
                    Sweat it out with <span className="text-aqua">Style</span>
                </h1>
                <p className='text-xl mt-4 text-gray-100 mb-8'>
                    This is TJM Sportswear. Your number one sportswear apparel buddy
                </p>
                {/* <Link href={route('orders.index')}>
                    <PrimaryButton className='mt-4'>Order Now</PrimaryButton>
                </Link> */}
                <div className="max-w-7xl mx-auto">
                    <div className='flex gap-4 justify-center items-center '>
                        <Link href={route('designer.index')} className='w-full '>
                            <Card className="bg-zinc-900 border-zinc-800  dark:bg-zinc-900 dark:border-zinc-800  shadow-sm hover:bg-aqua hover:dark:bg-aqua">
                                <div className="flex justify-between items-center">
                                    <h1 className='text-gray-100 font-bold font-Panchang'>Design</h1>
                                    <IconArrowUpRight color='#00ffff' />
                                </div>
                            </Card></Link>
                        <Link href={route('orders.index')} className='w-full'>
                            <Card className="bg-zinc-900 border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800  shadow-sm hover:bg-aqua hover:dark:bg-aqua">
                                <div className="flex justify-between items-center ">
                                    <h1 className='text-gray-100 font-bold font-Panchang'>Order</h1>
                                    <IconArrowUpRight color='#00ffff' />
                                </div>
                            </Card></Link>

                    </div>
                </div>
            </div>



            <div className="py-12 px-4">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-gray-100">

                    {/* <div className=' grid grid-cols-3 text-center mb-16'>
                        <div className='border-r-2'>
                            <h1 className='text-lg font-bold uppercase text-gray-800 dark:text-gray-100'>High Quality</h1>
                        </div>
                        <div className='border-r-2'>
                            <h1 className='text-lg font-bold uppercase text-gray-800 dark:text-gray-100'>Full Sublimation</h1>
                        </div>
                        <div>
                            <h1 className='text-lg font-bold uppercase text-gray-800 dark:text-gray-100'>Vibrant Apparels</h1>
                        </div>
                    </div> */}
                    <div className="relative justify-center">
                        {/* <img src="images/longsleeve.png" alt="" className='' /> */}

                        <h1 className='mb-2 font-Panchang font-2xl'>Our Products</h1>
                        <div className="relative   p-5 bg-gray-50 dark:bg-zinc-800/50 backdrop-blur-lg rounded-lg border dark:border-zinc-500 border-gray-300 shadow-sm">
                            <ProductCarousel>
                                {products.map((product) => (
                                    <Link key={product.id} to={`/product/${product.id}`}>
                                        <div className='bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 shadow-none p-0 mx-2 rounded-b-lg'>
                                            <img src={`/images/products/${product.image}`} alt="" className='rounded-t-lg h-56 object-cover w-full' />
                                            <div className="p-5 ">
                                                <h1 className="font-bold text-x text-gray-900 dark:text-gray-100">{product.product_name}</h1>
                                                <p className='text-aqua'>{product.product_price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </ProductCarousel>
                        </div>
                    </div>

                    {/* <div className="hidden md:block animate-bounce absolute inset-x-0 bottom-20 text-center">
                        <div className="flex justify-center">
                            <div className="bg-zinc-900 text-gray-200 dark:bg-gray-100 dark:text-gray-900 rounded-full p-3">
                                <IconArrowDown />
                            </div>
                        </div>
                    </div> */}



                    <div className="px-5 flex justify-between items-center mb-2 mt-10">
                        <h1 className="font-bold text-lg dark:text-gray-100 font-Panchang">Designs</h1>
                        <p className="text-aqua">View All</p>
                    </div>

                    <ProductCarousel>
                        {designs.map((design) => (
                            <Link key={design.id} href={route('design.info', design.id)}>
                                <div className='bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 shadow-none p-0 mx-2 rounded-b-lg'>
                                    <img src={`/storage/designs/${design.image}`} alt="" className='rounded-t-lg h-56 object-cover w-full'  loading='lazy'/>
                                    <div className="p-5">
                                        <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">{design.name}</h1>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </ProductCarousel>
                    <div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
