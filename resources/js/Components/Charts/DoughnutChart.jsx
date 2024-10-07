import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card, Spinner } from 'flowbite-react';

const DoughnutChart = ({ data2, label, title }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            // Simulate fetching data, you might want to fetch actual data here
            const formattedData = {
                labels: data2.map(item => item.status),
                datasets: [
                    {
                        label: label,
                        data: data2.map(item => item.count),
                        backgroundColor: [
                            '#00e1d2',
                            '#a855f7',
                            '#f59e0b',
                            '#f97316',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                          ],
                          borderWidth: 0
                    },
                ],
            };

            setChartData(formattedData);
        };

        fetch();
    }, [data2]);

    return (
        <Card className="dark:border-zinc-800 shadow-none w-full h-full dark:bg-zinc-900 rounded-lg">
            {chartData ? (
                <>
                    <p className="font-bold">{title}</p>
                    <Doughnut data={chartData} />
                </>
            ) : (
                <div className='w-full h-full text-center'>
                    <Spinner />
                </div>
            )}
        </Card>
    );
};

export default DoughnutChart;
