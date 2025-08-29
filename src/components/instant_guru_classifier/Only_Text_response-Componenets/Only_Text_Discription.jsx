import React from 'react'

const Only_Text_Discription = ({chat}) => {
  return (
         <div className="mt-3">
  

  {/* HTML render karega jo backend se aaya hai */}
  <div
    className="list-disc pl-5 space-y-1 text-sm text-gray-700"
    dangerouslySetInnerHTML={{ __html: chat.botResponse }}
  />
</div>
  )
}

export default Only_Text_Discription
