try {
  var socket = io.connect();
} catch (error) {
  console.log("Not connected to express server");
}



const video = document.getElementById("webcam");
const enableWebcamButton = document.getElementById("webcamButton");
const stopWebcamButton = document.getElementById("stopWebcamButton");


//const model = await tf.loadLayersModel("../model.json")

/*function videoOn() {
  var video = document.querySelector("#webcam");

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        document.getElementById("faceline-image").style.visibility = "visible";
        document.getElementById("dynamic-element").style.visibility = "hidden";
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}*/

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
    document.getElementById("faceline-image").style.visibility = "visible";
    document.getElementById("blue-shadow").style.visibility = "visible";
    document.getElementById("qrcode").style.visibility = "visible";
    document.getElementById("progress-bar-container").style.visibility = "visible";
    document.getElementById("dynamic-element").style.visibility = "hidden";
    try{
      socket.on("temp-reading", (data) => {
        console.log(data);
        checkTemp(data);
      });
    }catch(error) {
      console.log("socket is not defined");
    }

    //video.addEventListener('loadeddata', predictWebcam);
  });

}


function videoStop() {
    var video = document.querySelector("#webcam");
    var stream = video.srcObject;
    var tracks = stream.getTracks();
  
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
      document.getElementById("faceline-image").style.visibility = "hidden";
      document.getElementById("blue-shadow").style.visibility = "hidden";
      document.getElementById("qrcode").style.visibility = "hidden";
    document.getElementById("progress-bar-container").style.visibility = "hidden";
      document.getElementById("dynamic-element").style.visibility = "visible";
    }
    try{
      socket.off("temp-reading");
      document.getElementsByClassName("temp-reading-on-screen")[0].remove();
    } catch(error) {
      console.log("socket is not defined");
    }
    video.srcObject = null;
  }



function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

function checkTemp(temp) {
  var faceline = document.getElementById("faceline-image");
  if(document.getElementsByClassName("temp-reading-on-screen").length != 0) {
    var element = document.getElementsByClassName("temp-reading-on-screen")[0];
    element.innerHTML = `${temp}\u00B0C`;
  }
  else{
    var element = document.createElement("div");
    element.innerHTML = `${temp}\u00B0C`;
    element.classList.add("temp-reading-on-screen");
    element.style.position = "absolute";
    element.style.top = "20%";
    element.style.left = "42%";
    element.style.fontSize = "4rem";
  }

  if(temp >= 37.5) {
    faceline.src = "./assets/img/faceline-red.png";
    element.style.color = "red";
  }
  else {
    faceline.src = "./assets/img/faceline-green.png";
    element.style.color = "green";
  }
  document.body.appendChild(element);
}


// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
  stopWebcamButton.addEventListener('click', videoStop);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

// Placeholder function for next step.
function predictWebcam() {
}
