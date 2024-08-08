/*
Customized the base grid graphics by changing from circles to squares. 
Used for loop to create 5 overlapping squares, which are filled with random colors (retain 
until the program is refreshed). 

Implemented a custom “Note” class that is used in Grid.js. 
Instead of an array of values for noteSize, notePos and noteState 
have an array of notes. 
*/
// template for creating a single note square object
class Note {
    /**
     * constructor function for single note(square)
     * @param {*} _x - x position of the note(square)
     * @param {*} _y - y position of the note(square)
     * @param {*} _sz - size of the note(square)
     */
    constructor(_x, _y, _sz) {
        // size
        this.noteSize = _sz;
        // vector position 
        this.notePos = createVector(_x, _y);
        // initial state
        this.noteState = 0;
        // random colors for 5 squares
        this.sqrColors = [
            color(random(0, 255), random(0, 255), random(0, 255)),
            color(random(0, 255), random(0, 255), random(0, 255)),
            color(random(0, 255), random(0, 255), random(0, 255)),
            color(random(0, 255), random(0, 255), random(0, 255)),
            color(random(0, 255), random(0, 255), random(0, 255))
        ];
    }

    // calculates state of each square (of 16 x 12 grid) on every frame
    calc() {
        if (this.noteState > 0) {
            this.noteState -= 0.05;
            this.noteState = constrain(this.noteState, 0, 1);
        }
    }

    // draw function for note
    draw() {
        // if less than 0 then do nothing, otherwise draw note(square)
        if (this.noteState > 0) {
            push();
            stroke(0); // black stroke 
            strokeWeight(1); // stoke thickness
            // for loop handles 5 notes(squares)
            for (let k = 0; k < 5; k++) {
                // fills notes(squares) with random colors (colors remain until program is refreshed)
                fill(this.sqrColors[k]);
                // calculates width of the note(square)
                let w = this.noteSize * this.noteState * 1.5 - k * 12;
                if (w <= 0) w = 0;
                // calculates height of the note(square), which is equal to width
                let h = w;
                // calculates x position based on width, size and position
                let x = this.notePos.x + (this.noteSize - w) / 2 - this.noteSize / 2;
                // calculates y position based on width, size and position
                let y = this.notePos.y + (this.noteSize - w) / 2 - this.noteSize / 2;
                rect(x, y, w, h);
            }
            pop();
            // calls calculation function
            this.calc();
        }
    }
}