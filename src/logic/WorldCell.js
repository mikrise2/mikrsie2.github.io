import {Team} from './core.js'

class Marker {
    /**
     *
     * @param {Team} team
     * @param index
     */
    constructor(team, index) {
        this.team = team;
        this.index = index;
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
     * @returns {*}
     */
    getIndex() {
        return this.index;
    }
}

export class WorldCell {

    /**
     *
     * @type {boolean}
     */
    static #isInternalConstructing = false;

    /**
     * 
     * @param {Boolean} isObstacle True if WorldCell is obstacle
     * @param {Boolean} isNest True if WorldCell is Nest
     * @param {Team} nestTeam Team enum
     * @param {Number} numFood Number of food 1..9
     */
    constructor(isObstacle, isNest, nestTeam, numFood) {
        if (!WorldCell.#isInternalConstructing) {
            throw new TypeError("WorldCell should only be constructed via static constructors");
        }
        this.isObstacle = isObstacle;
        this.isNest = isNest;
        this.nestTeam = nestTeam;
        this.numFood = numFood;

        this.bug = null;
        this.marker = null;
        this.base = null;
    }

    /**
     *
     * @returns {WorldCell}
     */
    static createObstacle() {
        WorldCell.#isInternalConstructing = true;
        const instance = new WorldCell(true, false, Team.None, 0);
        WorldCell.#isInternalConstructing = false;
        return instance;
    }

    /**
     * 
     * @param {Team} team 
     * @returns instance of WorldCell
     */
    static createNest(team) {
        WorldCell.#isInternalConstructing = true;
        const instance = new WorldCell(false, true, team, 0);
        WorldCell.#isInternalConstructing = false;
        return instance;
    }

    /**
     *
     * @returns {WorldCell}
     */
    static createEmpty() {
        WorldCell.#isInternalConstructing = true;
        const instance = new WorldCell(false, false, Team.None, 0);
        WorldCell.#isInternalConstructing = false;
        return instance;
    }

    /**
     * 
     * @param {Number} numFood 
     * @returns 
     */
    static createFood(numFood) {
        WorldCell.#isInternalConstructing = true;
        const instance = new WorldCell(false, false, Team.None, numFood);
        WorldCell.#isInternalConstructing = false;
        return instance;
    }

    /**
     * 
     * @returns {Team}
     */
    getTeam() {
        return this.nestTeam;
    }

    /**
     * 
     * @returns {Boolean}
     */
    isObstructed() {
        return this.isObstacle;
    }

    /**
     * 
     * @returns {Boolean}
     */
    isOccupied() {
        return !this.isObstacle && this.bug !== null;
    }

    /**
     * 
     * @returns {Boolean}
     */
    setBug(bug) {
        this.bug = bug;
        return true;
    }

    /**
     * 
     * @returns {Bug}
     */
    getBug() {
        return this.bug;
    }

    /**
     * 
     * @returns {Boolean}
     */
    removeBug() {
        if (this.isObstructed()) {
            return false;
        }
        this.bug = null;
        return true;
    }

    /**
     *
     * @returns {Boolean}
     */
    decreaseFood() {
        this.numFood--;
    }

    /**
     *
     * @returns {Boolean}
     */
    increaseFood() {
        this.numFood++;
    }

    /**
     * 
     * @returns {Number}
     */
    getFood() {
        return this.numFood;
    }

    /**
     * 
     * @param {Team} color 
     * @returns {Boolean}
     */
    isFriendlyBase(color) {
        return this.isNest && this.nestTeam === color;
    }

    /**
     * 
     * @param {Team} color 
     * @returns {Boolean}
     */
    isEnemyBase(color) {
        return this.isNest && this.nestTeam !== color;
    }

    /**
     *
     * @param {Team} color
     * @param i marker number
     */
    setMarker(color, i) {
        this.marker = new Marker(color, i)
    }

    getMarker() {
        return this.marker;
    }

    clearMarker() {
        this.marker = null;
    }

    /**
     * 
     * @param {Team} color 
     * @returns {Boolean}
     */
    isFriendlyMarker(color) {
        if (!this.marker) {
            throw new Error("No marker here");
        }
        return this.marker.getTeam() === color;
    }

    /**
     * 
     * @param {Team} color 
     * @returns {Boolean}
     */
    isEnemyMarker(color) {
        return this.marker.getTeam() !== color;
    }

    toString() {
        // TODO()
    }
}

/**
 *
 * @param other
 * @returns {boolean}
 */
WorldCell.prototype.equals = function (other) {
    return this.isNest === other.isNest &&
        this.isObstacle === other.isObstacle &&
        this.nestTeam === other.nestTeam &&
        this.numFood === other.numFood
}

