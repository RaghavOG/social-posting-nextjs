'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Loader2Icon, X } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  imagePreviewUrl: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onImageRemove, imagePreviewUrl }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setIsUploading(true);
      onImageUpload(acceptedFiles[0]);
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  return (
    <div className="mt-4">
      {!imagePreviewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <p className="text-gray-500">Drag & drop an image here, or click to select one</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <Image
            src={imagePreviewUrl}
            alt="Preview"
            width={300}
            height={300}
            className="rounded-md object-cover"
          />
          <Button
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

