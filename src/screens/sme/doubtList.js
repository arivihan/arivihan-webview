import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChat, BsChatDotsFill, BsChatLeftText, BsEye } from 'react-icons/bs';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { smeCurrentViewCompoent, smeDoubtChatSession, smeDoubtChatSessionId, smeDoubtListUserId, smeDoubtListUserName } from '../../state/smeState';
import moment from 'moment';
import { ThreeCircles } from 'react-loader-spinner';
import SMEThemeWrapper from './smeThemeWrapper';
import { useNavigate, useParams } from 'react-router-dom';


export default function DoubtListScreen() {

    const [doubts, setDoubts] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const params = useParams();

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            smeCustomRequest(`/secure/sme/doubts-search?search=${searchText}`, "GET").then((res) => {
                setDoubts(res)
            })
        }
    }


    const getDoubts = () => {
        setIsLoading(true);
        if (params.userid === "latest") {
            smeCustomRequest(`/secure/sme/doubts-search?search=${searchText}`, "GET").then((res) => {
                setDoubts(res);
                setIsLoading(false);
            })
        } else {
            smeCustomRequest(`/secure/sme/doubts?userId=${params.userid}`, "GET").then((res) => {
                setDoubts(res);
                setIsLoading(false);
            })
        }
    }

    const handleDoubtChat = (doubt) => {
        smeDoubtChatSessionId.value = doubt.sessionId;
        smeDoubtChatSession.value = doubt;
        if (params.userid === "latest") {
            navigate("/sme-doubt-chat/" + doubt.userId + "/" + doubt.sessionId);
        } else {
            navigate("/sme-doubt-chat/" + params.userid + "/" + doubt.sessionId);

        }
    }

    useEffect(() => {
        getDoubts();
    }, [])


    return (
        <SMEThemeWrapper>
            <div className="h-full w-full">
                <div className=" flex items-center sticky top-0 bg-white py-0">

                    {
                        params.userid === "latest"
                            ?
                            <h2 className='font-bold'>Latest Doubts</h2>
                            :
                            <h2 className='font-bold'>{smeDoubtListUserName.value}'s Doubts</h2>
                    }
                    <div className="ml-auto flex items-center">
                        <input type="text" className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-72' placeholder='Search by name, phone number...' onInput={(e) => setSearchText(e.target.value)} onKeyDown={handleSearch} />
                        <div className="px-2 py-2 bg-primary/10 border border-primary ml-2 rounded cursor-pointer text-primary active:bg-primary active:text-white" onClick={handleSearch}><BiSearch /></div>
                    </div>
                </div>
                <div className="h-5/6 mt-2">
                    <div className="h-full w-full overflow-y-auto">
                        <table className='border w-full'>
                            <thead className='bg-primary text-white sticky top-0'>
                                <th className='border text-start px-2 py-1'>S.No.</th>
                                <th className='border text-start px-2 py-1'>Title</th>
                                <th className='border text-start px-2 py-1'>Subject</th>
                                <th className='border text-start px-2 py-1'>Resolved</th>
                                <th className='border text-start px-2 py-1'>Date</th>
                                <th className='border text-start px-2 py-1'>Actions</th>
                            </thead>
                            <tbody>

                                {
                                    isLoading
                                        ?
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full flex items-center justify-center h-[58vh]">
                                                    <ThreeCircles color='#26c6da' />
                                                </div>
                                            </td>
                                        </tr>
                                        :
                                        doubts === null || doubts.length === 0
                                            ?
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full flex flex-col items-center justify-center h-[58vh]">
                                                        <img src={require("../../assets/chat.png")} className='h-40 w-80 object-contain' />
                                                        <p className='text-sm text-gray-500'>Oops! no any result found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            doubts.map((doubt, index) => {
                                                return (

                                                    <tr key={index}>
                                                        <td className="border px-2 py-1">{index + 1}</td>
                                                        <td className="border px-2 py-1 max-w-72 break-all hyphen">{doubt.title}</td>
                                                        <td className="border px-2 py-1">{doubt.selectedSubject}</td>
                                                        <td className="border px-2 py-1">{doubt.resolved ? "Yes" : "No"}</td>
                                                        <td className="border px-2 py-1 text-sm">{moment(doubt.createdAt).format("h:m a DD-MM-YY")}</td>
                                                        <td className="border-t px-2 py-1 flex items-center">

                                                            <div className="border border-primary bg-primary/10 rounded p-1 cursor-pointer text-primary hover:text-white hover:bg-primary transition" onClick={() => { handleDoubtChat(doubt) }}>
                                                                <BsChatDotsFill />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                }

                            </tbody>
                        </table>

                    </div>
                </div>

                {/* <div className="h-10 w-full flex items-center justify-end">
                    <div className="ml-auto flex items-center bg-gray-200">
                        <div className="border-r border-white p-1 text-xl cursor-pointer hover:text-white hover:bg-primary transition">
                            <MdChevronLeft />
                        </div>
                        <span className='px-3 py-1 text-xs'>4</span>
                        <div className="border-l border-white p-1 text-xl cursor-pointer hover:text-white hover:bg-primary transition">
                            <MdChevronRight />
                        </div>

                    </div>
                </div> */}
            </div>
        </SMEThemeWrapper>
    )
}