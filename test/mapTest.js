const { throws } = require('assert');
var assert = require('assert');
const fs = require('fs');
const { describe } = require('node:test');
const { WorldMap } = require('../src/logic/map');
const { World } = require('../src/logic/world');
const { Team } = require('../src/logic/core');
const { WorldCell } = require('../src/logic/worldCell');
const { validateMapFormat } = require('../src/scripts/fileChecker');
const { validateBugFormat, parseInstructions, MoveInstruction } = require('../src/logic/instruction');

/**
 * 
 * @param {String} path 
 * @return {String}
 */
function readFile(path, callback) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        callback(data);
    });
}

describe('Map', function () {

    describe('Good', function () {
        it('Should pass', function () {
            readFile("test/map/ok/ok1", function (data) {
                assert(validateMapFormat(data));
            });
        });
    });

    describe('WorldCell equality', function () {
        it('Empty', function () {
            assert(WorldCell.createEmpty().equals(WorldCell.createEmpty()));
        });
        it('Obstacle', function () {
            assert(WorldCell.createObstacle().equals(WorldCell.createObstacle()));
        });
        it('Nest', function () {
            assert(WorldCell.createNest(Team.Red).equals(WorldCell.createNest(Team.Red)));
            assert(!WorldCell.createNest(Team.Red).equals(WorldCell.createNest(Team.Black)));
        });
        it('Food', function () {
            assert(WorldCell.createFood(4).equals(WorldCell.createFood(4)));
            assert(!WorldCell.createFood(4).equals(WorldCell.createFood(5)));
        });

        it('Different', function () {
            assert(!WorldCell.createEmpty().equals(WorldCell.createNest(Team.Red)));
        });
    });

    describe('Size', function () {
        it('Width first, height last', function () {
            readFile("test/map/bad/size1", function (data) {
                assert(!validateMapFormat(data));
            });
        });

        it('Mismatch', function () {
            readFile("test/map/bad/size2", function (data) {
                assert(!validateMapFormat(data));
            });
        });

        it('Line is too long', function () {
            readFile("test/map/bad/size3", function (data) {
                assert(!validateMapFormat(data));
            });
        });
    });

    describe('BadSymbols', function () {
        it('Bad number', function () {
            readFile("test/map/bad/symbol1", function (data) {
                assert(!validateMapFormat(data));
            });
        });

        it('Letter', function () {
            readFile("test/map/bad/symbol2", function (data) {
                assert(!validateMapFormat(data));
            });
        });
    });

    describe('Border', function () {
        it('Horizontal', function () {
            readFile("test/map/bad/border1", function (data) {
                assert(!validateMapFormat(data));
            });
        });

        it('Vertical', function () {
            readFile("test/map/bad/border2", function (data) {
                assert(!validateMapFormat(data));
            });
        });
    });

    describe('Missing team', function () {
        it('Black', function () {
            readFile("test/map/bad/missing1", function (data) {
                assert(!validateMapFormat(data));
            });
        });

        it('Red', function () {
            readFile("test/map/bad/missing2", function (data) {
                assert(!validateMapFormat(data));
            });
        });
    });

    describe('Swarm has to be linked', function () {
        it('Not linked', function () {
            readFile("test/map/bad/linked1", function (data) {
                assert(!validateMapFormat(data));
            });
        });

        it('Diagonally is not linked', function () {
            readFile("test/map/bad/linked2", function (data) {
                assert(!validateMapFormat(data));
            });
        });
    });

    describe('Conversion test', function () {
        it('Conversion', function () {
            readFile("test/map/ok/ok2", function (data) {
                assert(validateMapFormat(data));
                let expected = [
                    [WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createObstacle()],
                    [WorldCell.createObstacle(), WorldCell.createEmpty(), WorldCell.createNest(Team.Red), WorldCell.createNest(Team.Red), WorldCell.createObstacle()],
                    [WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createFood(9), WorldCell.createFood(1), WorldCell.createObstacle()],
                    [WorldCell.createObstacle(), WorldCell.createNest(Team.Black), WorldCell.createNest(Team.Red), WorldCell.createEmpty(), WorldCell.createObstacle()],
                    [WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createObstacle(), WorldCell.createObstacle()]
                ]
                WorldMap.Convert(data).every((line, i) => {
                    return line.every((it, j) => {
                        return it.equals(expected[i][j]);
                    })
                });
            });
        });
    });

    describe('WorldCell', function () {
        it('Public constructor is prohibited', function () {
            readFile("test/map/ok/ok1", function (data) {
                assert.throws(() => { WorldCell(true, true, Team.Red, 1) }, TypeError);
            });
        });
    });

});
