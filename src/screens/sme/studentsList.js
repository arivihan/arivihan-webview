import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsChatLeftText, BsEye } from 'react-icons/bs';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { smeCurrentViewCompoent, smeDoubtListUserId, smeDoubtListUserName } from '../../state/smeState';
import { ThreeCircles } from 'react-loader-spinner';
import SMEThemeWrapper from './smeThemeWrapper';
import { useNavigate } from 'react-router-dom';


export default function StudentListScreen() {
    const [students, setStudents] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();



    const handleSearch = (e) => {
        if (e.key === "Enter") {
            getStudents();
        }
    }


    const getStudents = () => {
        setIsLoading(true);
        smeCustomRequest(`/secure/sme/students?search=${searchText}`, "GET").then((res) => {
            setStudents(res);
            setIsLoading(false);
        })
    }


    const handleUserDoubtList = (id, name) => {
        smeDoubtListUserId.value = id;
        smeDoubtListUserName.value = name;
        smeCurrentViewCompoent.value = "doubtlist";
        navigate("/sme-doubt-list/" + id);

    }

    useEffect(() => {
        getStudents();
    }, [])

    return (
        <SMEThemeWrapper>

            <div className="h-full w-full flex flex-col">
                <div className="py-1 flex items-center sticky top-0 bg-white z-10">
                    <h2 className='font-bold'>Students With Doubts</h2>
                    <div className="ml-auto flex items-center">
                        <input type="text" className='border focus:outline-none focus:border-primary px-2 text-sm py-2 rounded w-72' placeholder='Search by name, phone number...' onInput={(e) => { setSearchText(e.target.value) }} onKeyDown={handleSearch} />
                        <div className="px-2 py-2 bg-primary/10 border border-primary ml-2 rounded cursor-pointer text-primary active:bg-primary active:text-white" onClick={getStudents}><BiSearch /></div>
                    </div>
                </div>
                <div className="h-5/6 ">
                    <table className='border w-full sticky top-0'>
                        <thead className='bg-primary text-white sticky top-0'>
                            <th className='border text-start px-2 py-1'>S.No.</th>
                            <th className='border text-start px-2 py-1'>Name</th>
                            <th className='border text-start px-2 py-1'>Class</th>
                            <th className='border text-start px-2 py-1'>Phone Number</th>
                            <th className='border text-start px-2 py-1'>Doubts Sessions</th>
                            <th className='border text-start px-2 py-1'>Actions</th>
                        </thead>
                        <tbody>
                            {
                                isLoading
                                    ?

                                    <tr>
                                        <td colSpan={6} class="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full flex items-center justify-center h-[58vh]">
                                                <ThreeCircles color='#26c6da' />
                                            </div>
                                        </td>
                                    </tr>

                                    :

                                    students === null || students.length === 0
                                        ?
                                        <tr>
                                            <td colSpan={6} class="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full flex flex-col items-center justify-center h-[58vh]">
                                                    <img src={require("../../assets/chat.png")} className='h-40 w-80 object-contain' />
                                                    <p className='text-sm text-gray-500'>Oops! no any result found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                        :
                                        students.map((stu, index) => {
                                            return (
                                                <tr>
                                                    <td className="border px-2 py-1">{index + 1}</td>
                                                    <td className="border px-2 py-1">{stu.name}</td>
                                                    <td className="border px-2 py-1">{stu.className}</td>
                                                    <td className="border px-2 py-1">{stu.phoneNumber}</td>
                                                    <td className="border px-2 py-1">{stu.doubtSessions}</td>
                                                    <td className="border px-2 py-1 flex items-center">

                                                        <div className="border border-primary bg-primary/10 rounded p-1 cursor-pointer text-primary hover:text-white hover:bg-primary transition" onClick={() => { handleUserDoubtList(stu.userId, stu.name) }}>
                                                            <BsChatLeftText />
                                                        </div>
                                                    </td>
                                                </tr>

                                            )
                                        })
                            }

                        </tbody>
                    </table>
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