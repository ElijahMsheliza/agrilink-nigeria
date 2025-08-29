'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon, GripVertical } from 'lucide-react';
import { 
  ImageFile, 
  processImages, 
  removeImage, 
  reorderImages, 
  validateImageLimits,
  formatFileSize 
} from '@/lib/image-utils';

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  onNext, 
  onBack, 
  onSaveDraft 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const newImages = await processImages(acceptedFiles);
      const combinedImages = [...images, ...newImages];
      
      // Validate limits
      const validation = validateImageLimits(combinedImages);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      
      onImagesChange(combinedImages);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 8,
    disabled: isUploading
  });

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = removeImage(images, imageId);
    onImagesChange(updatedImages);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = reorderImages(images, fromIndex, toIndex);
    onImagesChange(updatedImages);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onDrop(Array.from(files));
    }
  };

  const totalSize = (images || []).reduce((total, img) => total + (img.compressed?.size || img.file.size), 0);
  const hasErrors = (images || []).some(img => img.error);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
        <p className="text-gray-600 mt-2">Upload photos of your product (max 8 images)</p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive || dragActive
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-green-600 hover:text-green-700 font-medium"
            disabled={isUploading}
          >
            browse files
          </button>
        </p>
        
        <div className="text-xs text-gray-400 space-y-1">
          <p>Supported formats: JPEG, PNG, WebP</p>
          <p>Maximum file size: 5MB per image</p>
          <p>Maximum total size: 25MB</p>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Processing images...</span>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {(images || []).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Product Images ({(images || []).length}/8)
            </h3>
            <div className="text-sm text-gray-500">
              Total size: {formatFileSize(totalSize)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(images || []).map((image, index) => (
              <div
                key={image.id}
                className="relative group bg-gray-100 rounded-lg overflow-hidden"
              >
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white bg-black bg-opacity-50 rounded cursor-move" />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Image Preview */}
                {image.error ? (
                  <div className="aspect-square flex items-center justify-center bg-red-50">
                    <div className="text-center p-4">
                      <ImageIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <p className="text-xs text-red-600">{image.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square relative">
                    <img
                      src={image.preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Upload Progress */}
                    {image.uploadProgress !== undefined && image.uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white text-sm mb-2">
                            {image.uploadProgress}%
                          </div>
                          <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${image.uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Info */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.compressed?.size || image.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Image Guidelines */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Photo Guidelines:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Take clear, well-lit photos of your product</li>
              <li>• Show different angles and close-ups of quality</li>
              <li>• Include photos of packaging if applicable</li>
              <li>• Avoid blurry or dark images</li>
              <li>• First image will be the main product photo</li>
            </ul>
          </div>
        </div>
      )}

      {/* Error Display */}
      {hasErrors && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">Some images have errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {images.filter(img => img.error).map((image) => (
              <li key={image.id}>• {image.file.name}: {image.error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={(images || []).length === 0 || hasErrors}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next: Review & Publish
        </button>
      </div>
    </div>
  );
}
