import {assert, assertFails, assertNotThrows, assertThrows, test} from '../src/utils/Assertion.js';
import Bug from '../src/logic/Bug.js';
import {CellCondition, Color} from '../src/logic/Enums.js';
import WorldCell from '../src/logic/WorldCell.js';
import GUI from '../src/logic/GUI.js';
import {parse_map} from "../src/utils/MapParser.js";
import {
    invalid_rows,
    invalid_columns,
    border_missing1,
    border_missing2,
    border_missing3,
    invalid_value,
    invalid_swarm1,
    invalid_swarm2,
    plus_missing,
    minus_missing,
    normal_map,
    non_existent,
    invalid_token,
    missing_token, normal_assembler
} from "./tests.js";
import {parse_assembler} from "../src/utils/AssemblerParser.js";

/*
Unit tests
*/
await test('Color is enum', () => {
    assert(Object.keys(Color).length === 2, 'Color must have 2 values');
});

await test('Opposite works', () => {
    assert(Color.Red.opposite() === Color.Black);
    assert(Color.Black.opposite() !== Color.Black);
});

await test('Bug rotates properly', () => {
    const bug = new Bug(Color.Red);
    assert(bug.direction === 0, 'Initially direction must be 0');
    bug.turnRight();
    assert(bug.direction === 1, 'Right turn lead to incorrect direction');
    bug.turnLeft();
    bug.turnLeft();
    assert(bug.direction === 5, 'Left turn lead to incorrect direction');
});

await test('Setting markers on world cells works', () => {
    const cell = new WorldCell(false, 1, null);
    cell.setMarker(Color.Black, 0);
    assert(cell.isFriendlyMarker(Color.Black, 0) === true, "The value wasn't set");
    assert(cell.isFriendlyMarker(Color.Red, 1) === false, 'By default markers should be off');
    assertFails(() => {
        cell.isFriendlyMarker(Color.Red, -1);
    }, 'Accessing negative indices must fail');
    assertFails(() => {
        cell.isFriendlyMarker(Color.Red, 6);
    }, 'Accessing indices > 5 must fail');
});

await test('Setting bug to a world cell', () => {
    const cell = new WorldCell(false, 1, null);
    const bug = new Bug(Color.Red);
    bug.hasFood = true;
    assert(cell.setBug(bug) === true, 'The cell should be empty');
    assert(cell.getBug() === bug, 'Wrong bug in the cell');
    assert(cell.removeBug() === true, 'No bug was in the cell');
    assert(cell.removeBug() === false, "Bug wasn't removed");
});

await test('Check Friend condition', () => {
    const cell = new WorldCell(false, 1, null);
    const bug = new Bug(Color.Red);
    cell.setBug(bug);

    const friendCondition = new CellCondition('friend');
    assert(cell.cellMatches(friendCondition, bug.color) === true, "Friend condition doesn't work");
    assert(cell.cellMatches(friendCondition, bug.color.opposite()) === false, "Friend condition doesn't work for opposite color");
});

await test('Check Foe condition', () => {
    const cell = new WorldCell(false, 1, null);
    const bug = new Bug(Color.Red);
    cell.setBug(bug);

    const foeCondition = new CellCondition('foe');
    assert(cell.cellMatches(foeCondition, bug.color) === false, "Foe condition doesn't work");
    assert(cell.cellMatches(foeCondition, bug.color.opposite()) === true, "Foe condition doesn't work for opposite color");
});

await test('Check FriendWithFood condition', () => {
    const cell = new WorldCell(false, 1, null);
    const bug = new Bug(Color.Red);
    bug.hasFood = true;
    cell.setBug(bug);

    const condition = new CellCondition('friend-with-food');
    assert(cell.cellMatches(condition, bug.color) === true, "FriendWithFood condition doesn't work");
    assert(cell.cellMatches(condition, bug.color.opposite()) === false, "FriendWithFood condition doesn't work for opposite color");
});

await test('Check Food condition', () => {
    const cell = new WorldCell(false, 0, null);
    cell.setFood(1);

    const condition = new CellCondition('food');

    assert(cell.cellMatches(condition, Color.Red) === true, 'Should be 1 food');

    cell.setFood(0);
    assert(cell.cellMatches(condition, Color.Red) === false, 'Should be no food');
});

await test('Check Rock condition', () => {
    const rockCell = new WorldCell(true, 0, null);

    const condition = new CellCondition('rock');

    assert(rockCell.cellMatches(condition, Color.Red) === true, 'Cell has rock!');

    const cell = new WorldCell(false);
    assert(cell.cellMatches(condition, Color.Red) === false, 'Cell has no rock');
});

await test('Check Home condition', () => {
    const cell = new WorldCell(false, 0, Color.Red);
    const condition = new CellCondition('home');

    assert(cell.cellMatches(condition, Color.Red) === true, 'Wrong home color');
    assert(cell.cellMatches(condition, Color.Red.opposite()) === false, 'Wrong enemy home color');
});

await test('Check FoeHome condition', () => {
    const cell = new WorldCell(false, 0, Color.Red);
    const condition = new CellCondition('foe-home');

    assert(cell.cellMatches(condition, Color.Red) === false, 'Wrong enemy home color');
    assert(cell.cellMatches(condition, Color.Red.opposite()) === true, 'Wrong home color');
});

await test('Check Marker condition', () => {
    const cell = new WorldCell(false, 0, Color.Red);
    cell.setMarker(Color.Red, 0);

    const condition = new CellCondition('marker', 0);

    assert(cell.cellMatches(condition, Color.Red) === true, 'No marker');
    assert(cell.cellMatches(condition, Color.Red.opposite()) === false, 'Should be no marker for enemy');

    const falseCondition = new CellCondition('marker', 1);

    assert(cell.cellMatches(falseCondition, Color.Red) === false, 'Should be no marker for this pos');
});

await test('Check FoeMarker condition', () => {
    const cell = new WorldCell(false, 0, Color.Red);
    cell.setMarker(Color.Red.opposite(), 0);

    const condition = new CellCondition('foe-marker');

    assert(cell.cellMatches(condition, Color.Red) === true, 'Should be a marker for enemy');
    assert(cell.cellMatches(condition, Color.Red.opposite()) === false, 'Should be no marker for the current color');
});

await test('Check Unknown Condition', () => {
    assertFails(() => {
        new CellCondition('???');
    }, 'Should fail when creating unknown condition');

    const condition = new CellCondition('food');
    assertFails(() => {
        condition.name = '???';
    }, 'Switch should be exhaustive');
});

await test('Type safety', () => {
    const cell = new WorldCell(false, 0, Color.Red);
    const condition = new CellCondition('marker', 0);

    assertFails(() => {
        cell.setMarker(0, Color.Red);
    }, 'Giving arguments in wrong order must fail');
    assertFails(() => {
        cell.setMarker(Color.Red);
    }, 'Giving wrong number of arguments must fail');
    assertFails(() => {
        cell.cellMatches(condition, true);
    }, 'Using booleans instead of colors must fail');
    assertFails(() => {
        cell.cellMatches();
    }, 'Giving no arguments must fail');
});

await test('GUI class', () => {
    const gui = new GUI(false);
    const map = '###\n#.#\n###';
    const code1 = 'abacaba';
    const code2 = 'abracadabra';
    const assemblerFiles = [code1, code2];
    const n = 100;
    gui.setUseMapFile(map);
    gui.setAssemblerFilesList(assemblerFiles);
    gui.setIterationsNumber(n);

    assert(gui.getIterationsNum() === n, 'getIterationsNum must return what was passed to setIterationsNum');
});


await test('Right rows and columns in file', async () => {
    await assertThrows('Error expected', async () => {
        parse_map(invalid_rows)
    })
    await assertThrows('Error expected', async () => {
        parse_map(invalid_columns)
    })
})

await test('Missed borders', async () => {
    await assertThrows('Error expected', async () => {
        parse_map(border_missing1)
    })
    await assertThrows('Error expected', async () => {
        parse_map(border_missing2)
    })
    await assertThrows('Error expected', async () => {
        parse_map(border_missing3)
    })
})

await test('Invalid symbols', async () => {
    await assertThrows('Error expected', async () => {
        parse_map(invalid_value)
    })
})

await test('Invalid Swarm link', async () => {
    await assertThrows('Error expected', async () => {
        parse_map(invalid_swarm1)
    })
    await assertThrows('Error expected', async () => {
        parse_map(invalid_swarm2)
    })
})

await test('Swarm missing', async () => {
    await assertThrows('Error expected', async () => {
        parse_map(plus_missing)
    })
    await assertThrows('Error expected', async () => {
        parse_map(minus_missing)
    })
})


await test('Simple map', async () => {
    await assertNotThrows('No error expected', async () => {
        parse_map(normal_map)
    })
})

await test('Non-existent line', async () => {
    await assertThrows('Error expected', async () => {
        parse_assembler(non_existent)
    })
})

await test('Invalid token', async () => {
    await assertThrows('Error expected', async () => {
        parse_assembler(invalid_token)
    })
})

await test('missing_token', async () => {
    await assertThrows('Error expected', async () => {
        parse_assembler(missing_token)
    })
})

await test('normal assembler', async () => {
    await assertNotThrows('No error expected', async () => {
        parse_assembler(normal_assembler)
    })
})
