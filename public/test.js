try {
    var socket = io.connect();
  } catch (error) {
    console.log("Not connected to express server");
  }
  
  getHomePageElement();
  load_mask_model();
  load_model();
  
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
      removeThankYouPageElement();
      removeHomePageElement();
      getCheckMaskElement();
      document.body.style.backgroundImage = "none";
      // mask-check loop
      let myPromise = new Promise(function(myResolve, myReject){
        count = verify_mask(count);
        console.log(count);
        if(count >=10) {
          myResolve("true");
        } else {
          myReject("false");
        }
      }); 
      myPromise.then (
        function(value) {removeMaskPageElement();},
        function(error) {console.log("error in promise");}
      );
      getCheckTempElement();
      try{
        socket.on("temp-reading", (data) => {
          console.log(data);
          if(checkTemp(data)) {
            socket.off("temp-reading");
            setTimeout(removeTempPageElement,10000);
            getShowQrCodeElement();
            setTimeout(() =>{
              socket.on("verification-status", data => {
                console.log("verfication-status:",data);
                removeShowQrCodePageElement();
                getScanQrCodeElement();
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
                        removeScanQrCodePageElement();
                        videoStop();
                        getThankYouPageElement();
                    }, 1500);
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
      console.log("running check Temp");
    var faceline = document.getElementById("faceline-image");
    if(document.getElementsByClassName("temp-reading-on-screen").length != 0) {
      var element = document.getElementsByClassName("temp-reading-on-screen")[0];
      element.innerHTML = `${temp}\u00B0C`;
    }
    else{
      var element = document.createElement("div");
      element.innerHTML = `${temp}\u00B0C`;
      element.classList.add("temp-reading-on-screen");
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
  
  function detect_and_predict_mask(frame,faceNet, maskNet) {
    h = frame.shape[0];
    w = frame.shape[1];
      blob = cv2.dnn.blobFromImage(frame, 1.0, (224, 224),(104.0, 177.0, 123.0));
    faceNet.setInput(blob)
    detections = faceNet.forward();
  
    faces = [];
      locs = [];
      preds = [];
  
  
    for( let i = 0; i < detection.shpae[2]; i++) {
      confidence = detections[0,0,i,2];
      if(confidence > 0.5) {
        prediction = maskNet.predict(frame);
        mask = prediction[0];
        without_mask = prediction[1];
        if (mask > without_mask) 
          return true;
      }
    }
  }



  //new implemened functons
  function getHomePageElement() {
    let message = document.createElement("div");
    message.innerHTML = '<div id = "color-overlay"></div>';
    message.insertAdjacentHTML('beforeend','<div class="message-1 animate__animated animate__fadeInUp">Please <span id="text-style-one">approach</span> to complete health check!</div>');
    message.insertAdjacentHTML('beforeend','<div class = "message-2 animate__animated animate__fadeInUp">Let\'s keep everyone safe!</div>');
    message.insertAdjacentHTML('beforeend','<div class = "image-container-1 "><img id = "photo-style-one" src="./assets/img/heartbeat.png" alt="heartbeat image"></div>');
    message.classList.add("dynamic-element");

    let button_setting = document.getElementById("button-style-one");
    button_setting.style.visibility = "visible";

    document.body.appendChild(message);

}

function removeHomePageElement() {
    try{
        document.getElementsByClassName("dynamic-element")[0].remove();
        let button_setting = document.getElementById("button-style-one");
        button_setting.style.visibility = "hidden";
    }
    catch{
        console.log("element(s) does not exist");
    }
    
}

function getCheckMaskElement() {
  console.log("running get check mask");
    let mask_page_element = document.createElement("div");
    mask_page_element.innerHTML = '<div id="blue-shadow"></div>';
    mask_page_element.insertAdjacentHTML('beforeend','<div id="faceline-container"><img id="faceline-image" src="./assets/img/faceline-white.png" alt="faceline"></div>');
    mask_page_element.insertAdjacentHTML('beforeend','<div id="qrcode"><img src="./assets/img/qrcode.png" alt="vaccination code"></div>');
    mask_page_element.insertAdjacentHTML('beforeend','<div class ="pop-up-message">Checking mask...</div>');
    mask_page_element.classList.add("dynamic-element-mask");

    document.getElementById("progress-bar-container").style.visibility = "visible";
    document.body.appendChild(mask_page_element);

}

function removeMaskPageElement() {
    try{
        //document.getElementsByClassName("dynamic-element-mask")[0].remove();
        document.getElementsByClassName("progress-bar")[0].style.width = "50%";
        document.getElementsByClassName("pop-up-message")[0].remove();
    }
    catch{
        console.log("element(s) does not exist");
    }
    
}

function getCheckTempElement() {
    //nothing to get (as it is the same design as check mask page) only next to change the text of the pop up message
    try{
        let element = document.getElementsByClassName("dynamic-element-mask")[0];
        element.insertAdjacentHTML('beforeend','<div class = "temp-reading-on-screen"></div>');
    }catch{
        console.log("Element(s) does not exist");
    }
}

function removeTempPageElement() {
    try{
        document.getElementsByClassName("dynamic-element-mask")[0].remove();
    }
    catch{
        console.log("element(s) does not exist");
    }
}

function getShowQrCodeElement() {
    let show_qr_code_page  = document.createElement("div");
    show_qr_code_page.innerHTML = "";
    show_qr_code_page.insertAdjacentHTML('beforeend','<div class="message-3 animate__animated animate__fadeInUp">Please <span>show your vaccine record</span> or <span>tap your phone</span> *!</div>');
    show_qr_code_page.insertAdjacentHTML('beforeend','<div id = "color-overlay"></div>');
    show_qr_code_page.insertAdjacentHTML('beforeend','<div class ="open-leave-home-save-msg">*Open LeaveHomeSafe App</div>');
    show_qr_code_page.insertAdjacentHTML('beforeend','<div class ="qrcode-big"><img src="./assets/img/qrcode-big.png" alt="qr code"></div>');
    show_qr_code_page.classList.add("dynamic-element-qrcode");
    document.body.appendChild(show_qr_code_page);
}

function removeShowQrCodePageElement() {
    try{
        document.getElementsByClassName("dynamic-element-qrcode")[0].remove();

    }
    catch{
        console.log("element(s) does not exist");
    }
}

function getScanQrCodeElement() {
    document.getElementsByClassName("progress-bar")[0].style.width = "100%";
    let scan_qr_code_page_element = document.createElement("div");
    scan_qr_code_page_element.innerHTML = '<div id="blue-shadow"></div>';
    scan_qr_code_page_element.insertAdjacentHTML('beforeend','<div class = "frame-element"><img src="./assets/img/white-frame.png" alt="frame"></div>');
    scan_qr_code_page_element.insertAdjacentHTML('beforeend','<div id="qrcode"><img src="./assets/img/qrcode.png" alt="vaccination code"></div>');
    scan_qr_code_page_element.classList.add("dynamic-element-qrcode");
    document.body.appendChild(scan_qr_code_page_element);

}

function removeScanQrCodePageElement() {
    try{
        document.getElementsByClassName("dynamic-element-qrcode")[0].remove();

    }
    catch{
        console.log("element(s) does not exist");
    }
}

function getThankYouPageElement() {
    let thank_you_page_element = document.createElement("div");
    thank_you_page_element.innerHTML = '<div id = "color-overlay"></div>';
    thank_you_page_element.insertAdjacentHTML('beforeend','<div class="thankyou-msg animate__animated animate__fadeInUp">Thank <span>YOU!</span></div>');
    thank_you_page_element.insertAdjacentHTML('beforeend','<div class = "thankyou-subtext animate__animated animate__fadeInUp">Let\'s do our part to keep everyone safe!</div>');
    thank_you_page_element.insertAdjacentHTML('beforeend','<div class = "image-container-1 "><img id = "photo-style-one" src="./assets/img/heartbeat.png" alt="heartbeat image"></div>');
    thank_you_page_element.classList.add("dynamic-element-thank-you");

    //to restart all the elements
    document.getElementsByClassName("progress-bar")[0].style.width = "0%";
    document.getElementById("progress-bar-container").style.visibility = "hidden";

    deleteChecklogo();
    document.body.appendChild(thank_you_page_element);
}

function removeThankYouPageElement() {
    try{
        document.getElementsByClassName("dynamic-element-thank-you")[0].remove();
    }
    catch{
        console.log("element(s) does not exist");
    }
}

function deleteChecklogo() {
    try {
        document.getElementsByClassName("dynamic-checkbox")[0].remove();
    }
    catch{
        console.log("Element(s) does not exist");
    }
}




//mask detection functions

var model = undefined;
var mask_model = undefined;
/*const STATUS = document.getElementById("status");
var load = document.getElementById("load");
var load_mask = document.getElementById("load-mask-model");
const VIDEO = document.getElementById("webcam");
const ENABLE_CAM_BUTTON = document.getElementById('enableCam');
const PREDICT = document.getElementById('predict');
var stop_predict_button = document.getElementById('stop-predict');
var continue_predict_button = document.getElementById('continue-predict');
ENABLE_CAM_BUTTON.addEventListener('click', enableCam);
PREDICT.addEventListener('click', predict_and_check_mask);
load.addEventListener('click', loadModel);
load_mask.addEventListener('click', load_mask_model);
stop_predict_button.addEventListener('click', predict_change_status);
continue_predict_button.addEventListener('click', predict_change_status);
var predict_status = true;
*/

function cropCanvasImage(video, top_left, width, height) {
  var canvas = document.getElementById('canvas');
  canvas.width = 224;
  canvas.height = 224;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(
      video,
      top_left[0], top_left[1],
      width, height,
      0,0,
      224, 224
  );
  //let href = canvas.toDataURL();
  //console.log("The tensor shape is ", tensor.shape)
  //let resizedTensorFrame = tf.image.resizeBilinear(tensor,224, 224, true);
  let tensor = tf.browser.fromPixels(canvas, 3).div(255);
  return tensor;
}

function predict_change_status() {
  predict_status = (predict_status == true)? false : true;
}

async function load_model() {
  model = await blazeface.load();
  console.log("Blazeface Model loaded");
}
async function load_mask_model() {
  mask_model = await tf.loadLayersModel('./model.json');
  console.log("Mask Model loaded");
}

async function predict_and_check_mask() {
    // Pass in an image or video to the model. The model returns an array of
    // bounding boxes, probabilities, and landmarks, one for each detected face.
    let faces = []; 
    const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
    let video = document.getElementById("webcam");
    const predictions = await model.estimateFaces(video);
    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]]; //first is width second is height
            //console.log("The faces are ",faces[i]);

            let result = await mask_model.predict(cropCanvasImage(video,start,size[0], size[1]).expandDims(), false);
            console.log("The result is (mask)", result.dataSync()[0]);
            console.log("The result is (without_mask)", result.dataSync()[1]);
            tf.dispose();
            //return the probaility for with_mask
            return result.dataSync()[0];
        }

    } 
    else{
        console.log("No person is detected");
    }  


}  

function verify_mask(count) {
  //we will check the person's mask for two second, at 0.2s interval, and within the interval if it is wearing mask, we return true
  var interval = setInterval(function() {
    let probaility = predict_and_check_mask();
    if(probaility > 0.8) {
      count++;
    }
    else{
      count = 0;
    }
    if(count >= 10) {
      document.getElementsByClassName("pop-up-message")[0].innerHTML = "Mask Checked";
      clearInterval(interval);
      console.log("The number of count is", count);
    }
  }, 200)
}


