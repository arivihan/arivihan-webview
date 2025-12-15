import React from 'react'

const Video_description = ({ chat }) => {
  return (
    <div className="mt-3">
      <div
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: chat.botResponse }}
      />
    </div>
  )
}

export default Video_description
