/*
Customized the base grid graphics by changing from circles to squares. 
Used for loop to create 5 overlapping squares, which are filled with random colors (retain 
until the program is refreshed). This work can be viewed in "class Note{} -> Note.js".
*/

// template for creating grid object 
class Grid {
    /**
     * constructor function for grid
     * @param {*} _w - grid width
     * @param {*} _h - grid height
     * @param {*} _gcs - grid cell size
     */
    constructor(_w, _h, _gcs) {
        this.gridWidth = _w;
        this.gridHeight = _h;
        this.gridColumns = int(_w / _gcs);
        this.gridRows = int(_h / _gcs);
        this.notes = [];
        this.gridCellSize = _gcs;
        this.activeColumns = []; // array of active notes (looks through 16 x 12 grid to find a maximum active element, then add it to this array)
        this.noteBars = [];
        // array of names of notes
        this.kbNames = [
            'A0',
            'D1',
            'G1',
            'C2',
            'F2',
            'Bb2',
            'Eb3',
            'G#3',
            'C#4',
            'F#4',
            'B4',
            'E5',
            'A5',
            'D6',
            'G6',
            'C7',
        ];

        for (let i = 0; i < this.gridColumns; i++) {
            // creates an empty array for each column 
            this.notes.push([]);
            // creates elements for each column filled with zeros
            this.activeColumns.push(0);

            // fills each column with rows
            for (let j = 0; j < this.gridRows; j++) {
                // position for columns (i*_gcs), lines (j*_gcs) and size (_gcs) respectively
                this.notes[i].push(new Note(i * _gcs, j * _gcs, _gcs));
            }
        }
    }

    // runs functions within the class
    run(img) {
        img.loadPixels();
        this.findActiveNotes(img);
        this.calcMaxNoteOfColumn();
        this.drawVerticalBars();
        this.drawActiveRectNotes();
        this.drawKeyboard();
        this.drawNoteBars();
        this.startNoteBars();
    }

    // handles start of floating green note bars
    startNoteBars() {
        // frame frequency of adding floating green note bars to the screen 
        if (frameCount % 20 == 0) { // left at 20 this way green bars don't overlap
            for (let i = 0; i < this.gridColumns; i++) {
                // if active column is more than 0.7 than add floating green note bar to the screen
                if (this.activeColumns[i] > 0.7) {
                    // NoteBar() parameters (_x, _y, _w, _h, _nm, _speed)
                    this.noteBars.push(new NoteBar(
                        this.gridCellSize * i, // x coordinate
                        400, // y coordinate
                        this.gridCellSize, // width
                        this.gridCellSize / 2, // height
                        this.kbNames[i], // name
                        1)); // speed 
                }
            }
        }
    }

    // draws floating green note bars 
    drawNoteBars() {
        // loops over all floating green note bars 
        for (let i = 0; i < this.noteBars.length; i++) {
            // draws floating green note bars
            this.noteBars[i].draw();
            // if the floating green note bars are not active (not drawn on the screen: faded away or 
            // outside of the screen), then remove from the array
            if (this.noteBars[i].state <= 0) {
                this.noteBars.splice(i, 1);
            }
        }
    }

    // draws active notes in the shape of squares (colored in various colors)
    drawActiveRectNotes() {
        // loops over 16 x 12 grid to draw active notes(squares)
        for (let i = 0; i < this.gridColumns; i++) {
            for (let j = 0; j < this.gridRows; j++) {
                this.notes[i][j].draw();
            }
        }
    }

    // calculates maximum note of column to save resources
    calcMaxNoteOfColumn() {
        // if movement is not detected than assign 0 to activeColumns[i]
        for (let i = 0; i < this.gridColumns; i++) {
            this.activeColumns[i] = 0;
            // if movement is detected than assign 1 to activeColumns[i]
            for (let j = 0; j < this.gridRows; j++) {
                if (this.notes[i][j].noteState > this.activeColumns[i]) {
                    this.activeColumns[i] = this.notes[i][j].noteState;
                }
            }
        }
    }

    // draws vertical semi-transparent grey columns on the screen
    drawVerticalBars() {
        for (let i = 0; i < this.gridColumns; i++) {
            // defines variable and assigns it to active columns
            let cMax = this.activeColumns[i];
            // if more than zero (active) than draw vertical columns
            if (cMax > 0) {
                push();
                let alpha = cMax * 100; // transparency of notes
                let c = color(182, 184, 184, alpha); // light grey color with alpha defined transparency
                fill(c); // fill with above color
                let x = i * this.gridCellSize;
                let y = 0;
                let h = (this.notes[this.notes.length - 1].length - 2) * this.gridCellSize;
                let w = this.gridCellSize - 2;
                rect(x, y, w, h);
                pop();
            }
        }
    }

    // draws white rectangles (keyboard) with note names and activates keys on movement with light purple color
    drawKeyboard() {
        stroke(160, 167, 176); // light grey stroke
        for (let i = 0; i < this.notes.length; i++) {
            // defines variable and assigns it to active columns
            let activeColumnstate = this.activeColumns[i];
            // if column is active than color the key purple
            if (activeColumnstate >= 0.5) {
                var c1 = color(255, 255, 255, alpha); // white color
                var c2 = color(200, 200, 255, alpha); // purple color
                var mix = lerpColor(c1, c2, activeColumnstate); // blends two colors on active state
                fill(mix); // fills key purple on active state
            } else { // otherwise key is white
                fill(color(255, 255, 255)); // white color
            }
            let x = i * this.gridCellSize;
            let y = (this.notes[this.notes.length - 1].length - 2) * this.gridCellSize;
            rect(x, y, this.gridCellSize - 2, this.gridCellSize * 2);

            // text styling for the key description
            textSize(14);
            fill(0);
            textAlign(CENTER);
            text(this.kbNames[i], x + this.gridCellSize / 2, y + this.gridCellSize / 2.5); // key name, x position, y position 
        }
    }

    // analyzes white image for active cells
    findActiveNotes(img) {
        for (var x = 0; x < img.width; x += 1) {
            for (var y = 0; y < img.height; y += 1) {
                // calculates index based on x, y, width and 4 channels
                var index = (x + (y * img.width)) * 4;
                // state of image pixels
                var state = img.pixels[index + 0];
                // if pixel is black (movement detected), find which note to activate
                if (state == 0) {
                    // maps screen x position
                    var screenX = map(x, 0, img.width, 0, this.gridWidth);
                    // maps screen y position
                    var screenY = map(y, 0, img.height, 0, this.gridHeight);
                    // calculates grid cell
                    var i = int(screenX / this.gridCellSize); // int rounds result
                    var j = int(screenY / this.gridCellSize); // int rounds result
                    // marking the active cell (in place of which colorful rectangles appears)
                    this.notes[i][j].noteState = 1;
                }
            }
        }
    }
}