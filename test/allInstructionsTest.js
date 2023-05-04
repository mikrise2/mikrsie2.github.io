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

describe("Instructions", function () {
    describe("Preparation", function () {
        it('Validate', function () {
            readFile("test/brain/ok/AllInstructions", function (data) {
                assert(validateBugFormat(data));
            });
        })
    });

    describe("Simulation", function () {
        readFile("test/brain/ok/AllInstructions", function (data) {
            var instrucions = parseInstructions(data);
            World.setBlackInstructions(instrucions);

            readFile("test/brain/ok/AllInstructions", function (data) {
                var instrucions = parseInstructions(data);
                World.setRedInstructions(instrucions);

                simulate();
            });
        });
    });



    function simulate() {
        readFile("test/map/ok/AllInstructions", function (data) {
            assert(validateMapFormat(data));
            World.setMap(WorldMap.Convert(data));
            var bug = World.getBugAt(1, 2);
            assert(bug && bug.getTeam() === Team.Red)


            {
                // Move
                World.tick();
                var bug = World.getBugAt(2, 2);
                var old = World.getBugAt(1, 2);
                assert(!old && bug && bug.getTeam() === Team.Red);
            }

            {
                // Set marker
                World.tick();
                assert(World.getCell(2, 2).isFriendlyMarker(Team.Red));
            }

            {
                // Unmark
                World.tick();
                assert(!World.getCell(2, 2).getMarker());
            }

            {
                // Get food
                World.tick();
                assert(World.getBugAt(2, 2).isCarryingFood());
                assert(World.getCell(2, 2).getFood() == 0);
            }

            {
                // Try getting food, nothing changes
                World.tick();
                assert(World.getBugAt(2, 2).isCarryingFood());
                assert(World.getCell(2, 2).getFood() == 0);
            }

            {
                // Drop food
                World.tick();
                assert(!World.getBugAt(2, 2).isCarryingFood());
                assert(World.getCell(2, 2).getFood() == 1);
            }

            {
                // Turn left
                World.tick();
                assert(World.getBugAt(2, 2).getDirection() == 5);
            }

            {
                // Move
                World.tick();
                var bug = World.getBugAt(3, 1);
                var old = World.getBugAt(2, 2);
                assert(!old && bug && bug.getTeam() === Team.Red);
            }

        });
    }

})