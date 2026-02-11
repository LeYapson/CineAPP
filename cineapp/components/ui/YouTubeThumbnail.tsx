'use client';

import Image from 'next/image';
import { useState } from 'react';

interface YouTubeThumbnailProps {
  videoKey: string;
  videoName?: string;
  className?: string;
}

export default function YouTubeThumbnail({ videoKey, videoName, className }: YouTubeThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(
    videoKey ? `https://img.youtube.com/vi/${videoKey}/mqdefault.jpg` : '/placeholder-film.jpg'
  );
  
  const handleError = () => {
    setImgSrc('/placeholder-film.jpg');
  };

  return (
    <Image
      src={imgSrc}
      alt={videoName || 'Bande-annonce YouTube'}
      fill
      sizes="(max-width: 768px) 50vw, 33vw"
      className={className || 'object-cover'}
      onError={handleError}
    />
  );
}
