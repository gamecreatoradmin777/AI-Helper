// Load the image model and setup the webcam
//async function init() {
const devices = await navigator.mediaDevices.enumerateDevices();
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";
const webcam = new tmImage.Webcam(375, 375, flip); // width, height, flip
//await webcam.setup({ facingMode: "back" });
await webcam.setup({ deviceId: devices[0].deviceId }); 
await webcam.play();
window.requestAnimationFrame(loop);
const flip = false;
//}
