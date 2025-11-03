import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCw, Move } from 'lucide-react';
import type { TeamMember } from '../../models/types';

interface AvatarEditorProps {
  member: TeamMember;
  onSave: (cropData: any) => void;
  onClose: () => void;
}

/**
 * Avatar Editor - Image cropping and editing tool
 * Follows Single Responsibility Principle
 */
function AvatarEditor({ member, onSave, onClose }: AvatarEditorProps) {
  const [image, setImage] = useState<string>(member.avatar);
  const [scale, setScale] = useState(member.avatarCrop?.scale || 1);
  const [position, setPosition] = useState({ x: member.avatarCrop?.x || 0, y: member.avatarCrop?.y || 0 });
  const [rotation, setRotation] = useState(member.avatarCrop?.rotation || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const cropData = {
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      scale,
      rotation,
    };
    onSave(cropData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bolf-black/90 backdrop-blur-sm"
        />

        {/* Editor Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-bolf-black border border-bolf-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-bolf-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-bolf-white">Avatar Düzenle</h3>
              <p className="text-bolf-gray text-sm mt-1">{member.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bolf-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-bolf-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Image Upload */}
            <div>
              <label className="block text-bolf-white font-medium mb-2">Yeni Fotoğraf Yükle</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageLoad}
                className="w-full px-4 py-2 bg-bolf-black border border-bolf-white/20 rounded-lg text-bolf-white cursor-pointer hover:border-bolf-neon-blue/50 transition-colors"
              />
            </div>

            {/* Image Editor */}
            <div className="bg-bolf-black/50 rounded-lg p-6 border border-bolf-white/10">
              <div
                ref={containerRef}
                className="relative w-full h-96 bg-bolf-black/50 rounded-lg overflow-hidden border-2 border-bolf-white/20"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Crop Area Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-dashed border-bolf-neon-blue rounded-full" />
                </div>

                {/* Image */}
                <img
                  ref={imageRef}
                  src={image}
                  alt={member.name}
                  className="absolute cursor-move"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                    maxWidth: 'none',
                    height: 'auto',
                  }}
                  onMouseDown={handleMouseDown}
                  draggable={false}
                />
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                {/* Scale */}
                <div>
                  <label className="flex items-center space-x-2 text-bolf-white font-medium mb-2">
                    <span className="w-4 h-4">🔍</span>
                    <span>Yakınlaştırma ({Math.round(scale * 100)}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <label className="flex items-center space-x-2 text-bolf-white font-medium mb-2">
                    <RotateCw className="w-4 h-4" />
                    <span>Döndürme ({Math.round(rotation)}°)</span>
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Position Reset */}
                <button
                  onClick={() => {
                    setPosition({ x: 0, y: 0 });
                    setScale(1);
                    setRotation(0);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-bolf-gray/20 hover:bg-bolf-gray/30 text-bolf-white rounded-lg transition-colors"
                >
                  <Move className="w-4 h-4" />
                  <span>Konumu Sıfırla</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-bolf-white/10 flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-bolf-gray/20 hover:bg-bolf-gray/30 text-bolf-white rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-bolf-neon-blue hover:bg-bolf-neon-blue/80 text-bolf-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Kaydet</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AvatarEditor;

