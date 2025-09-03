import React from 'react'

const Only_Text_Discription = ({response_data}) => {
  return (
         <div className="mt-3">
  <p className="text-sm text-gray-600 mb-2">
    Here are list of questions related to{" "}
    <span className="font-bold">{response_data?.subject}</span>:
  </p>

  {/* HTML render karega jo backend se aaya hai */}
  <div
    className="list-disc pl-5 space-y-1 text-sm text-gray-700"
    dangerouslySetInnerHTML={{ __html: response_data?.descriptionHtml }}
  />
</div>
  )
}

export default Only_Text_Discription
