const video = document.getElementById('video');
const button = document.getElementById('button');
const select = document.getElementById('select');
//const devices = await navigator.mediaDevices.enumerateDevices();
let currentStream;
let stopsign = 0;
let donotentersign = 0;
let redlight = 0;
let yellowlight = 0;
let greenlight = 0;

// The video
let video2;
let Stop;
let Go;
let Yellow;
let redlightsound;
let stopsignsound;
let donotentersignsound;

// For displaying the label
let label = "waiting...";
// The classifier
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/Ui5Bv4szM/'; // Change link to the link for your model in teachable machiene after upload (Labeled Your Shareable Link)

button.addEventListener('click', event => {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (select.value === '') {
    videoConstraints.facingMode = 'environment';
  } else {
    videoConstraints.deviceId = { exact: select.value };
  }
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});
navigator.mediaDevices.enumerateDevices().then(gotDevices);

// Load the model!
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

video = currentStream;

function setup() {
  createCanvas(640, 520);
  //createCanvas(1000, 1000);
  //Create the video
  video2 = createCapture(video);
  video2.hide();

  // Start classifying
  classifyVideo();
  Stop = loadSound('Stop.mp3'); //use your audiofile name inside the quotation marks for the stop sound (can be used for red light, stop sign, and do not enter sign souds)
  Yellow = loadSound('Yellow.mp3'); //use your audiofile name inside the quotation marks for the Yellow light sound
  Go = loadSound('go.mp3'); //use your audiofile name inside the quotation marks for the green light sound
  stopsignsound = loadSound('stopsign.mp3'); //use your audiofile name inside the quotation marks for the red light sound
  donotentersignsound = loadSound('donotenter.mp3'); //use your audiofile name inside the quotation marks for the do not enter sign sound
  redlightsound = loadSound('redlight.mp3'); //use your audiofile name inside the quotation marks for the red light sound
}

// classify the video!
function classifyVideo() {
  classifier.classify(video2, gotResults);
}

function draw() {
  background(0);

  // Draw the video
  image(video2, 0, 0);

  // Draw the label
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, width / 2, height - 16);

  // Play Sounds based on what the model detects
  if (label == "Green Light") {
    if (Go.isPlaying()) {
      wait();
      console.log("Green Light Sound is Playing");
    } else if (greenlight == 0) {
      Go.play();
      wait();
      sign_reset();
      greenlight = 1;
      console.log(greenlight);
    }
  } else if (label == "Red Light") {
    if (redlightsound.isPlaying()) { //if you want to play stop, change redlightsound to stop.
      wait();
      console.log("Red Light Sound is Playing");
    } else if (redlight == 0) {
      redlightsound.play(); //if you want to play stop, change redlightsound to stop.
      wait();
      sign_reset();
      redlight = 1;
      console.log(redlight);
    }
  } else if (label == "Yellow Light") {
    if (Yellow.isPlaying()) {
      wait();
      console.log("Yellow Light Sound is Playing");
    } else if (yellowlight == 0) {
      Yellow.play();
      wait();
      sign_reset();
      yellowlight = 1;
      console.log(yellowlight);
    }
  } else if (label == "Stop Sign") {
    if (stopsignsound.isPlaying()) { //if you want to play stop, change stopsignsound to stop.
      wait();
      console.log("Stop Sign Sound is Playing");
    } else if (stopsign == 0) {
      stopsignsound.play(); //if you want to play stop, change stopsignsound to stop.
      wait();
      sign_reset();
      stopsign = 1;
      console.log(stopsign);
    }
  } else if (label == "Do Not Enter Sign") {
    if (donotentersignsound.isPlaying()) { //if you want to play stop, change donotentersignsound to stop.
      wait();
      console.log("Do Not Enter Sound is Playing");
    } else if (donotentersign == 0) {
      donotentersignsound.play(); //if you want to play stop, change donotentersignsound to stop.
      wait();
      sign_reset();
      donotentersign = 1;
      console.log(donotentersign);
    }
  }
}

// Get the classification!
function gotResults(error, results) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again!
  label = results[0].label;
  classifyVideo();
}


function sign_reset() {
  greenlight = 0;
  redlight = 0;
  yellowlight = 0;
  stopsign = 0;
  donotentersign = 0;
}

function wait() {
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  const repeatedGreetings = async () => {
  await sleep(1000)
  console.log("Wait1Sec")
  }

  repeatedGreetings()
}
//Other Codes start here
function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}

function gotDevices(mediaDevices) {
  select.innerHTML = '';
  select.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}