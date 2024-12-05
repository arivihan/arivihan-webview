import React from "react";
import { MdClose } from "react-icons/md";
import { imageViewUrl } from "../state/instantGuruState";

export const ImageViewModal = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-white p-4 z-20">
            <div className="absolute top-4 right-4 text-4xl bg-white rounded-full p-2" onClick={()=>{imageViewUrl.value = null}}>
                <MdClose />
            </div>

            <div className="flex items-center justify-center w-full h-full">
                <img src={imageViewUrl.value} alt="" className="w-full" />
            </div>
        </div>
    )
}