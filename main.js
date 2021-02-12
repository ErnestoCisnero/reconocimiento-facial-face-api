const video = document.getElementById('video');

function startvideo() {
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia);
    navigator.getUserMedia({ video: {} }, stream => video.srcObject = stream, err => console.log(err))

}


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startvideo);

video.addEventListener('play', () => {

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const dispalaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, dispalaySize);
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detections);
        const resizedDetections = faceapi.resizeResults(detections, dispalaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


    }, 100);
})