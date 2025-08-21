import SMEThemeWrapper from "../sme/smeThemeWrapper";
import React, { useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useParams } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AppMetricesScreen = () => {
    const params = useParams();
    const barData = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
            {
                label: "Sales",
                data: [30, 45, 28, 55, 43],
                backgroundColor: "rgba(59, 130, 246, 0.7)",
            },
        ],
    };

    const lineData = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets: [
            {
                label: "Visitors",
                data: [100, 200, 150, 300, 250],
                borderColor: "rgba(34, 197, 94, 1)",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
            },
        ],
    };

    const tableData = [
        { id: 1, name: "John Doe", sales: "$3000", status: "Completed" },
        { id: 2, name: "Jane Smith", sales: "$2500", status: "Pending" },
        { id: 3, name: "Alice Johnson", sales: "$1800", status: "Completed" },
        { id: 4, name: "Michael Brown", sales: "$2200", status: "Cancelled" },
    ];



    return (
        <SMEThemeWrapper>
            <div className="min-h-screen p-6">
                <h2 className="text-2xl font-bold">{params.type.at(0).toUpperCase() + params.type.substring(1)} Metrices</h2>
                <hr className="my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">Total Sales</h3>
                        <p className="text-2xl font-bold text-blue-500">$12,345</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">New Users</h3>
                        <p className="text-2xl font-bold text-green-500">345</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">Orders</h3>
                        <p className="text-2xl font-bold text-purple-500">1,234</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">Revenue</h3>
                        <p className="text-2xl font-bold text-red-500">$45,678</p>
                    </div>
                </div>

                {/* Graphs Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Sales Bar Chart</h3>
                        <Bar data={barData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Visitors Line Chart</h3>
                        <Line data={lineData} />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b px-4 py-2">ID</th>
                                    <th className="border-b px-4 py-2">Name</th>
                                    <th className="border-b px-4 py-2">Sales</th>
                                    <th className="border-b px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id}>
                                        <td className="border-b px-4 py-2">{row.id}</td>
                                        <td className="border-b px-4 py-2">{row.name}</td>
                                        <td className="border-b px-4 py-2">{row.sales}</td>
                                        <td
                                            className={`border-b px-4 py-2 ${row.status === "Completed"
                                                ? "text-green-500"
                                                : row.status === "Pending"
                                                    ? "text-yellow-500"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {row.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="h-6"></div>
            </div>
        </SMEThemeWrapper>
    );
};

export default AppMetricesScreen;
