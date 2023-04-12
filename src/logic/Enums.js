import {assert} from '../utils/Assertion.js';

// It should work as enumeration
export class Color {
    static Red = new Color('Red');

    static Black = new Color('Black');

    constructor(name) {
        this.name = name;
    }

    opposite() {
        if (this === Color.Red) {
            return Color.Black;
        }
        return Color.Red;
    }
}

Object.freeze(Color);

// Conditions for Bug Brain instructions
const CONDITIONS = Object.freeze(['friend', 'foe', 'friend-with-food', 'foe-with-food', 'food', 'rock', 'marker', 'foe-marker', 'home', 'foe-home']);

export class CellCondition {
    constructor(name, pos) {
        assert(CONDITIONS.includes(name), "cell condition name error");
        Object.defineProperty(this, 'name', {value: name, writable: false});
        if (name === 'marker') {
            assert([0, 1, 2, 3, 4, 5].includes(pos), "marker is not in 0..5 range");
            this.pos = pos;
        } else {
            assert(pos === undefined, "poss should be undefined");
        }
    }
}

export const CellDirection = {
    AHEAD: 'AHEAD', LEFT_AHEAD: 'LEFT_AHEAD', RIGHT_AHEAD: 'RIGHT_AHEAD', HERE: 'HERE'
}

export const Direction = {
    LEFT: 'LEFT', RIGHT: 'RIGHT'
}
