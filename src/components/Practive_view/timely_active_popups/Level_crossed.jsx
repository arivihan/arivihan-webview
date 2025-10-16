export const LevelCompletionPopup = () => {
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        <div className="flex flex-col w-[80%] bg-pink-500 rounded-2xl items-center justify-center  gap-4 mb-6">
          <div className="w-[100px] h-[100px] bg-[#D0FDFF] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
            <img className='w-[95%] h-[95%] object-cover' src="" alt="" />
          </div>
          <div className="flex-1 w-[100%] items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Level 5 crossed</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Apne basic concepts clear kar liye, ab unhe apply karne ke liye tayyar ho jao 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};