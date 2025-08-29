// Image utility functions for product management

export interface ImageFile {
  file: File;
  id: string;
  preview: string;
  compressed?: File;
  uploadProgress?: number;
  error?: string;
}

export interface ImageUploadResult {
  url: string;
  thumbnailUrl: string;
  filename: string;
  size: number;
}

// Validate image file
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Only JPEG, PNG, and WebP images are allowed' 
    };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'Image size must be less than 5MB' 
    };
  }

  return { isValid: true };
}

// Compress image using Canvas API
export async function compressImage(
  file: File, 
  maxWidth: number = 1200, 
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Generate thumbnail
export async function generateThumbnail(
  file: File, 
  width: number = 400, 
  height: number = 300
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate dimensions to maintain aspect ratio and fit in thumbnail
      const imgAspect = img.width / img.height;
      const thumbAspect = width / height;
      
      let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
      
      if (imgAspect > thumbAspect) {
        // Image is wider than thumbnail
        drawHeight = height;
        drawWidth = height * imgAspect;
        offsetX = (width - drawWidth) / 2;
      } else {
        // Image is taller than thumbnail
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetY = (height - drawHeight) / 2;
      }

      canvas.width = width;
      canvas.height = height;

      // Fill with white background
      ctx?.fillStyle('white');
      ctx?.fillRect(0, 0, width, height);

      // Draw image centered
      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(thumbnailFile);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        },
        file.type,
        0.8
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Create preview URL for image
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

// Clean up preview URLs to prevent memory leaks
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

// Process multiple images
export async function processImages(files: File[]): Promise<ImageFile[]> {
  const processedImages: ImageFile[] = [];

  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      processedImages.push({
        file,
        id: crypto.randomUUID(),
        preview: '',
        error: validation.error
      });
      continue;
    }

    try {
      const compressed = await compressImage(file);
      const preview = createImagePreview(compressed);
      
      processedImages.push({
        file: compressed,
        id: crypto.randomUUID(),
        preview,
        compressed
      });
    } catch (error) {
      processedImages.push({
        file,
        id: crypto.randomUUID(),
        preview: '',
        error: 'Failed to process image'
      });
    }
  }

  return processedImages;
}

// Reorder images array
export function reorderImages(images: ImageFile[], fromIndex: number, toIndex: number): ImageFile[] {
  const result = [...images];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

// Remove image from array
export function removeImage(images: ImageFile[], imageId: string): ImageFile[] {
  const imageToRemove = images.find(img => img.id === imageId);
  if (imageToRemove?.preview) {
    revokeImagePreview(imageToRemove.preview);
  }
  return images.filter(img => img.id !== imageId);
}

// Get total size of images
export function getTotalImageSize(images: ImageFile[]): number {
  return images.reduce((total, img) => total + (img.compressed?.size || img.file.size), 0);
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if images are within limits
export function validateImageLimits(images: ImageFile[]): { isValid: boolean; error?: string } {
  const maxImages = 8;
  const maxTotalSize = 25 * 1024 * 1024; // 25MB total

  if (images.length > maxImages) {
    return { 
      isValid: false, 
      error: `Maximum ${maxImages} images allowed` 
    };
  }

  const totalSize = getTotalImageSize(images);
  if (totalSize > maxTotalSize) {
    return { 
      isValid: false, 
      error: `Total image size must be less than ${formatFileSize(maxTotalSize)}` 
    };
  }

  return { isValid: true };
}

// Generate unique filename for upload
export function generateImageFilename(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${prefix || 'product'}_${baseName}_${timestamp}_${random}.${extension}`;
}
