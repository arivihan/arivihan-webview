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

const TodoListScreen = () => {
    const [toDoListCompleted, setToDoListCompleted] = useState(null);
    const [toDoListCreated, setToDoListCreated] = useState(null);

    const [selectedMonth, setSelectedMonth] = useState(12);

    const getToDoListCompleted = () => {
        analyticsCustomRequest(`/todolist/api/completed/`).then((res) => {
            setToDoListCompleted(
                {
                    labels: Object.keys(res),
                    datasets: [
                        {
                            label: "Todo List Completed",
                            data: Object.values(res),
                            borderColor: "rgba(34, 197, 94, 1)",
                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                        },
                    ],
                }
            );
        })
    }

    const getToDoListCreated = () => {
        analyticsCustomRequest(`/todolist/api/created/`).then((res) => {
            setToDoListCreated(
                {
                    labels: Object.keys(res),
                    datasets: [
                        {
                            label: "Todo List Created",
                            data: Object.values(res),
                            borderColor: "rgba(34, 197, 94, 1)",
                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                        },
                    ],
                }
            );
        })
    }


 

    useEffect(() => {
        getToDoListCompleted();
        getToDoListCreated();
    }, [])

    return (
        <SMEThemeWrapper>
            <div className="min-h-screen p-6">
                <div className="flex items-center">
                    <h2 className="text-2xl font-bold mr-auto">ToDo List</h2>
                    {/* <div className="flex gap-1">
                        <div className={`${selectedMonth === 10 ? "bg-primary text-white" : "border border-primary"}  px-4 py-1 rounded  text-sm cursor-pointer`} onClick={() => { setSelectedMonth(10) }}>
                            <span>Oct</span>
                        </div>
                        <div className={`${selectedMonth === 11 ? "bg-primary text-white" : "border border-primary"}  px-4 py-1 rounded  text-sm cursor-pointer`} onClick={() => { setSelectedMonth(11) }}>
                            <span>Nov</span>
                        </div>
                        <div className={`${selectedMonth === 12 ? "bg-primary text-white" : "border border-primary"}  px-4 py-1 rounded  text-sm cursor-pointer`} onClick={() => { setSelectedMonth(12) }}>
                            <span>Dec</span>
                        </div>
                    </div> */}
                </div>
                <hr className="my-4" />
        
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Todo List Created</h3>
                        {
                            toDoListCreated === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={toDoListCreated} />
                        }
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Todo List Completed</h3>
                        {
                            toDoListCompleted === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={toDoListCompleted} />
                        }
                    </div>
                </div>
                <div className="h-6"></div>
            </div>
        </SMEThemeWrapper>
    );
};

export default TodoListScreen;
