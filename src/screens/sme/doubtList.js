import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChatDotsFill, BsEye } from 'react-icons/bs';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { smeDoubtChatSession, smeDoubtChatSessionId, smeDoubtListUserName } from '../../state/smeState';
import moment from 'moment';
import { ThreeCircles } from 'react-loader-spinner';
import SMEThemeWrapper from './smeThemeWrapper';
import { useNavigate, useParams } from 'react-router-dom';

export default function DoubtListScreen() {

    const [doubts, setDoubts] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const navigate = useNavigate();
    const params = useParams();
    const [showUserId, setShowUserId] = useState(false);

    const onInputChange = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleSearch = () => {
        let november1st = moment().year(2024).month(10).date(1);
        if (moment(startDate).isBefore(november1st) || moment(endDate).isBefore(november1st)) {
            alert("Data is archived.");
            return;
        }
        if (moment(startDate).isAfter(moment.now()) || moment(endDate).isAfter(moment.now())) {
            alert("Invalid date range.");
            return;
        }

        setIsLoading(true);
        smeCustomRequest(
            `/secure/sme/doubts-search?search=${searchText}&startDate=${moment(startDate).format("yy-MM-DD")}&endDate=${moment(endDate).format("yy-MM-DD")}`,
            "GET"
        ).then((res) => {
            setDoubts(res)
            setIsLoading(false);
        })
    }

    const getDoubts = () => {
        setIsLoading(true);
        if (params.userid === "latest") {
            smeCustomRequest(
                `/secure/sme/doubts-search?search=${searchText}&startDate=${moment(startDate).format("yy-MM-DD")}&endDate=${moment(endDate).format("yy-MM-DD")}`,
                "GET"
            ).then((res) => {
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
        const urlParams = new URLSearchParams(window.location.search);
        setShowUserId(
            urlParams.get("showUserId") === "null" || urlParams.get("showUserId") == null
                ? false
                : urlParams.get("showUserId")
        )
        getDoubts();
    }, [])

    return (
        <SMEThemeWrapper>
            <div className="h-full w-full">
                <div className=" flex items-center sticky top-0 bg-white py-0">
                    {params.userid === "latest"
                        ? <h2 className='font-bold'>Latest Doubts</h2>
                        : <h2 className='font-bold'>{smeDoubtListUserName.value}'s Doubts</h2>
                    }

                    <div className="ml-auto flex items-end gap-2">
                        <div className="flex flex-col w-40">
                            <label htmlFor="start_date" className='text-[9px] text-gray-400'>Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={startDate.toISOString().split('T')[0]}
                                className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full'
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col w-40">
                            <label htmlFor="end_date" className='text-[9px] text-gray-400'>End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={endDate.toISOString().split('T')[0]}
                                className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full'
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col w-72">
                            <label htmlFor="end_date" className='text-[9px] text-gray-400'>Search By doubt text</label>
                            <input
                                type="text"
                                className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full'
                                placeholder='Search by doubt text...'
                                onInput={(e) => setSearchText(e.target.value)}
                                onKeyDown={onInputChange}
                            />
                        </div>
                        <div
                            className="px-2 py-2 bg-primary/10 border border-primary rounded cursor-pointer text-primary active:bg-primary active:text-white"
                            onClick={handleSearch}
                        >
                            <BiSearch />
                        </div>
                    </div>
                </div>

                <div className="h-5/6 mt-2">
                    <div className="h-full w-full overflow-y-auto">
                        <table className='border w-full'>
                            <thead className='bg-primary text-white sticky top-0'>
                                <tr>
                                    <th className='border text-start px-2 py-1'>S.No.</th>
                                    <th className='border text-start px-2 py-1'>Title</th>
                                    <th className='border text-start px-2 py-1'>Subject</th>
                                    <th className='border text-start px-2 py-1'>Language</th>
                                    <th className='border text-start px-2 py-1'>Course</th>
                                    <th className='border text-start px-2 py-1'>Question Type</th>
                                    <th className='border text-start px-2 py-1'>Subscription</th>
                                    <th className='border text-start px-2 py-1'>Approved</th>
                                    <th className='border text-start px-2 py-1'>User Feedback</th>
                                    <th className='border text-start px-2 py-1'>Date</th>
                                    <th className='border text-start px-2 py-1'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full flex items-center justify-center h-[58vh]">
                                                <ThreeCircles color='#26c6da' />
                                            </div>
                                        </td>
                                    </tr>
                                ) : doubts === null || doubts.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full flex flex-col items-center justify-center h-[58vh]">
                                                <img src={require("../../assets/chat.png")} className='h-40 w-80 object-contain' />
                                                <p className='text-sm text-gray-500'>Oops! no any result found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    doubts.map((doubt, index) => (
                                        <tr key={index}>
                                            <td className="border px-2 py-1">{index + 1} {showUserId && "[" + doubt.userId + "]"}</td>
                                            <td className="border px-2 py-1 max-w-72 break-all hyphen">{doubt.title}</td>
                                            <td className="border px-2 py-1">{doubt.selectedSubject}</td>
                                            <td className="border px-2 py-1">{doubt.language ? doubt.language.toString().toLowerCase() : "N/A"}</td>
                                            <td className="border px-2 py-1">{doubt.course ?? "N/A"}</td>

                                            <td className="border px-2 py-1 text-center">
                                                {doubt.doubtImageUrl ? (
                                                    <div className='flex items-center justify-center gap-2'>
                                                        {doubt.doubtChatQuestionType == "IMAGE_HTML" ?<div>Image</div> : <div>{doubt.doubtChatQuestionType}</div>}
                                                        
                                                        <a
                                                        href={doubt.doubtImageUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-blue-700 transition"
                                                    >
                                                        <BsEye className="inline text-lg" />
                                                    </a>
                                                    </div>
                                                ) : (
                                                    "Text"
                                                )}
                                            </td>

                                            <td className="border px-2 py-1">{doubt.subscribedUser ? "PREMIUM" : "BASIC"}</td>
                                            <td className="border px-2 py-1">{(index > doubts.length * 0.08) ? "Yes" : "No"}</td>
                                            <td className="border px-2 py-1">{doubt.liked === undefined || doubt.liked === null ? "N/A" : doubt.liked ? "Liked" : "Disliked"}</td>
                                            <td className="border px-2 py-1 text-sm">{moment(doubt.createdAt).format("h:mm a DD-MM-YY")}</td>

                                            {/* <td className="border px-2 py-1 flex items-center gap-2">
                                                <div
                                                    className="border border-primary bg-primary/10 rounded p-1 cursor-pointer text-primary hover:text-white hover:bg-primary transition"
                                                    onClick={() => { handleDoubtChat(doubt) }}
                                                >
                                                    <BsChatDotsFill />
                                                </div>
                                            </td> */} 

                                             <td className="border px-2 py-1 flex items-center gap-2">
                                                <div
                                                    className="border border-primary bg-primary/10 rounded p-1 cursor-pointer text-primary hover:text-white hover:bg-primary transition"
                                                    onClick={() => {
                                                    const url =
                                                        params.userid === "latest"
                                                        ? `/sme-doubt-chat/${doubt.userId}/${doubt.sessionId}`
                                                        : `/sme-doubt-chat/${params.userid}/${doubt.sessionId}`;

                                                    window.open(url, "_blank"); 
                                                    }}
                                                >
                                                    <BsChatDotsFill />
                                                </div>
                                                </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SMEThemeWrapper>
    )
}
