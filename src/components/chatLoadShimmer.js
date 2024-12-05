import { ShimmerCircularImage, ShimmerThumbnail } from 'react-shimmer-effects'


export const ChatLoadShimmer = () => {
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex items-end">
                <ShimmerCircularImage size={50} className="mr-2 mb-0" />
                <ShimmerThumbnail height={50} width={260} className="rounded-lg mb-0" />
            </div>
            <div className="ml-auto ">
                <ShimmerThumbnail height={60} width={240} className="rounded-lg mb-0" />
            </div>
            <div className="flex items-end">
                <ShimmerCircularImage size={50} className="mr-2 mb-0" />
                <ShimmerThumbnail height={120} width={260} className="rounded-lg mb-0" />
            </div>
            <div className="ml-auto">
                <ShimmerThumbnail height={60} width={240} className="rounded-lg mb-0" />
            </div>
            <div className="flex items-end">
                <ShimmerCircularImage size={50} className="mr-2 mb-0" />
                <ShimmerThumbnail height={120} width={260} className="rounded-lg mb-0" />
            </div>
            <div className="ml-auto">
                <ShimmerThumbnail height={60} width={240} className="rounded-lg mb-0" />
            </div>
            <div className="flex items-end">
                <ShimmerCircularImage size={50} className="mr-2 mb-0" />
                <ShimmerThumbnail height={120} width={260} className="rounded-lg mb-0" />
            </div>
        </div>
    )
}