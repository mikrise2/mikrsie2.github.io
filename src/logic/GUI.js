import { assert } from '../utils/Assertion.js';

export default class GUI {
  constructor(activatingLogOutput) {
    assert(typeof activatingLogOutput === 'boolean', 'activatingLogOutput must be a boolean flag');
  }

  setUseMapFile(map) {
    assert(typeof map === 'string', 'map must be a string');
    this.map = map;
  }

  setAssemblerFilesList(files) {
    assert(files.length === 2, 'there must be exactly two programs');
    assert(typeof files[0] === 'string' && typeof files[1] === 'string', 'programs must be strings');
    this.files = files;
  }

  setIterationsNumber(iterations) {
    assert(typeof iterations === 'number', 'map must be a string');
    assert(iterations > 0, 'number of iterations must be positive');
    this.iterations = iterations;
  }

  getIterationsNum() {
    return this.iterations;
  }
}
