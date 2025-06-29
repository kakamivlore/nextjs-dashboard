'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove?: (url: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
      onChange((result.info as { secure_url: string }).secure_url);
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <Image src={url} alt="Uploaded" fill className="object-cover rounded-md" />
          </div>
        ))}
      </div>

      <CldUploadWidget onSuccess={handleUpload} uploadPreset="nextjs-dashboard">
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={disabled}
          >
            Upload Image
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
