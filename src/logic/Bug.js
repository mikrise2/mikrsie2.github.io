import { assert } from '../utils/Assertion.js';
import { Color } from './Enums.js';

/**
 Attributes:
 color: Color
    Team color of the bug.
 resting: Number
    Number of cycles
 direction = 0: Number
    Int from 0 to 5, as described in specification.
 hasFood = false: Boolean
    Whether the bug carries a piece of food.
 instructionPos = 0: Number
    Bug's brain is a finite automaton and this is the index of state in it.
 */
const RESTING_LIMIT = 14;
export default class Bug {
  constructor(color) {
    assert(color instanceof Color, 'Bug constructor failed: color');

    this.color = color;
    this.resting = RESTING_LIMIT;
    this.direction = 0;
    this.hasFood = false;
    this.instructionPos = 0;
  }

  /** direction = (direction - 1) mod 6 */
  turnLeft() {
    this.direction += 5;
    this.direction %= 6;
  }

  /** direction = (direction + 1) mod 6 */
  turnRight() {
    this.direction += 1;
    this.direction %= 6;
  }

  toString() {
    return `Bug of color ${this.color}.\n
        \tDirection: ${this.direction}, \n
        \tHasFood: ${this.hasFood}, \n
        \tResting: ${this.resting}, \n
        \tInstructions position: ${this.instructionPos}.\n`;
  }
}
