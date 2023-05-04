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
describe("Bug brain", function () {
    describe('Correct', function () {
        it('Should pass', function () {
            readFile("test/brain/ok/correctBugBrain", function (data) {
                assert(validateBugFormat(data));
            });
        });
    });

    describe('Incomplete', function () {
        it('Empty', function () {
            readFile("test/brain/bad/emptyError", function (data) {
                assert(!validateBugFormat(data));
            });
        });

        it('Missing token', function () {
            readFile("test/brain/bad/missingError", function (data) {
                assert(!validateBugFormat(data));
            });
        });
    });

    describe('Typo', function () {
        it('Token typo', function () {
            readFile("test/brain/bad/typoError", function (data) {
                assert(!validateBugFormat(data));
            });
        });

        it('Token order', function () {
            readFile("test/brain/bad/tokenOrderError", function (data) {
                assert(!validateBugFormat(data));
            });
        });

        it('missed ;', function () {
            readFile("test/brain/bad/typoError", function (data) {
                assert(!validateBugFormat(data));
            });
        });
    });
});

