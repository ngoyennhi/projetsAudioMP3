let screen = document.querySelector('#screen');
let audio = document.querySelector('audio');
let audiotrack = document.querySelector('#audiotrack');
let playPause = document.querySelector('#playIconContainer');
let btnPlay = document.querySelector('#btn_play');
let btnPause = document.querySelector('#btn_pause');
let btnStop = document.querySelector('#btn_stop');
let btnBack = document.querySelector('#btn_back');
let btnNext = document.querySelector('#btn_next');
let btnRegleVolume = document.querySelector('#btn_volume');
let btnAudioMuted = document.querySelector('#audio_muted');
let btnAudio = document.querySelector('#btn_audio');
let btnMute = document.querySelector('#btn_muted');
let btnTitle = document.querySelector('#btn_title');
let barZone = document.querySelector('#wavebar');
let song_title = document.querySelector('#song_title');
let songselected = 0;
let duration;
let slider = document.getElementById('myRange');
let output = document.getElementById('demo');
let controlvolumn = document.getElementById('controlvolumn');
let time_start = document.getElementById('timeStart');
let time_end = document.getElementById('timeEnd');
// let timer_content = document.getElementById('timer');

const durationToggler = document.getElementById('duration-toggler');

//funtion to exchange format of time seconds to hh:mm:ss
function secondsToTime(e) {
  let h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0')

  return h + ':' + m + ':' + s
  //return `${h}:${m}:${s}`;
}
//Change display of elements display ON OFF

function StateOn(element) {
  element.classList.remove('display_off');
  element.classList.add('display_on');
}

function StateOff(element) {
  element.classList.remove('display_on');
  element.classList.add('display_off');
}

//display title of song who is playing
function leTitle(jsonObj, songselected) {
  let song_arr = document.querySelectorAll('#song_title>*');
  song_arr.forEach((element) => {
    element.remove();
  })

  let playlist = jsonObj[songselected];

  let title = document.createElement('h1');
  let singer = document.createElement('h3');
  let writer = document.createElement('h3');

  title.textContent = playlist.title;
  singer.textContent = playlist.singer;
  writer.textContent = playlist.writer;

  song_title.appendChild(title);
  song_title.appendChild(singer);
  song_title.appendChild(writer);
}

//display image of song who is playing
function changeBackgroundImage(jsonObj, songselected) {
  let playlist = jsonObj[songselected];
  url_src = playlist.image;
  screen.style.backgroundImage = "url('" + url_src + "')";
}

//upload playlist on hototongminh.needemand.com ( one times)
let p = fetch('https://hotongminh.needemand.com/json/playlist.php')
p.then(function (response) {
  if (!response.ok) {
    throw new Error('HTTP error, status = ' + response.status)
  }
  let contentType = response.headers.get('content-type')
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json().then(function (contenu) {
      // // all actions when we get playlist

      //    console.log(contenu);
      //button PLAY/PAUSE
      //async it means that: await function play() end, to continue these other functions
      playPause.addEventListener('click', async (e) => {
        if (btnPlay.className.includes('display_off')) {
          if (songselected == null) {
            songselected = 0;
          } else {
            //src
            //take a look to compare src of audio to play/pause
            if (!audio.src.includes(contenu[songselected].src)) {
              audio.src = contenu[songselected].src;
            }

            //play
            await audio.play();

            // //show duration of audio (s)
            time_end.textContent=secondsToTime(audio.duration);


            StateOff(btnPause);
            StateOn(btnPlay);
            StateOn(barZone);
            leTitle(contenu, songselected);
            changeBackgroundImage(contenu, songselected);

          }
        } else {
          audio.pause();
          StateOff(btnPlay);
          StateOn(btnPause);
          StateOff(barZone);
        }
      })

      //this function ensures that the value of the duration toggler is updated to reflect the current progress.
      audio.addEventListener('timeupdate', (e) => {
        durationToggler.value = audio.currentTime;  
        //show current time      
        time_start.textContent=secondsToTime(audio.currentTime);
      })

      // duration
      durationToggler.addEventListener('input', (e) => {
        //take max of range bar = duration of song
        durationToggler.max=audio.duration;
        audio.currentTime = durationToggler.value;
      })

      //button NEXT/BACK
      btnNext.addEventListener('click', async  (e) => {
        //next song
        songselected++;
        if (songselected > contenu.length - 1) {
          songselected = 0;
        }

        //change source
        audio.src = contenu[songselected].src;

        //play
        await audio.play();
        StateOn(btnPlay);
        StateOff(btnPause);
        StateOn(barZone);
        durationToggler.value.max = Math.max(audio.duration);

        leTitle(contenu, songselected);
        changeBackgroundImage(contenu, songselected);

  //show end time 
        time_end.textContent=secondsToTime(audio.duration);

        
      })

      //button BACK
      btnBack.addEventListener('click', async (e) => {
        songselected--;
        if (songselected < 0) {
          songselected = 0;
        }

        //change source
        audio.src = contenu[songselected].src;
        await audio.play();
        durationToggler.value.max = Math.max(audio.duration);

        //play
        StateOn(btnPlay);
        StateOff(btnPause);
        StateOn(barZone);

        leTitle(contenu, songselected);
        changeBackgroundImage(contenu, songselected);

        //show end time 
        time_end.textContent=secondsToTime(audio.duration);
     

      })

      //button TITLE
      btnTitle.addEventListener('click', (e) => {
        //change status to display on/off song_title
        if (song_title.className.includes('display_off')) {
          StateOn(song_title);
          leTitle(contenu, songselected);
          changeBackgroundImage(contenu, songselected);
        } else {
          StateOff(song_title);
        }
      })

      //button control Volumn bar
      btnRegleVolume.addEventListener('click', (e) => {
        if (controlvolumn.className.includes('display_off')) {
          StateOn(controlvolumn);
          StateOn(slider);
        } else {
          StateOff(controlvolumn);
          StateOff(slider);
        }
      })
      //button volumn // tao range cho volum roi them vao js nay
      // Update the current slider value (each time you drag the slider handle)
      slider.addEventListener('input', (e) => {
        //because value of volume is between (0-1) and our bar (1-100)
        audio.volume = slider.value / 100;

      })

      //button MUTED/AUDIO
      btnAudioMuted.addEventListener('click', (e) => {
        //includes() to test if there is 'display_on' or not
        if (btnAudio.className.includes('display_on')) {
          audio.muted = true;
          StateOn(btnMute);
          StateOff(btnAudio);
        } else {
          audio.muted = false;
          StateOn(btnAudio);
          StateOff(btnMute);
        }
      })

      //button STOP
      btnStop.addEventListener('click', (e) => {
        audio.load();
        audio.pause();
        StateOff(barZone);
        StateOff(song_title);
        screen.style.backgroundImage = 'none';
time_end.innerHTML="00:00:00"
      })
    })
  } else {
    console.log("le fichier envoyé n'est pas du json !");
  }
}).catch(function (error) {
  console.log('Aïe! Problème de réseau');
  console.log(error);
})

