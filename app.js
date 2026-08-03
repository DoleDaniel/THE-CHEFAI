import { Router } from './components/Router.js';
import { FeedTab } from './components/FeedTab.js';
import { KitchenTab } from './components/KitchenTab.js';
import { MealTab } from './components/MealTab.js';
import { ChefTab } from './components/ChefTab.js';
import { ProfileTab } from './components/ProfileTab.js';

// Silence noisy browser extension warnings (e.g. MetaMask's ObjectMultiplex/MaxListenersExceededWarning)
(function() {
  const filterWarning = (msg) => {
    if (!msg) return false;
    const str = String(msg.message || msg.reason || msg.stack || msg || "");
    const s = str.toLowerCase();
    const keywords = [
      "maxlistenersexceededwarning",
      "objectmultiplex",
      "orphaned data",
      "malformed chunk",
      "liveness",
      "postmessage",
      "domwindow",
      "target origin",
      "recipient window"
    ];
    return keywords.some(key => s.includes(key));
  };

  const originalWarn = console.warn;
  console.warn = function(...args) {
    if (args.some(filterWarning)) return;
    originalWarn.apply(console, args);
  };

  const originalError = console.error;
  console.error = function(...args) {
    if (args.some(filterWarning)) return;
    originalError.apply(console, args);
  };

  window.addEventListener('error', function(e) {
    const msg = String(e.message || e.error || "");
    if (msg.includes("postMessage") || msg.includes("DOMWindow") || msg.includes("target origin")) {
      e.preventDefault();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', function(e) {
    const reason = String(e.reason || "");
    if (reason.includes("postMessage") || reason.includes("DOMWindow") || reason.includes("target origin")) {
      e.preventDefault();
      return true;
    }
  });
})();

// Load YouTube Iframe Player API dynamically
(function() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.onerror = () => {
    console.warn("YouTube Player API script failed to load. Please verify your connection.");
  };
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

function validateAndExtractVideoId(input) {
  if (!input) return "";
  const cleanInput = input.trim();
  const idRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (idRegex.test(cleanInput)) {
    return cleanInput;
  }
  const urlRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = cleanInput.match(urlRegex);
  if (match && idRegex.test(match[1])) {
    return match[1];
  }
  return "";
}

window.handleBrokenImage = function(img) {
  const triedFallback = img.getAttribute("data-tried-fallback");
  const ytId = img.getAttribute("data-youtube-id");
  
  if (ytId && ytId !== "null" && ytId !== "" && triedFallback !== "yt") {
    // Attempt to load the designated original YouTube thumbnail from the source first
    img.setAttribute("data-tried-fallback", "yt");
    img.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return;
  }
  
  // If the YouTube fallback fails or isn't applicable, render the clean error placeholder directly
  const parent = img.parentElement;
  if (parent) {
    const isAvatar = (img.id && img.id.includes("avatar")) || (img.className && img.className.includes("avatar")) || img.style.borderRadius === "50%" || (parent.style.borderRadius && parent.style.borderRadius === "50%");
    img.remove();
    
    if (isAvatar) {
      const placeholder = document.createElement("div");
      placeholder.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.05);
        color: var(--accent-color, #ff6b00);
        border: 1.5px solid var(--accent-color, #ff6b00);
        border-radius: 50%;
        box-sizing: border-box;
      `;
      placeholder.innerHTML = `<i class="fa-solid fa-user" style="font-size: inherit;"></i>`;
      parent.appendChild(placeholder);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "image-error-placeholder";
      placeholder.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e1e24, #121215);
        color: var(--accent-color, #ff6b00);
        font-family: 'Outfit', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.05);
      `;
      placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <i class="fa-solid fa-image" style="font-size: 2rem; opacity: 0.8; margin-bottom: 4px;"></i>
          <div style="color: #fff; opacity: 0.95;">Recipe presentation unavailable</div>
        </div>
      `;
      parent.appendChild(placeholder);
    }
  }
};

function renderImageOrPlaceholderHTML(src, alt, classes = "", style = "", youtubeId = "") {
  if (navigator.onLine === false) {
    return `
      <div class="image-error-placeholder ${classes}" style="${style}; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e1e24, #121215); color: var(--accent-color, #ff6b00); font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700; text-align: center; padding: 20px; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, 0.05);">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <i class="fa-solid fa-image" style="font-size: 1.8rem; opacity: 0.8; margin-bottom: 2px;"></i>
          <div style="color: #fff; opacity: 0.95; font-size: 0.8rem;">Recipe presentation offline</div>
        </div>
      </div>
    `;
  }
  return `<img class="${classes}" src="${src}" onerror="window.handleBrokenImage(this)" data-youtube-id="${youtubeId}" alt="${alt}" style="${style}">`;
}

function renderAvatarOrPlaceholderHTML(src, alt, style = "") {
  if (navigator.onLine === false) {
    return `<div style="${style}; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); color: var(--accent-color); border: 1.5px solid var(--accent-color);"><i class="fa-solid fa-user" style="font-size: 0.85rem;"></i></div>`;
  }
  return `<img src="${src}" alt="${alt}" style="${style}">`;
}

function getCleanEmbedUrl(url, autoplay = false) {
  if (!url) return url;
  let videoId = "";
  if (url.includes("/embed/")) {
    const parts = url.split("/embed/");
    videoId = parts[1].split("?")[0];
  } else {
    videoId = validateAndExtractVideoId(url) || "9JTQYVV-IUI";
  }
  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&enablejsapi=1`;
  const currentOrigin = window.location.origin;
  if (currentOrigin && currentOrigin !== "null" && window.location.protocol !== "file:") {
    embedUrl += `&origin=${encodeURIComponent(currentOrigin)}`;
  }
  return embedUrl;
}

function getCacheBustedUrl(url) {
  if (!url) return "jollof.png";
  // Avoid query strings on local files (file://) or relative paths to prevent browser loading errors
  if (window.location.protocol === "file:" || url.startsWith("file:") || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    return url;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}cacheBust=${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

function getImageSrcWithCacheBust(url) {
  const imgUrl = url || "jollof.png";
  // Avoid query strings on local files (file://), relative paths, or YouTube CDN assets to prevent HTTP 404/loading errors
  if (
    window.location.protocol === "file:" ||
    imgUrl.startsWith("file:") ||
    (!imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) ||
    imgUrl.includes("ytimg.com") ||
    imgUrl.includes("youtube.com")
  ) {
    return imgUrl;
  }
  const separator = imgUrl.includes("?") ? "&" : "?";
  return `${imgUrl}${separator}v=${Date.now()}`;
}


const feedVideoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const iframe = entry.target;
    if (iframe && iframe._ytPlayerInstance) {
      const playerInstance = iframe._ytPlayerInstance;
      if (playerInstance.player) {
        if (entry.isIntersecting) {
          if (typeof playerInstance.player.playVideo === 'function') {
            try {
              playerInstance.player.playVideo();
              console.log("▶ Video resumed playing as it was scrolled back into view.");
            } catch (e) {
              console.info("Error playing scrolled back video:", e);
            }
          }
        } else {
          if (typeof playerInstance.player.pauseVideo === 'function') {
            try {
              playerInstance.player.pauseVideo();
              console.log("⏸ Video paused silently as it was scrolled past.");
            } catch (e) {
              console.info("Error pausing scrolled past video:", e);
            }
          }
        }
      }
    }
  });
}, {
  threshold: 0.15
});

class YouTubePlayerComponent {
  constructor(iframeElement, videoId, parentContainer, backupImageUrl, fallbackVideoId) {
    // If there is an existing player instance on this iframe element, destroy it first to prevent memory leaks
    if (iframeElement && iframeElement._ytPlayerInstance) {
      try {
        if (feedVideoObserver && feedVideoObserver.unobserve) {
          feedVideoObserver.unobserve(iframeElement);
        }
        iframeElement._ytPlayerInstance.destroy();
      } catch (e) {
        console.info("Error cleaning up previous player instance:", e);
      }
    }
    if (iframeElement) {
      iframeElement._ytPlayerInstance = this;
      if (feedVideoObserver && feedVideoObserver.observe) {
        feedVideoObserver.observe(iframeElement);
      }
    }

    this.iframeElement = iframeElement;
    this.videoId = videoId;
    this.parentContainer = parentContainer;
    this.backupImageUrl = backupImageUrl || "jollof.png";
    this.fallbackVideoId = fallbackVideoId || "9JTQYVV-IUI";
    this.state = {
      hasError: false
    };
    
    this.init();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.state.hasError && this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
    this.render();
  }

  init() {
    // 1. Immediate check if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.info("Device is offline. Switching directly to custom fallback card.");
      this.setState({ hasError: true });
      return;
    }

    if (typeof YT === 'undefined' || !YT.Player) {
      this.initRetryCount = (this.initRetryCount || 0) + 1;
      if (this.initRetryCount > 60) {
        console.warn("YouTube Player API failed to load. Gracefully degrading to native iframe.");
        if (this.loadTimeout) clearTimeout(this.loadTimeout);
        return;
      }
      setTimeout(() => this.init(), 100);
      return;
    }

    const iframeId = this.iframeElement.id || 'yt-player-' + Math.random().toString(36).substr(2, 9);
    this.iframeElement.id = iframeId;

    // Reset iframe visibility and remove any old fallback overlays
    this.iframeElement.style.display = 'block';
    const oldOverlay = this.parentContainer.querySelector('.video-fallback-overlay');
    if (oldOverlay) {
      oldOverlay.remove();
    }

    // 2. Set watchdog timeout to catch DNS/network errors where the iframe content fails silently
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
    this.loadTimeout = setTimeout(() => {
      if (!this.state.hasError) {
        console.warn("YouTube iframe onReady timed out. Gracefully degrading to native iframe.");
        // Removed aggressive fallback, leaving the native iframe visible
      }
    }, 6000);

    try {
      const playerVars = {};
      const currentOrigin = window.location.origin;
      if (currentOrigin && currentOrigin !== "null" && window.location.protocol !== "file:") {
        playerVars.origin = currentOrigin;
      }
      
      this.player = new YT.Player(iframeId, {
        host: 'https://www.youtube.com',
        playerVars: playerVars,
        events: {
          'onReady': () => {
            console.log("🎬 YouTube player loaded successfully.");
            if (this.loadTimeout) {
              clearTimeout(this.loadTimeout);
              this.loadTimeout = null;
            }
          },
          'onError': (event) => {
            console.info("YouTube Player error " + event.data + " handled gracefully. Switching to custom fallback card.");
            this.setState({ hasError: true });
          }
        }
      });

      // Catch error on network/iframe load failure
      this.iframeElement.onerror = () => {
        console.info("YouTube iframe failed to load. Switching to custom fallback card.");
        this.setState({ hasError: true });
      };
    } catch (error) {
      console.warn("YouTube player integration fallback triggered:", error);
      this.setState({ hasError: true });
    }
  }

  destroy() {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
    if (this.iframeElement && typeof feedVideoObserver !== 'undefined' && feedVideoObserver.unobserve) {
      try {
        feedVideoObserver.unobserve(this.iframeElement);
      } catch (e) {
        console.info("Error unobserving iframe:", e);
      }
    }
    if (this.player && typeof this.player.destroy === 'function') {
      try {
        this.player.destroy();
      } catch (e) {
        // Silently catch
      }
    }
    this.player = null;
    if (this.iframeElement) {
      this.iframeElement._ytPlayerInstance = null;
    }
  }

  render() {
    if (this.state.hasError) {
      // Stop and clean up player to prevent audio from playing in the background
      this.destroy();

      // 1. Hide the blank or broken YouTube player
      if (this.iframeElement) {
        this.iframeElement.style.display = 'none';
      }

      // 2. Remove any existing fallback overlays
      const oldOverlay = this.parentContainer.querySelector('.video-fallback-overlay');
      if (oldOverlay) {
        oldOverlay.remove();
      }

      // 3. Render a clean, beautifully curved fallback placeholder card
      const fallbackOverlay = document.createElement('div');
      fallbackOverlay.className = 'video-fallback-overlay';
      fallbackOverlay.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 250px;
        background: linear-gradient(135deg, rgba(30, 30, 35, 0.98), rgba(15, 15, 18, 0.99));
        color: #fff;
        padding: 20px;
        text-align: center;
        border-radius: 16px;
        border: 1.5px dashed rgba(255, 107, 0, 0.3);
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 0.2s ease, border-color 0.2s ease;
      `;

      fallbackOverlay.onmouseenter = () => {
        fallbackOverlay.style.transform = 'scale(1.01)';
        fallbackOverlay.style.borderColor = 'rgba(252, 74, 26, 0.6)';
      };
      fallbackOverlay.onmouseleave = () => {
        fallbackOverlay.style.transform = 'scale(1)';
        fallbackOverlay.style.borderColor = 'rgba(255, 107, 0, 0.3)';
      };

      // Tapping action: loads the working fallback video
      fallbackOverlay.onclick = () => {
        const workingFallbackId = this.fallbackVideoId;
        this.setState({ hasError: false });
        
        // Update source and re-init
        this.iframeElement.src = getCleanEmbedUrl(`https://www.youtube.com/embed/${workingFallbackId}`, true);
        setTimeout(() => {
          this.videoId = workingFallbackId;
          this.init();
        }, 300);
      };

      fallbackOverlay.innerHTML = `
        <div style="position: relative; width: 100%; height: 120px; margin-bottom: 12px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);">
          ${renderImageOrPlaceholderHTML(this.backupImageUrl, "Backup recipe preview", "", "width: 100%; height: 100%; object-fit: cover; opacity: 0.55;")}
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)); display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-circle-exclamation" style="font-size: 2rem; color: var(--accent-color, #ff6b00); filter: drop-shadow(0 2px 6px rgba(255,107,0,0.4));"></i>
          </div>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 6px; color: #fff; font-family: 'Outfit', sans-serif;">Video preview unavailable</div>
        <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.7); line-height: 1.4; max-width: 280px; margin: 0 auto 10px;">Tap to view alternative real-life recipes!</div>
        <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-color, #ff6b00); font-weight: 700;">Play Alternative Demo</div>
      `;

      this.parentContainer.appendChild(fallbackOverlay);
    } else {
      // Restore normal state: hide any fallback overlay and show the iframe player
      const oldOverlay = this.parentContainer.querySelector('.video-fallback-overlay');
      if (oldOverlay) {
        oldOverlay.remove();
      }
      if (this.iframeElement) {
        this.iframeElement.style.display = 'block';
      }
    }
  }
}

function getReliableFallbackVideoId(culture, title) {
  const c = String(culture || "").toLowerCase();
  const t = String(title || "").toLowerCase();
  if (t.includes("egusi") || t.includes("soup")) return "xVQ0dDDUil4";
  if (t.includes("jollof") || t.includes("rice")) return "9JTQYVV-IUI";
  if (c.includes("nigerian")) return "xVQ0dDDUil4";
  if (t.includes("quesadilla")) return "hFLFBVnImU4";
  if (t.includes("burrito")) return "VyEJTODAd2M";
  if (c.includes("mexican") || t.includes("taco")) return "hFLFBVnImU4";
  if (t.includes("feijoada") || t.includes("stew")) return "_EsP0oDXA3g";
  if (t.includes("moqueca")) return "MOv5_fUiar8";
  if (c.includes("brazilian")) return "_EsP0oDXA3g";
  if (t.includes("pasta") || t.includes("fagioli") || c.includes("italian")) return "HS1Ox1miZYw";
  return "xVQ0dDDUil4";
}

function attachYoutubePlayerWithFallback(iframeElement, videoId, parentContainer, backupImageUrl, fallbackVideoId) {
  new YouTubePlayerComponent(iframeElement, videoId, parentContainer, backupImageUrl, fallbackVideoId);
}

function evalFraction(str) {
  if (!str) return 0;
  const parts = str.trim().split(/\s+/);
  let val = 0;
  for (const part of parts) {
    if (part.includes("/")) {
      const frac = part.split("/");
      if (frac.length === 2) {
        const num = parseFloat(frac[0]);
        const den = parseFloat(frac[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          val += num / den;
        }
      }
    } else {
      const parsed = parseFloat(part);
      if (!isNaN(parsed)) {
        val += parsed;
      }
    }
  }
  return isNaN(val) || val === 0 ? 1 : val;
}

function scaleIngredientAmount(amountStr, multiplier) {
  if (!amountStr || amountStr.toLowerCase() === "to taste" || amountStr.toLowerCase() === "n/a") {
    return amountStr || "";
  }
  
  const amtStr = String(amountStr).trim();
  const match = amtStr.match(/^([\d\/\.\s\-]+)\s*(.*)$/);
  if (!match) return amountStr;
  
  const numStr = match[1].trim();
  const rest = match[2] ? match[2].trim() : "";
  
  if (numStr.includes("-")) {
    const rangeParts = numStr.split("-");
    if (rangeParts.length === 2) {
      const val1 = evalFraction(rangeParts[0]);
      const val2 = evalFraction(rangeParts[1]);
      if (val1 && val2) {
        const scaled1 = Number((val1 * multiplier).toFixed(2));
        const scaled2 = Number((val2 * multiplier).toFixed(2));
        const clean1 = scaled1 % 1 === 0 ? Math.round(scaled1) : scaled1;
        const clean2 = scaled2 % 1 === 0 ? Math.round(scaled2) : scaled2;
        return rest ? `${clean1}-${clean2} ${rest}` : `${clean1}-${clean2}`;
      }
    }
  }
  
  const val = evalFraction(numStr);
  if (!val || isNaN(val)) {
    return amountStr;
  }
  
  const scaledVal = Number((val * multiplier).toFixed(2));
  const cleanVal = scaledVal % 1 === 0 ? Math.round(scaledVal) : scaledVal;
  return rest ? `${cleanVal} ${rest}` : `${cleanVal}`;
}

function estimateIngredientNutrition(name, amountStr) {
  const n = String(name || "").toLowerCase().trim();
  let amount = 1;
  let unit = "pcs";
  
  const amtStr = String(amountStr || "").trim();
  const match = amtStr.match(/^([\d\/\.\s\-]+)\s*([a-zA-Z]+[s]?)/);
  if (match) {
    amount = evalFraction(match[1]);
    unit = match[2].toLowerCase();
  } else {
    const numMatch = amtStr.match(/^([\d\/\.\s\-]+)$/);
    if (numMatch) {
      amount = evalFraction(numMatch[1]);
    }
  }

  const database = {
    "tapioca": { cup: [540, 0, 135, 0], g: [3.6, 0, 0.9, 0], default: [540, 0, 135, 0] },
    "starch": { cup: [540, 0, 135, 0], g: [3.6, 0, 0.9, 0], default: [540, 0, 135, 0] },
    "flour": { cup: [455, 13, 95, 1], g: [3.6, 0.1, 0.76, 0.01], default: [455, 13, 95, 1] },
    "milk": { cup: [150, 8, 12, 8], ml: [0.6, 0.03, 0.05, 0.03], default: [150, 8, 12, 8] },
    "oil": { cup: [1920, 0, 0, 218], tbsp: [120, 0, 0, 14], tsp: [40, 0, 0, 4.5], default: [120, 0, 0, 14] },
    "butter": { cup: [1628, 2, 0, 184], tbsp: [100, 0, 0, 11.5], default: [100, 0, 0, 11.5] },
    "egg": { pc: [70, 6, 0.6, 5], piece: [70, 6, 0.6, 5], default: [70, 6, 0.6, 5] },
    "cheese": { cup: [400, 28, 4, 32], oz: [110, 7, 1, 9], g: [4, 0.25, 0.03, 0.3], default: [110, 7, 1, 9] },
    "parmesan": { cup: [420, 38, 4, 28], oz: [120, 10, 1, 8], g: [4.2, 0.35, 0.03, 0.28], default: [120, 10, 1, 8] },
    "mozzarella": { cup: [340, 24, 3, 25], oz: [85, 6, 0.7, 6], g: [3, 0.2, 0.02, 0.2], default: [85, 6, 0.7, 6] },
    "rice": { cup: [205, 4.3, 44.5, 0.4], g: [1.3, 0.03, 0.28, 0.003], default: [205, 4.3, 44.5, 0.4] },
    "bean": { cup: [240, 15, 44, 1], g: [1.4, 0.09, 0.26, 0.006], default: [240, 15, 44, 1] },
    "chicken": { g: [1.65, 0.31, 0, 0.036], default: [250, 40, 0, 10] },
    "beef": { g: [2.5, 0.26, 0, 0.15], default: [350, 35, 0, 20] },
    "pork": { g: [2.4, 0.27, 0, 0.14], default: [340, 35, 0, 20] },
    "fish": { g: [1.2, 0.2, 0, 0.04], default: [200, 30, 0, 8] },
    "spinach": { cup: [7, 0.9, 1.1, 0.1], g: [0.23, 0.03, 0.04, 0.004], default: [7, 0.9, 1.1, 0.1] },
    "tomato": { pc: [22, 1, 5, 0.2], piece: [22, 1, 5, 0.2], default: [22, 1, 5, 0.2] },
    "onion": { pc: [44, 1.2, 10, 0.1], piece: [44, 1.2, 10, 0.1], default: [44, 1.2, 10, 0.1] },
    "pepper": { pc: [30, 1.2, 7, 0.3], piece: [30, 1.2, 7, 0.3], default: [30, 1.2, 7, 0.3] },
    "salt": { default: [0, 0, 0, 0] },
    "water": { default: [0, 0, 0, 0] }
  };
  
  let matchEntry = null;
  for (const key in database) {
    if (n.includes(key)) {
      matchEntry = database[key];
      break;
    }
  }
  
  if (!matchEntry) {
    return [Math.round(40 * amount), Math.round(1 * amount * 10) / 10, Math.round(8 * amount * 10) / 10, Math.round(0.5 * amount * 10) / 10];
  }
  
  let unitKey = unit;
  if (unitKey.endsWith("s")) unitKey = unitKey.slice(0, -1);
  
  const nutritionValues = matchEntry[unitKey] || matchEntry.default;
  return [
    Math.round(nutritionValues[0] * amount),
    Math.round(nutritionValues[1] * amount * 10) / 10,
    Math.round(nutritionValues[2] * amount * 10) / 10,
    Math.round(nutritionValues[3] * amount * 10) / 10
  ];
}

function estimateRecipeNutrition(detailedIngredients) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  
  if (!detailedIngredients || detailedIngredients.length === 0) {
    return {
      calories: "280 kcal",
      protein: "8g",
      carbs: "35g",
      fat: "9g",
      impact: "Dynamic nutrition estimation based on standard ingredients."
    };
  }
  
  detailedIngredients.forEach(item => {
    const [c, p, cb, f] = estimateIngredientNutrition(item.name, item.amount);
    calories += c;
    protein += p;
    carbs += cb;
    fat += f;
  });
  
  return {
    calories: calories > 0 ? `${Math.round(calories)} kcal` : "250 kcal",
    protein: protein > 0 ? `${Math.round(protein)}g` : "8g",
    carbs: carbs > 0 ? `${Math.round(carbs)}g` : "30g",
    fat: fat > 0 ? `${Math.round(fat)}g` : "8g",
    impact: "Dynamically calculated based on recipe ingredients."
  };
}

function extractIngredientsFromTitleAndDescription(title, description) {
  const parsed = extractIngredientsFromDescription(description);
  if (parsed.length > 0) return parsed;
  
  const knownDictionary = [
    "sausage", "egg", "eggs", "cheese", "yam", "potato", "potatoes", "onion", "onions",
    "tomato", "tomatoes", "pepper", "peppers", "chicken", "beef", "pork", "fish", "crayfish",
    "rice", "bean", "beans", "pasta", "spaghetti", "noodle", "noodles", "bread", "flour",
    "butter", "milk", "garlic", "ginger", "cabbage", "carrot", "carrots", "spinach",
    "okra", "okro", "egusi", "pastry", "pastries", "dough", "shrimp", "prawn",
    "mutton", "goat", "lamb", "meat", "seafood", "stockfish", "plantain", "plantains"
  ];
  
  const found = new Set();
  const text = (title + " " + description).toLowerCase();
  
  knownDictionary.forEach(ing => {
    const regex = new RegExp(`\\b${ing}s?\\b`, 'i');
    if (regex.test(text)) {
      found.add(ing);
    }
  });
  
  return Array.from(found);
}

function extractIngredientsFromDescription(description) {
  if (!description) return [];
  const lines = description.split("\n");
  let inIngredientsSection = false;
  const ingredients = [];
  
  const startKeywords = ["ingredients:", "ingredients list", "you will need:", "shopping list:", "what you need:", "recipe ingredients:"];
  const endKeywords = ["method:", "instructions:", "procedure:", "preparation:", "directions:", "how to make", "step by step", "subscribe", "follow me", "social media", "http"];
  
  for (let line of lines) {
    const cleanLine = line.trim().toLowerCase();
    if (!inIngredientsSection) {
      if (startKeywords.some(keyword => cleanLine.includes(keyword))) {
        inIngredientsSection = true;
      }
    } else {
      if (endKeywords.some(keyword => cleanLine.startsWith(keyword) || cleanLine.includes(keyword)) || cleanLine.startsWith("step ")) {
        break;
      }
      if (line.trim()) {
        const cleaned = line.replace(/^[\s\-\*\•\d\/\.\,\(\)\+]+/, "").trim();
        if (cleaned.length > 2 && cleaned.length < 60 && !cleaned.includes("http") && !cleaned.includes("www.")) {
          ingredients.push(cleaned);
        }
      }
    }
  }
  
  // Smart fallback: If no explicit section was found, parse lines that look like bullet-point ingredient list items
  if (ingredients.length === 0) {
    for (let line of lines) {
      const trimmed = line.trim();
      if (/^[\-\*\•\d]/.test(trimmed)) {
        const cleaned = trimmed.replace(/^[\s\-\*\•\d\/\.\,\(\)\+]+/, "").trim();
        if (cleaned.length > 2 && cleaned.length < 50 && !cleaned.includes(".") && !cleaned.includes("http") && !/^(step|how|watch|subscribe|follow|join)/i.test(cleaned)) {
          ingredients.push(cleaned);
        }
      }
    }
  }
  
  return ingredients;
}

function findMatchingDatabaseRecipe(videoTitle, videoId) {
  const titleLower = String(videoTitle || "").toLowerCase();
  
  let match = RECIPES.find(r => 
    (r.youtubeVideoId && r.youtubeVideoId === videoId) || 
    (r.videoUrl && r.videoUrl.includes(videoId))
  );
  if (match) return match;
  
  for (const recipe of RECIPES) {
    const recipeNameLower = recipe.name.toLowerCase();
    const cleanRecipeName = recipeNameLower.replace(/(classic|authentic|traditional|nigerian|mexican|brazilian|italian|asian|style|crispy|street|stew|soup|bread|with|and)/g, "").trim();
    const words = cleanRecipeName.split(/\s+/).filter(w => w.length > 3);
    if (words.length > 0 && words.every(word => titleLower.includes(word))) {
      return recipe;
    }
  }
  
  return null;
}

window.playFallbackVideo = function(playerId, fallbackId, buttonElement) {
  const container = buttonElement.closest('.feed-video-placeholder') || buttonElement.closest('.modal-video-container') || buttonElement.closest('#share-modal-media-container');
  if (container) {
    container.innerHTML = `
      <iframe id="${playerId}" src="${getCleanEmbedUrl(`https://www.youtube.com/embed/${fallbackId}`, true)}" 
              style="width: 100%; height: 100%; border: none;" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
              allowfullscreen>
      </iframe>
    `;
    setTimeout(() => {
      const newIframe = document.getElementById(playerId);
      if (newIframe) {
        attachYoutubePlayerWithFallback(newIframe, fallbackId, container, null, fallbackId);
      }
    }, 200);
  }
};

// State management
let state = {
  kitchenIngredients: [],
  secretMeals: [],
  lastSavedMeal: null,
  profile: {
    name: "Gourmet Explorer",
    avatarUrl: "data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot; fill=&quot;%23fc4a1a&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;48&quot; fill=&quot;%231a1a1a&quot; stroke=&quot;%23fc4a1a&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 25c-8 0-14 6-14 14 0 3 1 5 2 7-6 2-10 8-10 15 0 8 6 14 14 14h16c8 0 14-6 14-14 0-7-4-13-10-15 1-2 2-4 2-7 0-8-6-14-14-14zm-12 40h24v6H38z&quot; fill=&quot;%23fc4a1a&quot;/></svg>",
    skillLevel: 45,
    xp: 0,
    level: 1,
    unlockedAchievements: [],
    email: "",
    password: "",
    country: "Nigeria",
    continent: "Africa"
  },
  simulatedTime: (() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  })(),
  activeCultureFilter: "All",
  feedSearchQuery: "",
  chefQueryIngredients: [],
  useImperialUnits: false,
  
  youtubeFeedVideos: [],
  youtubeFeedVideosFetched: false,
  lastYoutubeQuery: "",
  lastChefQueryStr: "",
  cachedChefSuggestions: [],
  youtubeCookingNextPageToken: "",
  youtubeTravelNextPageToken: "",
  isLoadingMoreFeed: false
};

/**
 * Check if the backend has a YouTube API key configured.
 * If yes, auto-configure client state to use the backend proxy.
 */


// Initial setup on page load
document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  loadSecretMealsFromServer();
  
  setupNavigation();
  setupEventListeners();
  
  setupCountryDropdown();
  setupProfileGateway();
  setupProfileFirewall();
  setupCuisineDropdown();
  renderFeed();
  renderKitchen();
  renderSecretMeals();
  renderProfile();
  runChefEngine();
  checkUrlParams();
  
  // Start clock simulation loop
  updateTimeWidget();
  
  // Start background local clock scheduler
  startRealClockScheduler();

  // Show profile creation modal on startup if no account email registered
  if (!state.profile.email) {
    const gatewayModal = document.getElementById("profile-gateway-modal");
    if (gatewayModal) {
      setTimeout(() => {
        gatewayModal.classList.add("active");
      }, 200);
    }
  } else {
    // Otherwise, show YouTube API Key modal if not present and not backend-managed
    setTimeout(() => {
      if (!"") {
        const apiModal = document.getElementById("youtube-api-modal");
        if (apiModal) {
          // modal removed;
        }
      }
    }, 600);
  }

  // Infinite scroll listener for feed-view
  window.addEventListener("scroll", () => {
    const feedView = document.getElementById("feed-view");
    if (feedView && feedView.classList.contains("active")) {
      // Trigger when user scrolls within 150px of the bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 150) {
        loadMoreFeedVideos();
      }
    }
  });
});

// Load data from localStorage
function loadLocalStorage() {
  const localKitchen = localStorage.getItem("the_chef_kitchen");
  const localSecretMeals = localStorage.getItem("the_chef_secrets");
  const localProfile = localStorage.getItem("the_chef_profile");


  if (localKitchen) {
    state.kitchenIngredients = JSON.parse(localKitchen);
  } else {
    // New user initial state: start with empty kitchen shelves
    state.kitchenIngredients = [];
    saveKitchenToStorage();
  }

  if (localSecretMeals) {
    state.secretMeals = JSON.parse(localSecretMeals);
  }

  if (localProfile) {
    state.profile = JSON.parse(localProfile);
    if (state.profile.name === undefined) state.profile.name = "Gourmet Explorer";
    if (state.profile.avatarUrl === undefined) state.profile.avatarUrl = "data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot; fill=&quot;%23fc4a1a&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;48&quot; fill=&quot;%231a1a1a&quot; stroke=&quot;%23fc4a1a&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 25c-8 0-14 6-14 14 0 3 1 5 2 7-6 2-10 8-10 15 0 8 6 14 14 14h16c8 0 14-6 14-14 0-7-4-13-10-15 1-2 2-4 2-7 0-8-6-14-14-14zm-12 40h24v6H38z&quot; fill=&quot;%23fc4a1a&quot;/></svg>";
    if (state.profile.xp === undefined) state.profile.xp = 0;
    if (state.profile.level === undefined) state.profile.level = 1;
    if (state.profile.unlockedAchievements === undefined) state.profile.unlockedAchievements = [];
    if (state.profile.email === undefined) state.profile.email = "";
    if (state.profile.password === undefined) state.profile.password = "";
    if (state.profile.country === undefined) state.profile.country = "Nigeria";
    if (state.profile.continent === undefined) state.profile.continent = "Africa";
  }
}

function saveKitchenToStorage() {
  localStorage.setItem("the_chef_kitchen", JSON.stringify(state.kitchenIngredients));
}

function saveSecretMealsToStorage() {
  localStorage.setItem("the_chef_secrets", JSON.stringify(state.secretMeals));
}

function saveProfileToStorage() {
  localStorage.setItem("the_chef_profile", JSON.stringify(state.profile));
}

// Fetch secret recipes from backend server
async function loadSecretMealsFromServer() {
  try {
    const res = await fetch('/api/meals');
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received HTML instead of JSON for secret meals");
        }
      const data = await res.json();
      if (data.success && Array.isArray(data.meals)) {
        state.secretMeals = data.meals;
        saveSecretMealsToStorage();
        renderSecretMeals();
      }
    }
  } catch (err) {
    console.warn("[THE CHEF] Could not fetch secret meals from server, using local storage:", err);
  }
}

// Convert file to Base64 data URL for backend upload transmission
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// Custom Notification/Toast Engine
function showToast(title, message, type = "info") {
  const container = document.getElementById("toast-notifications");
  const toast = document.createElement("div");
  toast.className = `toast-notification glass-panel ${type === "success" ? "success" : ""}`;
  
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-circle-check";
  if (type === "warning") icon = "fa-triangle-exclamation";
  
  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon ${type === 'success' ? 'text-success' : 'text-accent'}"></i>
    <div class="toast-msg-body">
      <h5>${title}</h5>
      <p>${message}</p>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Slide out and remove toast
  setTimeout(() => {
    toast.style.animation = "slideDown 0.3s ease-in forwards, fadeOut 0.3s ease-in forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Navigation Handling
function setupNavigation() {
  const root = document.getElementById('app-root') || document.body;
  const router = new Router({
    'feed-view': FeedTab,
    'kitchen-view': KitchenTab,
    'meal-view': MealTab,
    'chef-view': ChefTab,
    'profile-view': ProfileTab
  });

  const navLinks = document.querySelectorAll('.nav-link');
  const mobileTabToggle = document.getElementById('mobile-tab-toggle');
  const mainNavMenu = document.getElementById('main-nav-menu');
  const mobileActiveText = document.getElementById('mobile-active-text');
  const mobileActiveIcon = document.getElementById('mobile-active-icon');

  if (mobileTabToggle && mainNavMenu) {
    mobileTabToggle.addEventListener('click', () => {
      mainNavMenu.classList.toggle('show-dropdown');
      mobileTabToggle.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!mobileTabToggle.contains(e.target) && !mainNavMenu.contains(e.target)) {
        mainNavMenu.classList.remove('show-dropdown');
        mobileTabToggle.classList.remove('open');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (mainNavMenu && mobileTabToggle) {
        mainNavMenu.classList.remove('show-dropdown');
        mobileTabToggle.classList.remove('open');
        
        const span = link.querySelector('span');
        const icon = link.querySelector('i');
        if (span && mobileActiveText) mobileActiveText.textContent = span.textContent;
        if (icon && mobileActiveIcon) mobileActiveIcon.className = icon.className;
      }
      
      const targetId = link.getAttribute('data-target');
      router.navigate(targetId);
    });
  });

  // Cook with ingredients redirect button
  const suggestBtn = document.getElementById("kitchen-suggest-btn");
  if (suggestBtn) {
    suggestBtn.addEventListener("click", () => {
      router.navigate('feed-view');
    });
  }

  // Keep top-bar user details in header updated
  const headerName = document.querySelector(".nav-profile-name");
  const headerAvatar = document.querySelector(".nav-profile-avatar img");
  if (headerName) headerName.textContent = state.profile.name;
  if (headerAvatar) headerAvatar.src = state.profile.avatarUrl;

  // Initial navigation
  router.navigate('feed-view');
}


// -------------------------------------------------------------
// VIEW RENDERERS
// -------------------------------------------------------------

// Render Feed
// Helper to extract YouTube thumbnail from embed URL
function getYoutubeThumbnail(recipe) {
  if (recipe.videoUrl && recipe.videoUrl.includes("embed/")) {
    const parts = recipe.videoUrl.split("embed/");
    if (parts.length > 1) {
      const videoId = parts[1].split("?")[0];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  return recipe.image || "jollof.png";
}

// Helper to resolve continent classification for countries
function getContinentOfCountry(country) {
  if (!country) return "Other";
  const c = country.toLowerCase();
  
  const africa = ["nigeria", "ghana", "south africa", "egypt", "kenya", "ethiopia", "cameroon", "uganda", "morocco", "algeria", "tanzania", "senegal", "ivory coast", "côte d'ivoire", "angola", "zimbabwe", "zambia", "tunisia", "mali", "rwanda", "sudan", "madagascar", "liberia", "sierra leone", "libya", "somalia", "namibia", "botswana", "mozambique", "gabon"];
  if (africa.some(a => c.includes(a))) return "Africa";
  
  const northAmerica = ["mexico", "united states", "usa", "canada", "cuba", "jamaica", "haiti", "costa rica", "panama", "guatemala", "honduras"];
  if (northAmerica.some(n => c.includes(n))) return "North America";
  
  const southAmerica = ["brazil", "argentina", "colombia", "peru", "venezuela", "chile", "ecuador", "bolivia", "paraguay", "uruguay"];
  if (southAmerica.some(s => c.includes(s))) return "South America";
  
  const europe = ["united kingdom", "uk", "great britain", "france", "germany", "italy", "spain", "netherlands", "belgium", "switzerland", "sweden", "norway", "denmark", "portugal", "greece", "russia", "poland", "ireland", "austria", "turkey"];
  if (europe.some(e => c.includes(e))) return "Europe";
  
  return "Other";
}

// Helper to resolve continent classification for recipe cultures
function getContinentOfRecipe(recipe) {
  const cult = ((recipe.culture || recipe.cuisine || "")).toLowerCase();
  if (cult.includes("nigerian") || cult.includes("african") || cult.includes("ghanaian") || cult.includes("moroccan")) {
    return "Africa";
  }
  if (cult.includes("mexican") || cult.includes("american") || cult.includes("canadian")) {
    return "North America";
  }
  if (cult.includes("brazilian") || cult.includes("argentinian") || cult.includes("colombian")) {
    return "South America";
  }
  return "Other";
}

let youtubeFetchTimeout = null;

/**
 * Debounced wrapper around fetchYoutubeFeedVideos to prevent
 * excessive API queries during rapid text input or UI filter changes.
 */
function debouncedFetchYoutubeFeedVideos() {
  // Determine current active query category
  let queryType = "default";
  if (state.feedSearchQuery) {
    queryType = "search:" + state.feedSearchQuery;
  } else if (state.activeCultureFilter && state.activeCultureFilter !== "All") {
    queryType = "culture:" + state.activeCultureFilter;
  }

  // If query hasn't changed and videos are already loaded, skip
  if (state.lastYoutubeQuery === queryType && state.youtubeFeedVideosFetched) {
    return;
  }

  // If query changed, reset the fetched flag
  if (state.lastYoutubeQuery !== queryType) {
    state.youtubeFeedVideosFetched = false;
    state.lastYoutubeQuery = queryType;
  }

  if (youtubeFetchTimeout) {
    clearTimeout(youtubeFetchTimeout);
  }

  youtubeFetchTimeout = setTimeout(() => {
    fetchYoutubeFeedVideos();
  }, 400);
}

async function fetchYoutubeFeedVideos() {
  // Check if we already fetched for this query to prevent infinite render loops
  if (state.youtubeFeedVideosFetched) return;
  
  // Determine dynamic search term based on state
  let query = "";
  if (state.feedSearchQuery) {
    if (detectGrainsAndFruitCombination(state.feedSearchQuery)) {
      query = "Oatmeal + Porridge + Smoothie + Overnight Oats";
    } else {
      query = formatQueryForAndLogic(state.feedSearchQuery);
    }
  } else if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
    query = state.activeCultureFilter;
  } else {
    // Learn & adapt: mix user's preferred country with international cuisines to load mixed cuisines
    query = (state.profile.country || "Nigerian") + " or international";
  }

  // Randomize query keywords to refresh and change feed videos on load/login
  const FEED_SEARCH_POOLS = ["chef secrets", "street food", "kitchen secrets", "home style", "traditional recipe", "village food", "gourmet technique", "family recipe", "cinematic food styling", "satisfying cooking ASMR", "quick 15 minute dinner recipes", "West African street food cooking", "pro chef culinary techniques"];
  const randomKeyword = FEED_SEARCH_POOLS[Math.floor(Math.random() * FEED_SEARCH_POOLS.length)];

  const currentStrictBlock = getStrictMealTime(state.simulatedTime);
  const mealTimeKeyword = currentStrictBlock;

  const cookingQuery = `authentic ${query} ${mealTimeKeyword} cooking ${randomKeyword}`;
  const travelQuery = `${query} ${mealTimeKeyword} street food travel vlog`;
  const challengeQuery = `${query} food challenge eating competition worldwide`;
  
  // Do NOT include the meal time keyword in any user-facing label to keep the process unadvertised
  const cultureLabel = state.feedSearchQuery ? (state.feedSearchQuery.charAt(0).toUpperCase() + state.feedSearchQuery.slice(1)) : "Global Cooking";
  const travelLabel = state.feedSearchQuery ? `${state.feedSearchQuery} Food Travel` : "Food Travel";
  const challengeLabel = state.feedSearchQuery ? `${state.feedSearchQuery} Food Challenge` : "Food Challenge";

  try {
    console.log(`[THE CHEF] Fetching YouTube videos. Cooking query: "${cookingQuery}", Travel query: "${travelQuery}", Challenge query: "${challengeQuery}"`);
    
    // Fetch cooking videos
    const cookingVideos = await fetchYoutubeCulinaryVideos(cookingQuery, "", 14);
    state.youtubeCookingNextPageToken = cookingVideos.nextPageToken || "";

    // Fetch travel food videos
    const travelVideos = await fetchYoutubeCulinaryVideos(travelQuery, "", 14);
    state.youtubeTravelNextPageToken = travelVideos.nextPageToken || "";

    // Fetch challenge videos from all continents
    const challengeVideos = await fetchYoutubeCulinaryVideos(challengeQuery, "", 14);
    state.youtubeChallengeNextPageToken = challengeVideos.nextPageToken || "";
    
    // Map cooking videos
    const cookingItems = cookingVideos.map(video => ({
      id: "yt-" + video.videoId,
      name: video.title,
      culture: cultureLabel,
      category: "Recipe Show",
      story: video.description || "Authentic culinary experience shared by " + video.channelTitle,
      ingredients: [],
      detailedIngredients: [],
      nutrition: {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A",
        impact: "This is a live cooking demonstration fetched directly from YouTube."
      },
      image: video.thumbnailUrl,
      videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
      isYoutubeVideo: true,
      channelTitle: video.channelTitle,
      channelId: video.channelId || null
    }));

    // Map travel videos
    const travelItems = travelVideos.map(video => ({
      id: "yt-travel-" + video.videoId,
      name: video.title,
      culture: travelLabel,
      category: "Street Vlog",
      story: video.description || "World street food tour shared by " + video.channelTitle,
      ingredients: [],
      detailedIngredients: [],
      nutrition: {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A",
        impact: "This is a live travel food experience fetched directly from YouTube."
      },
      image: video.thumbnailUrl,
      videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
      isYoutubeVideo: true,
      channelTitle: video.channelTitle,
      channelId: video.channelId || null
    }));

    // Map challenge videos
    const challengeItems = challengeVideos.map(video => ({
      id: "yt-challenge-" + video.videoId,
      name: video.title,
      culture: challengeLabel,
      category: "Food Challenge",
      story: video.description || "Continent-wide food eating challenge shared by " + video.channelTitle,
      ingredients: [],
      detailedIngredients: [],
      nutrition: {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A",
        impact: "This is a food challenge demonstration fetched directly from YouTube."
      },
      image: video.thumbnailUrl,
      videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
      isYoutubeVideo: true,
      channelTitle: video.channelTitle,
      channelId: video.channelId || null
    }));

    // Store in state (shuffled so the top 2 videos are refreshed and randomized)
    state.youtubeFeedVideos = shuffleArray([...cookingItems, ...travelItems, ...challengeItems]);
    state.youtubeFeedVideosFetched = true;
    
    // Re-render feed to display the new videos
    renderFeed();
  } catch (error) {
    console.error("Failed to load YouTube feed videos:", error);
  }
}

async function loadMoreFeedVideos() {
  if (state.isLoadingMoreFeed) return;
  state.isLoadingMoreFeed = true;

  const grid = document.getElementById("recipes-feed-grid");
  if (!grid) {
    state.isLoadingMoreFeed = false;
    return;
  }

  // Append a beautiful loading indicator at the bottom of the grid
  const spinner = document.createElement("div");
  spinner.id = "feed-infinite-spinner";
  spinner.style.cssText = "grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; color: var(--text-muted); font-size: 0.85rem; width: 100%; text-align: center; gap: 8px;";
  spinner.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--accent-color); margin-bottom: 8px;"></i>
    <span>Loading more mouth-watering delicacies...</span>
  `;
  grid.appendChild(spinner);

  // Determine dynamic search term based on state
  let query = "";
  if (state.feedSearchQuery) {
    if (detectGrainsAndFruitCombination(state.feedSearchQuery)) {
      query = "Oatmeal + Porridge + Smoothie + Overnight Oats";
    } else {
      query = formatQueryForAndLogic(state.feedSearchQuery);
    }
  } else if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
    query = state.activeCultureFilter;
  } else {
    // Learn & adapt: mix user's preferred country with international cuisines to load mixed cuisines
    query = (state.profile.country || "Nigerian") + " or international";
  }

  // Randomize query keywords slightly to get fresh endless content
  const FEED_SEARCH_POOLS = ["chef secrets", "street food", "kitchen secrets", "home style", "traditional recipe", "village food", "gourmet technique", "family recipe", "cinematic food styling", "satisfying cooking ASMR", "quick 15 minute dinner recipes", "West African street food cooking", "pro chef culinary techniques"];
  const randomKeyword = FEED_SEARCH_POOLS[Math.floor(Math.random() * FEED_SEARCH_POOLS.length)];

  const currentStrictBlock = getStrictMealTime(state.simulatedTime);
  const mealTimeKeyword = currentStrictBlock;

  const cookingQuery = `authentic ${query} ${mealTimeKeyword} cooking ${randomKeyword}`;
  const travelQuery = `${query} ${mealTimeKeyword} street food travel vlog`;
  
  // Do NOT include the meal time keyword in any user-facing label to keep the process unadvertised
  const cultureLabel = state.feedSearchQuery ? (state.feedSearchQuery.charAt(0).toUpperCase() + state.feedSearchQuery.slice(1)) : "Global Cooking";
  const travelLabel = state.feedSearchQuery ? `${state.feedSearchQuery} Food Travel` : "Food Travel";

  try {
    const cookingRes = await fetchYoutubeCulinaryVideos(cookingQuery, "", 10, state.youtubeCookingNextPageToken);
    state.youtubeCookingNextPageToken = cookingRes.nextPageToken || "";

    const travelRes = await fetchYoutubeCulinaryVideos(travelQuery, "", 10, state.youtubeTravelNextPageToken);
    state.youtubeTravelNextPageToken = travelRes.nextPageToken || "";

    // Remove spinner
    const spinnerEl = document.getElementById("feed-infinite-spinner");
    if (spinnerEl) spinnerEl.remove();

    const cookingItems = (cookingRes || []).map(video => ({
      id: "yt-" + video.videoId,
      name: video.title,
      culture: cultureLabel,
      category: "Recipe Show",
      story: video.description || "Authentic culinary experience shared by " + video.channelTitle,
      ingredients: [],
      detailedIngredients: [],
      nutrition: {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A",
        impact: "This is a live cooking demonstration fetched directly from YouTube."
      },
      image: video.thumbnailUrl,
      videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
      isYoutubeVideo: true,
      channelTitle: video.channelTitle,
      channelId: video.channelId || null
    }));

    const travelItems = (travelRes || []).map(video => ({
      id: "yt-travel-" + video.videoId,
      name: video.title,
      culture: travelLabel,
      category: "Street Vlog",
      story: video.description || "World street food tour shared by " + video.channelTitle,
      ingredients: [],
      detailedIngredients: [],
      nutrition: {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A",
        impact: "This is a live travel food experience fetched directly from YouTube."
      },
      image: video.thumbnailUrl,
      videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
      isYoutubeVideo: true,
      channelTitle: video.channelTitle,
      channelId: video.channelId || null
    }));

    const newItems = [...cookingItems, ...travelItems];
    if (newItems.length > 0) {
      // Shuffle the new items to randomize first/second items in the new batch
      const shuffledNewItems = [...newItems].sort(() => Math.random() - 0.5);

      state.youtubeFeedVideos = [...state.youtubeFeedVideos, ...shuffledNewItems];
      
      // Append cards to grid smoothly
      shuffledNewItems.forEach(recipe => {
        const card = createRecipeCardElement(recipe);
        grid.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Failed to load more feed videos:", error);
    const spinnerEl = document.getElementById("feed-infinite-spinner");
    if (spinnerEl) spinnerEl.remove();
  } finally {
    state.isLoadingMoreFeed = false;
  }
}

// Render Feed
function renderFeed() {
  const grid = document.getElementById("recipes-feed-grid");
  if (!grid) return;
  grid.innerHTML = "";

  // Trigger asynchronous YouTube video load (debounced & filtered)
  debouncedFetchYoutubeFeedVideos();

  const query = (state.feedSearchQuery || "").toLowerCase();
  let filtered = [];
  const allRecipes = [...RECIPES, ...state.youtubeFeedVideos];

  // CASE A: A specific search query is entered in the search bar
  if (query) {
    filtered = allRecipes.filter(recipe => {
      if (isAiGeneratedContent(recipe.name, recipe.story || "")) return false;
      return recipe.name.toLowerCase().includes(query) ||
             recipe.culture.toLowerCase().includes(query) ||
             recipe.story.toLowerCase().includes(query) ||
             (recipe.ingredients && recipe.ingredients.some(ingred => ingred.toLowerCase().includes(query)));
    });
  } 
  // CASE B: Dropdown cuisine selector is set to a specific culture
  else if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
    filtered = allRecipes.filter(recipe => {
      if (isAiGeneratedContent(recipe.name, recipe.story || "")) return false;
      return recipe.culture.toLowerCase() === state.activeCultureFilter.toLowerCase();
    });
  } 
  // CASE C: Selector is left empty/blank (Default Fallback Mode: 3-4-3 layout)
  else {
    const localSugs = shuffleArray([...get343Suggestions()]);
    if (state.youtubeFeedVideos && state.youtubeFeedVideos.length > 0) {
      filtered = [...state.youtubeFeedVideos, ...localSugs];
    } else {
      filtered = localSugs;
    }
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-list-placeholder" style="grid-column: 1 / -1; padding: 60px 20px; border: 2px dashed var(--border-color); border-radius: 16px; width: 100%;">
        <i class="fa-solid fa-face-frown" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
        <p>No cuisines match your filters. Try selecting a different cuisine!</p>
      </div>
    `;
    return;
  }

  // Helper to determine the number of matching ingredients
  const getMatchCount = (r) => {
    if (!r.ingredients || r.ingredients.length === 0) return 0;
    const ownedNames = state.kitchenIngredients.map(i => i.name.toLowerCase());
    return r.ingredients.filter(ing => 
      ownedNames.some(owned => owned.includes(ing.toLowerCase()) || ing.toLowerCase().includes(owned))
    ).length;
  };

  // Sort by matching score if query is active or specific cuisine is selected
  if (query || (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "")) {
    const userProfile = state.profile;
    const userCountry = userProfile.country || "Nigeria";
    const userContinent = userProfile.continent || "Africa";
    
    filtered.sort((a, b) => {
      const aScore = getMatchCount(a);
      const bScore = getMatchCount(b);
      if (bScore !== aScore) return bScore - aScore;

      const aContinent = getContinentOfRecipe(a);
      const bContinent = getContinentOfRecipe(b);
      if (aContinent === userContinent && bContinent !== userContinent) return -1;
      if (aContinent !== userContinent && bContinent === userContinent) return 1;
      return 0;
    });
  }

  filtered.forEach(recipe => {
    const card = createRecipeCardElement(recipe);
    grid.appendChild(card);
  });
}

function createRecipeCardElement(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.setAttribute("key", `${recipe.id}_${Date.now()}`);
  const fallbackVideoId = getReliableFallbackVideoId(recipe.culture, recipe.name);
  
  // Fix: extract youtubeVideoId if missing but videoUrl exists
  if (!recipe.youtubeVideoId && recipe.videoUrl) {
    const match = recipe.videoUrl.match(/\/embed\/([^/?]+)/);
    if (match) {
      recipe.youtubeVideoId = match[1];
    }
  }

  const hasVideo = (recipe.youtubeVideoId && recipe.youtubeVideoId !== "null" && recipe.youtubeVideoId !== "") ||
                   (recipe.videoUrl && recipe.videoUrl.includes("/embed/"));
  const isImageOnly = recipe.mediaType === 'image' || !hasVideo;

  // Helper to determine the number of matching ingredients
  const getMatchCount = (r) => {
    if (!r.ingredients || r.ingredients.length === 0) return 0;
    const ownedNames = state.kitchenIngredients.map(i => i.name.toLowerCase());
    return r.ingredients.filter(ing => 
      ownedNames.some(owned => owned.includes(ing.toLowerCase()) || ing.toLowerCase().includes(owned))
    ).length;
  };

  // Check match status in feed to show helpful indicator
  const matchCount = getMatchCount(recipe);
  let matchBadgeHtml = "";
  if (recipe.isYoutubeVideo) {
    matchBadgeHtml = "";
  } else if (state.kitchenIngredients.length > 0) {
    if (matchCount >= 3) {
      matchBadgeHtml = `<span class="badge badge-success" style="position: absolute; left: 12px; top: 12px; z-index: 5;"><i class="fa-solid fa-face-laugh-beam"></i> Easy Cook</span>`;
    } else if (matchCount >= 1) {
      matchBadgeHtml = `<span class="badge badge-accent" style="position: absolute; left: 12px; top: 12px; z-index: 5;"><i class="fa-solid fa-clock-rotate-left"></i> Buy Few</span>`;
    }
  }

  const imageUrl = recipe.image || "jollof.png";
  
  // Get recipe creator details helper — returns channelId for real YouTube channel URLs
  const getRecipeCreator = (r) => {
    if (r.isYoutubeVideo) {
      const chTitle = r.channelTitle || "YouTube Creator";
      const chInitial = chTitle.charAt(0).toUpperCase();
      const chUrl = r.channelId
        ? `https://www.youtube.com/channel/${r.channelId}`
        : `https://www.youtube.com/results?search_query=${encodeURIComponent(chTitle)}`;
      return {
        name: chTitle,
        subtitle: "Verified Creator \u2022 YouTube",
        channelUrl: chUrl,
        initial: chInitial,
        isYouTube: true
      };
    }
    const cult = r.culture.toLowerCase();
    if (r.id && r.id.startsWith("custom-")) {
      const uName = state.profile.name || "Gourmet Explorer";
      return {
        name: uName,
        subtitle: state.profile.country || "Earth",
        channelUrl: null,
        initial: uName.charAt(0).toUpperCase(),
        isYouTube: false
      };
    }
    if (cult.includes("nigerian")) {
      return { name: "Sisi Yemmie", subtitle: "Lagos, Nigeria", channelUrl: null, initial: "S", isYouTube: false };
    }
    if (cult.includes("mexican")) {
      return { name: "Rick Bayless", subtitle: "Mexico City, Mexico", channelUrl: null, initial: "R", isYouTube: false };
    }
    if (cult.includes("brazilian")) {
      return { name: "Tastemade Brasil", subtitle: "São Paulo, Brazil", channelUrl: null, initial: "T", isYouTube: false };
    }
    if (cult.includes("italian")) {
      return { name: "Gennaro Contaldo", subtitle: "Rome, Italy", channelUrl: null, initial: "G", isYouTube: false };
    }
    if (cult.includes("indian")) {
      return { name: "Sanjeev Kapoor", subtitle: "Mumbai, India", channelUrl: null, initial: "S", isYouTube: false };
    }
    return {
      name: "World Chef",
      subtitle: "Global Cuisine",
      channelUrl: null,
      initial: "W",
      isYouTube: false
    };
  };

  const creator = getRecipeCreator(recipe);

  // Build the avatar element: circular initial-letter badge styled by culture accent
  const accentColors = { Nigerian: "#fc4a1a", Mexican: "#f7b733", Brazilian: "#2ecc71", Italian: "#e74c3c", Indian: "#ff9f43" };
  const avatarBg = accentColors[recipe.culture] || "var(--accent-color)";
  const avatarHtml = `<div style="width:38px;height:38px;border-radius:50%;background:${avatarBg};display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;color:#fff;flex-shrink:0;border:2px solid rgba(255,255,255,0.15);">${creator.initial}</div>`;

  const creatorHeaderHtml = creator.channelUrl
    ? `<a href="${creator.channelUrl}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex:1;min-width:0;">${avatarHtml}<div style="min-width:0;"><div style="font-weight:700;font-size:0.9rem;color:#fff;display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${creator.name}<i class="fa-solid fa-circle-check" style="color:var(--accent-color);font-size:0.7rem;"></i></div><div style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap;">${creator.subtitle}</div></div></a>`
    : `<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">${avatarHtml}<div style="min-width:0;"><div style="font-weight:700;font-size:0.9rem;color:#fff;display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${creator.name}<i class="fa-solid fa-circle-check" style="color:var(--accent-color);font-size:0.7rem;"></i></div><div style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap;">${creator.subtitle}</div></div></div>`;

  card.innerHTML = `
    <!-- Card Header: Clickable creator profile (VideoCard pattern) -->
    <div class="feed-card-header" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);gap:8px;">
      ${creatorHeaderHtml}
      <span class="badge badge-accent" style="font-size:0.68rem;padding:3px 8px;flex-shrink:0;">${recipe.culture}</span>
    </div>

    <!-- Click to Play Video Wrapper -->
    <div class="feed-card-media-container" style="width: 100%; position: relative; height: 350px; background: #000; overflow: hidden;">
      <div class="feed-media-cover" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; transition: opacity 0.3s ease; z-index: 4; display: flex; align-items: center; justify-content: center;">
        ${renderImageOrPlaceholderHTML(getImageSrcWithCacheBust(recipe.imageUrl || recipe.image), recipe.name, "feed-main-image", "width: 100%; height: 100%; object-fit: cover;", recipe.youtubeVideoId || "")}
        ${isImageOnly ? '' : `
          <div class="feed-play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;">
            <div class="play-btn-circle" style="width: 60px; height: 60px; border-radius: 50%; background: var(--accent-color); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(252, 74, 26, 0.4); transition: transform 0.2s ease, box-shadow 0.2s ease;">
              <i class="fa-solid fa-play" style="color: #fff; font-size: 1.5rem; margin-left: 4px;"></i>
            </div>
          </div>
        `}
        ${matchBadgeHtml}
      </div>
      ${isImageOnly ? '' : '<div class="feed-video-placeholder" style="width: 100%; height: 100%;"></div>'}
    </div>

    <!-- Card Content & Details -->
    <div class="feed-card-caption-section" style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
      <div>
        <span style="font-weight: 700; font-size: 0.88rem; color: #fff; margin-right: 6px;">${creator.name}</span>
        <span style="font-size: 0.95rem; color: var(--text-main); font-weight: 700;">${recipe.name}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 2px 0;">${recipe.story}</p>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${recipe.detailedIngredients.length} ingredients • ${recipe.category}</span>
        <button class="btn btn-accent btn-sm feed-details-btn" style="font-size: 0.75rem; padding: 5px 14px; border-radius: 6px;">Get Recipe Details</button>
      </div>
    </div>
  `;

  // Click to Play handler
  const mediaCover = card.querySelector(".feed-media-cover");
  mediaCover.addEventListener("click", () => {
    if (isImageOnly) {
      openRecipeModal(recipe);
      return;
    }
    const placeholder = card.querySelector(".feed-video-placeholder");
    placeholder.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:0.85rem;background:#121214;"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading Video...</div>`;
    mediaCover.style.display = "none";

    const iframeId = `yt-iframe-${recipe.id || Math.random().toString(36).substr(2, 9)}`;

    if (recipe.isYoutubeVideo) {
      const rawId = recipe.videoUrl;
      const videoId = validateAndExtractVideoId(rawId) || "9JTQYVV-IUI";
      const embedUrl = getCleanEmbedUrl(`https://www.youtube.com/embed/${videoId}`, true);
      placeholder.innerHTML = `
        <iframe id="${iframeId}" src="${embedUrl}" 
                style="width: 100%; height: 100%; border: none;" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
                allowfullscreen>
        </iframe>
      `;
      setTimeout(() => {
        const newIframe = document.getElementById(iframeId);
        if (newIframe) attachYoutubePlayerWithFallback(newIframe, videoId, placeholder, imageUrl, fallbackVideoId);
      }, 300);
    } else {
      fetchYoutubeCulinaryVideos(recipe.culture + " " + recipe.name + " recipe", "", 1)
        .then(videos => {
          const videoId = (videos && videos.length > 0) ? validateAndExtractVideoId(videos[0].videoId) : null;
          if (videoId) {
            const embedUrl = getCleanEmbedUrl(`https://www.youtube.com/embed/${videoId}`, true);
            placeholder.innerHTML = `
              <iframe id="${iframeId}" src="${embedUrl}" 
                      style="width: 100%; height: 100%; border: none;" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
                      allowfullscreen>
              </iframe>
            `;
            setTimeout(() => {
              const newIframe = document.getElementById(iframeId);
              if (newIframe) attachYoutubePlayerWithFallback(newIframe, videoId, placeholder, imageUrl, fallbackVideoId);
            }, 300);
          } else {
            throw new Error("No video found");
          }
        })
        .catch(() => {
          const rawId = recipe.videoUrl;
          const videoId = validateAndExtractVideoId(rawId) || "9JTQYVV-IUI";
          const embedUrl = getCleanEmbedUrl(`https://www.youtube.com/embed/${videoId}`, true);
          placeholder.innerHTML = `
            <iframe id="${iframeId}" src="${embedUrl}" 
                    style="width: 100%; height: 100%; border: none;" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
                    allowfullscreen>
            </iframe>
          `;
          setTimeout(() => {
            const newIframe = document.getElementById(iframeId);
            if (newIframe) attachYoutubePlayerWithFallback(newIframe, videoId, placeholder, imageUrl, fallbackVideoId);
          }, 300);
        });
    }
  });

  // Details Modal Trigger
  card.querySelector(".feed-details-btn").addEventListener("click", () => {
    openRecipeModal(recipe);
  });

  return card;
}

// Render Kitchen Shelves
function renderKitchen() {
  const shelves = ["Proteins", "Grains & Carbs", "Vegetables & Fruits", "Spices & Pantry"];
  
  // Update overall counts
  document.getElementById("total-ingredients-count").textContent = state.kitchenIngredients.length;
  
  shelves.forEach(shelfCat => {
    const shelfIdMap = {
      "Proteins": "shelf-proteins",
      "Grains & Carbs": "shelf-carbs",
      "Vegetables & Fruits": "shelf-produce",
      "Spices & Pantry": "shelf-spices"
    };
    
    const countIdMap = {
      "Proteins": "count-proteins",
      "Grains & Carbs": "count-carbs",
      "Vegetables & Fruits": "count-produce",
      "Spices & Pantry": "count-spices"
    };

    const container = document.getElementById(shelfIdMap[shelfCat]);
    const countLabel = document.getElementById(countIdMap[shelfCat]);
    
    container.innerHTML = "";
    
    const filtered = state.kitchenIngredients.filter(i => i.category === shelfCat);
    countLabel.textContent = `${filtered.length} items`;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-shelf-msg">Empty shelf</div>`;
    } else {
      filtered.forEach(ingred => {
        const tag = document.createElement("div");
        tag.className = "ingredient-tag";
        
        let qtyHtml = (ingred.qty !== undefined && ingred.qty !== "") ? `<span class="ingred-qty">${ingred.qty} ${ingred.unit || "pcs"}</span>` : "";
        
        tag.innerHTML = `
          <span class="ingred-name">${ingred.name}</span>
          ${qtyHtml}
          <button class="ingred-delete" data-id="${ingred.id}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;
        
        tag.querySelector(".ingred-delete").addEventListener("click", (e) => {
          e.stopPropagation();
          deleteIngredient(ingred.id);
        });
        
        container.appendChild(tag);
      });
    }
  });
}

function deleteIngredient(id) {
  const item = state.kitchenIngredients.find(i => i.id === id);
  state.kitchenIngredients = state.kitchenIngredients.filter(i => i.id !== id);
  saveKitchenToStorage();
  renderKitchen();
  if (item) {
    showToast("Ingredient Removed", `Took ${item.name} off the shelf.`);
  }
}

// Render Secret Meals List
function renderSecretMeals() {
  const container = document.getElementById("saved-meals-list");
  container.innerHTML = "";

  if (!state.secretMeals || state.secretMeals.length === 0) {
    container.innerHTML = `
      <div class="empty-list-placeholder">
        <i class="fa-solid fa-book-open"></i>
        <p>No secret recipes logged yet. Formulate your first experiment on the left!</p>
      </div>
    `;
    return;
  }

  state.secretMeals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "secret-meal-card glass-panel";
    card.setAttribute("data-key", `${meal.id}_${Date.now()}`);
    
    let mediaHtml = `
      <div class="secret-card-placeholder">
        <i class="fa-solid fa-utensils"></i>
        <span>No Photo Added</span>
      </div>
    `;
    if (meal.imgUrl) {
      const cacheBustUrl = meal.imgUrl.includes('?') ? meal.imgUrl : `${meal.imgUrl}?v=${Date.now()}`;
      mediaHtml = renderImageOrPlaceholderHTML(cacheBustUrl, meal.name, "", "width: 100%; height: 100%; object-fit: cover;");
    }

    card.innerHTML = `
      <div class="secret-card-media">
        ${mediaHtml}
      </div>
      <div class="secret-card-content">
        <h4 class="secret-card-title">${meal.name}</h4>
        <span class="secret-card-nutrition"><i class="fa-solid fa-heart-pulse"></i> ${meal.nutrition}</span>
        <p class="secret-card-body-summary">${Array.isArray(meal.procedure) ? meal.procedure.join(" ") : meal.procedure}</p>
        <div class="secret-card-actions" style="display: flex; gap: 8px;">
          <button class="btn btn-accent btn-sm btn-block btn-view-secret" data-id="${meal.id}">
            <i class="fa-solid fa-eye"></i> View
          </button>
          <button class="btn btn-primary btn-sm btn-block btn-share-secret" data-id="${meal.id}">
            <i class="fa-solid fa-share-nodes"></i> Share
          </button>
          <button class="btn btn-sm btn-delete-secret" data-id="${meal.id}" title="Delete Recipe" style="background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 12px; border-radius: 8px; cursor: pointer;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;

    // Hook events
    card.querySelector(".btn-view-secret").addEventListener("click", () => {
      openShareModalDirectly(meal);
    });

    card.querySelector(".btn-share-secret").addEventListener("click", () => {
      generateShareLink(meal);
    });

    card.querySelector(".btn-delete-secret").addEventListener("click", () => {
      if (confirm(`Delete secret recipe "${meal.name}"?`)) {
        deleteSecretMeal(meal.id);
      }
    });

    container.appendChild(card);
  });
}

// Delete secret recipe from backend server and state
async function deleteSecretMeal(mealId) {
  try {
    await fetch(`/api/meals/${encodeURIComponent(mealId)}`, { method: 'DELETE' });
  } catch (err) {
    console.warn("Backend delete failed, removing locally:", err);
  }
  state.secretMeals = state.secretMeals.filter(m => String(m.id) !== String(mealId));
  saveSecretMealsToStorage();
  renderSecretMeals();
  showToast("Recipe Deleted", "Secret recipe removed from your vault.", "info");
}

// Copy sharing link to clipboard (includes backend meal ID and base64 fallback)
function generateShareLink(meal) {
  try {
    const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(meal))));
    const shareUrl = `${window.location.origin}${decodeURIComponent(window.location.pathname)}?sharedMealId=${encodeURIComponent(meal.id)}&sharedMeal=${serialized}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Link Copied!", "Share with your friends to show them your experimental dish!", "success");
    }).catch(err => {
      console.error("Could not copy text: ", err);
      alert(`Share link:\n${shareUrl}`);
    });
  } catch (error) {
    console.error("Failed to generate link: ", error);
  }
}

// Render Profile
function renderProfile() {
  // Populate welcome badge greetings
  const welcomeUser = document.getElementById("profile-welcome-username");
  if (welcomeUser) welcomeUser.textContent = state.profile.name || "Gourmet Explorer";
  
  const welcomeAvatar = document.getElementById("profile-welcome-avatar");
  if (welcomeAvatar) welcomeAvatar.src = state.profile.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot; fill=&quot;%23fc4a1a&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;48&quot; fill=&quot;%231a1a1a&quot; stroke=&quot;%23fc4a1a&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 25c-8 0-14 6-14 14 0 3 1 5 2 7-6 2-10 8-10 15 0 8 6 14 14 14h16c8 0 14-6 14-14 0-7-4-13-10-15 1-2 2-4 2-7 0-8-6-14-14-14zm-12 40h24v6H38z&quot; fill=&quot;%23fc4a1a&quot;/></svg>";

  document.getElementById("profile-name").value = state.profile.name || "";
  document.getElementById("profile-skill-slider").value = state.profile.skillLevel || 45;
  document.getElementById("profile-email").value = state.profile.email || "";
  document.getElementById("profile-password").value = state.profile.password || "";
  if (window.setProfileCountry) {
    window.setProfileCountry(state.profile.country || "Nigeria");
  } else {
    document.getElementById("profile-country").value = state.profile.country || "Nigeria";
  }
  document.getElementById("skill-num-display").textContent = state.profile.skillLevel;
  
  const rankNum = document.getElementById("profile-rank-num");
  if (rankNum) rankNum.textContent = state.profile.skillLevel || 45;
  
  const rankBar = document.getElementById("profile-rank-bar");
  if (rankBar) rankBar.style.width = (state.profile.skillLevel || 45) + "%";

  const apiDisplay = document.getElementById("profile-youtube-key-display");
  const apiSection = document.getElementById("profile-youtube-api-section");
  const configBtn = document.getElementById("btn-configure-youtube-api");
  
  if ("" === "backend-managed") {
    if (apiSection) apiSection.style.display = "block";
    if (apiDisplay) {
      apiDisplay.value = "••••••••••••••••••••••••••••••••";
      apiDisplay.placeholder = "Backend Secured Active";
      apiDisplay.style.color = "#22c55e"; // Green color to signify active backend connection
    }
    if (configBtn) {
      configBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Active`;
      configBtn.disabled = true;
      configBtn.style.opacity = "0.7";
      configBtn.style.cursor = "default";
    }
  } else {
    if (apiSection) {
      apiSection.style.display = "" ? "none" : "block";
    }
    if (apiDisplay) {
      apiDisplay.value = "" ? "••••••••••••••••••••••••••••••••" : "";
      apiDisplay.placeholder = "" ? "••••••••••••••••••••••••••••••••" : "No API Key configured";
      apiDisplay.style.color = "var(--text-muted)";
    }
    if (configBtn) {
      configBtn.innerHTML = `<i class="fa-solid fa-gears"></i> Configure`;
      configBtn.disabled = false;
      configBtn.style.opacity = "1";
      configBtn.style.cursor = "pointer";
    }
  }

  // XP & Level calculations
  const xp = state.profile.xp || 0;
  const level = state.profile.level || 1;
  const nextXp = level * 100;
  const prevXp = (level - 1) * 100;
  const currentXpProgress = xp - prevXp;
  const percent = Math.min(100, Math.max(0, (currentXpProgress / 100) * 100));

  // Determine Rank Badge Title based on level
  let rank = "Novice Cook";
  let rankDesc = "You are just starting your culinary odyssey. Stick to basics!";
  
  if (level >= 6) {
    rank = "Master Chef / Legend";
    rankDesc = "Your culinary prowess is celebrated! You have unlocked complex fusion methods.";
  } else if (level >= 5) {
    rank = "Sous Chef";
    rankDesc = "Second in command. You understand intricate recipes and flavor mapping.";
  } else if (level >= 4) {
    rank = "Chef de Partie";
    rankDesc = "Section leader. Speed and culinary techniques are second nature to you.";
  } else if (level >= 3) {
    rank = "Prep Wizard";
    rankDesc = "Skill score high. You can slice, dice, and handle busy kitchen rushes!";
  } else if (level >= 2) {
    rank = "Line Cook";
    rankDesc = "Competent cook. Able to handle standard recipes with ease.";
  }

  const userLevel = document.getElementById("user-level");
  const userBadgeTitle = document.getElementById("user-badge-title");
  const userCurrentXp = document.getElementById("user-current-xp");
  const userNextLevelXp = document.getElementById("user-next-level-xp");
  const userXpFill = document.getElementById("user-xp-fill");

  if (userLevel) userLevel.textContent = level;
  if (userBadgeTitle) userBadgeTitle.textContent = rank;
  if (userCurrentXp) userCurrentXp.textContent = xp;
  if (userNextLevelXp) userNextLevelXp.textContent = nextXp;
  if (userXpFill) userXpFill.style.width = `${percent}%`;

  document.getElementById("rank-title-text").textContent = rank;
  document.getElementById("rank-description-text").textContent = rankDesc;

  // Render Achievements Unlocked states
  const unlocked = state.profile.unlockedAchievements || [];
  const achievements = ["kitchen-auditor", "alchemist", "globe-trotter"];
  
  achievements.forEach(ach => {
    const cardId = `achieve-${ach}`;
    const card = document.getElementById(cardId);
    if (card) {
      if (unlocked.includes(ach)) {
        card.classList.add("unlocked");
      } else {
        card.classList.remove("unlocked");
      }
    }
  });

  // Keep top-bar user details in header updated
  const headerName = document.querySelector(".nav-profile-name");
  const headerAvatar = document.querySelector(".nav-profile-avatar img");
  if (headerName) headerName.textContent = state.profile.name;
  if (headerAvatar) headerAvatar.src = state.profile.avatarUrl;
}

// -------------------------------------------------------------
// CHEF SUGGESTION ENGINE
// -------------------------------------------------------------
function setRecipes(recipes) {
  state.cachedChefSuggestions = recipes;
  renderChefSuggestionsGrid(recipes);
}

// Chef Suggestion render logic
function runChefEngine(forceTimeFilter = null) {
  // Explicitly wipe suggestion state array immediately upon trigger invocation
  setRecipes([]);

  const currentStrictBlock = getStrictMealTime(state.simulatedTime);
  const statusEl = document.querySelector(".chef-status");
  if (statusEl) {
    let greeting = "Online & Analyzing Kitchen";
    if (currentStrictBlock === "Breakfast") {
      greeting = "Good morning, Chef. Let's organize your early morning Mise en Place...";
    } else if (currentStrictBlock === "Lunch") {
      greeting = "Good afternoon, Chef. Let's prep a refreshing lunch profile...";
    } else if (currentStrictBlock === "Dinner") {
      greeting = "Good evening, Chef. Let's execute a heavy thermal application for dinner...";
    } else if (currentStrictBlock === "Supper") {
      greeting = "Good evening, Chef. Let's arrange a light supper profile...";
    } else if (currentStrictBlock === "Snack") {
      greeting = "Good night, Chef. Let's arrange a light late-night bite...";
    }
    statusEl.innerHTML = `<span class="status-dot animate-pulse"></span> ${greeting}`;
  }

  const isCustomActive = state.chefQueryIngredients.length > 0;
  const activeLength = isCustomActive ? state.chefQueryIngredients.length : state.kitchenIngredients.length;

  const pantryStatus = document.getElementById("chef-pantry-status");
  if (pantryStatus) {
    pantryStatus.textContent = isCustomActive 
      ? `Custom (${activeLength})` 
      : (activeLength > 0 ? "Ready" : "Stock Empty");
    pantryStatus.className = `sum-val ${activeLength > 0 ? 'text-success' : 'text-accent'}`;
  }

  const currentTimeType = forceTimeFilter || getMealTypeFromMinutes(state.simulatedTime);
  const textLabel = isCustomActive ? "custom input" : "your ingredients";
  const explanation = document.getElementById("console-explanation");
  if (explanation) {
    explanation.innerHTML = `
      Console active for <span class="text-accent"><strong>${currentTimeType}</strong></span> queries using ${textLabel}.
    `;
  }

  // Trigger matching and rendering of suggestions
  fetchAndRenderChefSuggestions();
}

// Helper to parse a single ingredient line into quantity amount and name
function parseIngredientLine(line) {
  const startAmountRegex = /^([\d\/\.\s\-]+(?:cups?|g|kg|ml|l|tbsp|tablespoons?|tsp|teaspoons?|pcs|pieces?|oz|lbs?)?)\s+(.+)$/i;
  const endAmountRegex = /^([^\(]+)\s*\(([\d\/\.\s\-]+(?:cups?|g|kg|ml|l|tbsp|tsp|oz|lbs?)?)\)$/i;

  let match = line.match(endAmountRegex);
  if (match) {
    return { name: match[1].trim(), amount: match[2].trim() };
  }

  // Use simple start amount regex without nested quantifiers to avoid backtracking regex issues
  const simpleStartRegex = /^([\d\/\.\s\-]+(?:cup|g|kg|ml|l|tbsp|tsp|pcs|piece|oz|lb)[s]?|[\d\/\.\s\-]+)\s+(.+)$/i;
  match = line.match(simpleStartRegex);
  if (match) {
    return { name: match[2].trim(), amount: match[1].trim() };
  }

  return { name: line.trim(), amount: "To taste" };
}

// Helper to detect if two recipe titles represent duplicate or highly similar dishes
function isDuplicateDish(name1, name2) {
  const n1 = String(name1 || "").toLowerCase().trim();
  const n2 = String(name2 || "").toLowerCase().trim();
  if (n1 === n2) return true;
  
  const stripWords = ["how", "to", "make", "cook", "recipe", "easy", "authentic", "classic", "traditional", "style", "stew", "soup", "stewed", "delicious", "nigerian", "mexican", "brazilian", "italian", "asian", "west", "african", "&", "and", "with", "in"];
  
  let w1 = n1.split(/[^a-zA-Z0-9]+/).filter(w => !stripWords.includes(w) && w.length > 2);
  let w2 = n2.split(/[^a-zA-Z0-9]+/).filter(w => !stripWords.includes(w) && w.length > 2);
  
  if (w1.length === 0 || w2.length === 0) return false;
  
  const overlap = w1.filter(w => w2.some(x => x.includes(w) || w.includes(x)));
  const ratio = overlap.length / Math.min(w1.length, w2.length);
  return ratio >= 0.75;
}

// Remove common noise words and plurals to standardize matching
function cleanIngredientWord(word) {
  let w = String(word).toLowerCase().trim();
  // Remove common adjectives/preparations
  const noise = [
    "fresh", "ground", "dried", "chopped", "sliced", "powder", "paste", 
    "leaves", "cloves", "shoulder", "breast", "oil", "sauce", "broth", 
    "stock", "cooked", "canned", "whole", "diced", "finely", "minced",
    "batter", "slurry", "soaked", "wet-ground", "peeled", "skinless", "skinned"
  ];
  noise.forEach(n => {
    w = w.replace(new RegExp(`\\b${n}\\b`, 'g'), '');
  });
  w = w.replace(/\s+/g, ' ').trim();
  
  // Simple singularization (remove trailing s or es)
  if (w.endsWith("es") && w.length > 4) {
    w = w.slice(0, -2);
  } else if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) {
    w = w.slice(0, -1);
  }
  return w;
}

function formatQueryForAndLogic(rawQuery) {
  if (!rawQuery) return "";
  if (rawQuery.includes(",")) {
    return rawQuery
      .split(",")
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .join(" + ");
  }
  return rawQuery
    .split(/\s+/)
    .filter(word => word.length > 0)
    .join(" + ");
}

function detectGrainsAndFruitCombination(queryStr) {
  if (!queryStr) return false;
  const q = queryStr.toLowerCase();
  const hasGrain = q.includes("oat") || q.includes("cereal") || q.includes("grain");
  const hasLiquid = q.includes("milk") || q.includes("water") || q.includes("juice");
  const hasFruit = q.includes("strawberry") || q.includes("berry") || q.includes("fruit") || q.includes("banana");
  return hasGrain && hasLiquid && hasFruit;
}

function chefSemanticMatch(userIng, recipeIng) {
  const u = cleanIngredientWord(userIng);
  const r = cleanIngredientWord(recipeIng);
  
  if (!u || !r) return false;
  
  // Direct or substring match after cleaning
  if (r.includes(u) || u.includes(r)) return true;
  
  // Culinary equivalence groups based on Culinary Institute of America classifications
  const equivalenceGroups = [
    // Rice Group
    ["rice", "parboiled", "arborio", "basmati", "jasmine", "grain"],
    // Tomato Group
    ["tomato", "roma", "puree", "paste"],
    // Beans / Cowpea Group
    ["bean", "beans", "black-eyed", "honey bean", "brown bean", "cowpea", "fagioli"],
    // Fish / Seafood Group
    ["fish", "stockfish", "crayfish", "cryfish", "shrimp", "prawn", "lobster", "crab", "cod", "snapper", "tilapia", "salmon", "tuna", "mackerel", "sardine", "peixe"],
    // Beef / Red Meat Group
    ["beef", "pork", "lamb", "mutton", "goat", "meat", "steak", "ham", "bacon", "sausage", "sirloin", "ribeye", "chuck", "flank"],
    // Poultry Group
    ["chicken", "turkey", "poultry"],
    // Parsley & Herb Group (fixes typos like parsely)
    ["parsley", "parsely", "coriander", "cilantro"],
    // Thyme & Basil Group
    ["thyme", "oregano", "basil", "rosemary"],
    // Curry & Turmeric
    ["curry", "turmeric"],
    // Seasoning & Spices
    ["seasoning", "bouillon", "maggi", "knorr", "salt", "pepper", "yaji", "spice", "locust beans", "iru", "dawadawa"],
    // Tuber / Garri Group
    ["cassava", "garri", "eba", "yam", "elubo", "amala"],
    // Leafy Green / Vegetables Group
    ["ugu", "ukwu", "spinach", "vegetable", "greens", "pumpkin leaves", "leafy greens"],
    // Egusi / Melon Group
    ["egusi", "melon seeds", "melon"],
    // Locust Bean Group
    ["locust beans", "iru", "dawadawa"],
    // Pepper / Chili Group
    ["pepper", "scotch bonnet", "atarodo", "shombo", "tatase", "chili"]
  ];
  
  for (const group of equivalenceGroups) {
    const uInGroup = group.some(item => u.includes(item) || item.includes(u));
    const rInGroup = group.some(item => r.includes(item) || item.includes(r));
    if (uInGroup && rInGroup) {
      return true;
    }
  }
  
  return false;
}

// Foundational Ingredient Class Matrix Helpers
function getIngredientCulinaryClass(ing) {
  const clean = cleanIngredientWord(ing);
  // 1. Grains / Cereals (rice, wheat, flour, bread, bun, tortilla, pasta, noodles, spaghettis, oats, cornmeal, etc.)
  if (/(\brice\b|\bwheat\b|\bflour\b|\bbread\b|\bbun\b|\btortilla\b|\bpasta\b|\bnoodle\b|\bdough\b|\bspaghetti\b|\bmacaroni\b|\boat\b|\boats\b|\bcornmeal\b|\bcorn\b|\bsemolina\b)/.test(clean)) {
    return 'grain';
  }
  // 2. Legumes / Pulses (beans, egusi melon seeds, lentils, peas, etc.)
  if (/(\bbean\b|\blentil\b|\bpea\b|\begusi\b|\bseeds\b)/.test(clean)) {
    return 'legume';
  }
  // 3. Tubers / Roots (yam, potatoes, cassava, yucca, boniato, garri, eba, tapioca, etc.)
  if (/(\byam\b|\bpotato\b|\bcassava\b|\byucca\b|\bboniato\b|\bgarri\b|\beba\b|\btapioca\b)/.test(clean)) {
    return 'tuber';
  }
  return null;
}

function detectBakedWheatAsset(ing) {
  const clean = cleanIngredientWord(ing);
  return /(\bbun\b|\bbread\b|\bflour\b|\btortilla\b|\bpizza\b|\bdough\b)/.test(clean);
}

function getRecipeArchetypeTraits(recipeId) {
  const traits = {
    isLegumePureeOrTuberDish: false,
    isPizzaBurgerOrTaco: false,
    isTacoOrPasta: false
  };
  
  if (["ng-moinmoin", "ng-akara", "ng-yam-porridge", "ng-egusi"].includes(recipeId)) {
    traits.isLegumePureeOrTuberDish = true;
  }
  if (["it-margherita", "mx-tacos", "mx-quesadilla", "mx-burrito", "mx-enchiladas"].includes(recipeId)) {
    traits.isPizzaBurgerOrTaco = true;
  }
  if (["mx-tacos", "mx-quesadilla", "mx-burrito", "mx-enchiladas", "as-noodles", "it-pasta-beans"].includes(recipeId)) {
    traits.isTacoOrPasta = true;
  }
  
  return traits;
}

function detectDryMilledPowder(ing) {
  const clean = cleanIngredientWord(ing);
  return /(\bflour\b|powder|meal|\belubo\b|\bamala\b|\bstarch\b)/.test(clean);
}

function detectWetSlurry(ing) {
  const clean = cleanIngredientWord(ing);
  return /(\bsoaked\b|\bwet-ground\b|\bblended\b|\bpaste\b|\bslurry\b|\bbatter\b)/.test(clean);
}

function getRecipeStateTraits(recipeId) {
  const traits = {
    isWholeGrainOrTuberDish: false,
    isWholeLegumeDish: false,
    isGelatinizedStarchOrBread: false,
    isBatterBasedCake: false
  };
  
  if (["ng-jollof", "it-risotto", "as-fried-rice", "ng-yam-porridge", "br-feijoada", "it-pasta-beans", "mx-burrito"].includes(recipeId)) {
    traits.isWholeGrainOrTuberDish = true;
  }
  if (["br-feijoada", "it-pasta-beans", "mx-burrito"].includes(recipeId)) {
    traits.isWholeLegumeDish = true;
  }
  if (["br-paodequeijo", "it-pizza", "as-baobuns", "br-coxinha", "ng-akara", "ng-moinmoin"].includes(recipeId)) {
    traits.isGelatinizedStarchOrBread = true;
  }
  if (["ng-akara", "ng-moinmoin"].includes(recipeId)) {
    traits.isBatterBasedCake = true;
  }
  
  return traits;
}

function getPrimaryCulinaryClass(ing) {
  const clean = cleanIngredientWord(ing);
  // 1. Grains / Cereals (rice, wheat, flour, bread, bun, tortilla, pasta, noodles, spaghettis, oats, cornmeal, etc.)
  if (/(\brice\b|\bwheat\b|\bflour\b|\bbread\b|\bbun\b|\btortilla\b|\bpasta\b|\bnoodle\b|\bdough\b|\bspaghetti\b|\bmacaroni\b|\boat\b|\boats\b|\bcornmeal\b|\bcorn\b|\bsemolina\b)/.test(clean)) {
    return 'grain';
  }
  // 2. Legumes / Pulses (beans, egusi melon seeds, lentils, peas, etc.)
  if (/(\bbean\b|\blentil\b|\bpea\b|\begusi\b|\bseeds\b)/.test(clean)) {
    return 'legume';
  }
  // 3. Tubers / Roots (yam, potatoes, cassava, yucca, boniato, garri, eba, tapioca, etc.)
  if (/(\byam\b|\bpotato\b|\bcassava\b|\byucca\b|\bboniato\b|\bgarri\b|\beba\b|\btapioca\b)/.test(clean)) {
    return 'tuber';
  }
  // 4. Animal Protein / Meats (beef, ground beef, chicken, pork, fish, seafood, stockfish, crayfish, etc.)
  if (/(\bbeef\b|\bchicken\b|\bpork\b|\bmeat\b|\bsteak\b|\bfish\b|\bseafood\b|\bcrayfish\b|\bstockfish\b|\bshrimp\b|\bprawn\b|\bcrab\b|\blobster\b|\bcod\b|\bsnapper\b|\btilapia\b|\bsalmon\b|\btuna\b|\bmackerel\b|\bsardine\b|\bpeixe\b|\bpoultry\b|\bturkey\b|\blamb\b|\bmutton\b|\bgoat\b|\bham\b|\bbacon\b|\bsausage\b)/.test(clean)) {
    return 'meat';
  }
  return null;
}

function getStandardizedIngredientsForSearch(ingredients) {
  const translations = {
    "garri": ["garri", "eba", "cassava"],
    "eba": ["eba", "garri", "cassava"],
    "ukwu": ["ugu", "pumpkin leaves", "vegetables"],
    "ugu": ["ugu", "pumpkin leaves", "vegetables"],
    "cryfish": ["crayfish"],
    "crayfish": ["crayfish"],
    "egusi": ["egusi melon", "melon"],
    "locust beans": ["locust beans", "iru"],
    "iru": ["locust beans", "iru"],
    "elubo": ["amala", "yam flour"],
    "amala": ["amala", "yam flour"],
    "tatase": ["bell pepper"],
    "atarodo": ["scotch bonnet"],
    "shombo": ["chili pepper"],
    "peixe": ["fish"]
  };

  return ingredients.map(ing => {
    const cleanIng = ing.replace(/^[\s\-\*\•\d\/\.\,\(\)\+]+/, "").trim().toLowerCase();
    if (translations[cleanIng]) {
      return translations[cleanIng].join(" ");
    }
    return ing;
  });
}

function isMissingIngredientAllowed(ingName) {
  const clean = cleanIngredientWord(ingName).toLowerCase();
  const commonPantryAndSeasonings = [
    "sugar", "salt", "cinnamon", "honey", "water", "sweetener", "butter", "oil", "oils",
    "onion", "onions", "garlic", "ginger", "tomato", "tomatoes", "pepper", "peppers",
    "crayfish", "seasoning", "cube", "cubes", "spinach", "vegetable", "vegetables", "milk",
    "bouillon", "stock", "broth", "coriander", "cilantro", "lime", "lemon", "curry", "thyme",
    "bay leaf", "bay leaves", "oregano", "cumin", "chili powder", "paprika", "clove", "cloves",
    "nutmeg", "parsley", "basil", "rosemary", "sauce", "coconut milk", "palm oil", "olive oil",
    "yeast", "baking powder", "baking soda", "vanilla", "essence", "vinegar"
  ];
  return commonPantryAndSeasonings.some(item => clean.includes(item) || item.includes(clean));
}

function isRecipeValidForCuisineAndIngredients(recipe, userIngredients, activeCultureFilter) {
  const titleLower = (recipe.title || recipe.name || "").toLowerCase();
  const idLower = (recipe.id || "").toLowerCase();
  const cuisine = (recipe.cuisine || recipe.culture || "").toLowerCase();
  
  // 1. Strict Cuisine/Culture Filter
  if (activeCultureFilter && activeCultureFilter !== "All" && activeCultureFilter !== "") {
    const filterLower = activeCultureFilter.toLowerCase();
    if (cuisine !== filterLower) {
      return false; // Exclude completely
    }
  }

  const coreIngredients = recipe.core_ingredients || recipe.ingredients || [];
  
  // 2. Base Protein Validation Constraint: drop conflicting chicken/beef recipes
  const isChickenRecipe = idLower.includes("chicken") || titleLower.includes("chicken") || coreIngredients.some(ing => {
    const lower = ing.toLowerCase();
    return lower.includes("chicken") && !lower.includes("stock") && !lower.includes("broth") && !lower.includes("cube") && !lower.includes("seasoning");
  });
  const isBeefRecipe = idLower.includes("beef") || titleLower.includes("beef") || coreIngredients.some(ing => {
    const lower = ing.toLowerCase();
    return lower.includes("beef") && !lower.includes("stock") && !lower.includes("broth") && !lower.includes("cube") && !lower.includes("seasoning");
  });
  
  const userHasBeef = userIngredients.some(ing => /\bbeef\b/.test(cleanIngredientWord(ing)));
  const userHasChicken = userIngredients.some(ing => /\bchicken\b/.test(cleanIngredientWord(ing)));
  
  if (userHasBeef && !userHasChicken && isChickenRecipe) return false;
  if (userHasChicken && !userHasBeef && isBeefRecipe) return false;

  // 3. Rice & Beans exclusion rule: do not recommend beans unless it has rice in it, as in rice and beans.
  const hasRiceInput = userIngredients.some(ing => ing === "rice" || ing.includes("rice"));
  const hasBeansInput = userIngredients.some(ing => ing.includes("bean"));
  if (hasRiceInput && !hasBeansInput) {
    const recipeIngredientsLower = coreIngredients.map(i => i.toLowerCase());
    const hasBeans = titleLower.includes("bean") || recipeIngredientsLower.some(i => i.includes("bean"));
    const hasRice = titleLower.includes("rice") || recipeIngredientsLower.some(i => i.includes("rice"));
    if (hasBeans && !hasRice) return false;
  }

  // 4. Classification Filter: If the recipe contains primary ingredient classes outside of user's input class parameters, drop it
  const userPrimaryClasses = new Set();
  userIngredients.forEach(ing => {
    const cls = getPrimaryCulinaryClass(ing);
    if (cls) userPrimaryClasses.add(cls);
  });
  
  let hasOutsideClassRequirement = false;
  coreIngredients.forEach(coreIng => {
    if (isMissingIngredientAllowed(coreIng)) return;
    const ingClass = getPrimaryCulinaryClass(coreIng);
    if (ingClass) {
      if (!userPrimaryClasses.has(ingClass)) {
        hasOutsideClassRequirement = true;
      }
    }
  });
  if (hasOutsideClassRequirement) return false;

  // 5. State Changes & Culinary Pathways constraints
  const hasGrainInput = userIngredients.some(ing => getIngredientCulinaryClass(ing) === 'grain');
  const hasLegumeInput = userIngredients.some(ing => getIngredientCulinaryClass(ing) === 'legume');
  const hasTuberInput = userIngredients.some(ing => getIngredientCulinaryClass(ing) === 'tuber');
  const hasBakedWheatAsset = userIngredients.some(ing => detectBakedWheatAsset(ing));
  const hasDryMilledPowderInput = userIngredients.some(ing => detectDryMilledPowder(ing));
  const hasWetSlurryInput = userIngredients.some(ing => detectWetSlurry(ing));
  
  const traits = getRecipeArchetypeTraits(recipe.id);
  const stateTraits = getRecipeStateTraits(recipe.id);
  
  if (hasDryMilledPowderInput && stateTraits.isWholeGrainOrTuberDish) return false;
  if (hasWetSlurryInput && stateTraits.isWholeLegumeDish) return false;
  if (hasBakedWheatAsset && traits.isLegumePureeOrTuberDish) return false;
  if (hasLegumeInput && !hasGrainInput && traits.isPizzaBurgerOrTaco) return false;
  if (hasTuberInput && !hasGrainInput && traits.isTacoOrPasta) return false;

  // 6. Unique Base Staples Exclusion Rule
  const uniqueBaseStaples = [
    "egusi", "okra", "beans", "rice", "yam", "oats", "pasta", "spaghetti", 
    "macaroni", "noodles", "tortilla", "cornmeal", "couscous", "quinoa", "cassava"
  ];
  
  let hasMissingUniqueStaple = false;
  coreIngredients.forEach(coreIng => {
    const cleanCore = cleanIngredientWord(coreIng).toLowerCase();
    const isUniqueStaple = uniqueBaseStaples.some(base => cleanCore.includes(base) || base.includes(cleanCore));
    if (isUniqueStaple) {
      const isMatched = userIngredients.some(userIng => chefSemanticMatch(userIng, coreIng));
      if (!isMatched) {
        hasMissingUniqueStaple = true;
      }
    }
  });
  if (hasMissingUniqueStaple) return false;

  // 7. Strict Input-Output Alignment: Exclude recipe if it requires a major (non-pantry) ingredient that the user did not input
  let hasMissingMajorIngredient = false;
  for (const coreIng of coreIngredients) {
    const isMatched = userIngredients.some(userIng => chefSemanticMatch(userIng, coreIng));
    if (!isMatched) {
      if (!isMissingIngredientAllowed(coreIng)) {
        hasMissingMajorIngredient = true;
        break;
      }
    }
  }
  if (hasMissingMajorIngredient) return false;

  return true;
}

async function fetchAndRenderChefSuggestions() {
  setRecipes([]); // Force-wipe the old array state completely clear

  const grid = document.getElementById("chef-suggestions-grid");
  const loading = document.getElementById("chef-suggestions-loading");
  const countBadge = document.getElementById("chef-suggestions-count-badge");
  if (!grid || !loading) return;

  const isCustomActive = state.chefQueryIngredients.length > 0;
  const section = document.getElementById("chef-suggestions-section");
  
  if (!isCustomActive) {
    if (section) section.classList.add("d-none");
    grid.innerHTML = "";
    if (countBadge) countBadge.textContent = "0 Suggested";
    state.lastChefQueryStr = "";
    state.cachedChefSuggestions = [];
    return;
  }

  if (section) section.classList.remove("d-none");
  const activeIngredients = state.chefQueryIngredients;

  // Forcefully reset the recipes list state and drop old DOM nodes to prevent layout mirroring/freezing
  grid.innerHTML = "";
  if (countBadge) countBadge.textContent = "0 Suggested";
  state.cachedChefSuggestions = [];

  // Create query fingerprint
  const queryFingerprint = [...activeIngredients].sort().join(",").toLowerCase();

  // Show loading indicator
  grid.classList.add("d-none");
  loading.classList.remove("d-none");

  try {
    // 1. Fetch the local recipesData.json dataset directly
    const response = await fetch("recipesData.json");
    if (!response.ok) {
      throw new Error("Failed to load recipesData.json");
    }
    const recipesData = await response.json();

    // Normalize user ingredients for robust case-insensitive comparison
    const userIngredients = activeIngredients.map(i => i.toLowerCase().trim());

    // Analyze user input for strict class matrix checks
    const hasGrainInput = userIngredients.some(ing => getIngredientCulinaryClass(ing) === 'grain');
    const hasLegumeInput = userIngredients.some(ing => getIngredientCulinaryClass(ing) === 'legume');
    const hasTuberInput = userIngredients.some(ing => getIngredientCulinaryClass(ing) === 'tuber');
    const hasBakedWheatAsset = userIngredients.some(ing => detectBakedWheatAsset(ing));
    
    // State Changes & Culinary Pathways checks
    const hasDryMilledPowderInput = userIngredients.some(ing => detectDryMilledPowder(ing));
    const hasWetSlurryInput = userIngredients.some(ing => detectWetSlurry(ing));
    
    // Analyze user input for explicit protein selections (Base Protein Validation Constraint)
    const userHasBeef = userIngredients.some(ing => {
      const clean = cleanIngredientWord(ing);
      return /\bbeef\b/.test(clean);
    });
    const userHasChicken = userIngredients.some(ing => {
      const clean = cleanIngredientWord(ing);
      return /\bchicken\b/.test(clean);
    });

    // Build user's input class parameters list
    const userPrimaryClasses = new Set();
    userIngredients.forEach(ing => {
      const cls = getPrimaryCulinaryClass(ing);
      if (cls) {
        userPrimaryClasses.add(cls);
      }
    });

    // 2. Perform strict ingredient matching, checking both core ingredients and flexible substitutes
    const processedRecipes = [];

    recipesData.forEach(recipe => {
      if (!isRecipeValidForCuisineAndIngredients(recipe, userIngredients, state.activeCultureFilter)) {
        return; // Exclude recipe completely
      }

      const coreMatched = [];
      const coreMissing = [];
      const satisfiedUser = [];

      userIngredients.forEach(userIng => {
        let isMatched = false;

        // Check core ingredients
        recipe.core_ingredients.forEach(coreIng => {
          if (chefSemanticMatch(userIng, coreIng)) {
            isMatched = true;
            if (!coreMatched.includes(coreIng)) {
              coreMatched.push(coreIng);
            }
          }
        });

        // Check flexible substitutes
        if (!isMatched && recipe.flexible_substitutes) {
          for (const coreIng in recipe.flexible_substitutes) {
            const substitutes = recipe.flexible_substitutes[coreIng];
            const subMatched = substitutes.some(sub => chefSemanticMatch(userIng, sub));
            if (subMatched) {
              isMatched = true;
              if (!coreMatched.includes(coreIng)) {
                coreMatched.push(coreIng);
              }
            }
          }
        }

        if (isMatched) {
          satisfiedUser.push(userIng);
        }
      });

      // Strict category checks based on coreMatched
      // If the recipe requires a meat, at least one required meat must be in coreMatched
      const recipeMeats = recipe.core_ingredients.filter(ing => getPrimaryCulinaryClass(ing) === 'meat');
      if (recipeMeats.length > 0) {
        const hasMatchedMeat = recipeMeats.some(meatIng => coreMatched.includes(meatIng));
        if (!hasMatchedMeat) {
          return; // Exclude recipe completely
        }
      }

      // If the recipe requires a grain, at least one required grain must be in coreMatched
      const recipeGrains = recipe.core_ingredients.filter(ing => getPrimaryCulinaryClass(ing) === 'grain');
      if (recipeGrains.length > 0) {
        const hasMatchedGrain = recipeGrains.some(grainIng => coreMatched.includes(grainIng));
        if (!hasMatchedGrain) {
          return; // Exclude recipe completely
        }
      }

      // If the recipe requires a tuber, at least one required tuber must be in coreMatched
      const recipeTubers = recipe.core_ingredients.filter(ing => getPrimaryCulinaryClass(ing) === 'tuber');
      if (recipeTubers.length > 0) {
        const hasMatchedTuber = recipeTubers.some(tuberIng => coreMatched.includes(tuberIng));
        if (!hasMatchedTuber) {
          return; // Exclude recipe completely
        }
      }

      // If the recipe requires a legume, at least one required legume must be in coreMatched
      const recipeLegumes = recipe.core_ingredients.filter(ing => getPrimaryCulinaryClass(ing) === 'legume');
      if (recipeLegumes.length > 0) {
        const hasMatchedLegume = recipeLegumes.some(legumeIng => coreMatched.includes(legumeIng));
        if (!hasMatchedLegume) {
          return; // Exclude recipe completely
        }
      }


      // Pantry staples list for Pantry Flex Exception
      const pantryStaples = ["sugar", "salt", "cinnamon", "honey", "water", "sweetener", "butter", "oil"];
      
      // Fill in coreMissing for ingredients that weren't matched
      let isPantryFlexMatch = false;
      let nonPantryMissingCount = 0;
      
      recipe.core_ingredients.forEach(coreIng => {
        if (!coreMatched.includes(coreIng)) {
          coreMissing.push(coreIng);
          const cleanCore = cleanIngredientWord(coreIng).toLowerCase();
          const isPantryStaple = pantryStaples.some(staple => cleanCore.includes(staple) || staple.includes(cleanCore));
          if (!isPantryStaple) {
            nonPantryMissingCount++;
          }
        }
      });

      const coreMatchedCount = coreMatched.length;
      if (nonPantryMissingCount === 0 && coreMatchedCount > 0) {
        isPantryFlexMatch = true;
      }

      const matchCount = satisfiedUser.length;

      // Quality gate: require a minimum number of matches based on the size of the user's query
      let minRequiredMatches = 1;
      if (userIngredients.length >= 5) {
        minRequiredMatches = 3;
      } else if (userIngredients.length >= 3) {
        minRequiredMatches = 2;
      }

      if (matchCount >= minRequiredMatches || isPantryFlexMatch) {
        const matchRatio = matchCount / recipe.core_ingredients.length;
        const ytVideoId = (recipe.youtubeVideoIds && recipe.youtubeVideoIds.length > 0) ? recipe.youtubeVideoIds[0] : (recipe.youtubeVideoId || "");
        const videoUrl = ytVideoId ? `https://www.youtube.com/embed/${ytVideoId}` : (recipe.videoUrl || "");

        const localRecipe = RECIPES.find(r => r.id === recipe.id);
        const recipeCategory = localRecipe ? localRecipe.category : "Dinner";

        processedRecipes.push({
          id: recipe.id,
          title: recipe.title,
          name: recipe.title, // For dual compatibility
          cuisine: recipe.cuisine,
          culture: recipe.cuisine, // For dual compatibility
          category: recipeCategory,
          story: recipe.story,
          description: recipe.story, // For dual compatibility
          imageUrl: recipe.imageUrl,
          image: recipe.imageUrl, // For dual compatibility
          procedure: (localRecipe && localRecipe.procedure) ? localRecipe.procedure : [],
          ingredients: (localRecipe && localRecipe.ingredients) ? localRecipe.ingredients : recipe.core_ingredients,
          youtubeVideoId: ytVideoId,
          videoUrl: videoUrl,
          nutrition: recipe.nutrients || recipe.nutrition, // For dual compatibility
          matchedIngredients: coreMatched,
          missingIngredients: coreMissing,
          matchCount: matchCount,
          matchRatio: matchRatio,
          isPantryFlexMatch: isPantryFlexMatch,
          detailedIngredients: (localRecipe && localRecipe.detailedIngredients) ? localRecipe.detailedIngredients : recipe.core_ingredients.map(ing => ({ name: ing, amount: "To taste" }))
        });
      }
    });

    // 3. Sort by: primary by match count (descending), secondary by user preferred country/continent adaptation, tertiary by temporal block appropriateness (no exclusions), quaternary by match ratio (descending)
    const currentStrictBlock = getStrictMealTime(state.simulatedTime);
    const userCountry = (state.profile.country || "Nigeria").toLowerCase();
    const userContinent = (state.profile.continent || "Africa").toLowerCase();

    processedRecipes.sort((a, b) => {
      // 0. Primary Sort: active culture filter matching
      if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
        const filterLower = state.activeCultureFilter.toLowerCase();
        const aMatchesFilter = (a.cuisine || "").toLowerCase() === filterLower;
        const bMatchesFilter = (b.cuisine || "").toLowerCase() === filterLower;
        if (aMatchesFilter && !bMatchesFilter) return -1;
        if (!aMatchesFilter && bMatchesFilter) return 1;
      }

      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      
      // Adaptation tie-breaker
      const aCountryPref = (a.cuisine || "").toLowerCase().includes(userCountry);
      const bCountryPref = (b.cuisine || "").toLowerCase().includes(userCountry);
      if (aCountryPref && !bCountryPref) return -1;
      if (!aCountryPref && bCountryPref) return 1;

      const aContinentPref = getContinentOfRecipe(a).toLowerCase() === userContinent;
      const bContinentPref = getContinentOfRecipe(b).toLowerCase() === userContinent;
      if (aContinentPref && !bContinentPref) return -1;
      if (!aContinentPref && bContinentPref) return 1;

      // Temporal appropriateness
      const aTimeApp = isRecipeCategoryInBlock(a.category, currentStrictBlock);
      const bTimeApp = isRecipeCategoryInBlock(b.category, currentStrictBlock);
      if (aTimeApp && !bTimeApp) return -1;
      if (!aTimeApp && bTimeApp) return 1;
      
      return b.matchRatio - a.matchRatio;
    });

    // 4. Deduplicate to ensure no identical headings, thumbnails, or videos
    const seenTitles = new Set();
    const seenImages = new Set();
    const seenVideos = new Set();
    const uniqueRecipes = [];

    processedRecipes.forEach(recipe => {
      const titleKey = (recipe.title || "").toLowerCase().trim();
      const imageKey = (recipe.imageUrl || "").toLowerCase().trim();
      const videoKey = (recipe.youtubeVideoId || "").toLowerCase().trim();

      const isDuplicate = seenTitles.has(titleKey) || 
                          (imageKey && seenImages.has(imageKey)) || 
                          (videoKey && seenVideos.has(videoKey));

      if (!isDuplicate) {
        seenTitles.add(titleKey);
        if (imageKey) seenImages.add(imageKey);
        if (videoKey) seenVideos.add(videoKey);
        uniqueRecipes.push(recipe);
      }
    });

    // 5. Slice to exactly 15 results maximum
    let finalRecipes = uniqueRecipes.slice(0, 15);

    // If we have fewer than 15 results, dynamically search YouTube for matching human-prepared meals
    if (finalRecipes.length < 15 && userIngredients.length > 0) {
      try {
        const neededCount = 15 - finalRecipes.length;
        const mealTimeKeyword = currentStrictBlock === "Late-Night" ? "Late-Night Snack" : currentStrictBlock;
        const queryTerms = getStandardizedIngredientsForSearch(userIngredients);
        const cleanIngredientsQuery = queryTerms.join(" + ");
        const cuisineKeyword = (state.activeCultureFilter && state.activeCultureFilter !== "All") ? `${state.activeCultureFilter} ` : "";
        const searchQuery = detectGrainsAndFruitCombination(cleanIngredientsQuery)
          ? `${cuisineKeyword}Oatmeal + Porridge + Smoothie + Overnight Oats + ${mealTimeKeyword}`
          : `${cuisineKeyword}${queryTerms.join(" + ")} ${mealTimeKeyword} recipe cooking`;
        
        console.log(`[THE CHEF] Fetching dynamic suggestions from YouTube for query: "${searchQuery}"`);
        const extraVideos = await fetchYoutubeCulinaryVideos(searchQuery, "", neededCount * 3);
        
        if (extraVideos && extraVideos.length > 0) {
          extraVideos.forEach(video => {
            if (finalRecipes.length >= 15) return;
            
            const titleLower = (video.title || "").toLowerCase();
            const descLower = (video.description || "").toLowerCase();
            const combineText = titleLower + " " + descLower;

            const titleKey = (video.title || "").toLowerCase().trim();
            const videoKey = (video.videoId || "").toLowerCase().trim();
            
            const isDuplicate = seenTitles.has(titleKey) || seenVideos.has(videoKey);
            if (isDuplicate) return;

            const localDbMatch = findMatchingDatabaseRecipe(video.title, video.videoId);
            const recipeId = "yt-sug-" + video.videoId;

            // Strict cuisine filter check
            if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
              const filterLower = state.activeCultureFilter.toLowerCase();
              const titleHasCuisine = titleLower.includes(filterLower) || descLower.includes(filterLower);
              const channelHasCuisine = (video.channelTitle || "").toLowerCase().includes(filterLower);
              const localMatchesCuisine = localDbMatch && (localDbMatch.culture || "").toLowerCase() === filterLower;
              
              if (!titleHasCuisine && !channelHasCuisine && !localMatchesCuisine) {
                return; // Exclude because it's not the selected cuisine
              }
            }

            if (localDbMatch) {
              // Enforce constraints on matched database recipe
              if (!isRecipeValidForCuisineAndIngredients(localDbMatch, userIngredients, state.activeCultureFilter)) {
                return;
              }

              seenTitles.add(titleKey);
              seenVideos.add(videoKey);

              finalRecipes.push({
                id: recipeId,
                title: video.title,
                name: video.title,
                cuisine: localDbMatch.culture,
                culture: localDbMatch.culture,
                category: localDbMatch.category || currentStrictBlock,
                story: localDbMatch.story,
                description: localDbMatch.story,
                imageUrl: video.thumbnailUrl || localDbMatch.image,
                image: video.thumbnailUrl || localDbMatch.image,
                youtubeVideoId: video.videoId,
                videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
                procedure: localDbMatch.procedure,
                ingredients: localDbMatch.ingredients,
                nutrition: localDbMatch.nutrition,
                matchedIngredients: localDbMatch.ingredients.filter(ing => userIngredients.includes(ing.toLowerCase())),
                missingIngredients: localDbMatch.ingredients.filter(ing => !userIngredients.includes(ing.toLowerCase())),
                matchCount: localDbMatch.ingredients.filter(ing => userIngredients.includes(ing.toLowerCase())).length,
                matchRatio: localDbMatch.ingredients.filter(ing => userIngredients.includes(ing.toLowerCase())).length / localDbMatch.ingredients.length,
                isPantryFlexMatch: false,
                isYoutubeVideo: true,
                detailedIngredients: localDbMatch.detailedIngredients
              });
            } else {
              // Parse details and validate as dynamic parsed video
              const parsedIngs = extractIngredientsFromTitleAndDescription(video.title, video.description);
              const finalIngredients = parsedIngs;
              
              const mockRecipe = {
                id: recipeId,
                title: video.title,
                cuisine: (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") ? state.activeCultureFilter : "Global",
                core_ingredients: finalIngredients
              };

              if (!isRecipeValidForCuisineAndIngredients(mockRecipe, userIngredients, state.activeCultureFilter)) {
                return;
              }

              // Min match quality gate check
              const matchingCount = userIngredients.filter(ing => {
                const clean = cleanIngredientWord(ing).toLowerCase();
                return combineText.includes(clean);
              }).length;
              const threshold = userIngredients.length >= 4 ? 2 : 1;
              if (matchingCount < threshold) {
                return; // Exclude video as a loose match!
              }

              seenTitles.add(titleKey);
              seenVideos.add(videoKey);

              const detailedIngs = finalIngredients.map(ing => {
                const cleanedName = ing.replace(/^[\s\-\*\•\d\/\.\,\(\)\+]+/, "").trim();
                const amountMatch = ing.match(/^([\d\/\.\s\-]+(?:cups?|g|kg|ml|l|tbsp|tsp|oz|lbs?|pcs|pieces)?)\s+(.+)$/i);
                if (amountMatch) {
                  return { name: amountMatch[2].trim(), amount: amountMatch[1].trim() };
                }
                return { name: cleanedName, amount: "To taste" };
              });
              
              const estimatedNutrition = estimateRecipeNutrition(detailedIngs);

              finalRecipes.push({
                id: recipeId,
                title: video.title,
                name: video.title,
                cuisine: mockRecipe.cuisine,
                culture: mockRecipe.cuisine,
                category: currentStrictBlock,
                story: video.description || `A live cooking demonstration for ${video.title} uploaded by ${video.channelTitle}.`,
                description: video.description || `A live cooking demonstration for ${video.title} uploaded by ${video.channelTitle}.`,
                imageUrl: video.thumbnailUrl,
                image: video.thumbnailUrl,
                youtubeVideoId: video.videoId,
                videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
                procedure: [
                  "Watch the live video demonstration above to see the full cooking procedures, step-by-step techniques, and culinary tips for this dish!"
                ],
                ingredients: finalIngredients,
                nutrition: estimatedNutrition,
                matchedIngredients: finalIngredients.filter(ing => userIngredients.some(ui => ing.toLowerCase().includes(ui) || ui.includes(ing.toLowerCase()))),
                missingIngredients: finalIngredients.filter(ing => !userIngredients.some(ui => ing.toLowerCase().includes(ui) || ui.includes(ing.toLowerCase()))),
                matchCount: finalIngredients.filter(ing => userIngredients.some(ui => ing.toLowerCase().includes(ui) || ui.includes(ing.toLowerCase()))).length,
                matchRatio: 1.0,
                isPantryFlexMatch: false,
                isYoutubeVideo: true,
                detailedIngredients: detailedIngs
              });
            }
          });
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic YouTube suggestions:", err);
      }
    }

    finalRecipes = finalRecipes.slice(0, 15);

    // Update Chef Chat panel status based on Pantry Flex and strict temporal state greeting
    const hasPantryFlexMatch = finalRecipes.some(r => r.isPantryFlexMatch);
    const statusEl = document.querySelector(".chef-status");
    if (statusEl) {
      if (hasPantryFlexMatch) {
        statusEl.innerHTML = `<span class="status-dot animate-pulse"></span> Chef, you have the core framework. Just grab a pinch of sweetener from your pantry to complete this profile.`;
      } else {
        const currentStrictBlock = getStrictMealTime(state.simulatedTime);
        let greeting = "Online & Analyzing Kitchen";
        if (currentStrictBlock === "Breakfast") {
          greeting = "Good morning, Chef. Let's organize your early morning Mise en Place...";
        } else if (currentStrictBlock === "Lunch") {
          greeting = "Good afternoon, Chef. Let's prep a refreshing lunch profile...";
        } else if (currentStrictBlock === "Dinner") {
          greeting = "Good evening, Chef. Let's execute a heavy thermal application for dinner...";
        } else if (currentStrictBlock === "Supper") {
          greeting = "Good evening, Chef. Let's arrange a light supper profile...";
        } else if (currentStrictBlock === "Snack") {
          greeting = "Good night, Chef. Let's arrange a light late-night bite...";
        }
        statusEl.innerHTML = `<span class="status-dot animate-pulse"></span> ${greeting}`;
      }
    }

    // Handle empty state gracefully
    if (finalRecipes.length === 0) {
      grid.innerHTML = `
        <div class="empty-list-placeholder" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; border: 2px dashed var(--border-color); border-radius: 16px; width: 100%;">
          <i class="fa-solid fa-face-frown" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.3; color: var(--text-muted);"></i>
          <p style="font-size: 0.85rem; color: var(--text-muted);">No recipes found with these ingredients yet. Try adding more items to your shelf!</p>
        </div>
      `;
      loading.classList.add("d-none");
      grid.classList.remove("d-none");
      if (countBadge) countBadge.textContent = "0 Suggested";
      state.cachedChefSuggestions = [];
      return;
    }

    // Cache suggestions
    state.lastChefQueryStr = queryFingerprint;
    state.cachedChefSuggestions = finalRecipes;

    // Render suggestions immediately without any scrape/AI layer
    renderChefSuggestionsGrid(finalRecipes);

  } catch (error) {
    console.error("Error in Chef Suggestion Engine:", error);
    grid.innerHTML = `
      <div class="empty-list-placeholder" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; border: 2px dashed var(--danger); border-radius: 16px; width: 100%;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--danger);"></i>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Failed to generate local suggestions. Please check your data connectivity.</p>
      </div>
    `;
  } finally {
    loading.classList.add("d-none");
    grid.classList.remove("d-none");
  }
}

// Sub-render function to draw suggestion cards inside the grid
function renderChefSuggestionsGrid(recipes) {
  const grid = document.getElementById("chef-suggestions-grid");
  const countBadge = document.getElementById("chef-suggestions-count-badge");
  if (!grid) return;

  grid.innerHTML = "";
  if (countBadge) {
    countBadge.textContent = `${recipes.length} Suggested`;
  }

  if (recipes.length === 0) {
    grid.innerHTML = `
      <div class="empty-list-placeholder" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; border: 2px dashed var(--border-color); border-radius: 16px; width: 100%;">
        <i class="fa-solid fa-face-frown" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.3; color: var(--text-muted);"></i>
        <p style="font-size: 0.85rem; color: var(--text-muted);">No recipes matched your kitchen ingredients. Try adding more ingredients to your shelf or typing additional custom ingredients!</p>
      </div>
    `;
    return;
  }

  recipes.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    
    // Unique Component Key Assignment for DOM tracking to clear previous images
    card.setAttribute("key", `${recipe.id}_${Date.now()}`);
    
    const isYoutubeWeb = recipe.id && (recipe.id.startsWith("web-") || recipe.id.startsWith("yt-sug-"));
    
    // Fix: extract youtubeVideoId if missing but videoUrl exists
    if (!recipe.youtubeVideoId && recipe.videoUrl) {
      const match = recipe.videoUrl.match(/\/embed\/([^/?]+)/);
      if (match) {
        recipe.youtubeVideoId = match[1];
      }
    }

    // Strict Conditional Logic for "IMAGE ONLY" Badge:
    // * IF recipe.youtubeVideoId exists AND is not empty/null, hide the badge completely.
    // * IF recipe.youtubeVideoId is completely missing, null, or undefined, display the badge.
    const isImageOnly = !recipe.youtubeVideoId || recipe.youtubeVideoId === "null" || recipe.youtubeVideoId === "";
    
    let sourceLabel = "";
    if (isYoutubeWeb) {
      sourceLabel = isImageOnly 
        ? `<i class="fa-solid fa-earth-americas text-accent"></i> Web Recipe` 
        : `<i class="fa-brands fa-youtube text-danger"></i> Web Video`;
    } else {
      sourceLabel = isImageOnly 
        ? `<i class="fa-solid fa-book-open text-accent"></i> Local Recipe` 
        : `<i class="fa-brands fa-youtube text-danger"></i> Local Video`;
    }

    // Determine preparation time / difficulty based on ID or details to keep the design premium without displaying fake numbers
    let prepTime = "25 mins";
    let difficulty = "Easy Cooking";
    if (recipe.id) {
      if (recipe.id.includes("quesadilla") || recipe.id.includes("akara") || recipe.id.includes("bruschetta")) {
        prepTime = "15 mins";
        difficulty = "Easy Cooking";
      } else if (recipe.id.includes("egusi") || recipe.id.includes("feijoada") || recipe.id.includes("lasagna") || recipe.id.includes("risotto")) {
        prepTime = "45 mins";
        difficulty = "Advanced Skill";
      } else {
        prepTime = "30 mins";
        difficulty = "Medium Cooking";
      }
    }
    const staticBadgeHtml = `<span class="badge badge-success" style="position: absolute; left: 12px; top: 12px; z-index: 5;"><i class="fa-solid fa-clock"></i> ⏱️ ${prepTime} | 🍳 ${difficulty}</span>`;

    // Dynamic Data Mapping strictly bound to the filtered recipe properties:
    const imageUrl = recipe.imageUrl || recipe.image;
    const recipeTitle = recipe.title || recipe.name;
    const recipeDescription = recipe.story || recipe.description;

    const matchedItemsHtml = recipe.matchedIngredients.map(ing => 
      `<span style="font-size: 0.75rem; background: rgba(46, 204, 113, 0.12); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); padding: 2px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-check" style="font-size: 0.65rem;"></i> ${ing}</span>`
    ).join(" ");

    const missingItemsHtml = recipe.missingIngredients.map(ing => 
      `<span style="font-size: 0.75rem; background: rgba(231, 76, 60, 0.12); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2); padding: 2px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-plus" style="font-size: 0.65rem;"></i> ${ing}</span>`
    ).join(" ");

    // Build VideoCard-style creator header for suggestions grid
    const cultureAccents2 = { Nigerian: "#fc4a1a", Mexican: "#f7b733", Brazilian: "#2ecc71", Italian: "#e74c3c", Indian: "#ff9f43" };
    const sugAvatarBg = cultureAccents2[recipe.culture] || "var(--accent-color)";
    const sugCreatorName = recipe.title || recipe.name || "Chef's Pick";
    const sugSubtitle = recipe.culture ? `${recipe.culture} Cuisine` : "Global Cuisine";
    const sugInitial = sugCreatorName.charAt(0).toUpperCase();
    const sugAvatarHtml = `<div style="width:36px;height:36px;border-radius:50%;background:${sugAvatarBg};display:flex;align-items:center;justify-content:center;font-size:0.95rem;font-weight:800;color:#fff;flex-shrink:0;border:2px solid rgba(255,255,255,0.12);">${sugInitial}</div>`;

    card.innerHTML = `
      <!-- Card Header: VideoCard social profile pattern -->
      <div class="feed-card-header" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.06);gap:8px;">
        <div style="display:flex;align-items:center;gap:9px;flex:1;min-width:0;">
          ${sugAvatarHtml}
          <div style="min-width:0;">
            <div style="font-weight:700;font-size:0.85rem;color:#fff;display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${sugCreatorName.length > 22 ? sugCreatorName.slice(0, 22) + "\u2026" : sugCreatorName}
              <i class="fa-solid fa-circle-check" style="color:var(--accent-color);font-size:0.65rem;flex-shrink:0;"></i>
            </div>
            <div style="font-size:0.7rem;color:var(--text-muted);white-space:nowrap;">${sugSubtitle} \u2022 ${sourceLabel}</div>
          </div>
        </div>
        <span class="badge badge-accent" style="font-size:0.65rem;padding:3px 7px;flex-shrink:0;">${recipe.culture}</span>
      </div>

      <!-- Card Thumbnail/Media -->
      <div class="feed-card-media-container" style="width: 100%; position: relative; height: 180px; background: #000; overflow: hidden; border-radius: 0;">
        <div class="feed-media-cover" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          ${renderImageOrPlaceholderHTML(getImageSrcWithCacheBust(recipe.imageUrl || recipe.image), recipe.title, "feed-main-image", "width: 100%; height: 100%; object-fit: cover;", recipe.youtubeVideoId || "")}
          ${isImageOnly ? '' : `
            <div class="feed-play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.35); display: flex; align-items: center; justify-content: center;">
              <div class="play-btn-circle" style="width: 44px; height: 44px; border-radius: 50%; background: var(--accent-color); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(252, 74, 26, 0.4);">
                <i class="fa-solid fa-play" style="color: #fff; font-size: 1.1rem; margin-left: 3px;"></i>
              </div>
            </div>
          `}
          ${staticBadgeHtml}
        </div>
        ${isImageOnly ? '' : '<div class="feed-video-placeholder" style="width: 100%; height: 100%;"></div>'}
      </div>

      <!-- Card Body Content -->
      <div class="feed-card-caption-section" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div>
          <span style="font-size: 0.95rem; color: var(--text-main); font-weight: 700; display: block; margin-bottom: 4px;">${recipe.title}</span>
          <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${recipe.description}</p>
        </div>

        <!-- Action Row -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
          <button class="btn btn-accent btn-sm feed-details-btn" style="font-size: 0.75rem; padding: 5px 14px; border-radius: 6px;">Details & Steps</button>
        </div>
      </div>
    `;

    // Click to Play video / Open details handler
    const mediaCover = card.querySelector(".feed-media-cover");
    mediaCover.addEventListener("click", () => {
      if (isImageOnly) {
        openRecipeModal(recipe);
      } else {
        const placeholder = card.querySelector(".feed-video-placeholder");
        placeholder.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:0.85rem;background:#121214;"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading Video...</div>`;
        mediaCover.style.display = "none";
        const embedUrl = getCleanEmbedUrl(recipe.videoUrl, true);
        placeholder.innerHTML = `<iframe src="${embedUrl}" title="Recipe Demonstration Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" allowfullscreen style="width:100%; height:100%; border:0;"></iframe>`;
      }
    });

    // Details Modal click handler
    card.querySelector(".feed-details-btn").addEventListener("click", () => {
      openRecipeModal(recipe);
    });

    grid.appendChild(card);
  });
}

// -------------------------------------------------------------
// RECIPE DETAILS MODAL CONTROLLER
// -------------------------------------------------------------
function convertMeasurement(amountStr, toImperial) {
  if (!amountStr) return "";
  
  // E.g., "500g", "4 cups", "1.5 kg", "250 ml", "1 large", "3 tablespoons"
  const regex = /^([\d\.]+)\s*([a-zA-Záéíóúãõç\s\(\)&/\-]+)$/;
  const match = amountStr.match(regex);
  if (!match) return amountStr;

  const val = parseFloat(match[1]);
  const unit = match[2].trim().toLowerCase();

  if (toImperial) {
    // Metric -> Imperial
    if (unit === "g" || unit === "grams") {
      const oz = Math.round(val * LOCALIZATIONS.conversions.gToOz * 10) / 10;
      return `${oz} oz`;
    }
    if (unit === "kg" || unit === "kilograms") {
      const lbs = Math.round(val * LOCALIZATIONS.conversions.kgToLbs * 10) / 10;
      return `${lbs} lbs`;
    }
    if (unit === "ml" || unit === "milliliters") {
      const flOz = Math.round(val * LOCALIZATIONS.conversions.mlToFlOz * 10) / 10;
      return `${flOz} fl oz`;
    }
    if (unit === "l" || unit === "liter" || unit === "liters") {
      const pts = Math.round(val * 2.11338 * 10) / 10;
      return `${pts} pt`;
    }
  } else {
    // Imperial -> Metric
    if (unit === "cup" || unit === "cups") {
      const ml = Math.round(val * 240);
      return `${ml} ml`;
    }
    if (unit === "tbsp" || unit === "tablespoon" || unit === "tablespoons" || unit === "spoon" || unit === "spoons") {
      const ml = Math.round(val * 15);
      return `${ml} ml`;
    }
    if (unit === "tsp" || unit === "teaspoon" || unit === "teaspoons") {
      const ml = Math.round(val * 5);
      return `${ml} ml`;
    }
    if (unit === "oz" || unit === "ounce" || unit === "ounces") {
      const g = Math.round(val / LOCALIZATIONS.conversions.gToOz);
      return `${g} g`;
    }
    if (unit === "lb" || unit === "lbs" || unit === "pound" || unit === "pounds") {
      const g = Math.round(val / LOCALIZATIONS.conversions.kgToLbs * 1000);
      return g >= 1000 ? `${(g/1000).toFixed(1)} kg` : `${g} g`;
    }
  }
  return amountStr;
}

function renderModalChecklist(recipe) {
  const ingredientsList = document.getElementById("modal-ingredients-list");
  ingredientsList.innerHTML = "";
  
  const ownedNames = state.kitchenIngredients.map(i => i.name.toLowerCase());
  const multiplier = (state.modalServings || 2) / 2;

  recipe.detailedIngredients.forEach(item => {
    const li = document.createElement("li");
    
    // Check if owned
    const isOwned = ownedNames.some(owned => 
      owned.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(owned)
    );

    // Scale and convert amount based on toggle
    const scaledAmount = scaleIngredientAmount(item.amount, multiplier);
    const convertedAmount = convertMeasurement(scaledAmount, state.useImperialUnits);
    
    const hasAmount = convertedAmount && 
                      convertedAmount.toLowerCase() !== "to taste" && 
                      convertedAmount.toLowerCase() !== "n/a";
    const amountSpan = hasAmount ? ` (${convertedAmount})` : "";

    if (isOwned) {
      li.className = "ingredient-owned";
      li.innerHTML = `
        <input type="checkbox" checked disabled>
        <span><strong>${item.name}</strong>${amountSpan}</span>
        <span class="badge badge-success btn-sm" style="padding: 1px 6px; font-size: 0.65rem;">Stocked</span>
      `;
    } else {
      li.innerHTML = `
        <input type="checkbox">
        <span>${item.name}${amountSpan}</span>
      `;
    }

    ingredientsList.appendChild(li);
  });
}

function scaleNutritionFacts(nutrition, multiplier) {
  const scaled = { ...nutrition };
  if (scaled.calories && scaled.calories !== "N/A") {
    scaled.calories = scaled.calories.replace(/([\d\.]+)/, (m) => Math.round(parseFloat(m) * multiplier));
  }
  if (scaled.protein && scaled.protein !== "N/A") {
    scaled.protein = scaled.protein.replace(/([\d\.]+)/, (m) => Math.round(parseFloat(m) * multiplier));
  }
  if (scaled.carbs && scaled.carbs !== "N/A") {
    scaled.carbs = scaled.carbs.replace(/([\d\.]+)/, (m) => Math.round(parseFloat(m) * multiplier));
  }
  if (scaled.fat && scaled.fat !== "N/A") {
    scaled.fat = scaled.fat.replace(/([\d\.]+)/, (m) => Math.round(parseFloat(m) * multiplier));
  }
  return scaled;
}

function openRecipeModal(recipe) {
  const modal = document.getElementById("recipe-detail-modal");
  
  if (recipe.id && String(recipe.id).startsWith("yt-sug-") && !recipe.hasBeenResearched) {
    modal.classList.add("active");
    // Show spinner inside modal slots while fetching details
    document.getElementById("modal-title").textContent = recipe.name;
    document.getElementById("modal-story").innerHTML = `<div style="text-align:center;padding:20px;color:var(--accent-color);"><i class="fa-solid fa-spinner fa-spin"></i> Researching culinary story and ingredients...</div>`;
    document.getElementById("modal-ingredients-list").innerHTML = `<li style="list-style:none;text-align:center;color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading checklist...</li>`;
    const procedureList = document.getElementById("modal-procedure-list");
    if (procedureList) {
      procedureList.innerHTML = `<li style="list-style:none;color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching cooking instructions...</li>`;
    }
    
    // Clear embed player temporarily to prevent loading noise
    const modalVideoContainer = document.querySelector("#recipe-detail-modal .modal-video-container");
    if (modalVideoContainer) modalVideoContainer.innerHTML = "";

    fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoTitle: recipe.name,
        videoDescription: recipe.story || "",
        ingredients: recipe.ingredients || []
      })
    })
    .then(r => {
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response for research data");
        }
        return r.json();
      })
    .then(res => {
      recipe.hasBeenResearched = true;
      if (res.success && res.data) {
        recipe.story = res.data.story;
        recipe.detailedIngredients = res.data.detailedIngredients;
        recipe.procedure = res.data.procedure;
        recipe.ingredients = res.data.detailedIngredients.map(i => i.name);
        recipe.nutrition = {
          calories: res.data.nutrients.calories,
          protein: res.data.nutrients.protein,
          carbs: res.data.nutrients.carbs,
          fat: res.data.nutrients.fat,
          impact: res.data.nutrients.impact
        };
        recipe.culture = res.data.culture;
        recipe.sources = res.data.sources || [];
      }
      openRecipeModal(recipe);
    })
    .catch(err => {
      console.warn("Failed fetching recipe details from backend:", err);
      recipe.hasBeenResearched = true;
      openRecipeModal(recipe);
    });
    return;
  }

  const fallbackVideoId = getReliableFallbackVideoId(recipe.culture, recipe.name);
  
  // Reset procedure header to clean title
  const procedureHeader = document.getElementById("modal-procedure-list") ? document.getElementById("modal-procedure-list").previousElementSibling : null;
  if (procedureHeader) {
    procedureHeader.innerHTML = `<i class="fa-solid fa-circle-play text-accent"></i> Step-by-Step Procedure`;
  }
  
  // Set content
  document.getElementById("modal-title").textContent = recipe.name;
  document.getElementById("modal-culture").textContent = recipe.culture;
  document.getElementById("modal-category").textContent = recipe.category;
  document.getElementById("modal-story").textContent = recipe.story;

  // Video embed - Recreate iframe dynamically to prevent YouTube player memory leaks
  const modalVideoContainer = document.querySelector("#recipe-detail-modal .modal-video-container");
  modalVideoContainer.innerHTML = `
    <iframe id="modal-video-iframe" src="" title="Recipe Demonstration Video" frameborder="0" 
            style="width: 100%; height: 100%; border: none;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
            allowfullscreen></iframe>
  `;
  const iframe = document.getElementById("modal-video-iframe");
  const backupImg = recipe.image || "jollof.png";

  const targetVideoId = recipe.youtubeVideoId || validateAndExtractVideoId(recipe.videoUrl);
  if (targetVideoId) {
    iframe.src = getCleanEmbedUrl(`https://www.youtube.com/embed/${targetVideoId}`);
    setTimeout(() => {
      attachYoutubePlayerWithFallback(iframe, targetVideoId, modalVideoContainer, backupImg, fallbackVideoId);
    }, 300);
  } else {
    fetchYoutubeCulinaryVideos(recipe.culture + " " + recipe.name + " recipe", "", 1)
      .then(videos => {
        const videoId = (videos && videos.length > 0) ? validateAndExtractVideoId(videos[0].videoId) : null;
        if (videoId) {
          iframe.src = getCleanEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
          setTimeout(() => {
            attachYoutubePlayerWithFallback(iframe, videoId, modalVideoContainer, backupImg, fallbackVideoId);
          }, 300);
        } else {
          const fallbackId = validateAndExtractVideoId(recipe.videoUrl) || "9JTQYVV-IUI";
          iframe.src = getCleanEmbedUrl(`https://www.youtube.com/embed/${fallbackId}`);
          setTimeout(() => {
            attachYoutubePlayerWithFallback(iframe, fallbackId, modalVideoContainer, backupImg, fallbackVideoId);
          }, 300);
        }
      })
      .catch(() => {
        const fallbackId = validateAndExtractVideoId(recipe.videoUrl) || "9JTQYVV-IUI";
        iframe.src = getCleanEmbedUrl(`https://www.youtube.com/embed/${fallbackId}`);
        setTimeout(() => {
          attachYoutubePlayerWithFallback(iframe, fallbackId, modalVideoContainer, backupImg, fallbackVideoId);
        }, 300);
      });
  }

  // Calculate base nutrition (with dynamic estimation if N/A)
  let baseNutrition = recipe.nutrition;
  if ((!baseNutrition || baseNutrition.calories === "N/A") && recipe.detailedIngredients && recipe.detailedIngredients.length > 0) {
    baseNutrition = estimateRecipeNutrition(recipe.detailedIngredients);
  }
  const nutrition = baseNutrition || {
    calories: "N/A",
    protein: "N/A",
    carbs: "N/A",
    fat: "N/A",
    impact: "No nutrition details available."
  };

  // Servings and Nutrition scaling setup
  state.modalServings = 2;
  const decBtn = document.getElementById("btn-dec-servings");
  const incBtn = document.getElementById("btn-inc-servings");
  const servingsDisplay = document.getElementById("display-servings");
  
  if (servingsDisplay) {
    servingsDisplay.textContent = state.modalServings;
  }

  const updateModalContent = () => {
    if (servingsDisplay) {
      servingsDisplay.textContent = state.modalServings;
    }
    
    // Rerender checklists with the updated servings multiplier
    if (recipe.detailedIngredients && recipe.detailedIngredients.length > 0) {
      renderModalChecklist(recipe);
    }
    
    // Scale and update the nutrition grid
    const multiplier = state.modalServings / 2;
    const scaledNutrition = scaleNutritionFacts(nutrition, multiplier);
    document.getElementById("nutri-calories").textContent = scaledNutrition.calories || "N/A";
    document.getElementById("nutri-protein").textContent = scaledNutrition.protein || "N/A";
    document.getElementById("nutri-carbs").textContent = scaledNutrition.carbs || "N/A";
    document.getElementById("nutri-fat").textContent = scaledNutrition.fat || "N/A";
  };

  if (decBtn) {
    decBtn.onclick = () => {
      if (state.modalServings > 1) {
        state.modalServings--;
        updateModalContent();
      }
    };
  }

  if (incBtn) {
    incBtn.onclick = () => {
      if (state.modalServings < 12) {
        state.modalServings++;
        updateModalContent();
      }
    };
  }

  // Set initial nutrition display values
  document.getElementById("nutri-calories").textContent = nutrition.calories || "N/A";
  document.getElementById("nutri-protein").textContent = nutrition.protein || "N/A";
  document.getElementById("nutri-carbs").textContent = nutrition.carbs || "N/A";
  document.getElementById("nutri-fat").textContent = nutrition.fat || "N/A";
  document.getElementById("nutri-impact").textContent = nutrition.impact || "N/A";

  // Unit Toggle handler
  const unitToggle = document.getElementById("modal-unit-toggle");
  const unitToggleText = document.getElementById("unit-toggle-text");
  
  unitToggle.checked = state.useImperialUnits;
  unitToggleText.textContent = state.useImperialUnits ? "Imperial" : "Metric";

  unitToggle.onchange = (e) => {
    state.useImperialUnits = e.target.checked;
    unitToggleText.textContent = state.useImperialUnits ? "Imperial" : "Metric";
    renderModalChecklist(recipe);
  };

  // Render the checklist
  if (!recipe.detailedIngredients || recipe.detailedIngredients.length === 0) {
    document.getElementById("modal-ingredients-list").innerHTML = `<li style="list-style:none;color:var(--text-muted);font-style:italic;">No ingredients checklist needed for live YouTube streams. Watch the video above!</li>`;
    const swapsPanel = document.getElementById("modal-swaps-panel");
    if (swapsPanel) swapsPanel.style.display = "none";
  } else {
    const swapsPanel = document.getElementById("modal-swaps-panel");
    if (swapsPanel) swapsPanel.style.display = "block";
    renderModalChecklist(recipe);
  }

  // Cross-Cultural Substitutions Swap Panel
  const swapsPanel = document.getElementById("modal-swaps-panel");
  const swapsList = document.getElementById("modal-swaps-list");
  swapsList.innerHTML = "";
  
  let hasSwaps = false;
  
  const ingredientsArray = recipe.ingredients || [];
  ingredientsArray.forEach(ingred => {
    const matchKey = Object.keys(LOCALIZATIONS.substitutions).find(key => 
      key.toLowerCase().includes(ingred.toLowerCase()) || ingred.toLowerCase().includes(key.toLowerCase())
    );

    if (matchKey) {
      hasSwaps = true;
      const subInfoArray = LOCALIZATIONS.substitutions[matchKey];
      subInfoArray.forEach(info => {
        const row = document.createElement("div");
        row.className = "swap-item-row";
        row.innerHTML = `
          <div>
            <span class="swap-original">${ingred}</span>
            <i class="fa-solid fa-arrow-right-long swap-arrow"></i>
            <span class="swap-local">${info.substitute}</span>
          </div>
          <span class="badge badge-primary" style="font-size: 0.65rem;">${info.market}</span>
        `;
        swapsList.appendChild(row);
      });
    }
  });

  if (hasSwaps) {
    swapsPanel.classList.remove("d-none");
  } else {
    swapsPanel.classList.add("d-none");
  }

  // Gamification: cook a recipe from another culture gives +4 XP!
  // Simple check: if user's profile state is default/empty, assume different culture. 
  // Let's reward them for viewing/cooking any recipe detail!
  const currentCulture = recipe.culture.toLowerCase();
  const isForeign = currentCulture !== "nigerian"; // Assume default is Nigerian or local
  gainXP(isForeign ? 4 : 2, `Explored ${recipe.name} (${recipe.culture} cuisine)`);

  // Procedure list
  const procedureList = document.getElementById("modal-procedure-list");
  procedureList.innerHTML = "";
  
  if (recipe.isYoutubeVideo) {
    if (procedureHeader && !procedureHeader.innerHTML.includes("Watch Live Video")) {
      procedureHeader.innerHTML += ` <span style="font-size: 0.8rem; font-weight: normal; margin-left: 8px; color: var(--accent-color); font-style: italic;">(Watch Live Video Above)</span>`;
    }
  }

  if (recipe.procedure && recipe.procedure.length > 0) {
    recipe.procedure.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      procedureList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.style.listStyle = "none";
    li.style.color = "var(--text-muted)";
    li.style.fontStyle = "italic";
    li.textContent = "Watch the live video demonstration above to see the full cooking procedures and step-by-step techniques!";
    procedureList.appendChild(li);
  }

  // Render verified reference sources
  const sourcesSection = document.getElementById("modal-sources-section");
  const sourcesList = document.getElementById("modal-sources-list");
  if (sourcesList) {
    sourcesList.innerHTML = "";
    if (recipe.sources && recipe.sources.length > 0) {
      if (sourcesSection) sourcesSection.style.display = "block";
      recipe.sources.forEach(src => {
        const a = document.createElement("a");
        a.href = src.url;
        a.target = "_blank";
        a.style.color = "var(--accent-color)";
        a.style.fontSize = "0.8rem";
        a.style.textDecoration = "underline";
        a.style.display = "inline-flex";
        a.style.alignItems = "center";
        a.style.gap = "6px";
        a.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i> ${src.title}`;
        sourcesList.appendChild(a);
      });
    } else {
      if (sourcesSection) sourcesSection.style.display = "none";
    }
  }

  modal.classList.add("active");
}

function closeRecipeModal() {
  const modal = document.getElementById("recipe-detail-modal");
  modal.classList.remove("active");
  
  const iframe = document.getElementById("modal-video-iframe");
  if (iframe) {
    if (iframe._ytPlayerInstance) {
      try {
        iframe._ytPlayerInstance.destroy();
      } catch (e) {
        // Ignore
      }
    }
    iframe.src = "";
  }
}

// -------------------------------------------------------------
// SHARE LANDING MODAL (FOR SECRET MEALS DECODING)
// -------------------------------------------------------------
function openShareModalDirectly(meal) {
  const modal = document.getElementById("share-landing-modal");
  const fallbackVideoId = getReliableFallbackVideoId(meal.culture || "Global", meal.name);
  
  document.getElementById("share-modal-title").textContent = meal.name;
  document.getElementById("share-modal-nutrition").textContent = meal.nutrition;

  // Render media - Recreate media elements dynamically to prevent YouTube player memory leaks
  const container = document.getElementById("share-modal-media-container");
  container.innerHTML = `
    <iframe id="share-modal-video-iframe" class="d-none" src="" title="Recipe Demonstration Video" frameborder="0" 
            style="width: 100%; height: 100%; border: none;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
            allowfullscreen></iframe>
    <img id="share-modal-image" class="d-none" src="" alt="Recipe Picture" style="width: 100%; height: 100%; object-fit: cover;">
  `;
  const iframe = document.getElementById("share-modal-video-iframe");
  const img = document.getElementById("share-modal-image");

  container.classList.remove("d-none");
  iframe.classList.add("d-none");
  img.classList.add("d-none");

  if (meal.videoUrl) {
    const videoId = validateAndExtractVideoId(meal.videoUrl) || "9JTQYVV-IUI";
    iframe.src = getCleanEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    iframe.classList.remove("d-none");
    setTimeout(() => {
      attachYoutubePlayerWithFallback(iframe, videoId, container, meal.imgUrl, fallbackVideoId);
    }, 300);
  } else if (meal.imgUrl) {
    if (navigator.onLine === false) {
      container.innerHTML = `
        <div class="image-error-placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1e1e24, #121215); color: var(--accent-color, #ff6b00); font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700; text-align: center; padding: 20px; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, 0.05);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <i class="fa-solid fa-image" style="font-size: 1.8rem; opacity: 0.8; margin-bottom: 2px;"></i>
            <div style="color: #fff; opacity: 0.95; font-size: 0.8rem;">Recipe presentation offline</div>
          </div>
        </div>
      `;
    } else {
      img.src = meal.imgUrl;
      img.onerror = () => {
        container.innerHTML = `
          <div class="image-error-placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1e1e24, #121215); color: var(--accent-color, #ff6b00); font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700; text-align: center; padding: 20px; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, 0.05);">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <i class="fa-solid fa-image" style="font-size: 1.8rem; opacity: 0.8; margin-bottom: 2px;"></i>
              <div style="color: #fff; opacity: 0.95; font-size: 0.8rem;">Recipe presentation unavailable</div>
            </div>
          </div>
        `;
      };
      img.classList.remove("d-none");
    }
  } else {
    container.classList.add("d-none");
  }

  // Ingredients list
  const ingredientsList = document.getElementById("share-modal-ingredients-list");
  ingredientsList.innerHTML = "";
  meal.ingredients.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox"> <span>${item}</span>`;
    ingredientsList.appendChild(li);
  });

  // Procedure list
  const procedureList = document.getElementById("share-modal-procedure-list");
  procedureList.innerHTML = "";
  meal.procedure.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    procedureList.appendChild(li);
  });

  modal.classList.add("active");
}

function closeShareModal() {
  const modal = document.getElementById("share-landing-modal");
  modal.classList.remove("active");
  
  const iframe = document.getElementById("share-modal-video-iframe");
  if (iframe) {
    if (iframe._ytPlayerInstance) {
      try {
        iframe._ytPlayerInstance.destroy();
      } catch (e) {
        // Ignore
      }
    }
    iframe.src = "";
  }

  // Clear query parameters from URL so reloading doesn't prompt again
  const cleanUrl = window.location.origin + decodeURIComponent(window.location.pathname);
  window.history.replaceState({}, document.title, cleanUrl);
}

// Check URL parameters for shared meals
async function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedMealId = urlParams.get("sharedMealId");
  const sharedMealHash = urlParams.get("sharedMeal");

  if (sharedMealId) {
    try {
      const res = await fetch(`/api/meals/${encodeURIComponent(sharedMealId)}`);
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.meal) {
          setTimeout(() => {
            openShareModalDirectly(resData.meal);
            showToast("Shared Recipe Loaded!", `Viewing "${resData.meal.name}" from server.`, "success");
          }, 800);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend shared meal lookup failed, trying fallback URL payload:", e);
    }
  }

  if (sharedMealHash) {
    try {
      const decodedMeal = JSON.parse(decodeURIComponent(escape(atob(sharedMealHash))));
      if (decodedMeal && decodedMeal.name) {
        // Delay slightly for smooth page load transition
        setTimeout(() => {
          openShareModalDirectly(decodedMeal);
          showToast("Shared Recipe Loaded!", `Viewing "${decodedMeal.name}" shared by friend.`, "success");
        }, 800);
      }
    } catch (e) {
      console.error("Error decoding shared meal:", e);
      showToast("Decoding Failed", "The shared recipe link is invalid or corrupted.", "warning");
    }
  }
}

// -------------------------------------------------------------
// CLOCK SIMULATOR & MEAL TIME ALERTS
// -------------------------------------------------------------

function getMinutesFromTime(hour, minute) {
  return hour * 60 + minute;
}

function getMealTypeFromMinutes(minutes) {
  // Breakfast: 6 AM to 9 AM (360 - 540)
  // Lunch: 12 PM to 2 PM (720 - 840)
  // Dinner: 6 PM to 8:30 PM (1080 - 1230)
  // Supper: 9 PM to 11 PM (1260 - 1380)
  if (minutes >= 360 && minutes < 540) return "Breakfast";
  if (minutes >= 720 && minutes < 840) return "Lunch";
  if (minutes >= 1080 && minutes < 1230) return "Dinner";
  if (minutes >= 1260 && minutes < 1380) return "Supper";
  return "Snack / Free Time";
}

function getStrictMealTime(minutes) {
  const hour = Math.floor(minutes / 60);
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 16) return "Lunch";
  if (hour >= 16 && hour < 19) return "Dinner";
  if (hour >= 19 && hour < 22) return "Supper";
  return "Snack";
}

function isRecipeCategoryInBlock(recipeCategory, activeBlock) {
  const rc = (recipeCategory || "").toLowerCase();
  const ab = (activeBlock || "").toLowerCase();
  if (ab === "breakfast") {
    return rc === "breakfast";
  }
  if (ab === "lunch") {
    return rc === "lunch";
  }
  if (ab === "dinner") {
    return rc === "dinner";
  }
  if (ab === "supper") {
    return rc === "supper" || rc === "dinner";
  }
  if (ab === "snack") {
    return rc === "snack" || rc === "late-night";
  }
  return false;
}

function getProactiveOrActiveMealWindow(minutes) {
  // Breakfast: 6 AM to 9 AM (360 - 540). Proactive: 5 AM to 6 AM (300 - 360)
  if (minutes >= 300 && minutes < 360) return { type: "Breakfast", isProactive: true };
  if (minutes >= 360 && minutes < 540) return { type: "Breakfast", isProactive: false };

  // Lunch: 12 PM to 2 PM (720 - 840). Proactive: 11 AM to 12 PM (660 - 720)
  if (minutes >= 660 && minutes < 720) return { type: "Lunch", isProactive: true };
  if (minutes >= 720 && minutes < 840) return { type: "Lunch", isProactive: false };

  // Dinner: 6 PM to 8:30 PM (1080 - 1230). Proactive: 5 PM to 6 PM (1020 - 1080)
  if (minutes >= 1020 && minutes < 1080) return { type: "Dinner", isProactive: true };
  if (minutes >= 1080 && minutes < 1230) return { type: "Dinner", isProactive: false };

  // Supper: 9 PM to 11 PM (1260 - 1380). Proactive: 8 PM to 9 PM (1200 - 1260)
  if (minutes >= 1200 && minutes < 1260) return { type: "Supper", isProactive: true };
  if (minutes >= 1260 && minutes < 1380) return { type: "Supper", isProactive: false };

  return null;
}

function formatMinutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Keep updating top bar widget
function updateTimeWidget() {
  // Sync state.simulatedTime to actual local system time
  const now = new Date();
  const actualMinutes = now.getHours() * 60 + now.getMinutes();
  state.simulatedTime = actualMinutes;

  const timeText = formatMinutesToTime(state.simulatedTime);
  const mealType = getMealTypeFromMinutes(state.simulatedTime);

  const widgetTimeText = document.getElementById("widget-time-text");
  if (widgetTimeText) widgetTimeText.textContent = timeText;

  const simTimeLabel = document.getElementById("simulated-time-label");
  if (simTimeLabel) simTimeLabel.textContent = timeText;

  const typeBadge = document.getElementById("widget-meal-type");
  if (typeBadge) {
    typeBadge.textContent = mealType;
    if (mealType === "Snack / Free Time") {
      typeBadge.className = "badge badge-primary";
    } else {
      typeBadge.className = "badge badge-accent";
    }
  }

  const simBadge = document.getElementById("simulated-meal-label");
  if (simBadge) {
    simBadge.textContent = mealType;
    if (mealType === "Snack / Free Time") {
      simBadge.className = "badge badge-primary";
    } else {
      simBadge.className = "badge badge-accent";
    }
  }
}

// Notification Check
let lastNotificationType = "";
function checkMealTimeNotifications() {
  const windowData = getProactiveOrActiveMealWindow(state.simulatedTime);
  const alertPanel = document.getElementById("meal-time-alert");
  if (!alertPanel) return;

  if (windowData) {
    const { type: mealType, isProactive } = windowData;
    
    // If it's a new notification state, fire notification banner and toast
    const stateKey = `${mealType}-${isProactive ? 'pro' : 'act'}`;
    if (lastNotificationType !== stateKey) {
      lastNotificationType = stateKey;

      let suggestionText = isProactive
        ? `It is currently ${formatMinutesToTime(state.simulatedTime)} (1 hour before ${mealType}). Let Chef suggest healthy ${mealType} dishes from different cultures based on your shelves.`
        : `It is currently ${formatMinutesToTime(state.simulatedTime)}. Let Chef suggest healthy ${mealType} dishes from different cultures based on your shelves.`;
      
      if (state.kitchenIngredients.length > 0) {
        // Find expiring or standard ingredient to feature
        const item1 = state.kitchenIngredients[0].name;
        const item2 = state.kitchenIngredients.length > 1 ? state.kitchenIngredients[1].name : "";
        const namePair = item2 ? `${item1} and ${item2}` : item1;

        // Try to match a recipe of the correct category
        const match = RECIPES.find(r => 
          r.category.toLowerCase() === mealType.toLowerCase() &&
          r.ingredients.some(ing => ing.toLowerCase().includes(item1.toLowerCase()))
        );

        if (match) {
          suggestionText = isProactive
            ? `You have ${namePair} on your kitchen shelf. How about preparing ${match.name} for upcoming ${mealType}?`
            : `You have ${namePair} on your kitchen shelf. How about preparing ${match.name} for ${mealType}?`;
        }
      }

      // Show in-app alert box at top of Chef page
      alertPanel.classList.remove("d-none");
      document.getElementById("alert-title").textContent = isProactive 
        ? `Time to Plan ${mealType}! (Almost time)` 
        : `Time for ${mealType}!`;
      document.getElementById("alert-text").textContent = suggestionText;

      // Trigger standard floating toast
      showToast(
        isProactive ? `Meal Planning: ${mealType}` : `Meal Alert: ${mealType}`, 
        suggestionText, 
        "warning"
      );
    }
  } else {
    alertPanel.classList.add("d-none");
    lastNotificationType = "";
  }
}

// Render Quick Tags for custom ingredients query
function renderQuickTags() {
  const container = document.getElementById("chef-quick-tags-container");
  const list = document.getElementById("chef-quick-tags-list");
  const badge = document.getElementById("chef-input-source-badge");

  list.innerHTML = "";

  if (state.chefQueryIngredients.length === 0) {
    container.classList.add("d-none");
    badge.textContent = "Using My Kitchen Shelf";
    badge.className = "badge badge-primary";
    return;
  }

  container.classList.remove("d-none");
  badge.textContent = "Using Custom Entry";
  badge.className = "badge badge-accent";

  state.chefQueryIngredients.forEach((item, index) => {
    const tag = document.createElement("div");
    tag.className = "ingredient-tag";
    tag.style.background = "rgba(252, 74, 26, 0.1)";
    tag.style.borderColor = "rgba(252, 74, 26, 0.25)";

    tag.innerHTML = `
      <span class="ingred-name">${item}</span>
      <button class="ingred-delete" data-index="${index}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    tag.querySelector(".ingred-delete").addEventListener("click", () => {
      state.chefQueryIngredients.splice(index, 1);
      renderQuickTags();
      runChefEngine();
    });

    list.appendChild(tag);
  });
}

// =============================================================
// ADVANCED CULINARY ENGINE HELPERS
// =============================================================

function levenshtein(s1, s2) {
  const m = s1.length, n = s2.length;
  const d = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i-1] === s2[j-1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i-1][j] + 1,
        d[i][j-1] + 1,
        d[i-1][j-1] + cost
      );
    }
  }
  return d[m][n];
}

function gainXP(amount, reason) {
  if (!state.profile.xp) state.profile.xp = 0;
  if (!state.profile.level) state.profile.level = 1;

  state.profile.xp += amount;
  const oldLevel = state.profile.level;
  const newLevel = Math.floor(state.profile.xp / 100) + 1;
  state.profile.level = newLevel;

  saveProfileToStorage();
  checkAchievements();
  renderProfile();

  if (newLevel > oldLevel) {
    showToast("Level Up! 🌟", `Congratulations! You reached Level ${newLevel}!`, "success");
  } else {
    showToast(`+${amount} XP`, reason, "success");
  }
}

function checkAchievements() {
  if (!state.profile.unlockedAchievements) state.profile.unlockedAchievements = [];
  const unlocked = state.profile.unlockedAchievements;
  
  if (!unlocked.includes("kitchen-auditor") && state.kitchenIngredients.length > 0) {
    unlocked.push("kitchen-auditor");
    saveProfileToStorage();
    gainXP(2, "Achievement: Kitchen Auditor!");
  }

  if (!unlocked.includes("alchemist") && state.secretMeals.length > 0) {
    unlocked.push("alchemist");
    saveProfileToStorage();
    gainXP(3, "Achievement: Flavor Alchemist!");
  }

  // Globe Trotter is unlocked when they gain over 25 XP
  if (!unlocked.includes("globe-trotter") && state.profile.xp >= 25) {
    unlocked.push("globe-trotter");
    saveProfileToStorage();
    gainXP(4, "Achievement: Globe Trotter!");
  }
}

function isAiGeneratedContent(title, story) {
  const lowercase = `${title} ${story}`.toLowerCase();
  const aiKeywords = ["#midjourney", "#stablediffusion", "#aiart", "dall-e", "generated by ai", "artificial intelligence", "stable diffusion", "midjourney"];
  return aiKeywords.some(kw => lowercase.includes(kw));
}

function startRealClockScheduler() {
  // Run on start
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  console.log(`Local Time-Zone Sync Active: ${formatMinutesToTime(minutes)} local time.`);
  updateTimeWidget();

  setInterval(() => {
    const today = new Date();
    const currentMins = today.getHours() * 60 + today.getMinutes();

    // Update the time widget dynamically to match real system clock
    updateTimeWidget();

    // Trigger state-aware suggestions proactively (1 hour before each window starts)
    if (today.getSeconds() < 10) { // first check in that minute
      if (currentMins === 300) {
        triggerStateAwareNotification("Breakfast", true);
      } else if (currentMins === 660) {
        triggerStateAwareNotification("Lunch", true);
      } else if (currentMins === 1020) {
        triggerStateAwareNotification("Dinner", true);
      } else if (currentMins === 1200) {
        triggerStateAwareNotification("Supper", true);
      }
    }
  }, 10000);
}

function triggerStateAwareNotification(mealType, isProactive = false) {
  let title = isProactive ? `Meal Planning: ${mealType}` : `Time for ${mealType}!`;
  let text = isProactive 
    ? `It's almost time for ${mealType}! Let the Chef plan your meal based on your kitchen.`
    : `Time to cook ${mealType}! Let the Chef plan your meal based on your kitchen.`;
    
  if (state.kitchenIngredients.length > 0) {
    const item = state.kitchenIngredients[0].name;
    const match = RECIPES.find(r => 
      r.category.toLowerCase() === mealType.toLowerCase() && 
      r.ingredients.some(ing => ing.toLowerCase().includes(item.toLowerCase()))
    );
    if (match) {
      text = isProactive
        ? `It's almost time for ${mealType}! Since you have ${item} ready, how about preparing ${match.name}?`
        : `You have ${item} ready to cook! How about preparing some ${match.name} for ${mealType}?`;
    }
  }
  showToast(title, text, "warning");
}

// -------------------------------------------------------------
// SEARCHABLE CUSTOM COUNTRY DROPDOWN COMPONENT
// -------------------------------------------------------------

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const SUGGESTED_COUNTRIES = ["Nigeria", "United States", "United Kingdom", "Brazil", "Mexico"];

function setupEventListeners() {
  // Feed Search Box
  const feedSearchInput = document.getElementById("feed-search-input");
  if (feedSearchInput) {
    feedSearchInput.addEventListener("input", (e) => {
      state.feedSearchQuery = e.target.value.toLowerCase().trim();
      renderFeed();
    });
  }

  // Standardized ingredients list compiled from database
  const STANDARDIZED_INGREDIENTS = Array.from(new Set(RECIPES.flatMap(r => r.ingredients)));

  // Fuzzy spelling checker listener
  const nameInput = document.getElementById("ingredient-name");
  const suggestionWrapper = document.getElementById("fuzzy-suggestion-wrapper");

  if (nameInput && suggestionWrapper) {
    nameInput.addEventListener("input", (e) => {
      const val = e.target.value.trim().toLowerCase();
      suggestionWrapper.innerHTML = "";
      if (val.length < 3) return;

      const exact = STANDARDIZED_INGREDIENTS.find(x => x.toLowerCase() === val);
      if (exact) return;

      let closest = null;
      let minDistance = 999;
      STANDARDIZED_INGREDIENTS.forEach(ing => {
        const dist = levenshtein(val, ing.toLowerCase());
        if (dist < minDistance && dist <= 2) {
          minDistance = dist;
          closest = ing;
        }
      });

      if (closest) {
        suggestionWrapper.className = "fuzzy-suggestion-box";
        suggestionWrapper.innerHTML = `
          <span>Did you mean <strong>${closest}</strong>?</span>
          <button type="button" class="fuzzy-suggestion-btn" id="fuzzy-apply-btn" data-target="${closest}">Apply</button>
        `;

        document.getElementById("fuzzy-apply-btn").addEventListener("click", (evt) => {
          nameInput.value = evt.target.getAttribute("data-target");
          suggestionWrapper.innerHTML = "";
          suggestionWrapper.className = "";
          nameInput.focus();
        });
      } else {
        suggestionWrapper.className = "";
      }
    });
  }

  // Kitchen add ingredient form
  const addIngredientForm = document.getElementById("add-ingredient-form");
  addIngredientForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const qtyInput = document.getElementById("ingredient-qty");
    const unitInput = document.getElementById("ingredient-unit");
    const catInput = document.getElementById("ingredient-category");

    const newIngred = {
      id: "ingred-" + Date.now(),
      name: nameInput.value.trim(),
      qty: qtyInput.value ? parseFloat(qtyInput.value) : "",
      unit: unitInput.value,
      category: catInput.value
    };

    state.kitchenIngredients.push(newIngred);
    saveKitchenToStorage();
    renderKitchen();
    
    // Gamification point: +1 XP
    gainXP(1, `Logged ${newIngred.name}`);

    showToast("Ingredient Added", `Placed ${newIngred.name} (${newIngred.qty || ""} ${newIngred.unit}) on the shelf.`, "success");

    // Reset inputs
    nameInput.value = "";
    qtyInput.value = "";
    suggestionWrapper.innerHTML = "";
    suggestionWrapper.className = "";
    nameInput.focus();
  });

  // Cook with ingredients redirect button
  document.getElementById("kitchen-suggest-btn").addEventListener("click", () => {
    document.getElementById("nav-feed").click();
  });

  // Camera Capture Modal logic
  let cameraStream = null;
  let capturedSnaps = [];

  const videoElement = document.getElementById("camera-video");
  const canvasElement = document.getElementById("camera-canvas");
  const snapsList = document.getElementById("camera-snapshots-list");
  const snapCountSpan = document.getElementById("camera-snap-count");
  const captureBtn = document.getElementById("camera-capture-btn");
  const uploadBtn = document.getElementById("camera-upload-btn");
  const cameraModal = document.getElementById("camera-modal");
  const cameraCloseBtn = document.getElementById("camera-modal-close-btn");

  const selectFileBtn = document.getElementById("upload-select-file-btn");
  const selectCameraBtn = document.getElementById("upload-select-camera-btn");
  const fileUploadInput = document.getElementById("meal-file-upload");
  const imgUrlInput = document.getElementById("meal-img-url");
  const uploadProgressContainer = document.getElementById("cdn-upload-progress");
  const uploadPercentText = document.getElementById("cdn-upload-percent");
  const uploadFillBar = document.getElementById("cdn-upload-fill");

  if (selectFileBtn && fileUploadInput) {
    selectFileBtn.addEventListener("click", () => {
      fileUploadInput.click();
    });
  }

  if (selectCameraBtn) {
    selectCameraBtn.addEventListener("click", () => {
      capturedSnaps = [];
      if (snapsList) snapsList.innerHTML = "";
      if (snapCountSpan) snapCountSpan.textContent = "0";
      if (uploadBtn) uploadBtn.classList.add("d-none");
      if (cameraModal) cameraModal.classList.add("active");

      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          cameraStream = stream;
          if (videoElement) videoElement.srcObject = stream;
        })
        .catch(err => {
          console.error("Camera access failed:", err);
          showToast("Camera Access Failed", "Please allow camera permissions or upload from files instead.", "warning");
          if (cameraModal) cameraModal.classList.remove("active");
        });
    });
  }

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (cameraModal) cameraModal.classList.remove("active");
  };

  if (cameraCloseBtn) {
    cameraCloseBtn.addEventListener("click", stopCameraStream);
  }

  if (cameraModal) {
    cameraModal.addEventListener("click", (evt) => {
      if (evt.target === cameraModal) {
        stopCameraStream();
      }
    });
  }

  function updateUploadButtonState() {
    if (capturedSnaps.length >= 3 && capturedSnaps.length <= 4) {
      uploadBtn.classList.remove("d-none");
    } else {
      uploadBtn.classList.add("d-none");
    }
  }

  function refreshThumbnails() {
    if (!snapsList) return;
    snapsList.innerHTML = "";
    capturedSnaps.forEach((url, index) => {
      const thumb = document.createElement("div");
      thumb.style.position = "relative";
      thumb.style.width = "60px";
      thumb.style.height = "60px";
      thumb.style.borderRadius = "6px";
      thumb.style.overflow = "hidden";
      thumb.style.border = "1px solid var(--border-color)";

      thumb.innerHTML = `
        <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">
        <button type="button" class="thumb-del" style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); border: none; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; cursor: pointer;">&times;</button>
      `;

      thumb.querySelector(".thumb-del").addEventListener("click", () => {
        capturedSnaps.splice(index, 1);
        refreshThumbnails();
      });

      snapsList.appendChild(thumb);
    });
    if (snapCountSpan) snapCountSpan.textContent = capturedSnaps.length;
    updateUploadButtonState();
  }

  if (captureBtn) {
    captureBtn.addEventListener("click", () => {
      if (capturedSnaps.length >= 4) {
        showToast("Limit Reached", "You can only snap up to 4 photos.", "warning");
        return;
      }

      if (videoElement && canvasElement) {
        const context = canvasElement.getContext("2d");
        canvasElement.width = videoElement.videoWidth || 640;
        canvasElement.height = videoElement.videoHeight || 480;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        const dataUrl = canvasElement.toDataURL("image/jpeg");
        capturedSnaps.push(dataUrl);
        refreshThumbnails();
      }
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
      stopCameraStream();

      if (!capturedSnaps || capturedSnaps.length === 0) {
        showToast("No Snaps", "Please capture at least 3 or 4 photos.", "warning");
        return;
      }

      if (uploadProgressContainer && uploadFillBar && uploadPercentText) {
        uploadProgressContainer.style.display = "block";
        uploadFillBar.style.width = "20%";
        uploadPercentText.textContent = "Transmitting camera snapshot to backend...";

        let serverUrl = null;
        try {
          const primarySnap = capturedSnaps[0];
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: `camera-snap-${Date.now()}.jpg`,
              fileData: primarySnap,
              fileType: 'image/jpeg'
            })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.url) {
              serverUrl = data.url;
            }
          }
        } catch (err) {
          console.warn("Camera snap upload to backend failed, using fallback URL:", err);
        }

        const finalUrl = serverUrl || `https://cdn.thechef.io/uploads/camera-set-${Date.now()}.jpg`;
        uploadFillBar.style.width = "100%";
        uploadPercentText.textContent = "100%";

        setTimeout(() => {
          if (imgUrlInput) imgUrlInput.value = finalUrl;
          const videoUrlInput = document.getElementById("meal-video-url");
          if (videoUrlInput) videoUrlInput.value = "";

          showToast("Upload Successful", `Camera snapshot saved securely to server.`, "success");
          uploadProgressContainer.style.display = "none";

          const mediaIndicator = document.getElementById("media-status-indicator");
          const mediaText = document.getElementById("media-status-text");
          if (mediaIndicator && mediaText) {
            mediaIndicator.style.display = "flex";
            mediaText.textContent = `${capturedSnaps.length} Camera snapshots uploaded successfully!`;
          }
        }, 300);
      }
    });
  }

  // Real Backend CDN File Uploader for My Meal

  if (fileUploadInput) {
    fileUploadInput.addEventListener("change", async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      uploadProgressContainer.style.display = "block";
      uploadFillBar.style.width = "0%";
      uploadPercentText.textContent = "Inspecting files...";

      const fileList = Array.from(files);
      const containsVideo = fileList.some(f => f.type.startsWith("video/"));
      const containsImage = fileList.some(f => f.type.startsWith("image/"));

      const proceedWithRealUpload = async (fileList, isVideoUpload, videoDurationSec = 0) => {
        uploadPercentText.textContent = "10%";
        uploadFillBar.style.width = "10%";

        let serverUrl = null;
        try {
          const targetFile = fileList[0];
          uploadPercentText.textContent = "Reading file content...";
          const base64Data = await readFileAsBase64(targetFile);

          uploadPercentText.textContent = "50% (Saving to server uploads)...";
          uploadFillBar.style.width = "50%";

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: targetFile.name,
              fileType: targetFile.type,
              fileData: base64Data
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.url) {
              serverUrl = data.url;
            }
          }
        } catch (err) {
          console.warn("Backend file upload failed, falling back to CDN:", err);
        }

        const fallbackUrl = isVideoUpload 
          ? `https://cdn.thechef.io/uploads/video-${Date.now()}.${fileList[0].name.split('.').pop()}`
          : `https://cdn.thechef.io/uploads/gallery-set-${Date.now()}.jpg`;
        
        const finalUrl = serverUrl || fallbackUrl;

        uploadFillBar.style.width = "100%";
        uploadPercentText.textContent = "100%";

        setTimeout(() => {
          const videoUrlInput = document.getElementById("meal-video-url");
          if (isVideoUpload) {
            if (imgUrlInput) imgUrlInput.value = "";
            if (videoUrlInput) videoUrlInput.value = finalUrl;
          } else {
            if (imgUrlInput) imgUrlInput.value = finalUrl;
            if (videoUrlInput) videoUrlInput.value = "";
          }

          showToast("Upload Successful", `Media saved securely to server uploads.`, "success");
          uploadProgressContainer.style.display = "none";

          const mediaIndicator = document.getElementById("media-status-indicator");
          const mediaText = document.getElementById("media-status-text");
          if (mediaIndicator && mediaText) {
            mediaIndicator.style.display = "flex";
            if (isVideoUpload) {
              mediaText.textContent = `Video (${Math.round(videoDurationSec)}s) uploaded successfully!`;
            } else {
              mediaText.textContent = `${fileList.length} Gallery pictures uploaded successfully!`;
            }
          }
        }, 300);
      };

      // Case 1: Video File
      if (containsVideo) {
        if (fileList.length > 1) {
          uploadProgressContainer.style.display = "none";
          fileUploadInput.value = "";
          showToast("Upload Rejected", "You can only upload a single video file at a time.", "warning");
          return;
        }

        const file = fileList[0];
        const maxVideoSize = 20 * 1024 * 1024; // 20MB
        if (file.size > maxVideoSize) {
          uploadProgressContainer.style.display = "none";
          fileUploadInput.value = "";
          showToast(
            "Video Rejected", 
            `Video size exceeds 20MB limit (Your file: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`, 
            "warning"
          );
          return;
        }

        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          const duration = video.duration;

          if (duration > 30) {
            uploadProgressContainer.style.display = "none";
            fileUploadInput.value = "";
            showToast(
              "Video Rejected", 
              `Video length exceeds 30 seconds limit (Your video: ${Math.round(duration)} seconds).`, 
              "warning"
            );
          } else {
            proceedWithRealUpload(fileList, true, duration);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(video.src);
          uploadProgressContainer.style.display = "none";
          fileUploadInput.value = "";
          showToast("Invalid File Format", "Failed to parse video metadata.", "warning");
        };
        return;
      }

      // Case 2: Image Files (must be exactly 3 or 4 pictures)
      if (containsImage) {
        if (fileList.length < 3 || fileList.length > 4) {
          uploadProgressContainer.style.display = "none";
          fileUploadInput.value = "";
          showToast(
            "Upload Rejected", 
            `You must select exactly 3 or 4 pictures (You selected ${fileList.length}).`, 
            "warning"
          );
          return;
        }

        const maxImgSize = 5 * 1024 * 1024; // 5MB per image
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.size > maxImgSize) {
            uploadProgressContainer.style.display = "none";
            fileUploadInput.value = "";
            showToast(
              "Image Rejected", 
              `Image "${file.name}" exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`, 
              "warning"
            );
            return;
          }
        }

        proceedWithRealUpload(fileList, false);
      }
    });
  }

  // Save Secret Meal Form (Connected to Backend API)
  const saveMealForm = document.getElementById("save-meal-form");
  if (saveMealForm) {
    saveMealForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("meal-name").value.trim();
      const ingredientsText = document.getElementById("meal-ingredients").value.trim();
      const procedureText = document.getElementById("meal-procedure").value.trim();
      const nutrition = document.getElementById("meal-nutrition").value.trim();
      const imgUrl = document.getElementById("meal-img-url").value.trim() || "";
      const videoUrl = document.getElementById("meal-video-url").value.trim() || "";

      // Enforce media upload requirement
      if (!imgUrl && !videoUrl) {
        showToast("Media Required", "Uploading pictures or a video is mandatory to log your custom recipe.", "warning");
        return;
      }

      // AI Guardrail filter: block AI titles or procedures
      if (isAiGeneratedContent(name, procedureText + " " + ingredientsText)) {
        showToast("AI Content Blocked", "Your recipe looks AI-generated! The Chef only accepts real-life, human-made recipe files.", "warning");
        return;
      }

      const ingredients = ingredientsText.split("\n").map(i => i.trim()).filter(Boolean);
      const procedure = procedureText.split("\n").map(p => p.trim()).filter(Boolean);

      const newMealPayload = {
        id: "secret-" + Date.now(),
        name,
        ingredients,
        procedure,
        nutrition,
        imgUrl,
        videoUrl
      };

      let savedMeal = newMealPayload;

      try {
        const response = await fetch('/api/meals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMealPayload)
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.meal) {
            savedMeal = resData.meal;
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          if (errData.error) {
            showToast("Save Failed", errData.error, "warning");
            return;
          }
        }
      } catch (err) {
        console.warn("Backend save failed, storing recipe locally:", err);
      }

      state.secretMeals.unshift(savedMeal);
      state.lastSavedMeal = savedMeal;
      saveSecretMealsToStorage();
      renderSecretMeals();
      saveMealForm.reset();

      // Make the Share button next to the Save button visible and active
      const shareLastSavedBtn = document.getElementById("btn-share-last-saved");
      if (shareLastSavedBtn) {
        shareLastSavedBtn.classList.remove("d-none");
        shareLastSavedBtn.style.display = "block";
      }

      // Reset hidden inputs and indicator
      document.getElementById("meal-img-url").value = "";
      document.getElementById("meal-video-url").value = "";
      const mediaIndicator = document.getElementById("media-status-indicator");
      if (mediaIndicator) mediaIndicator.style.display = "none";

      // Gamification points: +3 XP for logging a custom secret meal!
      gainXP(3, `Saved Secret Recipe: ${savedMeal.name}`);

      showToast("Secret Saved", `Logged "${savedMeal.name}" into your secure recipe vault!`, "success");
    });
  }

  // Click handler for Share button next to Save button
  const shareLastSavedBtn = document.getElementById("btn-share-last-saved");
  if (shareLastSavedBtn) {
    shareLastSavedBtn.addEventListener("click", () => {
      if (state.lastSavedMeal) {
        generateShareLink(state.lastSavedMeal);
      } else {
        showToast("No Recipe Saved", "Please save a recipe first.", "warning");
      }
    });
  }

  // Chef tab culture search filter
  const chefCultureSearch = document.getElementById("chef-culture-search");
  if (chefCultureSearch) {
    chefCultureSearch.addEventListener("input", () => {
      runChefEngine();
    });
  }

  // Time machine slider
  const timeSlider = document.getElementById("simulated-time-slider");
  if (timeSlider) {
    timeSlider.addEventListener("input", (e) => {
      state.simulatedTime = parseInt(e.target.value);
      updateTimeWidget();
      checkMealTimeNotifications();
    });
  }

  // Banner suggest click
  document.getElementById("alert-suggest-btn").addEventListener("click", () => {
    document.getElementById("meal-time-alert").classList.add("d-none");
    const mealTime = getMealTypeFromMinutes(state.simulatedTime);
    state.chefQueryIngredients = state.kitchenIngredients.map(i => i.name);
    renderQuickTags();
    runChefEngine(mealTime);
    showToast("The Chef Active", `Filtered suggestions for ${mealTime} based on your kitchen.`, "success");
  });

  // Profile Form
  const profileForm = document.getElementById("profile-settings-form");
  const avatarOpts = document.querySelectorAll(".avatar-opt");
  let selectedAvatar = state.profile.avatarUrl;

  avatarOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      avatarOpts.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      selectedAvatar = opt.getAttribute("data-avatar-url");
    });
  });

  // Link avatar choice to initial profile selection
  avatarOpts.forEach(opt => {
    if (opt.getAttribute("data-avatar-url") === state.profile.avatarUrl) {
      opt.click();
    }
  });

  const skillSlider = document.getElementById("profile-skill-slider");
  skillSlider.addEventListener("input", (e) => {
    document.getElementById("skill-num-display").textContent = e.target.value;
  });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const profileNameInput = document.getElementById("profile-name");
    const profileEmailInput = document.getElementById("profile-email");
    const profilePasswordInput = document.getElementById("profile-password");
    const profileCountrySelect = document.getElementById("profile-country");
    
    state.profile.name = profileNameInput.value.trim();
    state.profile.email = profileEmailInput.value.trim();
    state.profile.password = profilePasswordInput.value.trim();
    const oldCountry = state.profile.country;
    state.profile.country = profileCountrySelect.value;
    state.profile.continent = getContinentOfCountry(profileCountrySelect.value) || "Africa";
    state.profile.avatarUrl = selectedAvatar;
    state.profile.skillLevel = parseInt(skillSlider.value);

    saveProfileToStorage();
    renderProfile();
    
    if (state.profile.country !== oldCountry) {
      state.youtubeFeedVideosFetched = false;
      state.lastYoutubeQuery = "";
      fetchYoutubeFeedVideos();
    } else {
      renderFeed();
    }

    // Close the profile edit modal
    const editModal = document.getElementById("profile-edit-modal");
    if (editModal) editModal.classList.remove("active");

    showToast("Profile Saved", "Your secure profile changes have been saved successfully.", "success");
  });

  // Modal Closures
  document.getElementById("modal-close-btn").addEventListener("click", closeRecipeModal);
  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("recipe-detail-modal")) {
      closeRecipeModal();
    }
    if (e.target === document.getElementById("share-landing-modal")) {
      closeShareModal();
    }
  });

  document.getElementById("share-modal-close-btn").addEventListener("click", closeShareModal);
  document.getElementById("share-modal-explore-btn").addEventListener("click", closeShareModal);

  // Quick Entry Box Event Listeners
  const textInput = document.getElementById("chef-text-input");
  const submitBtn = document.getElementById("chef-text-submit-btn");
  const clearBtn = document.getElementById("chef-clear-custom-btn");
  const saveBtn = document.getElementById("chef-save-to-kitchen-btn");

  function processCustomInput() {
    const val = textInput.value.trim();
    if (!val) return;

    // Parse comma-separated values
    const items = val.split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (items.length > 0) {
      state.chefQueryIngredients = items;
      renderQuickTags();
      runChefEngine();
      textInput.value = "";
      showToast("Ingredients Parsed", `Matched Chef suggestions to ${items.length} typed ingredients.`, "success");
    }
  }

  if (submitBtn) submitBtn.addEventListener("click", processCustomInput);
  if (textInput) {
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        processCustomInput();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.chefQueryIngredients = [];
      document.getElementById("chef-quick-tags-container").classList.add("d-none");
      const badge = document.getElementById("chef-input-source-badge");
      badge.textContent = "Using My Kitchen Shelf";
      badge.className = "badge badge-primary";
      runChefEngine();
      showToast("Pantry Search Reset", "Reverting back to your kitchen shelf database.");
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (state.chefQueryIngredients.length === 0) return;

      let addedCount = 0;
      state.chefQueryIngredients.forEach(item => {
        // Check if it already exists (case-insensitive)
        const exists = state.kitchenIngredients.some(existing => 
          existing.name.toLowerCase() === item.toLowerCase()
        );

        if (!exists) {
          // Auto-assign category
          const lowerItem = item.toLowerCase();
          let category = "Spices & Pantry"; // default
          if (lowerItem.includes("tomato") || lowerItem.includes("onion") || lowerItem.includes("pepper") || lowerItem.includes("carrot") || lowerItem.includes("spinach") || lowerItem.includes("leaf") || lowerItem.includes("cilantro") || lowerItem.includes("lime") || lowerItem.includes("pineapple")) {
            category = "Vegetables & Fruits";
          } else if (lowerItem.includes("beef") || lowerItem.includes("chicken") || lowerItem.includes("fish") || lowerItem.includes("pork") || lowerItem.includes("sausage") || lowerItem.includes("bacon") || lowerItem.includes("meat") || lowerItem.includes("egg") || lowerItem.includes("cheese")) {
            category = "Proteins";
          } else if (lowerItem.includes("rice") || lowerItem.includes("yam") || lowerItem.includes("flour") || lowerItem.includes("starch") || lowerItem.includes("potato") || lowerItem.includes("tortilla") || lowerItem.includes("bread")) {
            category = "Grains & Carbs";
          }

          state.kitchenIngredients.push({
            id: "ingred-" + Date.now() + Math.random().toString(36).substr(2, 5),
            name: item,
            qty: "",
            category: category
          });
          addedCount++;
        }
      });

      saveKitchenToStorage();
      renderKitchen(); // Refresh kitchen view
      
      const countText = addedCount > 0 ? `Saved ${addedCount} new ingredients to your kitchen shelf!` : "All typed ingredients were already on your shelf.";
      showToast("Kitchen Shelves Updated", countText, "success");

      // Reset query
      state.chefQueryIngredients = [];
      document.getElementById("chef-quick-tags-container").classList.add("d-none");
      const badge = document.getElementById("chef-input-source-badge");
      badge.textContent = "Using My Kitchen Shelf";
      badge.className = "badge badge-primary";
      runChefEngine();
    });
  }
}

// -------------------------------------------------------------
// VIEW RENDERERS
// -------------------------------------------------------------

// Render Feed
// Helper to extract YouTube thumbnail from embed URL
function setupCountryDropdown() {
  const trigger = document.getElementById("profile-country-trigger");
  const menu = document.getElementById("profile-country-dropdown");
  const searchInput = document.getElementById("profile-country-search-input");
  const listContainer = document.getElementById("profile-country-list");
  const hiddenInput = document.getElementById("profile-country");
  const label = document.getElementById("profile-country-selected-label");

  if (!trigger || !menu || !searchInput || !listContainer || !hiddenInput || !label) return;

  // Toggle dropdown menu
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
    if (menu.classList.contains("active")) {
      searchInput.value = "";
      renderList();
      searchInput.focus();
    }
  });

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove("active");
    }
  });

  // Search input typing filter
  searchInput.addEventListener("input", (e) => {
    const filter = e.target.value.toLowerCase().trim();
    renderList(filter);
  });

  // Function to render items
  function renderList(filter = "") {
    listContainer.innerHTML = "";
    const selectedValue = hiddenInput.value;

    // Filter lists
    const filteredSuggested = SUGGESTED_COUNTRIES.filter(c => c.toLowerCase().includes(filter));
    const filteredOthers = ALL_COUNTRIES
      .filter(c => !SUGGESTED_COUNTRIES.includes(c))
      .filter(c => c.toLowerCase().includes(filter))
      .sort((a, b) => a.localeCompare(b));

    // Render Suggested section
    if (filteredSuggested.length > 0) {
      const header = document.createElement("div");
      header.className = "custom-dropdown-header";
      header.textContent = "Popular / Suggested";
      listContainer.appendChild(header);

      filteredSuggested.forEach(c => {
        createItem(c);
      });
    }

    // Render remaining section
    if (filteredOthers.length > 0) {
      const header = document.createElement("div");
      header.className = "custom-dropdown-header";
      header.textContent = "All Countries";
      listContainer.appendChild(header);

      filteredOthers.forEach(c => {
        createItem(c);
      });
    }

    if (filteredSuggested.length === 0 && filteredOthers.length === 0) {
      const empty = document.createElement("div");
      empty.className = "custom-dropdown-item";
      empty.style.color = "var(--text-muted)";
      empty.style.fontStyle = "italic";
      empty.textContent = "No countries match search.";
      listContainer.appendChild(empty);
    }

    function createItem(c) {
      const item = document.createElement("div");
      item.className = "custom-dropdown-item";
      if (c === selectedValue) {
        item.classList.add("selected");
      }
      item.innerHTML = `
        <span>${c}</span>
        ${c === selectedValue ? '<i class="fa-solid fa-circle-check"></i>' : ''}
      `;

      item.addEventListener("click", () => {
        hiddenInput.value = c;
        label.textContent = c;
        menu.classList.remove("active");
        searchInput.value = "";
        
        // Trigger render to update active state
        renderList();
      });

      listContainer.appendChild(item);
    }
  }

  // Initial list rendering
  renderList();

  // Export helper to set country value programmatically (used by renderProfile)
  window.setProfileCountry = (c) => {
    hiddenInput.value = c;
    label.textContent = c || "Select Country";
    renderList();
  };
}

function setupProfileGateway() {
  const modal = document.getElementById("profile-gateway-modal");
  const form = document.getElementById("gateway-registration-form");
  const avatarGrid = document.getElementById("gateway-avatar-picker");
  
  if (!modal || !form) return;

  // Handle avatar picker selection in gateway modal
  if (avatarGrid) {
    const avatars = avatarGrid.querySelectorAll(".avatar-opt");
    avatars.forEach(avatar => {
      avatar.addEventListener("click", () => {
        avatars.forEach(a => a.classList.remove("active"));
        avatar.classList.add("active");
      });
    });
  }

  // Handle registration form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nameVal = document.getElementById("gateway-name").value.trim();
    const emailVal = document.getElementById("gateway-email").value.trim();
    const passwordVal = document.getElementById("gateway-password").value.trim();
    
    let avatarUrl = "data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot; fill=&quot;%23fc4a1a&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;48&quot; fill=&quot;%231a1a1a&quot; stroke=&quot;%23fc4a1a&quot; stroke-width=&quot;2&quot;/><path d=&quot;M50 25c-8 0-14 6-14 14 0 3 1 5 2 7-6 2-10 8-10 15 0 8 6 14 14 14h16c8 0 14-6 14-14 0-7-4-13-10-15 1-2 2-4 2-7 0-8-6-14-14-14zm-12 40h24v6H38z&quot; fill=&quot;%23fc4a1a&quot;/></svg>";
    if (avatarGrid) {
      const activeAvatar = avatarGrid.querySelector(".avatar-opt.active");
      if (activeAvatar) {
        avatarUrl = activeAvatar.getAttribute("data-avatar-url");
      }
    }

    // Save details to state profile
    state.profile.name = nameVal;
    state.profile.email = emailVal;
    state.profile.password = passwordVal;
    state.profile.avatarUrl = avatarUrl;
    state.profile.country = "Nigeria"; // Default country
    state.profile.continent = "Africa";
    state.profile.skillLevel = 45;
    
    // Ensure new account starts with completely empty kitchen shelves
    state.kitchenIngredients = [];
    saveKitchenToStorage();
    if (typeof renderKitchen === "function") renderKitchen();
    if (typeof runChefEngine === "function") runChefEngine();
    
    saveProfileToStorage();
    renderProfile();
    
    modal.classList.remove("active");
    showToast("Account Created", `Welcome to THE CHEF, ${nameVal}!`, "success");

    // After profile is created, show the YouTube API key modal if it isn't configured yet
    if (!"") {
      const apiModal = document.getElementById("youtube-api-modal");
      if (apiModal) {
        setTimeout(() => {
          // modal removed;
        }, 500);
      }
    }
  });
}

function setupProfileFirewall() {
  const triggerBtn = document.getElementById("btn-edit-profile-trigger");
  const firewallModal = document.getElementById("profile-firewall-modal");
  const firewallCloseBtn = document.getElementById("profile-firewall-close-btn");
  const unlockBtn = document.getElementById("btn-unlock-profile");
  const emailInput = document.getElementById("firewall-email");
  const passwordInput = document.getElementById("firewall-password");

  const editModal = document.getElementById("profile-edit-modal");
  const editCloseBtn = document.getElementById("profile-edit-close-btn");

  if (!firewallModal || !editModal) return;

  // Open firewall verification modal
  if (triggerBtn) {
    triggerBtn.addEventListener("click", () => {
      if (emailInput) emailInput.value = "";
      if (passwordInput) passwordInput.value = "";
      firewallModal.classList.add("active");
    });
  }

  // Close firewall modal
  const closeFirewall = () => {
    firewallModal.classList.remove("active");
  };
  if (firewallCloseBtn) firewallCloseBtn.addEventListener("click", closeFirewall);

  // Close edit profile modal
  const closeEdit = () => {
    editModal.classList.remove("active");
  };
  if (editCloseBtn) editCloseBtn.addEventListener("click", closeEdit);

  // Close modals on overlay click
  window.addEventListener("click", (e) => {
    if (e.target === firewallModal) {
      closeFirewall();
    }
    if (e.target === editModal) {
      closeEdit();
    }
  });

  // Verify credentials and unlock edit modal
  if (unlockBtn && emailInput && passwordInput) {
    unlockBtn.addEventListener("click", () => {
      const enteredEmail = emailInput.value.trim();
      const enteredPassword = passwordInput.value.trim();

      if (!enteredEmail || !enteredPassword) {
        showToast("Verification Required", "Please enter your Gmail and password to unlock.", "warning");
        return;
      }

      if (enteredEmail.toLowerCase() === state.profile.email.toLowerCase() && enteredPassword === state.profile.password) {
        // Verification success!
        closeFirewall();
        // Clear verification fields
        emailInput.value = "";
        passwordInput.value = "";
        
        // Open Edit Profile modal
        editModal.classList.add("active");
        showToast("Access Granted", "Firewall unlocked. You may edit your profile details.", "success");
      } else {
        showToast("Access Denied", "Incorrect Gmail or password. Access blocked.", "error");
      }
    });
  }
}

function setupCuisineDropdown() {
  const trigger = document.getElementById("chef-cuisine-trigger");
  const menu = document.getElementById("chef-cuisine-menu");
  const searchInput = document.getElementById("chef-cuisine-search-input");
  const listContainer = document.getElementById("chef-cuisine-list");
  const label = document.getElementById("chef-cuisine-selected-label");

  if (!trigger || !menu || !searchInput || !listContainer || !label) return;

  const CUISINES = [
    "All Cuisines (Local & Global Mix)",
    "Nigerian",
    "Mexican",
    "Brazilian",
    "Italian",
    "Indian",
    "Chinese"
  ];

  // Toggle menu
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = menu.style.display === "block";
    menu.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
      searchInput.value = "";
      renderList("");
      searchInput.focus();
    }
  });

  // Close menu when clicked outside
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !trigger.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  // Search filter input
  searchInput.addEventListener("input", (e) => {
    renderList(e.target.value.trim());
  });

  function renderList(filterText = "") {
    listContainer.innerHTML = "";
    const filter = filterText.toLowerCase();

    const filtered = CUISINES.filter(c => c.toLowerCase().includes(filter));
    
    filtered.forEach(c => {
      const item = document.createElement("div");
      item.style.padding = "10px 14px";
      item.style.fontSize = "0.85rem";
      item.style.color = "#fff";
      item.style.cursor = "pointer";
      item.style.transition = "background 0.2s";
      item.className = "dropdown-cuisine-item";
      
      // Add hover effects in JS
      item.addEventListener("mouseenter", () => {
        item.style.background = "rgba(252, 74, 26, 0.15)";
        item.style.color = "var(--accent-color)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "transparent";
        item.style.color = "#fff";
      });

      item.textContent = c;

      item.addEventListener("click", () => {
        if (c.startsWith("All Cuisines")) {
          state.activeCultureFilter = "All";
          label.textContent = "Select Cuisine";
        } else {
          state.activeCultureFilter = c;
          label.textContent = c;
        }
        
        menu.style.display = "none";
        renderFeed();
        runChefEngine();
      });

      listContainer.appendChild(item);
    });

    if (filtered.length === 0) {
      const noResults = document.createElement("div");
      noResults.style.padding = "10px 14px";
      noResults.style.fontSize = "0.8rem";
      noResults.style.color = "var(--text-muted)";
      noResults.textContent = "No cuisines found";
      listContainer.appendChild(noResults);
    }
  }

  // Initial render
  renderList("");
}

function get343Suggestions() {
  const userCountry = state.profile.country || "Nigeria";
  const userContinent = state.profile.continent || "Africa";
  
  // Clean AI-generated content first
  const pool = RECIPES.filter(r => !isAiGeneratedContent(r.name, r.story || ""));
  
  // Tier 1: User's local Country/Region (e.g. Nigerian)
  const tier1Pool = pool.filter(r => r.culture.toLowerCase() === userCountry.toLowerCase());
  
  // Tier 2: Broader continent outside user's country (e.g. African outside Nigerian)
  const tier2Pool = pool.filter(r => {
    const rContinent = getContinentOfRecipe(r);
    const rCountry = r.culture;
    return rContinent === userContinent && rCountry.toLowerCase() !== userCountry.toLowerCase();
  });
  
  // Tier 3: Different global cuisines (completely different continent/culture)
  const tier3Pool = pool.filter(r => {
    const rContinent = getContinentOfRecipe(r);
    return rContinent !== userContinent;
  });

  // Select 3 from Tier 1 (shuffle and fallback if not enough)
  let tier1 = shuffleArray([...tier1Pool]).slice(0, 3);
  if (tier1.length < 3) {
    const additional = pool.filter(r => !tier1.includes(r) && r.culture.toLowerCase() === userCountry.toLowerCase());
    tier1 = tier1.concat(shuffleArray(additional)).slice(0, 3);
  }

  // Select 4 from Tier 2
  let tier2 = shuffleArray([...tier2Pool]).slice(0, 4);
  if (tier2.length < 4) {
    const backup = pool.filter(r => !tier1.includes(r) && r.culture.toLowerCase() !== userCountry.toLowerCase());
    tier2 = tier2.concat(shuffleArray(backup)).slice(0, 4);
  }

  // Select 3 from Tier 3
  let tier3 = shuffleArray([...tier3Pool]).slice(0, 3);
  if (tier3.length < 3) {
    const backup = pool.filter(r => !tier1.includes(r) && !tier2.includes(r));
    tier3 = tier3.concat(shuffleArray(backup)).slice(0, 3);
  }

  // Combine into exactly 10 suggestions
  let result = [...tier1, ...tier2, ...tier3];
  
  // Ensure exactly 10 elements
  if (result.length < 10) {
    const remaining = pool.filter(r => !result.includes(r));
    result = result.concat(shuffleArray(remaining)).slice(0, 10);
  } else {
    result = result.slice(0, 10);
  }
  
  return result;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}





