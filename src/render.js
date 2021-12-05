console.log("from renderer");
const eL = require('electron');
const { ipcRenderer } = eL;

const { writeFile } = require('fs');

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector('video');

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

const stopBtn = document.getElementById('stopBtn');
stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

// Get the available video sources
async function getVideoSources() {
    ipcRenderer.send('get-video-source');
    console.log('have requested the selected input source')

    ipcRenderer.on('video-source-selected', (event, err, data) => {
      const selectedSource = data;
      console.log('have select capture source ', selectedSource);
      selectSource(selectedSource);
    })
}

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;

  const contraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  }

  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(contraints);

  // Preview thesource in a video element
  videoElement.srcObject = stream;
  var playPromise = videoElement.play();
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show UI playing UI
      console.log('previewing captured video source')
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
      console.log('captured video source paused')
    });
  }

  // Create Media MediaRecorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Updates UI
}

function handleDataAvailable(event) {
  console.log('video data available');
  recordedChunks.push(event.data);
}

async function handleStop(event) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs: vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());
  ipcRenderer.send('get-save-file');
  ipcRenderer.on('save-to-file', (event, err, data) => {
    const filePath = data;

    console.log(filePath);
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  });
}
