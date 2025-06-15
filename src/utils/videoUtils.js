/**
 * Video utility functions for thumbnail generation and validation
 */

export const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 1 second or 10% of duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = seekTime;
    });
    
    video.addEventListener('seeked', () => {
      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob);
            resolve({
              thumbnailUrl,
              duration: video.duration,
              width: video.videoWidth,
              height: video.videoHeight
            });
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        reject(error);
      }
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });
    
    // Load video file
    video.src = URL.createObjectURL(file);
    video.load();
  });
};

export const validateVideoFile = (file) => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  const maxDuration = 300; // 5 minutes
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid video file (MP4, WebM, OGG, or MOV)');
  }
  
  if (file.size > maxSize) {
    throw new Error('Video file must be less than 50MB');
  }
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.addEventListener('loadedmetadata', () => {
      if (video.duration > maxDuration) {
        reject(new Error('Video must be less than 5 minutes long'));
      } else {
        resolve(true);
      }
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Invalid video file'));
    });
    
    video.src = URL.createObjectURL(file);
    video.load();
  });
};

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};