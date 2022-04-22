/*var socket = io();

socket.on("data", (data) => {
    //displayMessage(`You connected with id: ${socket.id}`);
    //socket.emit("custom-event", 10, "Hi", {a: "a"});
    console.log(data);
    document.getElementById("system-message").innerHTMl = data;
});*/


const video = document.getElementById("webcam")
const enableWebcamButton = document.getElementById("webcamButton")

//const model = await tf.loadLayersModel("../model.json")

function videoOn() {
  var video = document.querySelector("#webcam");

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        document.getElementById("face-line").style.visibility = "visible";
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}


function videoStop() {
    var video = document.querySelector("#webcam");
    var stream = video.srcObject;
    var tracks = stream.getTracks();
  
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
      document.getElementById("face-line").style.visibility = "hidden"
    }
  
    video.srcObject = null;
  }



function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

function enableCam(event) {
  /*if(!model) {
    return;
  }*/
  event.target.classList.add('removed');  

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    document.getElementById("face-line").style.visibility = "visible";
    //video.addEventListener('loadeddata', predictWebcam);
  });

}

// Placeholder function for next step.
function predictWebcam() {
}

