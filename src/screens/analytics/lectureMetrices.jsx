import SMEThemeWrapper from "../sme/smeThemeWrapper";
import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useParams } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { analyticsCustomRequest } from "../../utils/smeCustomRequest";
import moment from "moment";
import { CgChevronLeft } from "react-icons/cg";
import { BiChevronRight } from "react-icons/bi";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const LectureMetricesScreen = () => {
    const [lectureViewsData, setLectureViewsData] = useState(null);
    const [lineGraphData, setlineGraphData] = useState(null);
    const [pieGraphData, setPieGraphData] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [currentTablePage, setCurrentTablePage] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(12);
    const [lectureQueriesSolved, setLectureQueriesSolved] = useState(null);

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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (context.raw !== undefined) {
                            label += ': ' + context.raw + ' Views';
                        }
                        return label;
                    },
                },
            },
        },
    };

    const getLectureOverallData = () => {
        setLectureViewsData(null);
        setPieGraphData(null);
        analyticsCustomRequest(`/lecture/api/total-count?month=${selectedMonth}`).then((res) => {
            setLectureViewsData(res);

            setPieGraphData(
                {
                    labels: Object.keys(res.breakdown),
                    datasets: [
                        {
                            label: "test",
                            data: Object.values(res.breakdown),
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        },
                    ],
                }
            );
        })
    }

    const getLineGraphData = () => {
        setlineGraphData(null);
        analyticsCustomRequest(`/lecture/api/line-graph?month=${selectedMonth}`).then((res) => {
            setlineGraphData(
                {
                    labels: res.data.map((item) => item.event_date),
                    datasets: [
                        {
                            label: "View Trends",
                            data: res.data.map((item) => item.event_count),
                            borderColor: "rgba(34, 197, 94, 1)",
                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                        },
                    ],
                }
            );
        })
    }

    const getLectureQueriesCompleted = () => {
        setLectureQueriesSolved(null);
        analyticsCustomRequest(`/lecture/api/ai-corrections-during-lecture/`).then((res) => {
            setLectureQueriesSolved(
                {
                    labels: Object.keys(res),
                    datasets: [
                        {
                            label: "View Trends",
                            data: Object.values(res),
                            borderColor: "rgba(34, 197, 94, 1)",
                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                        },
                    ],
                }
            );
        })
    }

    const getTableData = (page = 0) => {
        setTableData(null);
        analyticsCustomRequest(`/lecture/api/table-view?month=${selectedMonth}&page=${page}`).then((res) => {
            setTableData(
                res.data
            )
        })
    }

    useEffect(() => {
        getTableData();
    }, [currentTablePage, selectedMonth])

    useEffect(() => {
        getLectureOverallData();
        getLineGraphData();
    }, [selectedMonth])

    useEffect(()=>{
        getLectureQueriesCompleted();
    },[])

    return (
        <SMEThemeWrapper>
            <div className="min-h-screen p-6">
                <div className="flex items-center">
                    <h2 className="text-2xl font-bold mr-auto">Lecture  Metrices</h2>
                    <div className="flex gap-1">
                        <div className={`${selectedMonth === 10 ? "bg-primary text-white" : "border border-primary"}  px-4 py-1 rounded  text-sm cursor-pointer`} onClick={() => { setSelectedMonth(10) }}>
                            <span>Oct</span>
                        </div>
                        <div className={`${selectedMonth === 11 ? "bg-primary text-white" : "border border-primary"}  px-4 py-1 rounded  text-sm cursor-pointer`} onClick={() => { setSelectedMonth(11) }}>
                            <span>Nov</span>
                        </div>
                        <div className={`${selectedMonth === 12 ? "bg-primary text-white" : "border border-primary"}  px-4 py-1 rounded  text-sm cursor-pointer`} onClick={() => { setSelectedMonth(12) }}>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">Total Videos Completed</h3>
                        {
                            lectureViewsData === null
                                ?
                                <div className="my-2">
                                    <ThreeCircles color='#26c6da' height={18} />
                                </div>
                                :
                                <p className="text-2xl font-bold text-blue-500">{lectureViewsData.total_count}</p>
                        }
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">Board Videos Completed</h3>
                        {
                            lectureViewsData === null
                                ?
                                <div className="my-2">
                                    <ThreeCircles color='#26c6da' height={18} />
                                </div>
                                :
                                <p className="text-2xl font-bold text-green-500">{lectureViewsData.breakdown.Board}</p>
                        }
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">JEE Videos Completed</h3>
                        {
                            lectureViewsData === null
                                ?
                                <div className="my-2">
                                    <ThreeCircles color='#26c6da' height={18} />
                                </div>
                                :
                                <p className="text-2xl font-bold text-purple-500">{lectureViewsData.breakdown.JEE}</p>
                        }
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">NEET Videos Completed</h3>
                        {
                            lectureViewsData === null
                                ?
                                <div className="my-2">
                                    <ThreeCircles color='#26c6da' height={18} />
                                </div>
                                :
                                <p className="text-2xl font-bold text-red-500">{lectureViewsData.breakdown.NEET}</p>
                        }
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold">Interactive Input Clicked</h3>
                        {
                            lectureViewsData === null
                                ?
                                <div className="my-2">
                                    <ThreeCircles color='#26c6da' height={18} />
                                </div>
                                :
                                <p className="text-2xl font-bold text-blue-500">{lectureViewsData.breakdown.interactive_input}</p>
                        }
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Course Video Overview</h3>
                        {
                            pieGraphData === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <div className="h-64 w-full flex items-center justify-center">
                                    <Bar data={pieGraphData} />
                                    {/* <Pie data={pieGraphData} options={options} /> */}
                                </div>
                        }
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Micro lecture daily completions</h3>
                        {
                            lineGraphData === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={lineGraphData} />
                        }
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">AI Corrections During Lecture</h3>
                        {
                            lectureQueriesSolved === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={lectureQueriesSolved} />
                        }
                    </div>
                </div>

                <div className="bg-white border p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Views Data</h3>
                    <div className="overflow-x-auto flex flex-col">
                        <table className="table-auto w-full text-left border-collapse" border="1">
                            <thead>
                                <tr>
                                    <th className="border-b px-4 py-2">ID</th>
                                    <th className="border-b px-4 py-2">MicroLecture Name</th>
                                    <th className="border-b px-4 py-2">Chapter Name</th>
                                    <th className="border-b px-4 py-2">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    tableData === null
                                        ?
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="w-full flex items-center justify-center py-12">
                                                    <ThreeCircles color='#26c6da' height={60} />
                                                </div>
                                            </td>
                                        </tr>
                                        :
                                        tableData.map((row) => (
                                            <tr key={row.id}>
                                                <td className="border-b px-4 py-2">{row.phoneNumber}</td>
                                                <td className="border-b px-4 py-2">{row.MicrolectureName}</td>
                                                <td className="border-b px-4 py-2">{row.ChapterName}</td>
                                                <td className="border-b px-4 py-2">{row.event_timestamp ? moment(row.event_timestamp).format("HH:MM:SS DD/MM/YYYY") : "N/A"}</td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>

                        <div className="flex items-center mt-4 ml-auto gap-4">
                            <div className="rounded border p-2 cursor-pointer" onClick={() => { if (currentTablePage > 0) { setCurrentTablePage(currentTablePage - 1) } }}>
                                <CgChevronLeft />
                            </div>
                            <div className="rounded border p-2 cursor-pointer" onClick={() => { setCurrentTablePage(currentTablePage + 1) }}>
                                <BiChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-6"></div>
            </div>
        </SMEThemeWrapper>
    );
};

export default LectureMetricesScreen;
