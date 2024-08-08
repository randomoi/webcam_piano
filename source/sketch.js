// *******************************************************************
// BACKGROUND SUBTRACTION *
// *******************************************************************

var video;
var prevImg; 
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
let grid; // created global variable 
let monoSynths = [],
    playing;

// handles setup of the program
function setup() {
    let canvasWidth = 640;
    let canvasHeight = 480;
    // creates 2 side by side canvases
    cnv = createCanvas(canvasWidth * 2, canvasHeight);
    // sound plays only after a user interaction event (mouse touch)
    cnv.touchStarted(playSound);

    // turns off default display density
    pixelDensity(1);
    video = createCapture(VIDEO);
    // hides secondary video
    video.hide();
    // creates slider with default value of 50
    thresholdSlider = createSlider(0, 255, 50);
    // slider position on the screen
    thresholdSlider.position(20, 20);

    // initialized grid variable in the setup() function
    // calls Grid.js the size of canvas width, height and size 40 
    grid = new Grid(canvasWidth, canvasHeight, 40);

    /*
    Implemented the core p5.js sound library to play sounds depending 
    on which “note” in the grid is activated. Included the user interaction function for 
    starting the audio context to make sure audio works across all browsers.
    */
    // loops over grid/notes and pushes p5's MonoSynth(), which is used for sound synthesis for a single note 
    // https://p5js.org/reference/#/p5.MonoSynth
    for (let i = 0; i < grid.notes.length; i++) {
        monoSynths.push(new p5.MonoSynth());
    }
}

function draw() {
    background(0);
    image(video, 0, 0);
    // creates current image 
    currImg = createImage(video.width, video.height);
    // creates copy of the current view
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    // Step 5: used the resize command to scale it down to a quarter of the size it was
    // resizes it to quarter of the view
    currImg.resize(currImg.width / 4, currImg.height / 4);
    // Step 4: ran a blur filter
    // blur filter
    currImg.filter(BLUR, 3);

    // creates another image
    diffImg = createImage(video.width, video.height);
    // Step 5: used the resize command to scale it down to a quarter of the size it was
    // resizes the screen
    diffImg.resize(diffImg.width / 4, diffImg.height / 4);
    // loads pixels of the image
    diffImg.loadPixels();
    // threshold margin detection of movement
    threshold = thresholdSlider.value();
    // if previous image is not undefined (if at least something loaded into previous image) than perfrom the following
    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                // calculates index based on x, y and width of the current image multiplied by 4 channels
                var index = (x + (y * currImg.width)) * 4;
                // calculates red source channel of current image
                var redSource = currImg.pixels[index + 0];
                // calculates green source channel of current image
                var greenSource = currImg.pixels[index + 1];
                // calculates blue source channel of current image
                var blueSource = currImg.pixels[index + 2];
                // calculates red source channel of previous image
                var redBack = prevImg.pixels[index + 0];
                // calculates green source channel of previous image
                var greenBack = prevImg.pixels[index + 1];
                // calculates blue source channel of previous image
                var blueBack = prevImg.pixels[index + 2];

                // calculates color similarities between current and previous image sources of pixels
                var d = distSquared(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                // if distance is more than threshold than image converts to black (black = movement)
                if (d > threshold * threshold) { // multiplied by self to complete the theorem in distSquared()
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;

                    // if distance is less than threshold than image converts to white (white = no movement)
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }

    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    // default slider value text styling
    text(threshold, 160, 35);

    /* 
    moved the code updating the prevImg from the keyPressed() 
    function to the end of the draw() loop
    */
    // creates previous image
    prevImg = createImage(currImg.width, currImg.height);

    // creates copy of previous image
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    // called "grid.run(diffImg)"
    grid.run(diffImg);

    // calls draws message function ("click to start audio")
    userMessage();
    // calls play sound function
    playSound();
}

// faster method for calculating color similarity, which does not calculate root
function distSquared(x1, y1, z1, x2, y2, z2) {
    var d = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
    return d;
}

/*
Implemented the core p5.js sound library to play sounds depending 
on which “note” in the grid is activated. Included the user interaction function for 
starting the audio context to make sure audio works across all browsers.
*/
// playSound() handles sound for maximum active movement
function playSound() {
    for (let i = 0; i < grid.notes.length; i++) {
        // if active (movement detected) >= 0.7, than play sound of notes
        if (grid.activeColumns[i] >= 0.7) {
            monoSynths[i].play(grid.kbNames[i], 0.05, 0, 1 / 2); // 0.5 = amplitude, 0 = cueStart, 1/2 = 0.5 duration in seconds
        }
    }
}

// userMessage() handles audio content message for the user
// https://p5js.org/reference/#/p5/getAudioContext
function userMessage() {
    // if audio is off, display message
    if (getAudioContext().state !== 'running') {
        push();
        // text styling of the message
        textSize(25);
        fill(255);
        text('click to start audio', width / 4, height / 2); // the message and position
        pop();
        // if audio is on, hide message
    } else {
        getAudioContext().hide
    }
}

// touchStarted() handles sound on mouse press by the user
// https://p5js.org/reference/#/p5/touchStarted
function touchStarted() {
    // if audio is not running, resume audio 
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}