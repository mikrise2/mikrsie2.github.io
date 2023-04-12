import {CellCondition, CellDirection, Direction} from "../logic/Enums.js";
import {parse_int} from "./Functions.js";
import {Drop, Flip, Mark, Move, PickUp, Sense, Turn, UnMark} from "../logic/Instructions.js";

export async function parse_assembler_from_file(file) {
    let text = await file.text()
    return parse_assembler(text)
}

export function parse_assembler(text) {
    text = text.replace(/\r/g, '')
    let lines = text.split('\n')
    if (lines.length === 0) {
        throw `File doesn't contain any command`
    }
    let commands = []
    lines.forEach(line => {
        commands.push(parse_line(line, lines.length))
    })
    return commands
}

function parse_line(line, commands_size) {
    if (line === '') {
        throw 'empty line is not a command'
    }
    let command_text = line.split(';')[0].trim().split(' ')
    switch (command_text[0]) {
        case 'sense':
            return parse_sense(command_text, commands_size)
        case 'mark':
            return parse_mark(command_text, commands_size)
        case 'unmark':
            return parse_unmark(command_text, commands_size)
        case 'pickup':
            return parse_pickup(command_text, commands_size)
        case 'drop':
            return parse_drop(command_text, commands_size)
        case 'turn':
            return parse_turn(command_text, commands_size)
        case 'move':
            return parse_move(command_text, commands_size)
        case 'flip':
            return parse_flip(command_text, commands_size)
        default:
            throw `Invalid command ${command_text[0]}`
    }
}

function parse_sense(command_text, commands_size) {
    if (command_text.length !== 5 && command_text.length !== 6) {
        throw `sense instruction must have 4-5 parameters`
    }
    let direction = parse_direction(command_text[1])
    let move1 = parse_int(command_text[2])
    check_index(move1, commands_size)
    let move2 = parse_int(command_text[3])
    check_index(move2, commands_size)
    if (command_text.length === 5) {
        let condition = new CellCondition(command_text[4])
        return new Sense(direction, condition, move1, move2)
    } else {
        if (command_text[4] !== 'marker') {
            throw `if Sense function has 5 parameters, last parameter must be marker with marker indicator`
        }
        let marker_indicator = parse_int(command_text[5])
        let condition = new CellCondition(command_text[4], marker_indicator)
        return new Sense(direction, condition, move1, move2)
    }
}

function parse_direction(direction_line) {
    switch (direction_line) {
        case 'ahead':
            return CellDirection.AHEAD
        case 'here':
            return CellDirection.HERE
        case 'right-ahead':
            return CellDirection.RIGHT_AHEAD
        case 'left-ahead':
            return CellDirection.LEFT_AHEAD
        default :
            throw `Unknown direction - ${direction_line}`
    }
}

function parse_mark(command_text, commands_size) {
    if (command_text.length !== 3) {
        throw `mark instruction must have 2 parameters`
    }
    let marker = parse_int(command_text[1])
    check_marker(marker)
    let move = parse_int(command_text[2])
    check_index(move, commands_size)
    return new Mark(marker, move)
}

function parse_unmark(command_text, commands_size) {
    if (command_text.length !== 3) {
        throw `unmark instruction must have 2 parameters`
    }
    let marker = parse_int(command_text[1])
    check_marker(marker)
    let move = parse_int(command_text[2])
    check_index(move, commands_size)
    return new UnMark(marker, move)
}

function parse_pickup(command_text, commands_size) {
    if (command_text.length !== 3) {
        throw `pickup instruction must have 2 parameters`
    }
    let move1 = parse_int(command_text[1])
    check_index(move1, commands_size)
    let move2 = parse_int(command_text[2])
    check_index(move2, commands_size)
    return new PickUp(move1, move2)
}

function parse_drop(command_text, commands_size) {
    if (command_text.length !== 2) {
        throw `drop instruction must have 1 parameters`
    }
    let move = parse_int(command_text[1])
    check_index(move, commands_size)
    return new Drop(move)
}

function parse_turn(command_text, commands_size) {
    if (command_text.length !== 3) {
        throw `turn instruction must have 2 parameters`
    }
    let direction = undefined
    switch (command_text[1]) {
        case 'left':
            direction = Direction.LEFT
            break
        case 'right':
            direction = Direction.RIGHT
            break
        default:
            throw `Unknown direction ${command_text[1]}`
    }
    let move = parse_int(command_text[2])
    check_index(move, commands_size)
    return new Turn(direction, move)
}

function parse_move(command_text, commands_size) {
    if (command_text.length !== 3) {
        throw `move instruction must have 2 parameters`
    }
    let move1 = parse_int(command_text[1])
    check_index(move1, commands_size)
    let move2 = parse_int(command_text[2])
    check_index(move2, commands_size)
    return new Move(move1, move2)
}

function parse_flip(command_text, commands_size) {
    if (command_text.length !== 4) {
        throw `parse instruction must have 3 parameters`
    }
    let bound = parse_int(command_text[3])
    let move1 = parse_int(command_text[2])
    check_index(move1, commands_size)
    let move2 = parse_int(command_text[3])
    check_index(move2, commands_size)
    return new Flip(bound, move1, move2)
}

function check_index(current, size) {
    if (current < 0 || current >= size) {
        throw `no instruction with index ${current}`
    }
}

function check_marker(index) {
    if (index < 0 || index >= 6) {
        throw `marker indicator must be in range 0..5, but ${index} was presented`
    }
}
