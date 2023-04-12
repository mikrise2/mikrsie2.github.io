import WorldCell from "../logic/WorldCell.js";
import {Color} from "../logic/Enums.js";
import {parse_int} from "./Functions.js";

export async function parse_map_from_file(file) {
    let text = await file.text()
    return parse_map(text)
}

export function parse_map(text) {
    text = text.replace(/\r/g, '')
    let lines = text.replace(/\r/g, '').split('\n').filter(line => line !== '')
    if (lines.length <= 2) {
        throw "File must contain more than 2 lines"
    }
    let rows = parse_int(lines[0])
    let columns = parse_int(lines[1])
    if (rows !== lines.length - 2) {
        throw `Incorrect number of rows: was typed: ${rows}, but found: ${lines.length - 2}`
    }
    const worldCells = new Array(rows);
    for (let i = 0; i < rows; i++) {
        worldCells[i] = new Array(columns);
    }
    let first_row = lines[2].trim().split(' ')
    let last_row = lines[rows + 1].trim().split(' ') //map_rows.length-1 +2(rows and columns at the start of the file)
    if (first_row.length !== columns) {
        throw `Incorrect number of columns: was typed: ${columns}, but found: ${first_row.length}`
    }
    if (last_row.length !== columns) {
        throw `Incorrect number of columns: was typed: ${columns}, but found: ${last_row.length}`
    }
    let bound_rows = [first_row, last_row];
    bound_rows.forEach(function (line, i) {
        for (let index = 0; index < columns; index++) {
            if (line[index] !== '#') {
                throw `Borders must contain only #`
            }
            worldCells[i === 0 ? i : rows - 1][index] = world_cell_by_symbol('#')
        }
    })
    for (let i = 1; i < rows; i++) {
        let line_content = lines[i + 2].trim().split(' ')
        if (line_content.length !== columns) {
            throw `Incorrect number of columns: was typed: ${columns}, but found: ${line_content.length}`
        }
        if (line_content[0] !== '#' || line_content[line_content.length - 1] !== '#') {
            throw `Borders must contain only #`
        }
        worldCells[i][0] = world_cell_by_symbol('#')
        worldCells[i][columns - 1] = world_cell_by_symbol('#')
        for (let y = 1; y < line_content.length - 1; y++) {
            if (!is_valid_string(line_content[y])) {
                throw `Incorrect symbol '${line_content[y]}' was presented`
            }
            worldCells[i][y] = world_cell_by_symbol(line_content[y])
        }
    }
    if (!text.includes('-') || !text.includes('+')) {
        throw 'One of the bug swarms is missing'
    }
    if (!check_swarm_link(worldCells, rows, columns, Color.Red)) {
        throw `Red Swarm isn't linked`
    }
    if (!check_swarm_link(worldCells, rows, columns, Color.Black)) {
        throw `Black Swarm isn't linked`
    }
    return worldCells
}

function is_valid_string(str) {
    return /^[1-9]+$/.test(str) || str === '#' || str === '+' || str === '-' || str === '.';
}

function world_cell_by_symbol(symbol) {
    switch (symbol) {
        case '#':
            return new WorldCell(true)
        case '-':
            return new WorldCell(false, 0, Color.Black)
        case '+':
            return new WorldCell(false, 0, Color.Red)
        case '.':
            return new WorldCell()
        default:
            return new WorldCell(false, Number(symbol)) //We are using default, because validation on symbols correctness was before this function call
    }
}

function check_swarm_link(worldCells, rows, columns, color) {
    let points = new Set()
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (worldCells[i][j].baseColor === color) {
                points.add(JSON.stringify({x: j, y: i}))
            }
        }
    }
    if (points.length === 0) {
        throw 'One of the bug swarms is missing'
    }
    let checking_points = new Set()
    check_points(points, checking_points, rows, columns, points.values().next().value)
    return checking_points.size === points.size
}

function check_points(required_points, points, rows, columns, point) {
    points.add(point)
    point = JSON.parse(point)
    if (point.x > 0) {
        let new_point = JSON.stringify({x: (point.x - 1), y: point.y})
        if (!points.has(new_point) && required_points.has(new_point)) {
            check_points(required_points, points, rows, columns, new_point)
        }
    }
    if (point.x < columns - 1) {
        let new_point = JSON.stringify({x: (point.x + 1), y: point.y})
        if (!points.has(new_point) && required_points.has(new_point)) {
            check_points(required_points, points, rows, columns, new_point)
        }
    }
    if (point.y > 0) {
        let new_point = JSON.stringify({x: point.x, y: (point.y - 1)})
        if (!points.has(new_point) && required_points.has(new_point)) {
            check_points(required_points, points, rows, columns, new_point)
        }
    }
    if (point.y < rows - 1) {
        let new_point = JSON.stringify({x: point.x, y: (point.y + 1)})
        if (!points.has(new_point) && required_points.has(new_point)) {
            check_points(required_points, points, rows, columns, new_point)
        }
    }
    if (point.y % 2 === 0) {
        if (point.x > 0 && point.y > 0) {
            let new_point = JSON.stringify({x: (point.x - 1), y: (point.y - 1)})
            if (!points.has(new_point) && required_points.has(new_point)) {
                check_points(required_points, points, rows, columns, new_point)
            }
        }
        if (point.x > 0 && point.y < rows - 1) {
            let new_point = JSON.stringify({x: (point.x - 1), y: (point.y + 1)})
            if (!points.has(new_point) && required_points.has(new_point)) {
                check_points(required_points, points, rows, columns, new_point)
            }
        }
    } else {
        if (point.x < columns - 1 && point.y > 0) {
            let new_point = JSON.stringify({x: (point.x + 1), y: (point.y - 1)})
            if (!points.has(new_point) && required_points.has(new_point)) {
                check_points(required_points, points, rows, columns, new_point)
            }
        }
        if (point.x < columns - 1 && point.y < rows - 1) {
            let new_point = JSON.stringify({x: (point.x + 1), y: (point.y + 1)})
            if (!points.has(new_point) && required_points.has(new_point)) {
                check_points(required_points, points, rows, columns, new_point)
            }
        }
    }
}