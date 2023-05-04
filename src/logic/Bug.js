const { Instruction } = require('./instruction');
const { directions, Team } = require('./core');

class Bug {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Team} team
     */
    constructor(x, y, team) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.dir = 0;
        this.currentInstruction = 0;
        this.carryingFood = false;
    }

    /**
     * 
     * @returns {Instruction}
     */
    getCurrentInstruction() {
        return this.currentInstruction;
    }

    /**
     * 
     * @param {Number} i 
     */
    setInstruction(i) {
        this.currentInstruction = i;
    }

    pickupFood() {
        if (this.carryingFood) {
            throw new Error("Can not pick food up");
        }

        this.carryingFood = true;
    }

    dropFood() {
        if (!this.carryingFood) {
            throw new Error("No food to drop");
        }

        this.carryingFood = false;
    }

    /**
     *
     * @returns {boolean}
     */
    isCarryingFood() {
        return this.carryingFood;
    }

    /**
     *
     * @returns {number}
     */
    getDirection() {
        return this.dir;
    }

    /**
     *
     * @returns {Number[]}
     */
    getCell() {
        return [this.x, this.y];
    }

    /**
     * 
     * @returns {Team}
     */
    getTeam() {
        return this.team;
    }

    /**
     *
     * @param senseDir
     * @returns {Number[]|*[]}
     */
    getCellSenseDir(senseDir) {
        switch (senseDir) {
            case 'here': {
                return [this.x, this.y];
            }
            case 'ahead': {
                return [this.x + this.dir[0], this.y + this.dir[1]]
            }
            case 'leftahead': {
                this.rotateCounterCLockwise()
                let res = [this.x + this.dir[0], this.y + this.dir[1]]
                this.rotateCLockwise()
                return res
            }
            case 'rightahead': {
                this.rotateCLockwise()
                let res = [this.x + this.dir[0], this.y + this.dir[1]]
                this.rotateCounterCLockwise()
                return res
            }
        }
    }

    rotateCLockwise() {
        this.dir = (this.dir + 1) % 6
    }

    rotateCounterCLockwise() {
        this.dir = (this.dir + 5) % 6
    }

    /**
     *
     * @returns {Number[]}
     */
    moveForward() {
        this.x += directions[this.dir][0];
        this.y += directions[this.dir][1];
        return [this.x, this.y];
    }
}