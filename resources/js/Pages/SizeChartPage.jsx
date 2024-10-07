import { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { Card, Toast } from "flowbite-react";
import { IconX } from "@tabler/icons-react";

export default function SizeChart({ auth, sizeChartData, filename }) {
    const [sizes, setSizes] = useState([]);
    const [newMeasurement, setNewMeasurement] = useState("");
    const [newSizeName, setNewSizeName] = useState(""); // State for new size name

    const { props } = usePage();
    const { data, setData, post } = useForm({
        _method: 'put',
        sizeChart: '',
        name: '',
    });

    useEffect(() => {
        if (sizeChartData && sizeChartData.Sizes) {
            setSizes(sizeChartData.Sizes.Size);
        }
    }, [sizeChartData]);

    const handleChange = (sizeName, measurementName, value) => {
        setSizes((prevSizes) => {
            const updatedSizes = prevSizes.map((size) => {
                if (size.Name === sizeName) {
                    return {
                        ...size,
                        Measurements: {
                            ...size.Measurements,
                            [measurementName]: value,
                        },
                    };
                }
                return size;
            });

            // Update XML after changes
            const updatedXML = generateXML(updatedSizes);
            setData('sizeChart', updatedXML);
            return updatedSizes;
        });
    };

    const handleMeasurementNameChange = (sizeName, oldMeasurementName, newMeasurementName) => {
        setSizes((prevSizes) => {
            const updatedSizes = prevSizes.map((size) => {
                if (size.Name === sizeName) {
                    const measurements = { ...size.Measurements };
                    // Rename the measurement
                    measurements[newMeasurementName] = measurements[oldMeasurementName];
                    delete measurements[oldMeasurementName];
                    return {
                        ...size,
                        Measurements: measurements,
                    };
                }
                return size;
            });

            // Update XML after renaming measurement
            const updatedXML = generateXML(updatedSizes);
            setData('sizeChart', updatedXML);
            return updatedSizes;
        });
    };

    const addNewMeasurement = () => {
        if (!newMeasurement) return; // Prevent adding empty measurement name

        setSizes((prevSizes) =>
            prevSizes.map((size) => ({
                ...size,
                Measurements: {
                    ...size.Measurements,
                    [newMeasurement]: "", // Initialize new measurement for each size
                },
            }))
        );
        setNewMeasurement(""); // Clear input

        // Update XML after adding new measurement
        const updatedXML = generateXML(sizes);
        setData('sizeChart', updatedXML);
    };

    // Function to add a new size
    const addNewSize = () => {
        if (!newSizeName) return; // Prevent adding empty size name

        const newSize = {
            Name: newSizeName,
            Measurements: {},
        };

        // Initialize new size with existing measurements
        Object.keys(sizes[0]?.Measurements || {}).forEach((measurement) => {
            newSize.Measurements[measurement] = ""; // Set each measurement to an empty string
        });

        // Add the new size with measurements initialized
        setSizes((prevSizes) => [...prevSizes, newSize]);
        setNewSizeName(""); // Clear input

        // Update XML after adding new size
        const updatedXML = generateXML([...sizes, newSize]);
        setData('sizeChart', updatedXML);
    };

    const deleteRow = (sizeName) => {
        setSizes((prevSizes) => {
            const updatedSizes = prevSizes.filter((size) => size.Name !== sizeName);
            
            // Update XML after deleting row
            const updatedXML = generateXML(updatedSizes);
            setData('sizeChart', updatedXML);
            return updatedSizes;
        });
    };

    const deleteMeasurement = (sizeName, measurementName) => {
        setSizes((prevSizes) =>
            prevSizes.map((size) => {
                if (size.Name === sizeName) {
                    const measurements = { ...size.Measurements };
                    delete measurements[measurementName];
                    return {
                        ...size,
                        Measurements: measurements,
                    };
                }
                return size;
            })
        );

        // Update XML after deleting measurement
        const updatedXML = generateXML(sizes);
        setData('sizeChart', updatedXML);
    };

    // Function to delete an entire measurement column
    const deleteMeasurementColumn = (measurementName) => {
        setSizes((prevSizes) =>
            prevSizes.map((size) => {
                const measurements = { ...size.Measurements };
                delete measurements[measurementName];
                return {
                    ...size,
                    Measurements: measurements,
                };
            })
        );

        // Update XML after deleting measurement column
        const updatedXML = generateXML(sizes);
        setData('sizeChart', updatedXML);
    };

    const generateXML = (sizes) => {
        const xmlDoc = document.implementation.createDocument("", "", null);
        const productElement = xmlDoc.createElement("Product");

        // productElement.setAttribute("id", product.id);
        // productElement.setAttribute("name", product.product_name);
        xmlDoc.appendChild(productElement);

        const sizesElement = xmlDoc.createElement("Sizes");
        productElement.appendChild(sizesElement);

        sizes.forEach((size) => {
            const sizeElement = xmlDoc.createElement("Size");
            sizesElement.appendChild(sizeElement);

            const nameElement = xmlDoc.createElement("Name");
            nameElement.textContent = size.Name;
            sizeElement.appendChild(nameElement);

            const measurementsElement = xmlDoc.createElement("Measurements");
            sizeElement.appendChild(measurementsElement);

            // Add existing measurements
            Object.entries(size.Measurements).forEach(([measurement, value]) => {
                const measurementElement = xmlDoc.createElement(measurement);
                measurementElement.textContent = value;
                measurementsElement.appendChild(measurementElement);
            });
        });

        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(xmlDoc);
        console.log(xmlString);
        return  xmlString;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.sizeChart.update', filename), {
            sizeChart: data.sizeChart, // Use the updated XML data
            
        });
    };

    return (
        <AdminLayout user={auth.admin}>
            {props.flash.success && (
                <div
                    className="fixed bottom-10 left-10 z-50 animate-slideUp transition-transform transform 
                    animate-[slide-up_0.5s_ease-out_forwards]"
                >
                    <Toast>
                        <span>{props.flash.success}</span>
                        <Toast.Toggle />
                    </Toast>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex justify-between">
                    <h1 className="font-bold text-2xl">Size Chart</h1>
                    <PrimaryButton className="mt-4" type="submit">
                        Update
                    </PrimaryButton>
                </div>
                <div className="mb-4 flex">
                    <InputLabel className="mr-2">New Measurement Name:</InputLabel>
                    <TextInput
                        value={newMeasurement}
                        onChange={(e) => setNewMeasurement(e.target.value)}
                        placeholder="Enter new measurement name"
                    />
                    <PrimaryButton type="button" onClick={addNewMeasurement} className="ml-2">
                        Add Measurement
                    </PrimaryButton>
                </div>
                <div className="mb-4 flex">
                    <InputLabel className="mr-2">New Size Name:</InputLabel>
                    <TextInput
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        placeholder="Enter new size name"
                    />
                    <PrimaryButton type="button" onClick={addNewSize} className="ml-2">
                        Add Size
                    </PrimaryButton>
                </div>
                {sizes.length > 0 ? (
                    <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                        <table className="table-auto min-w-full border border-gray-300 dark:border-zinc-800 rounded-md">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 dark:border-zinc-800 p-2">Size</th>
                                    {Object.keys(sizes[0].Measurements).map((measurement) => (
                                        <th key={measurement} className="border border-gray-300 dark:border-zinc-800 p-2">
                                            <InputLabel className="sr-only">Measurement Name</InputLabel>
                                            <TextInput
                                                value={measurement}
                                                onChange={(e) => handleMeasurementNameChange(sizes[0].Name, measurement, e.target.value)}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => deleteMeasurementColumn(measurement)} 
                                                className="text-red-500 ml-2"
                                            >
                                                Delete
                                            </button>
                                        </th>
                                    ))}
                                    <th className="border border-gray-300 dark:border-zinc-800 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizes.map((size) => (
                                    <tr key={size.Name}>
                                        <td className="border border-gray-300 dark:border-zinc-800 p-2">
                                            <InputLabel className="sr-only">Size Name</InputLabel>
                                            <TextInput
                                                value={size.Name}
                                                onChange={(e) => handleMeasurementNameChange(size.Name, size.Name, e.target.value)}
                                            />
                                        </td>
                                        {Object.keys(size.Measurements).map((measurement) => (
                                            <td key={measurement} className="border border-gray-300 dark:border-zinc-800 p-2">
                                                <InputLabel className="sr-only">Measurement Value</InputLabel>
                                                <TextInput
                                                    value={size.Measurements[measurement]}
                                                    onChange={(e) => handleChange(size.Name, measurement, e.target.value)}
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => deleteMeasurement(size.Name, measurement)} 
                                                    className="text-red-500 ml-2"
                                                >
                                                    <IconX/>
                                                </button>
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 dark:border-zinc-800 p-2">
                                            <button 
                                                type="button" 
                                                onClick={() => deleteRow(size.Name)} 
                                                className="text-red-500"
                                            >
                                                <IconX/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                ) : (
                    <p>No size chart data available.</p>
                )}
            </form>
        </AdminLayout>
    );
}
