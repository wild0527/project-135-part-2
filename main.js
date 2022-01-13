status = "";
objects = [];

function setup() {
    canvas = createCanvas(480, 360);
    canvas.center()

    video = createCapture(VIDEO);
    video.hide();

}

function start() {
    objectDetector = ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects";
    document.getElementById("start").value = "input_values";
}

function gotResult(error, results) {
    if (error) {
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function modelLoaded() {
    console.log("model is loaded");
    status = true;
}

function draw() {
    image(video, 0, 0, 480, 360);

    if (status != "") {
        objectDetector.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Objects Detected";
            document.getElementById("number_of_objects").innerHTML = "Number of objects detected: " + objects.length;

            fill("#FF0000");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("#FF0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].label == object_name) {
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("object_status").innerHTML = object_name + " is found";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(object_name + " is found");
                synth.speak(utterThis);
            } else {
                document.getElementById("object_status").innerHTML = object_name + " was not found";
            }
        }
    }
}