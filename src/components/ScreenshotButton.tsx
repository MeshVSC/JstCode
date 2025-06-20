'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

interface ScreenshotButtonProps {
  className?: string;
}

export default function ScreenshotButton({ className = '' }: ScreenshotButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const takeScreenshot = async () => {
    setIsCapturing(true);
    
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Create timestamp for filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot-${timestamp}.png`;

        // Force download to default Downloads folder
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`Screenshot saved to Downloads: ${filename}`);
      }, 'image/png');

    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      onClick={takeScreenshot}
      disabled={isCapturing}
      className={`
        w-8 h-8 flex items-center justify-center rounded transition-colors
        ${isCapturing 
          ? 'bg-[#3e3e42] text-[#858585] cursor-not-allowed'
          : 'hover:bg-[#3e3e42] text-[#cccccc] hover:text-white'
        }
        ${className}
      `}
      title="Take screenshot for AI assistance"
    >
      {isCapturing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" opacity="0.3"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5z"/>
        </svg>
      )}
    </button>
  );
}