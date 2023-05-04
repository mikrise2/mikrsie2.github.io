/**
 *
 * @param fileContent
 * @returns {boolean}
 */
export function validateBugFormat(fileContent) {
    const instructions = fileContent.split('\n').map(line => line.split(';')[0].trim());

    const regex = /^((mark \d+ \d+)|(direction [0|1|2|3|4|5|] \d+ \d+)|(flip \d+ \d+ \d+)|(move \d+ \d+)|(turn (left|right) \d+)|(drop \d+)|(unmark \d \d+)|(pickup (\d+) (\d+))|(move (\d+) (\d+))|(sense (here|leftahead|rightahead|ahead) (\d+) (\d+) (friend|foe|friendwithfood|foewithfood|food|rock|marker \d|foemarker|home|foehome)))$/;

    for (const instruction of instructions) {
        if (!regex.test(instruction)) {
          alert("Error: typos/non-existent tokens.");
            return false;
        }
    }

    return true;
}

/**
 *
 * @param fileContent
 * @returns {unknown[]}
 */
function parseInstructions(fileContent) {
    return fileContent.split('\n')
        .map(line => line.split(';')[0].trim())
        .map(line => {
            let tokens = line.split(' ');
            switch (tokens[0]) {
                case 'move':
                    return new MoveInstruction(tokens);
                case 'mark':
                    return new MarkInstruction(tokens);
                case 'unmark':
                    return new UnmarkInstruction(tokens);
                case 'pickup':
                    return new PickupInstruction(tokens);
                case 'drop':
                    return new DropInstruction(tokens);
                case 'turn':
                    return new TurnInstruction(tokens);
                case 'direction':
                    return new DirectionInstruction(tokens);
                case 'flip':
                    return new DirectionInstruction(tokens);
            }
        })
}


class Instruction {

    /**
     *
     * @param {int} thenInstruction
     * @param {int} elseInstruction
     * @param {Function} condition
     */
    constructor(thenInstruction, elseInstruction, condition) {
        this.thenInstruction = thenInstruction;
        this.elseInstrucion = elseInstruction;
        this.condition = condition;
    }

    /**
     *
     * @param {World} world
     * @param  {Bug} bug
     * @returns {int} next instruction number
     */
    execute(world, bug) {
        return this.condition(world, bug) ?
            this.thenInstruction : this.elseInstrucion;
    }


}

class MoveInstruction extends Instruction {
    /**
     *
     * @param tokens
     * @returns {MoveInstruction}
     */
    constructor(tokens) {
        /**
         *
         * @type {number}
         */
        let thenInstruction = parseInt(tokens[1]);
        /**
         *
         * @type {number}
         */
        let elseInstruction = parseInt(tokens[2]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                var [x, y] = bug.getCell()
                var ahead = world.getCellAhead(x, y, directions[bug.getDirection()]);
                if (ahead.isObstructed()
                    || (ahead.getBug() && ahead.getBug().getTeam() === bug.getTeam())) {
                    return false;
                }
                world.moveBug(x, y, bug);
                return true;
            })
    }
}

class MarkInstruction extends Instruction {
    /**
     *
     * @param tokens
     * @returns {MarkInstruction}
     */
    constructor(tokens) {
        let markIndex = parseInt(tokens[1]);
        let thenInstruction = parseInt(tokens[2]);
        let elseInstruction = parseInt(tokens[2]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                let [x, y] = bug.getCell()

                world.setMarker(x, y, bug.getTeam(), markIndex); //TODO setMarker unresolved
                return true;
            })
    }
}

class UnmarkInstruction extends Instruction {
    /**
     *
     * @param tokens
     * @returns {UnmarkInstruction}
     */
    constructor(tokens) {
        let markIndex = parseInt(tokens[1]);
        let thenInstruction = parseInt(tokens[2]);
        let elseInstruction = parseInt(tokens[2]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                world.unmark(markIndex, bug.getTeam());
                return true;
            })
    }
}

class PickupInstruction extends Instruction {
    /**
     *
     * @param tokens
     * @returns {PickupInstruction}
     */
    constructor(tokens) {
        /**
         *
         * @type {number}
         */
        let thenInstruction = parseInt(tokens[1]);
        /**
         *
         * @type {number}
         */
        let elseInstruction = parseInt(tokens[2]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                var [x, y] = bug.getCell();
                if (bug.isCarryingFood() || world.getCell(x, y).getFood() <= 0) {
                    return false;
                }

                world.pickupFood(x, y, bug);
                return true;
            })
    }
}

class DropInstruction extends Instruction {
    /**
     *
     * @param tokens
     * @returns {DropInstruction}
     */
    constructor(tokens) {
        let thenInstruction = parseInt(tokens[1]);
        let elseInstruction = parseInt(tokens[1]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                var [x, y] = bug.getCell();
                if (!bug.isCarryingFood()) {
                    return false;
                }

                world.dropFood(x, y, bug);
                return true;
            })
    }
}

class TurnInstruction extends Instruction {
    /**
     *
     * @param tokens
     * @returns {TurnInstruction}
     */
    constructor(tokens) {
        let side = tokens[1];
        if (side === "left") {
            side = false;
        } else if (side === "right") {
            side = true;
        } else {
            throw new Error("Unknown token", side); //TODO Error with 2 arguments, LIKE
        }

        let thenInstruction = parseInt(tokens[2]);
        let elseInstruction = parseInt(tokens[2]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                side ? bug.rotateCLockwise() : bug.rotateCounterCLockwise();
                return true;
            })
    }
}

class DirectionInstruction extends Instruction {
    constructor(tokens) {
        let dir = parseInt(tokens[1]);
        let thenInstruction = parseInt(tokens[2]);
        let elseInstruction = parseInt(tokens[3]);
        super(thenInstruction, elseInstruction,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                return bug.getDirection() === dir;
            })
    }
}

class FlipInstruction extends Instruction {
    constructor(tokens) {
        let p = parseInt(tokens[1]);
        let thenInstruction = parseInt(tokens[2]);
        let elseInstrucion = parseInt(tokens[3]);
        super(thenInstruction, elseInstrucion,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                return Math.random() * p === 0;
            })
    }
}

/**
 * @untested
 */
class SenseInstruction extends Instruction {

    constructor(tokens) {
        /**
         *
         * @type {string}
         */
        let senseDir = tokens[1]; // here|leftahead|rightahead|ahead
        /**
         *
         * @type {number}
         */
        let thenInstruction = parseInt(tokens[2]);
        /**
         *
         * @type {number}
         */
        let elseInstrucion = parseInt(tokens[3]);
        /**
         *
         * @type {string}
         */
        let condition = tokens[4]; // friend|foe|friendwithfood|foewithfood|food|rock|marker \d|foemarker|home|foehome
        super(thenInstruction, elseInstrucion,
            /**
             *
             * @param {World} world
             * @param {Bug} bug
             * @returns
             */
            function (world, bug) {
                /**
                 *
                 * @type {number}
                 */
                let [x, y] = bug.getCellSenseDir(senseDir)
                /**
                 *
                 * @type {WorldCell|Number[]|*}
                 */
                let cell = World.getCell(x, y)
                if (!cell) {
                    return false;
                }
                /**
                 *
                 * @type {Bug}
                 */
                let otherBug = cell.getBug()
                /**
                 *
                 * @type {Marker}
                 */
                switch (condition) {
                    case 'friend': {
                        return otherBug && otherBug.getTeam() === bug.getTeam()
                    }
                    case 'foe': {
                        return otherBug && otherBug.getTeam() !== bug.getTeam()
                    }
                    case 'friendwithfood': {
                        return otherBug && otherBug.getTeam() === bug.getTeam()
                            && otherBug.isCarryingFood()
                    }
                    case 'foewithfood': {
                        return otherBug && otherBug.getTeam() !== bug.getTeam()
                            && otherBug.isCarryingFood()
                    }
                    case 'food': {
                        return cell.getFood() > 0
                    }
                    case 'rock': {
                        return cell.isObstructed()
                    }
                    case 'marker': {
                        let index = parseInt(tokens[5]);
                        let marker = cell.getMarker();
                        return marker && marker.getIndex() === index
                            && marker.getTeam() === bug.getTeam();
                    }
                    case 'foemarker': {
                        let marker = cell.getMarker();
                        return marker && marker.getTeam() === bug.getTeam();
                    }
                    case 'home': {
                        return cell.isFriendlyBase(bug.getTeam())
                    }
                    case 'foehome': {
                        return cell.isEnemyBase(bug.getTeam())
                    }

                }
            })
    }
}
