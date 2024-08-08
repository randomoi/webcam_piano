/* 
Trigger secondary graphics effects or animations when an active note is drawn.
Used "Synthesia" a digital piano app for ipad as my source of inspiration for the 
project (https://synthesiagame.com). The project has an animated keyboard, vertical 
translucent bars, randomly colored squares and floating green note bars, 
which all activate on movement. 
    1.	Floating Green Note Bars get triggered by movement then fade away after set period of time.
    2.	Keyboard keys activate and light up purple on movement.
    3.	Vertical Translucent Bars were designed to accentuate the active piano keys.
    4.	Colored Squares used random() to color 5 squares, which activate on movement.
*/
// template for creating a single floating green note bar object
class NoteBar {
    /**
     * constructor function for single floating green note bar 
     * @param {*} _x  - x coordinate of the floating green note bar 
     * @param {*} _y - y coordinate of the floating green note bar 
     * @param {*} _w - width of the floating green note bar 
     * @param {*} _h - height of the floating green note bar 
     * @param {*} _nm - name of the floating green note bar 
     * @param {*} _speed - speed of the floating green note bar 
     */
    constructor(_x, _y, _w, _h, _nm, _speed) {
            this.position = createVector(_x, _y);
            this.width = _w;
            this.height = _h;
            this.speed = _speed;
            this.state = 1;
            this.name = _nm;
        }
        // draw function for floating green note bar 
    draw() {
        // if active (more than 0), then draw floating green note bar 
        if (this.state > 0) {
            push();
            noStroke();
            fill(0, 200, 0, this.state * 255); // light green fill with transparency
            rect(this.position.x, this.position.y, this.width, this.height);
            textSize(14); // size of note names
            fill(255, 255, 255); // note names color white 
            textAlign(CENTER, CENTER); // text alignment
            text(this.name, this.position.x + this.width / 2, this.position.y + this.height / 2);
            pop();
            // calls calc function, which calculates state of the floating green note bar
            this.calc();
        }
    }

    // calculates state of the floating green note bar
    calc() {
        // if active (more than 0), calculate y position and speed
        if (this.state > 0) {
            if (this.position.y > 0) {
                this.position.y -= this.speed;
                this.state -= 0.005;
                // if not active, stop
            } else {
                this.state = 0;
            }
        }
    }
}