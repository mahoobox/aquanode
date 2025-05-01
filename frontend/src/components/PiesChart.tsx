import {
    Chart as ChartJS,
    ArcElement,
    Chart,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PiesChartProps {
    data: {
        [key: string]: number;
    };
}


Chart.register(ChartDataLabels);

export function PiesChart({ data }: PiesChartProps) {
    const labels = Object.keys(data); 
    const values = Object.values(data);

    const total = values.reduce((a, b) => a + b, 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Total",
                data: values,
                backgroundColor: [
                    "rgba(216, 27, 96, 0.8)",
                    "rgba(41, 182, 246, 0.8)",
                    "rgba(244, 81, 30, 0.8)",
                    "rgba(92, 107, 192, 0.8)",
                ],
                borderColor: [
                    "rgba(216, 27, 96, 1)",
                    "rgba(41, 182, 246, 1)",
                    "rgba(244, 81, 30, 1)",
                    "rgba(92, 107, 192, 1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    const options: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "left",
                labels: {
                    font: { size: 15 },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.parsed;
                        return `${label}: ${value}`;
                    },
                },
            },
            datalabels: {
                color: "#fff",
                formatter: (value) => {
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`;
                },
                font: {
                    size: 18,
                },
            },
        },
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    zIndex: 10,
                }}
            >
                
            </div>
            <Pie data={chartData} options={options} />
        </div>
    );
}
