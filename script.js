// Force manual scroll restoration immediately to prevent layout jumps on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const carEl = document.getElementById("active_scrolling_car");
  const frame1Bg = document.getElementById("frame1_bg");
  const frame2BgWrapper = document.getElementById("frame2_bg_wrapper");
  const saveTheDateHeader = document.getElementById("text_save_the_date");
  const d24 = document.getElementById("date_block_day");
  const d05 = document.getElementById("date_block_month");
  const d26 = document.getElementById("date_block_year");
  const scrollInstruction = document.getElementById("scroll_instruction");
  const formalPanel = document.getElementById("formal_invitation_panel");
  
  const musicBtn = document.getElementById("toggleMusicBtn");
  const musicBtnText = document.getElementById("musicBtnText");
  const speakerOn = document.getElementById("speakerOnIcon");
  const speakerOff = document.getElementById("speakerOffIcon");
  const audioEl = document.getElementById("weddingBgMusic");

  let isAudioPlaying = false;
  let autoTriggered = false;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function mapRange(val, inMin, inMax, outMin, outMax) {
    if (inMax === inMin) return outMin;
    const t = (val - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
  }

  let initialWidth = window.innerWidth;
  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth !== initialWidth) {
      initialWidth = window.innerWidth;
      setVh();
    }
  });
  window.addEventListener("orientationchange", setVh);
  setVh();

  window.scrollTo(0, 0);

  let targetScrollY = 0;
  let currentScrollY = 0;
  const ease = 0.08;

  window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  function tick() {
    currentScrollY += (targetScrollY - currentScrollY) * ease;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    let progress = 0;
    if (docHeight > 0) {
      progress = clamp(currentScrollY / docHeight, 0, 1);
    }

    updateAnimations(progress);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function updateAnimations(progress) {
    const h = window.innerHeight;
    const isMobile = window.innerWidth < 768;

    const carStartOffset = -240;
    const carEndOffset = h + 240;

    if (progress <= 0.78) {
      const currentYValue = carStartOffset + (progress / 0.78) * (carEndOffset - carStartOffset);
      let scaleVal = 1 - Math.abs(0.39 - progress) * (isMobile ? 0.12 : 0.28);
      if (progress > 0.65) {
        const exitScaleFactor = clamp(mapRange(progress, 0.65, 0.78, 1.0, 0.55), 0.55, 1.0);
        scaleVal *= exitScaleFactor;
      }
      const rotateAngle = isMobile ? 0 : Math.sin(progress * 15) * 1.5;
      const carOpacity = clamp(mapRange(progress, 0.72, 0.78, 1, 0), 0, 1);
      carEl.style.transform = `translate3d(0, ${currentYValue}px, 0) scale(${scaleVal}) rotate(${rotateAngle}deg)`;
      carEl.style.opacity = carOpacity;
    } else {
      carEl.style.opacity = "0";
    }

    const bgOpacity = progress <= 0.65 ? 1 : clamp(mapRange(progress, 0.65, 0.74, 1, 0), 0, 1);
    frame1Bg.style.opacity = bgOpacity;
    frame1Bg.style.transform = "scale(1) translate3d(0, 0, 0)";

    const frame2BgOpacity = clamp(mapRange(progress, 0.65, 0.78, 0, 1), 0, 1);
    frame2BgWrapper.style.opacity = frame2BgOpacity;

    let headerOpacity = 0;
    if (progress <= 0.65) {
      headerOpacity = clamp(mapRange(progress, 0.01, 0.12, 0, 1), 0, 1);
    } else {
      headerOpacity = clamp(mapRange(progress, 0.65, 0.72, 1, 0), 0, 1);
    }
    saveTheDateHeader.style.opacity = headerOpacity;
    saveTheDateHeader.style.transform = `translate3d(0, ${(1 - headerOpacity) * -15}px, 0)`;

    let d24Opacity = 0;
    if (progress <= 0.65) {
      d24Opacity = clamp(mapRange(progress, 0.08, 0.20, 0, 1), 0, 1);
    } else {
      d24Opacity = clamp(mapRange(progress, 0.65, 0.72, 1, 0), 0, 1);
    }
    d24.style.opacity = d24Opacity;
    d24.style.transform = `scale(${0.95 + 0.05 * d24Opacity})`;

    let d05Opacity = 0;
    if (progress <= 0.65) {
      d05Opacity = clamp(mapRange(progress, 0.20, 0.32, 0, 1), 0, 1);
    } else {
      d05Opacity = clamp(mapRange(progress, 0.65, 0.72, 1, 0), 0, 1);
    }
    d05.style.opacity = d05Opacity;
    d05.style.transform = `scale(${0.95 + 0.05 * d05Opacity})`;

    let d26Opacity = 0;
    if (progress <= 0.65) {
      d26Opacity = clamp(mapRange(progress, 0.32, 0.44, 0, 1), 0, 1);
    } else {
      d26Opacity = clamp(mapRange(progress, 0.65, 0.72, 1, 0), 0, 1);
    }
    d26.style.opacity = d26Opacity;
    d26.style.transform = `scale(${0.95 + 0.05 * d26Opacity})`;

    const instructionOpacity = clamp(mapRange(progress, 0.0, 0.02, 1, 0), 0, 1);
    scrollInstruction.style.opacity = instructionOpacity;
    scrollInstruction.style.transform = `translate3d(-50%, ${(1 - instructionOpacity) * 15}px, 0)`;

    const formalOpacity = clamp(mapRange(progress, 0.74, 0.86, 0, 1), 0, 1);
    formalPanel.style.opacity = formalOpacity;
    formalPanel.style.transform = `translate3d(0, ${(1 - formalOpacity) * 20}px, 0)`;

    if (progress >= 0.74) {
      formalPanel.style.pointerEvents = "auto";
    } else {
      formalPanel.style.pointerEvents = "none";
    }
  }

  function playAudio() {
    audioEl.play().then(() => {
      isAudioPlaying = true;
      musicBtnText.innerText = "PLAYING";
      speakerOn.classList.remove("hidden");
      speakerOff.classList.add("hidden");
    }).catch(err => {
      console.log("Audio loading deferred until active interaction.", err);
    });
  }

  function pauseAudio() {
    audioEl.pause();
    isAudioPlaying = false;
    musicBtnText.innerText = "PLAY MUSIC";
    speakerOn.classList.add("hidden");
    speakerOff.classList.remove("hidden");
  }

  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  const triggerInteractiveAudio = () => {
    if (!isAudioPlaying && !autoTriggered) {
      autoTriggered = true;
      playAudio();
      cleanupInteractionListeners();
    }
  };

  function cleanupInteractionListeners() {
    document.removeEventListener("click", triggerInteractiveAudio);
    document.removeEventListener("touchstart", triggerInteractiveAudio);
    document.removeEventListener("scroll", triggerInteractiveAudio);
  }

  document.addEventListener("click", triggerInteractiveAudio, { passive: true });
  document.addEventListener("touchstart", triggerInteractiveAudio, { passive: true });
  document.addEventListener("scroll", triggerInteractiveAudio, { passive: true });

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    targetScrollY = 0;
    currentScrollY = 0;
    setVh();
  });

  const targetWeddingDate = new Date("2026-07-11T07:00:00Z");

  function runCountdown() {
    const distance = targetWeddingDate.getTime() - new Date().getTime();
    if (distance < 0) {
      document.getElementById("wedding_countdown").innerHTML = "<p class='text-gold-600 tracking-wider uppercase font-mono text-center w-full'>The Wedding has Begun!</p>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("days_val").innerText = String(days).padStart(2, "0");
    document.getElementById("hours_val").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes_val").innerText = String(minutes).padStart(2, "0");
  }

  setInterval(runCountdown, 1000);
  runCountdown();
});
