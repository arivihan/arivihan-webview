import React from 'react'

const Video_description = ({response_data}) => {
  return (
         <div className="mt-3">
      <p className="text-sm text-gray-600 mb-2">
        Here are key highlights of{" "}
        <span className="font-bold">{response_data?.subject}</span> lecture:
      </p>
    
      {/* Description HTML render  */}
      <div
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: response_data?.descriptionHtml }}
      />
    </div>
  )
}

export default Video_description
