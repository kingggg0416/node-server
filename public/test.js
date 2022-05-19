try {
    var socket = io.connect();
  } catch (error) {
    console.log("Not connected to express server");
  }
  
  getHomePageElement();
  load_mask_model();
  load_model();

  //showChecked();
  const video = document.getElementById("webcam");
  const enableWebcamButton = document.getElementById("button-style-two");
  const stopWebcamButton = document.getElementById("button-style-one");


  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will 
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
    stopWebcamButton.addEventListener('click', videoStop);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }

  async function enableCam(event) {
    event.target.classList.add('removed');
    const constraints = {
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints).then(async function(stream) {
        video.srcObject = stream;

        //clear the page 
        removeThankYouPageElement();
        removeHomePageElement();
        document.body.style.backgroundImage = "none";
        console.log("dummy1");
        //event loop for check mask
        getCheckMaskElement();
        await checkMask();
        removeMaskPageElement();
        console.log("dummy2");
        //event loop for check Temperature
        getCheckTempElement();
        await checkTemp();
        removeTempPageElement();
        console.log("dummy3");
        //event loop for show qr code page
        getShowQrCodeElement();
        await sleeper(5000);
        removeShowQrCodePageElement();
        console.log("dummy4");
        //event loop for scan qrCode
        getScanQrCodeElement();
        await checkVax();
        removeScanQrCodePageElement();
        console.log("dummy5");
        //event loop for checked animation
        showChecked();
        await sleeper(1500);
        removeCheck();
        console.log("dummy6");
        //event loop for final thank you page
        getThankYouPageElement();

    });
}
  
  
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
  

async function checkTemp() {
    return new Promise(async (resolve, reject) => {
        var temp_status = false;
        var element = document.getElementsByClassName("temp-reading-on-screen")[0];
        await sleeper(300);
        socket.on("temp-reading",async (temp) => {
            console.log(temp);
            element.innerHTML = `${temp}\u00B0C`;

            if(temp >= 37.5) {
                document.getElementById("faceline-container").remove();
                let faceline = document.createElement('div');
                faceline.innerHTML = '<img src="./assets/img/faceline-red.png" alt="faceline">';
                faceline.setAttribute('id', 'faceline-container');
                document.getElementsByClassName("dynamic-element-temp")[0].appendChild(faceline);
                element.style.color = "red";
            }
            else {
                document.getElementById("faceline-container").remove();

                let faceline = document.createElement('div');
                faceline.innerHTML = '<img src="./assets/img/faceline-green.png" alt="faceline">';
                faceline.setAttribute('id', 'faceline-container');
                document.getElementsByClassName("dynamic-element-temp")[0].appendChild(faceline);
                element.style.color = "green";
                await sleeper(300);
                temp_status = true;
            }

            //stopping condition
            if (temp_status){
                socket.off("temp-reading");
                element.innerHTML = "Seems Good!";
                console.log("Finished checking mask");
                await sleeper(1000);
                resolve("Temperature Checked");
            }
        }); 
    });
}
  

  /*
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
  */
  
async function checkVax() {
    return new Promise((resolve, reject) => {
        var vax_status = false;
        socket.on("verification-status",async (data) => {
            // 0 stands for false , 1 stands for true
            console.log("Verification status: ",data);

            if(data == 0) {
                document.getElementById("frame-element").remove();
                let frameBox = document.createElement('div');
                frameBox.innerHTML = '<img src="./assets/img/red-frame.png" alt="frame">';
                frameBox.setAttribute('id', 'frame-element');
                document.getElementsByClassName("dynamic-element-qrcode")[0].appendChild(frameBox);
            }
            else if(data == 1) {
                document.getElementById("frame-element").remove();
                let frameBox = document.createElement('div');
                frameBox.innerHTML = '<img src="./assets/img/green-frame.png" alt="frame">';
                frameBox.setAttribute('id', 'frame-element');
                document.getElementsByClassName("dynamic-element-qrcode")[0].appendChild(frameBox);
                await sleeper(800);
                vax_status = true;
            }

            //stopping condition
            if (vax_status) {
                socket.off("verification-status");
                console.log("Vaccination record is checked");
                resolve("Vaccination record is checked");
            }
        }); 
    });
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
    document.getElementById("progress-bar-container").style.visibility = "visible";
    let mask_page_element = document.createElement("div");
    mask_page_element.innerHTML = '<div id="blue-shadow"></div>';
    mask_page_element.insertAdjacentHTML('beforeend','<div id="faceline-container"><img src="./assets/img/faceline-white.png" alt="faceline"></div>');
    mask_page_element.insertAdjacentHTML('beforeend','<div id="qrcode"><img src="./assets/img/qrcode.png" alt="vaccination code"></div>');
    mask_page_element.insertAdjacentHTML('beforeend','<div class = "mask-text-wrapper"><div class ="pop-up-message">Checking mask...</div></div>');
    mask_page_element.classList.add("dynamic-element-mask");
    document.body.appendChild(mask_page_element);
    console.log("Finished running getCheckMaskElement");

}

function removeMaskPageElement() {
    try{
        //document.getElementsByClassName("dynamic-element-mask")[0].remove();
        document.getElementsByClassName("progress-bar")[0].style.width = "50%";
        document.getElementsByClassName("dynamic-element-mask")[0].remove();
    }
    catch{
        console.log("element(s) does not exist");
    }
    
}

function getCheckTempElement() {
    console.log("running get check mask");;
    let temp_page_element = document.createElement("div");
    temp_page_element.innerHTML = '<div id="blue-shadow"></div>';
    temp_page_element.insertAdjacentHTML('beforeend','<div id="faceline-container"><img src="./assets/img/faceline-white.png" alt="faceline"></div>');
    temp_page_element.insertAdjacentHTML('beforeend','<div id="qrcode"><img src="./assets/img/qrcode.png" alt="vaccination code"></div>');
    temp_page_element.insertAdjacentHTML('beforeend','<div class = "temp-text-wrapper" ><div class = "temp-reading-on-screen">Checking Temperature...</div></div>');
    temp_page_element.classList.add("dynamic-element-temp");
    document.body.appendChild(temp_page_element);

}

function removeTempPageElement() {
    try{
        document.getElementsByClassName("dynamic-element-temp")[0].remove();
    }
    catch{
        console.log("element(s) does not exist");
    }
}

function getShowQrCodeElement() {
    let show_qr_code_page  = document.createElement("div");
    show_qr_code_page.innerHTML = "";
    show_qr_code_page.insertAdjacentHTML('beforeend','<div class ="message-3"><div class="animate__animated animate__fadeInUp">Please <span>show your vaccine record</span> or <span>tap your phone</span> *!</div></div>');
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
    scan_qr_code_page_element.insertAdjacentHTML('beforeend','<div id ="frame-element"><img src="./assets/img/white-frame.png" alt="frame"></div>');
    scan_qr_code_page_element.insertAdjacentHTML('beforeend','<div id="qrcode"><img src="./assets/img/qrcode.png" alt="vaccination code"></div>');
    scan_qr_code_page_element.classList.add("dynamic-element-qrcode");
    document.body.appendChild(scan_qr_code_page_element);
}

async function removeScanQrCodePageElement() {
    try{
        document.getElementById("frame-element").remove();
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
  let result = await model.estimateFaces(document.getElementById("model_initializer"));
  console.log("Initialized blazeface_model: ",result);
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
        return 0;
    }  


}  

async function checkMask() {
    let count = 0;
    while(count < 10) {
        setTimeout(async function() {
            console.log("Checking Mask... Current Count is: ",count);
            let probability = await predict_and_check_mask();
            if(probability >0.8){
                count ++;
            }
            else {
                count = 0;
            }
        }, 200);
        await sleeper(200);
    };
    document.getElementById("faceline-container").remove();
    let faceline = document.createElement('div');
    faceline.innerHTML = '<img src="./assets/img/faceline-green.png" alt="faceline">';
    faceline.setAttribute('id', 'faceline-container');
    document.getElementsByClassName("dynamic-element-mask")[0].appendChild(faceline);
    let element2 = document.getElementsByClassName("pop-up-message")[0];
    element2.style.color = "green";
    element2.innerHTML = "Perfect!";
    await sleeper(2000);
    return "Mask is Checked";
}

async function sleeper(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showChecked() {
    console.log("Running showChecked()");
    let element = document.createElement("div");
    element.classList.add("dynamic-checkbox");
    element.innerHTML = '<input type="checkbox" id="check"><label for="check" id="check-label"><div class="check-icon"></div></label>';
    let element2 = document.createElement("div");
    element2.classList.add("dynamic-element");
    element2.innerHTML = '<div id="blue-shadow"></div>';
    document.body.appendChild(element2);
    document.body.appendChild(element);
    element.firstChild.checked = true;
    console.log("Finished running showChecked()");
  }


function removeCheck() {
    try {
        document.getElementsByClassName("dynamic-checkbox")[0].remove();
        document.getElementsByClassName("dynamic-element")[0].remove();
    }
    catch{
        console.log("Element(s) does not exist");
    }
}