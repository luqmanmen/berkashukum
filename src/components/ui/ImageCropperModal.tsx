import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropCompleteAction: (croppedFile: File) => void;
  aspect?: number;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropCompleteAction,
  aspect
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropCompleteAction(croppedFile);
      }
    } catch (e) {
      console.error("Failed to crop image", e);
      alert("Gagal memotong gambar.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-fadeInUp">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-navy">Sesuaikan Gambar</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            minZoom={0.1}
            restrictPosition={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="p-4 bg-gray-50 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={0.1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold text-sm transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-md text-navy-dark bg-gold hover:bg-gold-light font-bold text-sm transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Memproses..." : "Simpan Potongan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
