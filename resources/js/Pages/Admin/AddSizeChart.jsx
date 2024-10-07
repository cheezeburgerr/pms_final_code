import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { Card } from "flowbite-react";

export default function CreateSizeChart({ auth }) {
    const [sizes, setSizes] = useState([]); // Array to store sizes and their measurements
    const [newSizeName, setNewSizeName] = useState(""); // New size name
    const [newMeasurement, setNewMeasurement] = useState(""); // New measurement name

    const { data, setData, post } = useForm({
        sizeChart: '',
        name: '', // Name for the size chart, e.g., "Shirt Size Chart"
    });

    // Function to add a new size to the chart
    const addNewSize = () => {
        if (!newSizeName) return;

        const newSize = {
            Name: newSizeName,
            Measurements: {},
        };

        setSizes([...sizes, newSize]);
        setNewSizeName(""); // Clear input
    };

    // Function to add a new measurement to all sizes
    const addNewMeasurement = () => {
        if (!newMeasurement) return;

        setSizes(
            sizes.map((size) => ({
                ...size,
                Measurements: {
                    ...size.Measurements,
                    [newMeasurement]: "", // Initialize new measurement with empty value
                },
            }))
        );
        setNewMeasurement(""); // Clear input
    };

    // Handle input changes for individual measurement values
    const handleMeasurementChange = (sizeName, measurementName, value) => {
        setSizes((prevSizes) =>
            prevSizes.map((size) => {
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
            })
        );
        const xml =generateXML();
        console.log(sizes);
        setData('sizeChart', xml);
    };

    // Generate XML structure based on the sizes and measurements
    const generateXML = () => {
        const xmlDoc = document.implementation.createDocument("", "", null);
        const productElement = xmlDoc.createElement("Product");
    
        const sizesElement = xmlDoc.createElement("Sizes");
        productElement.appendChild(sizesElement);
    
        if (sizes.length === 0) {
            console.log("No sizes available for generating XML.");
            return null; // Exit early if no sizes
        }
    
        sizes.forEach((size) => {
            const sizeElement = xmlDoc.createElement("Size");
            sizesElement.appendChild(sizeElement);
    
            const nameElement = xmlDoc.createElement("Name");
            nameElement.textContent = size.Name;
            sizeElement.appendChild(nameElement);
    
            const measurementsElement = xmlDoc.createElement("Measurements");
            sizeElement.appendChild(measurementsElement);
    
            Object.entries(size.Measurements).forEach(([measurement, value]) => {
                const measurementElement = xmlDoc.createElement(measurement);
                measurementElement.textContent = value || ""; // Ensure no null values
                measurementsElement.appendChild(measurementElement);
            });
        });
    
        xmlDoc.appendChild(productElement); // Append the root element to the document
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(xmlDoc);
    
        console.log("Generated XML:", xmlString); // Log the generated XML
        return xmlString;
    };
    

    // Submit the form
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const generatedXML = generateXML();
    
        // Post the form data directly, including the XML in the sizeChart field
        post(route('size-chart.store'), {
            // sizeChart: generatedXML, // Manually include the XML in the payload
            name: data.name, // Pass the name of the size chart if needed
        });
    };

    return (
        <AdminLayout user={auth.admin}>
            <div className="flex justify-between mb-4">
                <h1 className="font-bold text-2xl">Create Size Chart XML</h1>
            </div>
            <TextInput
                name="name"
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Enter size chart name"
            />
            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex">
                    <TextInput
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        placeholder="Enter new size name"
                    />
                    <PrimaryButton type="button" onClick={addNewSize} className="ml-2">
                        Add Size
                    </PrimaryButton>
                </div>

                <div className="mb-4 flex">
                    <TextInput
                        value={newMeasurement}
                        onChange={(e) => setNewMeasurement(e.target.value)}
                        placeholder="Enter new measurement name"
                    />
                    <PrimaryButton type="button" onClick={addNewMeasurement} className="ml-2">
                        Add Measurement
                    </PrimaryButton>
                </div>

                {sizes.length > 0 && (
                    <Card>
                        <table className="table-auto w-full border border-gray-300 rounded-md">
                            <thead>
                                <tr>
                                    <th className="border p-2">Size</th>
                                    {Object.keys(sizes[0]?.Measurements || {}).map((measurement) => (
                                        <th key={measurement} className="border p-2">{measurement}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sizes.map((size) => (
                                    <tr key={size.Name}>
                                        <td className="border p-2">{size.Name}</td>
                                        {Object.keys(size.Measurements).map((measurement) => (
                                            <td key={measurement} className="border p-2">
                                                <TextInput
                                                    value={size.Measurements[measurement]}
                                                    onChange={(e) =>
                                                        handleMeasurementChange(size.Name, measurement, e.target.value)
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}

                <PrimaryButton type="submit" className="mt-4">
                    Create Size Chart XML
                </PrimaryButton>
            </form>
        </AdminLayout>
    );
}
