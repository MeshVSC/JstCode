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
          <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="17" cy="8" r="1" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
}