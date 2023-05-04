const { Bug } = require('./bug');
const { Instruction } = require('./instruction')
const { directions, Team } = require('./core');
const { WorldCell } = require('./worldCell');

/**
 *
 * @type {{setMarker: World.setMarker, getCell: ((function(*, *): WorldCell)|*), getCellAhead: (function(Number, Number, [Number,Number]): WorldCell), getBugAt: (function(Number, Number): Bug), obstructed: (function(Number, Number): Boolean), tick: World.tick, unmark: World.unmark, pickupFood: World.pickupFood, foodAt: (function(Number, Number): Number), size: (function(): (number|*)[]), setBlackInstructions: World.setBlackInstructions, isFriendlyMarkerAt: (function(Number, Number, Team): Boolean), setRedInstructions: World.setRedInstructions, setMap: World.setMap, isFriendlyBaseAt: (function(Number, Number, Team): Boolean), adjacentOtherBugs: (function(Number, Number): number), isEnemyMarkerAt: (function(Number, Number, Team): Boolean), dropFood: World.dropFood, moveBug: World.moveBug, occupied: (function(Number, Number): Boolean), isEnemyBaseAt: (function(Number, Number, Team): Boolean)}}
 */
let World = (function () {
    let map = null;
    let redInstructions = NaN;
    let blackInstructions = NaN;

    let blackMarkers = [null, null, null, null, null, null];
    let redMarkers = [null, null, null, null, null, null];

    let tickNumber = 0;
    let bugs = [];

    /**
     * 
     * @param {Instruction} instruction 
     * @param {Bug} bug 
     */
    function executeInstruction(instruction, bug) {
        instruction.execute(World, bug);
    }

    return {
        /**
         *
         * @param instructions
         */
        setRedInstructions: function (instructions) {
            World.redInstructions = instructions.slice();
        },

        /**
         *
         * @param instructions
         */
        setBlackInstructions: function (instructions) {
            World.blackInstructions = instructions.slice();
        },

        /**
         * 
         * @param {*} x 
         * @param {*} y 
         * @returns {WorldCell}
        */
        getCell: function (x, y) {
            // console.log("Get cell", x, y);
            if (y < 0 || x < 0
                || x >= World.map[0].length
                || y >= World.map.length) {
                return null;
            }
            return World.map[y][x];
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {[Number, Number]} direction 
         * @returns {WorldCell}
         */
        getCellAhead: function (x, y, direction) {
            // console.log("Get cell ahead", x, y, direction);
            return World.getCell(x + direction[0], y + direction[1]);
        },

        /**
         * 
         * @param {Array.<Array.<WorldCell>>} map 
         */
        setMap: function (map) {
            World.map = map.map(function (arr) {
                return arr.slice();
            });
            // console.log(World.map);
            World.map.forEach((line, i) => {
                line.forEach((cell, j) => {
                    if (cell.isNest) {
                        if (cell.getTeam() === Team.Black) {
                            cell.setBug(new Bug(j, i, Team.Black));
                        } else if (cell.getTeam() === Team.Red) {
                            cell.setBug(new Bug(j, i, Team.Red));
                        } else {
                            throw new Error("Unrecognized team");
                        }
                        bugs.push(cell.getBug());
                    }
                })
            })
        },

        /**
         * 
         * @returns {(number|*)[]}
         */
        size: function () {
            if (isNaN(World.map)) { //TODO Argument type any[] is not assignable to parameter type number ....
                throw new Error("Map not set");
            }

            return [World.map[0].size, World.map.size]; //TODO size.....
        },
        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @returns {Boolean}
         */
        obstructed: function (x, y) { //TODO The best solution for the function representation, LIKE
            return World.getCell(x, y).isObstructed();
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @returns {Boolean}
         */
        occupied: function (x, y) {
            return World.getCell(x, y).isOccupied();
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @returns {Bug}
         */
        getBugAt: function (x, y) {
            // World.getCell(x, y);
            return World.getCell(x, y).getBug();
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Team} team 
         * @returns {Boolean}
         */
        foodAt: function (x, y) {
            return World.getCell(x, y).getFood(); //TODO in doc Boolean ...
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Team} team 
         * @returns {Boolean}
         */
        isFriendlyBaseAt: function (x, y, team) {
            return World.getCell(x, y).isFriendlyBase(team);
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Team} team 
         * @returns {Boolean}
         */
        isEnemyBaseAt: function (x, y, team) {
            return World.getCell(x, y).isEnemyBase(team);
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Team} team 
         * @returns {Boolean}
         */
        isFriendlyMarkerAt: function (x, y, team) {
            return World.getCell(x, y).isFriendlyMarker(team);
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Team} team 
         * @returns {Boolean}
         */
        isEnemyMarkerAt: function (x, y, team) {
            return World.getCell(x, y).isEnemyMarker(team);
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @returns {Number}
         */
        adjacentOtherBugs: function (x, y) {
            let num = 0;
            directions.forEach(dir => {
                let cell = World.getCell(x + dir[0], y + dir[1]);
                num += isNaN(cell) ? 0 : (cell.isOccupied ? 1 : 0) //TODO worldCell type to isNan.... undefined is better
            })
            return num;
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Bug} bug 
         */
        moveBug: function (x, y, bug) {
            World.getCell(x, y).removeBug();
            [x, y] = bug.moveForward() //TODO Oni hot' nemnogo dumali, chto oni delaut, tipy ne shodyatca voobshe......
            World.getCell(x, y).setBug(bug);
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Team} team 
         * @param {Number} i 
         */
        setMarker: function (x, y, team, i) {
            if (i < 0 || i >= blackMarkers.length) {
                throw new Error("Out of bounds");
            }

            if (team === Team.Black && !blackMarkers[i]) {
                blackMarkers[i] = [x, y];
                World.getCell(x, y).setMarker(team, i);
            } else if (team === Team.Red && !redMarkers[i]) {
                redMarkers[i] = [x, y];
                World.getCell(x, y).setMarker(team, i);
            } else {
                throw new Error("Unrecognized team");
            }
        },

        /**
         *  
         * @param {Number} i 
         * @param {Team} team
         */
        unmark: function (i, team) {
            if (i < 0 || i >= blackMarkers.length) {
                throw new Error("Out of bounds");
            }

            if (team === Team.Black && blackMarkers[i]) {
                let [x, y] = blackMarkers[i];
                World.getCell(x, y).clearMarker();
                blackMarkers[i] = null;
            } else if (team === Team.Red && redMarkers[i]) {
                let [x, y] = redMarkers[i];
                World.getCell(x, y).clearMarker();
                redMarkers[i] = null;
            } else {
                throw new Error("Unrecognized team");
            }

        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Bug} bug 
         */
        pickupFood: function (x, y, bug) {
            let food = World.getCell(x, y).getFood();
            if (food <= 0) {
                throw new Error("No food here");
            }

            bug.pickupFood();
            World.getCell(x, y).decreaseFood();
        },

        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Bug} bug 
         */
        dropFood: function (x, y, bug) {
            bug.dropFood();
            World.getCell(x, y).increaseFood();
        },

        tick: function () {
            console.log("Tick ", tickNumber);
            bugs.forEach(bug => {
                let i = bug.getCurrentInstruction();
                if (bug.getTeam() === Team.Black) {
                    bug.setInstruction(
                        World.blackInstructions[i].execute(World, bug)
                    );
                } else if (bug.getTeam() === Team.Red) {
                    bug.setInstruction(
                        World.redInstructions[i].execute(World, bug)
                    );
                } else {
                    throw new Error("Unrecognized team");
                }

            });
            tickNumber++;
        }
    }
})();
