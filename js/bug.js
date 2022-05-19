/**
 * Class Bug
 */

class Bug{
    /**
     * Constructor 
     * Receive a coordinate (x,y) which is the initial position of the bug and the movements it will make
     * @param {Integer} x: position x of the bug
     * @param {Integer} y: position y of the bug
     * @param {String} steps: sequence steps
     */
    
    constructor(x,y,steps,id){
        this.id=id;
        this.x = x;
        this.y = y;
        this.steps = steps;
        this.cantstep = 0;
    }

    /**
     * MoveOn
     */
    MoveOn() {
        //x is column 
        if (steps[this.cantstep] == "D") {
            this.cantstep++;
            if (x != 48) {
                x = 8 + (x + 1) * 15;
                return x
            }
            return false
        }
        if (steps[this.cantstep] == "I") {
            this.cantstep++;
            if (x != 0) {
                x = 8 + (x - 1) * 15;
                return x
            }
            return false
        }
        //y is line (fila)
        if (steps[this.cantstep] == "A") {
            this.cantstep++;
            if (x != 0) {
                y = 8 + (y - 1) * 15;
                return y
            }
            return false
        }
        if (steps[this.cantstep] == "B") {
            this.cantstep++;
            if (x != 36) {
                y = 8 + (y + 1) * 15;
                return y
            }
            return false
        }
    
    }
}

module.exports = { Bug };