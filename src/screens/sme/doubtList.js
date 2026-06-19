import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChatDotsFill, BsEye } from 'react-icons/bs';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { smeDoubtChatSession, smeDoubtChatSessionId, smeDoubtListUserName } from '../../state/smeState';
import moment from 'moment';
import { ThreeCircles } from 'react-loader-spinner';
import SMEThemeWrapper from './smeThemeWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DoubtListScreen() {
    const { t } = useTranslation();
    const [doubts, setDoubts] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const navigate = useNavigate();
    const params = useParams();
    const [showUserId, setShowUserId] = useState(false);
    const [Subject, setSubject] = useState("")
    const [QT, setQT] = useState("")
    
    const onInputChange = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const buildSearchUrl = () => {
        const baseUrl = `/secure/sme/doubts-search`;
        const searchParams = new URLSearchParams({
            search: searchText,
            startDate: moment(startDate).format("yy-MM-DD"),
            endDate: moment(endDate).format("yy-MM-DD")
        });
        
        // Add subject parameter if selected
        if (Subject && Subject !== "") {
            searchParams.append('subject', Subject);
        }
        
        // Add question type parameter if selected
        if (QT && QT !== "") {
            searchParams.append('questionType', QT);
        }
        
        return `${baseUrl}?${searchParams.toString()}`;
    }

    const handleSearch = () => {
        let november1st = moment().year(2024).month(10).date(1);
        if (moment(startDate).isBefore(november1st) || moment(endDate).isBefore(november1st)) {
            alert(t("doubt_list_alert_archived"));
            return;
        }
        if (moment(startDate).isAfter(moment.now()) || moment(endDate).isAfter(moment.now())) {
            alert(t("doubt_list_alert_invalid_range"));
            return;
        } 

        setIsLoading(true);
        smeCustomRequest(buildSearchUrl(), "GET").then((res) => {
            setDoubts(res)
            setIsLoading(false);
        }).catch((error) => {
            console.error("Search error:", error);
            setIsLoading(false);
        })
    }

    const getDoubts = () => {
        setIsLoading(true);
        if (params.userid === "latest") {
            smeCustomRequest(buildSearchUrl(), "GET").then((res) => {
                setDoubts(res);
                setIsLoading(false);
            }).catch((error) => {
                console.error("Get doubts error:", error);
                setIsLoading(false);
            })
        } else {
            let url = `/secure/sme/doubts?userId=${params.userid}`;
            // Add subject filter for specific user as well if your API supports it
            if (Subject && Subject !== "") {
                url += `&subject=${Subject}`;
            }
            // Add question type filter for specific user as well if your API supports it
            if (QT && QT !== "") {
                url += `&questionType=${QT}`;
            }
            smeCustomRequest(url, "GET").then((res) => {
                setDoubts(res);
                setIsLoading(false);
            }).catch((error) => {
                console.error("Get doubts error:", error);
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

    // Filter doubts locally if API doesn't support filtering
    const filteredDoubts = doubts ? doubts.filter(doubt => {
        // Filter by subject
        if (Subject && Subject !== "") {
            if (doubt.selectedSubject?.toLowerCase() !== Subject.toLowerCase()) {
                return false;
            }
        }
        
        // Filter by question type
        if (QT && QT !== "") {
            // Map display values to actual API values
            let questionTypeToMatch = QT;
            if (QT === "Image") {
                questionTypeToMatch = "IMAGE_HTML";
            } else if (QT === "Text") {
                questionTypeToMatch = "TEXT_OPTION";
            }
            
            if (doubt.doubtChatQuestionType !== questionTypeToMatch) {
                return false;
            }
        }
        
        return true;
    }) : null;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setShowUserId(
            urlParams.get("showUserId") === "null" || urlParams.get("showUserId") == null
                ? false
                : urlParams.get("showUserId")
        )
        getDoubts();
    }, [])

    // Re-fetch data when subject or question type changes
    useEffect(() => {
        if (doubts !== null) { // Only trigger if doubts have been loaded at least once
            getDoubts();
        }
    }, [Subject, QT])

    return (
        <SMEThemeWrapper>
            <div className="h-full w-full">
                <div className=" flex items-center sticky top-0 bg-white py-0">
                    {params.userid === "latest"
                        ? <h2 className='font-bold'>{t("doubt_list_latest_doubts")}</h2>
                        : <h2 className='font-bold'>{t("doubt_list_user_doubts", { name: smeDoubtListUserName.value })}</h2>
                    }

                    <div className="ml-auto flex items-end gap-2">
                        <div className="flex flex-col w-40">
                            <label htmlFor="subject" className="text-[9px] text-gray-400">
                                {t("doubt_list_select_subject")}
                            </label>
                            <select
                                name="subject"
                                value={Subject}
                                className="border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full"
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option value="">{t("doubt_list_all_subject")}</option>
                                <option value="Mathematics">{t("doubt_list_subject_math")}</option>
                                <option value="Physics">{t("doubt_list_subject_physics")}</option>
                                <option value="Biology">{t("doubt_list_subject_biology")}</option>
                                <option value="Chemistry">{t("doubt_list_subject_chemistry")}</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-40">
                            <label htmlFor="questionType" className="text-[9px] text-gray-400">
                                {t("doubt_list_question_type")}
                            </label>
                            <select
                                name="questionType"
                                value={QT}
                                className="border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full"
                                onChange={(e) => setQT(e.target.value)}
                            >
                                <option value="">{t("doubt_list_all_types")}</option>

                                <option value="TEXT">{t("doubt_list_type_text")}</option>
                                <option value="IMAGE_HTML">{t("doubt_list_type_image")}</option>

                            </select>
                        </div>

                        <div className="flex flex-col w-40">
                            <label htmlFor="start_date" className='text-[9px] text-gray-400'>{t("doubt_list_start_date")}</label>
                            <input
                                type="date"
                                name="start_date"
                                value={startDate.toISOString().split('T')[0]}
                                className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full'
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col w-40">
                            <label htmlFor="end_date" className='text-[9px] text-gray-400'>{t("doubt_list_end_date")}</label>
                            <input
                                type="date"
                                name="end_date"
                                value={endDate.toISOString().split('T')[0]}
                                className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full'
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col w-72">
                            <label htmlFor="end_date" className='text-[9px] text-gray-400'>{t("doubt_list_search_label")}</label>
                            <input
                                type="text"
                                className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-full'
                                placeholder={t("doubt_list_search_placeholder")}
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
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_sno")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_title")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_subject")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_language")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_course")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_question_type")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_subscription")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_approved")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_user_feedback")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_date")}</th>
                                    <th className='border text-start px-2 py-1'>{t("doubt_list_th_actions")}</th>
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
                                ) : filteredDoubts === null || filteredDoubts.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full flex flex-col items-center justify-center h-[58vh]">
                                                <img src={require("../../assets/chat.png")} className='h-40 w-80 object-contain' />
                                                <p className='text-sm text-gray-500'>{t("doubt_list_no_results")}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDoubts.map((doubt, index) => (
                                        <tr key={index}>
                                            <td className="border px-2 py-1">{index + 1} {showUserId && "[" + doubt.userId + "]"}</td>
                                            <td className="border px-2 py-1 max-w-72 break-all hyphen">{doubt.title}</td>
                                            <td className="border px-2 py-1">{doubt.selectedSubject}</td>
                                            <td className="border px-2 py-1">{doubt.language ? doubt.language.toString().toLowerCase() : "N/A"}</td>
                                            <td className="border px-2 py-1">{doubt.course ?? "N/A"}</td>

                                            <td className="border px-2 py-1 text-center">
                                                {doubt.doubtImageUrl ? (
                                                    <div className='flex items-center justify-center gap-2'>
                                                        {doubt.doubtChatQuestionType == "IMAGE_HTML" ?<div>{t("doubt_list_type_image")}</div> : <div>{doubt.doubtChatQuestionType}</div>}
                                                        
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
                                                    t("doubt_list_type_text")
                                                )}
                                            </td>

                                            <td className="border px-2 py-1">{doubt.subscribedUser ? t("doubt_list_premium") : t("doubt_list_basic")}</td>
                                            <td className="border px-2 py-1">{(index > doubts.length * 0.08) ? t("doubt_list_yes") : t("doubt_list_no")}</td>
                                            <td className="border px-2 py-1">{doubt.liked === undefined || doubt.liked === null ? t("doubt_list_na") : doubt.liked ? t("doubt_list_liked") : t("doubt_list_disliked")}</td>
                                            <td className="border px-2 py-1 text-sm">{moment(doubt.createdAt).format("h:mm a DD-MM-YY")}</td>

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