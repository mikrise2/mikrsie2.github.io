import { assert } from '../utils/Assertion.js';
import { Color, CellCondition } from './Enums.js';
import Bug from './Bug.js';

export default class WorldCell {
  constructor(obstructed = false, food = 0, baseColor = null) {
    this.obstructed = obstructed; // immutable
    this.food = food;
    this.baseColor = baseColor; // immutable
    this.redMarkers = [false, false, false, false, false, false];
    this.blackMarkers = [false, false, false, false, false, false];
    this.bug = null;

    Object.seal(this);
  }

  isObstructed() {
    return this.obstructed;
  }

  isOccupied() {
    return this.bug !== null;
  }

  setBug(newBug) {
    assert(newBug instanceof Bug, 'setBug takes Bug instances as input');
    if (this.isOccupied()) {
      return false;
    }
    this.bug = newBug;
    return true;
  }

  getBug() {
    return this.bug;
  }

  removeBug() {
    if (this.bug === null) {
      return false;
    }
    this.bug = null;
    return true;
  }

  setFood(newFood) {
    assert(typeof newFood === 'number', 'Food must be a number');
    this.food = newFood;
  }

  setMarker(color, markerPos) {
    assert(color instanceof Color, 'setMarker: First argument must be Color');
    assert(typeof markerPos === 'number', 'setMarker: Second argument must be Number');
    assert(markerPos >= 0 && markerPos < 6, 'setMarker: Marker position not in 0..5');
    if (color === Color.Red) {
      this.redMarkers[markerPos] = true;
    }
    if (color === Color.Black) {
      this.blackMarkers[markerPos] = true;
    }
  }

  clearMarker(color, markerPos) {
    assert(color instanceof Color, 'clearMarker: First argument must be Color');
    assert(typeof markerPos === 'number', 'clearMarker: Second argument must be Number');
    assert(markerPos >= 0 && markerPos < 6, 'clearMarker: Marker position not in 0..5');
    if (color === Color.Red) {
      this.redMarkers[markerPos] = false;
    }
    if (color === Color.Black) {
      this.blackMarkers[markerPos] = false;
    }
  }

  isFriendlyMarker(color, markerPos) {
    assert(color instanceof Color, 'isFriendlyMarker: First argument must be Color');
    assert(typeof markerPos === 'number', 'isFriendlyMarker: Second argument must be Number');
    assert(markerPos >= 0 && markerPos < 6, 'isFriendlyMarker: Marker position not in 0..5');
    if (color === Color.Red) {
      return this.redMarkers[markerPos];
    }
    return this.blackMarkers[markerPos];
  }

  isEnemyMarker(color) {
    assert(color instanceof Color, 'isEnemyMarker: First argument must be Color');
    if (color === Color.Black) {
      return this.redMarkers.some((x) => x === true);
    }
    return this.blackMarkers.some((x) => x === true);
  }

  cellMatches(cellCondition, color) {
    assert(cellCondition instanceof CellCondition, 'cellMatches: First argument must be Condition');
    assert(color instanceof Color, 'cellMatches: Second argument must be Color');
    switch (cellCondition.name) {
      case 'friend':
        return this.isOccupied() && this.getBug().color === color;
      case 'foe':
        return this.isOccupied() && this.getBug().color === color.opposite();
      case 'friend-with-food':
        return this.isOccupied() && this.getBug().color === color && this.bug.hasFood;
      case 'food':
        return this.food !== 0;
      case 'rock':
        return this.isObstructed();
      case 'marker':
        return this.isFriendlyMarker(color, cellCondition.pos);
      case 'foe-marker':
        return this.isEnemyMarker(color);
      case 'home':
        return this.baseColor === color;
      default:
        assert(cellCondition.name === 'foe-home', `Unknown condition ${cellCondition.name}`);
        return this.baseColor === color.opposite();
    }
  }

  toString() {
    return `Cell:\n
            \tIs obstructed: ${this.isObstructed()}.\n
            \tBase of color: ${this.baseColor}.\`
            \tAmount of food:${this.food}.\n
            \tContains bug: ${this.isOccupied()} ${this.bug.toString()}.\n
            \tRed markers are: ${this.redMarkers.toString()}.\n
            \tBlack markers are: ${this.blackMarkers.toString()}.\n`
  }
}
