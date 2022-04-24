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
    document.body.style.backgroundImage = "none";
    try{
      socket.on("temp-reading", (data) => {
        console.log(data);
        if(checkTemp(data)) {
          socket.off("temp-reading");
          setTimeout(showQrCode,1000);
          setTimeout(() =>{
            socket.on("verification-status", data => {
              console.log("verfication-status:",data);
              document.getElementById("qrcode").style.visibility = "visible";
              document.getElementById("blue-shadow").style.visibility = "visible";
              document.getElementById("color-overlay").style.visibility = "hidden";
              document.getElementById("color-overlay").style.visibility = "hidden";
              try{
                document.getElementsByClassName("open-leave-home-save-msg")[0].remove();
                document.getElementsByClassName("message-3")[0].remove();
                document.getElementsByClassName("qrcode-big")[0].remove();
              }catch{};
              if(checkVax(data)) {
                socket.off("verification-status");
                setTimeout(() => {
                  try{
                    document.getElementsByClassName("frame-element")[0].remove();
                    document.getElementById("qrcode").style.visibility = "hidden";
                  }catch{
                    console.log("elements already removed");
                  };
                  document.getElementsByClassName("progress-bar")[0].style.width = "100%";
                  showChecked();
                  setTimeout(() => {
                    videoStop();
                    document.getElementsByClassName("message-1")[0].style.visibility = "hidden";
                    document.getElementsByClassName("message-2")[0].style.visibility = "hidden";
                    loadFinalPage();
                  }, 1000);
                },500)
              }
              
            })
          },6000); 
        }
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
      document.body.style.backgroundImage = "url('./assets/img/restaurant-background.png')";
    }
    try{
      socket.off("temp-reading");
      socket.off("verification-status");
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
    document.body.appendChild(element);
  }

  if(temp >= 37.5) {
    faceline.src = "./assets/img/faceline-red.png";
    element.style.color = "red";
    return false;
  }
  else {
    faceline.src = "./assets/img/faceline-green.png";
    element.style.color = "green";
    return true;
  }
}



function showQrCode() {
  document.getElementsByClassName("progress-bar")[0].style.width = "50%";
  let element = document.getElementById("faceline-image");
  let element2 = document.getElementById("qrcode");
  let element3 = document.getElementById("button-style-one");
  let element4 = document.getElementById("blue-shadow");
  let element5 = document.getElementById("color-overlay");
  try{
    document.getElementsByClassName("temp-reading-on-screen")[0].remove();
  } catch{console.log("No such element");};
  element.style.visibility = "hidden";
  element2.style.visibility = "hidden";
  element3.style.visibility = "hidden";
  element4.style.visibility = "hidden";
  element5.style.visibility = "visible";
  let newElement1 = document.createElement("div");
  let newElement2 = document.createElement("div");
  let newElement3 = document.createElement("div");
  newElement1.innerHTML = 'Please <span>show your vaccine record</span> or <span>tap your phone</span> *!';
  newElement2.innerHTML = '*Open LeaveHomeSafe App';
  newElement3.innerHTML = '<img src="./assets/img/qrcode-big.png" alt="qr code">';
  newElement1.classList.add("message-3","animate__animated", "animate__slideInRight");
  newElement2.classList.add("open-leave-home-save-msg");
  newElement3.classList.add("qrcode-big");
  document.body.appendChild(newElement1);
  document.body.appendChild(newElement2);
  document.body.appendChild(newElement3);
}


function checkVax(data) {
  
  if(document.getElementsByClassName("frame-element").length != 0) {
    var frameBox = document.getElementsByClassName("frame-element")[0];
  }
  else {
    var frameBox = document.createElement("div");
    frameBox.classList.add("frame-element");
    frameBox.innerHTML = '<img src="./assets/img/white-frame.png" alt="frame">';
    document.body.appendChild(frameBox);
  }
  //data 0 stands for not verified yet, data 1 stands for verified
  if(data == 0) {
    frameBox.firstChild.src =  "./assets/img/red-frame.png";
    return false;
  }
  else if(data == 1) {
    frameBox.firstChild.src =  "./assets/img/green-frame.png";
    //putting return flase here to visualize first
    return true;
    //return false;
  }
}

function showChecked() {
  let element = document.createElement("div");
  element.classList.add("dynamic-checkbox");
  element.innerHTML = '<input type="checkbox" id="check"><label for="check" id="check-label"><div class="check-icon"></div></label>';
  document.body.appendChild(element);
  element.firstChild.checked = true;

}

function loadFinalPage() {
    document.getElementsByClassName("image-container-1")[0].style.visibility = "visible";
    document.getElementById("color-overlay").style.visibility = "visible";
    //document.getElementById("temp-helper").style.visibility = "hidden";
    document.getElementsByClassName("dynamic-checkbox")[0].remove();
    let element1 = document.createElement("div");
    let element2 = document.createElement("div");
    element1.innerHTML = 'Thank <span>YOU!</span>';
    element2.innerHTML = 'Let\'s do our part to keep everyone safe!';
    element1.classList.add("thankyou-msg", "animate__animated", "animate__fadeInUp");
    element2.classList.add("thankyou-subtext", "animate__animated", "animate__fadeInUp");
    document.body.appendChild(element1);
    document.body.appendChild(element2);
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
