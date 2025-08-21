import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop, { PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { MdClose } from 'react-icons/md'

const ImageCropModal = ({ imageSrc, onClose, onSave }) => {
  const [crop, setCrop] = useState({ unit: '%', width: 50, height: 20, x: 10, y: 10 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const imgRef = useRef(null);

  const handleImageLoaded = useCallback((img) => {
    console.log(img);

    imgRef.current = img;
  }, []);

  const getCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      console.error('Invalid crop dimensions or image not loaded');
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const { x, y, width, height } = completedCrop;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      imgRef.current,
      x * scaleX,
      y * scaleY,
      width * scaleX,
      height * scaleY,
      0,
      0,
      width,
      height
    );

    const croppedUrl = canvas.toDataURL('image/jpeg');
    setCroppedImageUrl(croppedUrl);
  }, [completedCrop]);

  useEffect(() => {
    if (completedCrop) {
      getCroppedImage();
    }
  }, [completedCrop, getCroppedImage]);

  const handleSave = () => {
    if (croppedImageUrl) {
      console.log('Saving cropped image:', croppedImageUrl);
      onSave(croppedImageUrl);
      onClose();
    } else {
      console.error('No cropped image available');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 shadow-lg relative w-screen h-screen">
        <div className="flex items-center justify-between mb-4 ">
          <button
            onClick={onClose}
            className="text-2xl text-gray-700"
          >
            <MdClose />
          </button>
          <div className="flex justify-between items-center">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg"
              disabled={!completedCrop}
            >
              Crop
            </button>
          </div>
        </div>

        {imageSrc && (
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            // aspect={1}
            ruleOfThirds
            keepSelection
            className='h-full w-full flex items-center justify-center bg-white'
          >
            <img
              src={imageSrc}
              alt="To be cropped"
              ref={imgRef}
              className='crop-img h-screen w-screen object-contain'
              onLoad={(e) => handleImageLoaded(e.target)}
            />
          </ReactCrop>
        )}
      </div>
    </div>
  );
};

export default ImageCropModal;
