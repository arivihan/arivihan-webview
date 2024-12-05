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
                <div className="flex gap-4">

                    <div className="w-1/4 flex items-center border p-5 rounded-lg shadow-lg border-primary/50">
                        <div className="flex flex-col items-center">
                            <PiStudent className='text-6xl' />
                        </div>
                        <div className="h-full w-[1px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{formatNumber(homeData.students)}</p>
                            }
                            <span className='text-sm text-gray-500'>Students</span>
                        </div>
                    </div>

                    <div className="w-1/4 flex items-center border p-5 rounded-lg  shadow-lg border-primary/30">
                        <div className="flex flex-col items-center">
                            <BsQuestionCircle className='text-6xl' />
                        </div>
                        <div className="h-full w-[1px] bg-primary/30 mx-4"></div>
                        <div className="flex flex-col items-end mx-auto">
                            {
                                homeData === null
                                    ?
                                    <div className="my-2">
                                        <ThreeCircles color='#26c6da' height={40} />
                                    </div>
                                    :
                                    <p className='text-5xl'>{formatNumber(homeData.doubts)}</p>
                            }
                            <span className='text-sm text-gray-500'>Doubts</span>
                        </div>
                    </div>


                </div>
            </div>

        </SMEThemeWrapper>
    )
}