import {assert} from "../utils/Assertion.js";
import {CellCondition, CellDirection, Direction} from "./Enums.js";


export class Sense {
    constructor(cellDirection, condition, move1, move2,) {
        assert(cellDirection in CellDirection, 'Cell Direction must be CellDirection enum')
        assert(condition instanceof CellCondition, 'condition must be CellCondition enum')
        assert(Number.isInteger(move1), 'then branch must be a number')
        assert(Number.isInteger(move2), 'else branch should be a number')
        this.cellDirection = cellDirection
        this.condition = condition
        this.move1 = move1
        this.move2 = move2
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class Mark {
    constructor(marker, move) {
        assert(Number.isInteger(marker), 'marker must be a number')
        assert(marker >= 0 && marker < 6, 'marker must be in range 0..5')
        assert(Number.isInteger(move), 'then branch must be a number')
        this.marker = marker
        this.move = move
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class UnMark {
    constructor(marker, move) {
        assert(Number.isInteger(marker), 'marker must be a number')
        assert(marker >= 0 && marker < 6, 'marker must be in range 0..5')
        assert(Number.isInteger(move), 'then branch must be a number')
        this.marker = marker
        this.move = move
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class PickUp {
    constructor(move1, move2) {
        assert(Number.isInteger(move1), 'then branch must be a number')
        assert(Number.isInteger(move2), 'else branch must be a number')
        this.move1 = move1
        this.move2 = move2
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class Drop {
    constructor(next) {
        assert(Number.isInteger(next), 'then branch must be a number')
        this.next = next
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class Turn {
    constructor(direction, move) {
        assert(direction in Direction, 'direction must be Direction enum')
        assert(Number.isInteger(move), 'then branch must be a number')
        this.direction = direction
        this.move = move
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class Move {
    constructor(move1, move2) {
        assert(Number.isInteger(move1), 'then branch must be a number')
        assert(Number.isInteger(move2), 'else branch must be a number')
        this.move1 = move1
        this.move2 = move2
    }

    execute(position, bug, map) {
        //TODO
    }
}

export class Flip {
    constructor(bound, move1, move2) {
        assert(Number.isInteger(bound), 'upper bound must be a number')
        assert(Number.isInteger(move1), 'then branch must be a number')
        assert(Number.isInteger(move2), 'else branch must be a number')
        this.move1 = move1
        this.move2 = move2
        this.bound = bound
    }

    execute(position, bug, map) {
        //TODO
    }
}