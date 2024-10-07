import { Card } from 'flowbite-react';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ title, data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map(item => item.count),
        backgroundColor: [
          '#00e1d2',
          '#a855f7',
          '#f59e0b',
          '#f97316',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: title
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export default function DoughnutCharts ({ groupedData, title })  {
  return (
    <Card className=' dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
        <h1 className="font-bold">{title}</h1>
      <div className='flex gap-4 flex-wrap  overflow-scroll no-scrollbar'>

      {Object.entries(groupedData).map(([key, value], index) => (
        <div className='' key={index} style={{ marginBottom: '20px' }}>
          <DoughnutChart title={key} data={value} />
        </div>
      ))}
      </div>
    </Card>
  );
};

