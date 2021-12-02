let audio = document.querySelector("audio");
let playPause = document.querySelector("#playIconContainer");
let btnPlay = document.querySelector("#btn_play");
let btnPause = document.querySelector("#btn_pause");
let btnStop = document.querySelector("#btn_stop");
let btnBack = document.querySelector("#btn_back");
let btnNext = document.querySelector("#btn_next");
let btnRegleVolume = document.querySelector("#btn_volume");
let btnAudioMuted = document.querySelector("#audio_muted");
let btnAudio = document.querySelector("#btn_audio");
let btnMute = document.querySelector("#btn_muted");
let btnTitle = document.querySelector("#btn_title");
let barZone = document.querySelector("#wavebar");


//button MUTED/AUDIO
btnAudioMuted.addEventListener("click", (e) => {
  //includes() to test if there is 'display_on' or not
  if (btnAudio.className.includes("display_on")) {
    audio.muted = true;
    StateOn(btnMute);
    StateOff(btnAudio);
  } else {
    audio.muted = false;
    StateOn(btnAudio);
    StateOff(btnMute);
  }
});

//button PLAY/PAUSE
playPause.addEventListener("click", (e) => {
  if (btnPlay.className.includes("display_on")) {
    audio.pause();
    StateOn(btnPause);
    StateOff(btnPlay);
	StateOff(barZone);
  } else {
    audio.play();
    StateOn(btnPlay);
    StateOff(btnPause);
	  StateOn(barZone);
  }
});

//button STOP
btnStop.addEventListener("click", (e) => {
  audio.load();
  audio.pause();
  StateOff(barZone);
});

//Change display of elements display ON OFF
function StateOn(element) {
  element.classList.remove("display_off");
  element.classList.add("display_on");
}
function StateOff(element) {
  element.classList.remove("display_on");
  element.classList.add("display_off");
}



//volume bar
let app = (() => {
  function updateSlider(element) {
    if (element) {
      let parent = element.parentElement,
        lastValue = parent.getAttribute("data-slider-value");

      if (lastValue === element.value) {
        return; // No value change, no need to update then
      }

      parent.setAttribute("data-slider-value", element.value);
      let $thumb = parent.querySelector(".range-slider__thumb"),
        $bar = parent.querySelector(".range-slider__bar"),
        pct =
          element.value *
          ((parent.clientHeight - $thumb.clientHeight) / parent.clientHeight);

      $thumb.style.bottom = `${pct}%`;
      $bar.style.height = `calc(${pct}% + ${$thumb.clientHeight / 2}px)`;
      $thumb.textContent = `${element.value}`;
    }
  }
  return {
    updateSlider: updateSlider,
  };
})();

(function initAndSetupTheSliders() {
  const inputs = [].slice.call(
    document.querySelectorAll(".range-slider input")
  );
  inputs.forEach((input) => input.setAttribute("value", "50"));
  inputs.forEach((input) => app.updateSlider(input));
  // Cross-browser support where value changes instantly as you drag the handle, therefore two event types.
  inputs.forEach((input) =>
    input.addEventListener("input", (element) => app.updateSlider(input))
  );
  inputs.forEach((input) =>
    input.addEventListener("change", (element) => app.updateSlider(input))
  );
})();
