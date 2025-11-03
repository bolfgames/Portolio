import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';

interface LanguageSelectorProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

/**
 * Language Selector Component - Dropdown with flag emojis
 * Follows Single Responsibility Principle
 */
function LanguageSelector({ isOpen: externalIsOpen, onToggle }: LanguageSelectorProps = {}) {
  const { language, setLanguage, availableLanguages } = useI18n();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalIsOpen !== undefined && onToggle ? onToggle : setInternalIsOpen;

  const currentLang = availableLanguages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (externalIsOpen !== undefined && onToggle && isOpen) {
          onToggle(); // Use external toggle if provided
        } else if (externalIsOpen === undefined) {
          setInternalIsOpen(false); // Use internal state if no external control
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, externalIsOpen, onToggle]);

  const handleLanguageChange = (langCode: typeof language) => {
    setLanguage(langCode);
    // Close the dropdown after language change
    if (externalIsOpen !== undefined && onToggle && isOpen) {
      onToggle(); // Close using external toggle (only if currently open)
    } else if (externalIsOpen === undefined && internalIsOpen) {
      setInternalIsOpen(false); // Close using internal state (only if currently open)
    }
  };

  const handleToggle = () => {
    if (externalIsOpen !== undefined && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-bolf-white/5 backdrop-blur-md border border-bolf-white/10 hover:bg-bolf-white/10 transition-colors text-bolf-white"
      >
        <span className="text-xl">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm">{currentLang?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-bolf-black/90 backdrop-blur-md border border-bolf-white/10 shadow-xl overflow-hidden z-50"
          >
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-bolf-white/10 transition-colors ${
                  language === lang.code ? 'bg-bolf-neon-blue/20 text-bolf-neon-blue' : 'text-bolf-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;

