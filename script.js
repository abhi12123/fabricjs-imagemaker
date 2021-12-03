
var canvas = new fabric.Canvas('c');
var video1El = document.getElementById('video1');
var webcamEl = document.getElementById('webcam');

var video1 = new fabric.Image(video1El, {
    left: 0,
    top: 0,
    // originX: 'center',
    // originY: 'center',
    objectCaching: false,
    selectable: false
});

var webcam = new fabric.Image(webcamEl, {
    left: 0,
    top: 0,
    // originX: 'center',
    // originY: 'center',
    objectCaching: false,
    selectable: false
});

var svgEl = document.body.getElementsByTagName('svg');

const addSvg = (index) => {
    console.log('trigger')
    var serializer = new XMLSerializer();
    var svgStr = serializer.serializeToString(svgEl[index]);
    const DOMURL = window.URL || window.webkitURL || window;
    const svgDataStream = new Blob([svgStr], { type: 'image/svg+xml' });
    const img = new Image();
    const imgUrl = DOMURL.createObjectURL(svgDataStream);
    img.src = imgUrl;
    console.log(img.src)
    const imgInstance = new fabric.Image(img, {
        left: 0,
        top: 0,
        width:100,
        height:100
    });
    imgInstance.scaleToWidth(200);
    imgInstance.scaleToHeight(200);
    console.log(imgInstance)

    // "add" rectangle onto canvas
    canvas.add(imgInstance);
    // canvas.renderAll();
};

canvas.add(video1);
// video1.getElement().play();

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}


// adding webcam video element
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function getWebcamAllowed(localMediaStream) {
        webcamEl.srcObject = localMediaStream;

        canvas.add(webcam);
        webcam.moveTo(0); // move webcam element to back of zIndex stack
        webcam.getElement().play();
    }).catch(function getWebcamNotAllowed(e) {
        // block will be hit if user selects "no" for browser "allow webcam access" prompt
    });

fabric.util.requestAnimFrame(function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
});

var convertToImage = function () {
    canvas.discardActiveObject().renderAll();
    document.getElementById("ten").src = canvas.toDataURL('png');
}


document.getElementById('btn').onclick = convertToImage
document.getElementById('del').onclick = () => canvas.remove(canvas.getActiveObject());
let svgBtns = document.getElementsByClassName('svg-btn');
svgBtns[0].onclick = () => addSvg(0)
svgBtns[1].onclick = () => addSvg(1)
svgBtns[2].onclick = () => addSvg(2)
// svgBtns.map((el, index) => {
//     el.onclick = addSvg(index)
// })
