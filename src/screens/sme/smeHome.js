import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChat, BsChatDotsFill, BsChatLeftText, BsEye, BsQuestionCircle } from 'react-icons/bs';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { smeCurrentViewCompoent, smeDoubtChatSession, smeDoubtChatSessionId, smeDoubtListUserId, smeDoubtListUserName } from '../../state/smeState';
import moment from 'moment';
import { ThreeCircles } from 'react-loader-spinner';
import SMEThemeWrapper from './smeThemeWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import { PiStudent } from 'react-icons/pi';
import formatNumber from '../../utils/formatNumber';
import { Line } from 'react-chartjs-2';


export default function SmeHomeScreen() {

    const [homeData, setHomeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const params = useParams();

    const getHomeData = () => {
        smeCustomRequest('/secure/sme/home', "GET").then((res) => {
            console.log(res);
            setHomeData(res);
        });
    }

    useEffect(() => {
        getHomeData()
    }, [])


    return (
        <SMEThemeWrapper>

            <div className="h-full w-full">
                <div className="flex flex-wrap gap-4">

                    <div className="w-[calc(100%/3.1)] flex items-center border border-[2px]  p-5 rounded-lg shadow border-primary/50">
                        <div className="flex flex-col items-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/3829/3829933.png" className='h-16' />
                            {/* <PiStudent className='text-6xl' /> */}
                        </div>
                        <div className="h-full w-[2px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{homeData && homeData.students && formatNumber(homeData.students)}</p>
                            }
                            <span className='text-sm text-gray-500 font-bold'>Students</span>
                        </div>
                    </div>

                    <div className="w-[calc(100%/3.1)] flex items-center border  border-[2px] p-5 rounded-lg  shadow border-primary/30">
                        <div className="flex flex-col items-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/1081/1081046.png" className='h-16' />
                            {/* <BsQuestionCircle className='text-6xl' /> */}
                        </div>
                        <div className="h-full w-[2px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{homeData && homeData.students && formatNumber(homeData.doubts)}</p>
                            }
                            <span className='text-sm text-gray-500 font-bold'>Doubts</span>
                        </div>
                    </div>

                    <div className="w-[calc(100%/3.1)] flex items-center border  border-[2px] p-5 rounded-lg  shadow border-primary/30">
                        <div className="flex flex-col items-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/12886/12886027.png" className='h-16' />
                            {/* <BsQuestionCircle className='text-6xl' /> */}
                        </div>
                        <div className="h-full w-[2px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{homeData && homeData.students && formatNumber(homeData.board_doubts ?? 0)}</p>
                            }
                            <span className='text-sm text-gray-500 font-bold'>Board Doubts</span>
                        </div>
                    </div>

                    <div className="w-[calc(100%/3.1)] flex items-center border  border-[2px] p-5 rounded-lg  shadow border-primary/30">
                        <div className="flex flex-col items-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/5064/5064617.png" className='h-16' />
                            {/* <BsQuestionCircle className='text-6xl' /> */}
                        </div>
                        <div className="h-full w-[2px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{homeData && homeData.students && formatNumber(parseInt(homeData.neet_doubts ?? 0))}</p>
                            }
                            <span className='text-sm text-gray-500 font-bold'>JEE Doubts</span>
                        </div>
                    </div>

                    <div className="w-[calc(100%/3.1)] flex items-center border  border-[2px] p-5 rounded-lg  shadow border-primary/30">
                        <div className="flex flex-col items-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/9733/9733596.png" className='h-16' />
                            {/* <BsQuestionCircle className='text-6xl' /> */}
                        </div>
                        <div className="h-full w-[2px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{homeData && homeData.students && formatNumber(parseInt(homeData.jee_doubts ?? 0))}</p>
                            }
                            <span className='text-sm text-gray-500 font-bold'>NEET Doubts</span>
                        </div>
                    </div>


                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Doubt Queries Solved</h3>
                        {
                            homeData === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={{
                                    labels: Object.keys(homeData.doubt_queries_solved),
                                    datasets: [
                                        {
                                            label: "Doubt Queries Solved",
                                            data: Object.values(homeData.doubt_queries_solved),
                                            borderColor: "rgba(34, 197, 94, 1)",
                                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                                        },
                                    ],
                                }} />
                        }
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Student's Efficiency</h3>
                        {
                            homeData === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={{
                                    labels: Object.keys(homeData.efficiency_student),
                                    datasets: [
                                        {
                                            label: "Efficiency Student",
                                            data: Object.values(homeData.efficiency_student),
                                            borderColor: "rgba(34, 197, 94, 1)",
                                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                                        },
                                    ],
                                }} />
                        }
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4">Tutor's Efficiency</h3>
                        {
                            homeData === null
                                ?
                                <div className="h-64 w-full flex items-center justify-center">
                                    <ThreeCircles color='#26c6da' height={60} />
                                </div>
                                :
                                <Line data={{
                                    labels: Object.keys(homeData.efficiency_tutor),
                                    datasets: [
                                        {
                                            label: "Efficiency Tutor",
                                            data: Object.values(homeData.efficiency_tutor),
                                            borderColor: "rgba(34, 197, 94, 1)",
                                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                                        },
                                    ],
                                }} />
                        }
                    </div>
                </div>
                <div className="pb-6"></div>
            </div>

        </SMEThemeWrapper>
    )
}