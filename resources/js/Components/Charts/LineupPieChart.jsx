import { Pie } from 'react-chartjs-2';

const LineupPieChart = ({ printers }) => {
    // Calculate the good and error lineups
    const goodLineups = printers.reduce((totalGood, printer) => {
        return totalGood + printer.orders.reduce((sum, order) => {
            const goodCount = order.order.lineups.filter(lineup => lineup.status !== 'Error').length;
            return sum + goodCount;
        }, 0);
    }, 0);

    const errorLineups = printers.reduce((totalError, printer) => {
        return totalError + printer.orders.reduce((sum, order) => {
            const errorCount = order.order.lineups.filter(lineup => lineup.status === 'Error').length;
            return sum + errorCount;
        }, 0);
    }, 0);

    // Prepare the data for the pie chart
    const data = {
        labels: ['Good Lineups', 'Error Lineups'],
        datasets: [
            {
                data: [goodLineups, errorLineups], // Good vs Error lineups
                backgroundColor: ['#4CAF50', '#F44336'], // Good: Green, Error: Red
                hoverBackgroundColor: ['#66BB6A', '#EF5350']
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
        <div>
            <h2>Lineups Status</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default LineupPieChart;
