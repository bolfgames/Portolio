import { useEffect, useRef, useState, useCallback } from 'react';
import { settingsService } from '../../services/settingsService';

/**
 * BOLF Keyboard - Orijinal CodePen implementasyonu
 * B O L F tuşları ve Shift tetikleyici
 */
function BOLFKeyboard() {
  const [pressed, setPressed] = useState<Record<string, boolean>>({});
  const [animating, setAnimating] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const keypadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio('https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3');
    audio.volume = 0.2;
    audio.preload = 'auto';
    // Audio'yu önceden yükle ve hazırla
    audio.load();
    audioRef.current = audio;
    
    // Audio yüklendiğinde hazır olduğundan emin ol
    audio.addEventListener('canplaythrough', () => {
      // Audio hazır
    }, { once: true });
  }, []);

  const click = useCallback(() => {
    if (!audioRef.current) return;
    // Daha hızlı yanıt için önce pause ve currentTime sıfırla
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    // play()'i hemen çağır
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Sessiz oynatma hatası göz ardı edilir
      });
    }
  }, []);

  const pressKey = useCallback((id: string) => {
    setPressed((p) => ({ ...p, [id]: true }));
    click();
    setTimeout(() => setPressed((p) => ({ ...p, [id]: false })), 150);
  }, [click]);

  // Shift tuşuna basıldığında → B,O,L,F sıralı animasyon (input'a yazma yok)
  const handleShiftKeyPress = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    const order = ['two', 'three', 'four', 'five'];
    pressKey('one');
    
    // Sırayla tuşlara bas (sadece animasyon, input'a yazma yok)
    order.forEach((id, idx) => {
      setTimeout(() => {
        pressKey(id);
      }, (idx + 1) * 140);
    });
    
    setTimeout(() => setAnimating(false), order.length * 140 + 200);
  }, [animating, pressKey]);

  // Gerçek klavye inputu dinle (herhangi bir yerde)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyLower = e.key.toLowerCase();
      
      // Shift tuşuna basıldığında tüm BOLF animasyonu tetiklenir (input'a yazma yok)
      // Sadece Shift tuşuna basıldığında (başka tuş kombinasyonu yok)
      if (e.key === 'Shift' || e.key === 'ShiftLeft' || e.key === 'ShiftRight') {
        // Shift + başka tuş kombinasyonlarını kontrol et
        if (!e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Biraz gecikme ile kontrol et (başka tuş basılı mı diye)
          setTimeout(() => {
            // Eğer hala sadece Shift basılıysa (başka tuş basılmadıysa)
            handleShiftKeyPress();
          }, 50);
        }
        return;
      }

      // B, O, L, F tuşlarına basıldığında (herhangi bir yerde, Shift olmadan)
      const keyMap: Record<string, string> = {
        'b': 'two',
        'o': 'three',
        'l': 'four',
        'f': 'five',
      };

      if (keyMap[keyLower] && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const keyId = keyMap[keyLower];
        pressKey(keyId);
        // Hidden input'a yaz
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value += e.key.toUpperCase();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setPressed((p) => ({ ...p, one: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleShiftKeyPress, pressKey]);

  // Keypad'e tıklayınca focus al (klavye inputu için)
  const handleKeypadClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Tuş içerikleri (id → label)
  const keyLabels: Record<string, string> = {
    one: '⇧',
    two: 'B',
    three: 'O',
    four: 'L',
    five: 'F',
  };

  // Tuş konumları (orijinal CodePen)
  const positions: Record<string, React.CSSProperties> = {
    one: { left: '13.5%', bottom: '57.2%' },
    two: { left: '25.8%', bottom: '48.5%' },
    three: { left: '38%', bottom: '39.2%' },
    four: { left: '50.4%', bottom: '30.2%' },
    five: { left: '62.7%', bottom: '21%' },
  };

  const handleClick = (id: string) => {
    if (id === 'one') {
      handleShiftKeyPress();
      return;
    }
    if (animating) return;
    pressKey(id);
    // Hidden input'a yaz
    const letter = keyLabels[id];
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value += letter;
    }
  };

  return (
    <div className="relative w-full flex justify-center items-center pt-4 pb-4 mb-16 md:mb-20">
      {/* Hidden input - klavye inputu için (görünmez) */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="sr-only"
        tabIndex={0}
      />

      {/* Klavye */}
      <div
        ref={keypadRef}
        className="keypad relative"
        style={{ 
          aspectRatio: '400 / 310', 
          width: 'clamp(280px, 45vw, 500px)',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleKeypadClick}
        tabIndex={-1}
      >
        <style>{`
          :root {
            --travel: 20;
          }
          
          .keypad {
            position: relative;
            display: flex;
            place-items: center;
            transition-property: translate, transform;
            transition-duration: 0.26s;
            transition-timing-function: ease-out;
            transform-style: preserve-3d;
          }
          
          .key {
            transform-style: preserve-3d;
            border: 0;
            background: transparent;
            padding: 0;
            cursor: pointer;
            outline: none;
          }
          
          .key[data-pressed='true'],
          .key:active {
            --travel: 20;
          }
          
          .key[data-pressed='true'] .key__content,
          .key:active .key__content {
            translate: 0 calc(var(--travel) * 1%);
          }
          
          #one {
            left: 13.5%;
            bottom: 57.2%;
          }
          
          #two {
            left: 25.8%;
            bottom: 48.5%;
          }
          
          #three {
            left: 38%;
            bottom: 39.2%;
          }
          
          #four {
            left: 50.4%;
            bottom: 30.2%;
          }
          
          #five {
            left: 62.7%;
            bottom: 21%;
          }
          
          .key__content {
            width: 100%;
            display: inline-block;
            height: 100%;
            transition: translate 0.12s ease-out;
            container-type: inline-size;
          }
          
          .key__text {
            width: 52%;
            height: 62%;
            position: absolute;
            font-size: 18cqi;
            z-index: 21;
            top: 5%;
            left: 0;
            mix-blend-mode: normal;
            color: hsl(0 0% 4%);
            translate: 45% -16%;
            transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
            display: grid;
            place-items: center;
            font-weight: bold;
          }
          
          .keypad__single {
            position: absolute;
            width: 21%;
            height: 24%;
          }
          
          .key__mask {
            width: 100%;
            height: 100%;
            display: inline-block;
          }
          
          .key__content img {
            filter: hue-rotate(calc(var(--hue, 0) * 1deg))
              saturate(var(--saturate, 1)) 
              brightness(var(--brightness, 1));
            pointer-events: none;
            top: 0;
            opacity: 1;
            width: 96%;
            position: absolute;
            left: 50%;
            translate: -50% 1%;
          }
          
          .keypad__base {
            position: absolute;
            bottom: 0;
            width: 100%;
          }
          
          .keypad__base img {
            width: 100%;
          }
          
          /* Shift tuşu (one) - orijinal renk tonları */
          #one .key__text {
            color: #fff;
            font-size: 22cqi;
          }
          
          #one .key__content img {
            --saturate: 0;
            --brightness: 0.6;
          }
          
          /* Diğer tuşlar (two, three, four, five) - orijinal renk tonları */
          #two .key__content img,
          #three .key__content img,
          #four .key__content img,
          #five .key__content img {
            --brightness: 2;
            --saturate: 0;
          }
          
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        `}</style>
        
        {/* Base image */}
        <div className="keypad__base absolute bottom-0 w-full">
          <img src="https://assets.codepen.io/605876/ai-base.png?format=auto&quality=86" alt="" className="w-full" />
        </div>

        {(['one', 'two', 'three', 'four', 'five'] as const).map((id) => (
          <button
            key={id}
            id={id}
            className="key keypad__single absolute"
            style={{ width: '21%', height: '24%', ...positions[id] }}
            onClick={() => handleClick(id)}
            data-pressed={pressed[id] ? 'true' : 'false'}
          >
            <span className="key__mask inline-block w-full h-full">
              <span className="key__content inline-block w-full h-full">
                <span className="key__text absolute grid place-items-center">
                  <span>{keyLabels[id]}</span>
                </span>
                <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Wrapper component that checks settings before rendering
 * Listens to settings changes for real-time updates
 */
export default function BOLFKeyboardWrapper() {
  const [isEnabled, setIsEnabled] = useState(() => 
    settingsService.isFeatureEnabled('features.keyboardAnimation.enabled')
  );

  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      setIsEnabled(settingsService.isFeatureEnabled('features.keyboardAnimation.enabled'));
    });

    return unsubscribe;
  }, []);

  if (!isEnabled) {
    return null;
  }

  return <BOLFKeyboard />;
}
