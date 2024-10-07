import { Card } from 'flowbite-react';
import { Doughnut, Pie } from 'react-chartjs-2';

const PrinterPieCharts = ({ printers }) => {
    return (
        <div className='flex gap-4 w-full overflow-x-auto'>
            {printers.map((printer) => {
                // Calculate the good and error lineups for each printer
                const goodLineups = printer.orders.reduce((sum, order) => {
                    const goodCount = order.order.lineups.filter(lineup => lineup.status !== 'Error').length;
                    return sum + goodCount;
                }, 0);

                const errorLineups = printer.orders.reduce((sum, order) => {
                    const errorCount = order.order.lineups.filter(lineup => lineup.status === 'Error').length;
                    return sum + errorCount;
                }, 0);

                // Prepare data for the pie chart
                const data = {
                    labels: ['Good Lineups', 'Error Lineups'],
                    datasets: [
                        {
                            data: [goodLineups, errorLineups], // Good vs Error lineups for each printer
                            backgroundColor: ['#00e1d2', '#a855f7'], // Good: Green, Error: Red
                            // hoverBackgroundColor: ['#66BB6A', '#EF5350'],
                            borderWidth: 0
                        }
                    ]
                };

                const options = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                    }
                };

                return (
                    <Card key={printer.id} className="mb-4 w-full dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
                        <h2 className="font-bold text-xl mb-2">{printer.equipment_name}</h2>
                        <Doughnut data={data} options={options} />
                        <div className="flex justify-between">
                            <p>Orders</p>
                            <p className='text-right'>{printer.orders.length}</p>
                        </div>
                        <hr  className='dark:border-zinc-800'/>
                        <div className="flex justify-between">
                            <p>Good</p>
                            <p className='text-right'>{goodLineups}</p>
                        </div>
                        <hr  className='dark:border-zinc-800'/>
                        <div className="flex justify-between">
                            <p>Error</p>
                            <p className='text-right'>{errorLineups}</p>
                        </div>
                        <hr  className='dark:border-zinc-800'/>
                    </Card>
                );
            })}
        </div>
    );
};

export default PrinterPieCharts;
