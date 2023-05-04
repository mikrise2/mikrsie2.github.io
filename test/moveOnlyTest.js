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


describe("Move only test", function () {
    describe("Instructions", function () {
        it('Validate', function () {
            readFile("test/brain/ok/moveOnlyBrain", function (data) {
                assert(validateBugFormat(data));
            });
        })

        it('Parse', function () {
            readFile("test/brain/ok/moveOnlyBrain", function (data) {
                var instructions = parseInstructions(data);
                assert(instructions[0] instanceof MoveInstruction
                    && instructions[0].thenInstruction === 0
                    && instructions[0].elseInstrucion === 0);
            });
        })
    })

    describe("Simulation", function () {
        readFile("test/brain/ok/moveOnlyBrain", function (data) {
            var instrucions = parseInstructions(data);
            World.setBlackInstructions(instrucions);

            readFile("test/brain/ok/moveOnlyBrain", function (data) {
                var instrucions = parseInstructions(data);
                World.setRedInstructions(instrucions);

                readFile("test/map/ok/moveOnlyMap", function (data) {
                    assert(validateMapFormat(data));
                    World.setMap(WorldMap.Convert(data));
                    var bug1 = World.getBugAt(1, 2);
                    var bug2 = World.getBugAt(3, 2);
                    assert(bug1 && bug1.getTeam() === Team.Black);
                    assert(bug2 && bug2.getTeam() === Team.Red);

                    {
                        World.tick();
                        var bug1Old = World.getBugAt(1, 2);
                        var bug2Old = World.getBugAt(3, 2);
                        var bug1 = World.getBugAt(2, 2);
                        var bug2 = World.getBugAt(4, 2);
                        assert(!bug1Old && bug1 && bug1.getTeam() === Team.Black);
                        assert(!bug2Old && bug2 && bug2.getTeam() === Team.Red);
                    }

                    {
                        World.tick();
                        var bug1Old = World.getBugAt(2, 2);
                        var bug1 = World.getBugAt(3, 2);
                        var bug2 = World.getBugAt(4, 2);
                        assert(!bug1Old && bug1 && bug1.getTeam() === Team.Black);
                        assert(bug2 && bug2.getTeam() === Team.Red);
                    }

                    {
                        World.tick();
                        var bug1Old = World.getBugAt(3, 2);
                        var bug1 = World.getBugAt(4, 2);
                        assert(!bug1Old && bug1 && bug1.getTeam() === Team.Black);
                    }
                });
            });
        });
    })
});
