import {validateBugFormat} from "../logic/instruction.js";
import {WorldMap} from "../logic/map.js";


/**
 * @deprecated since sprint 2 due to non-exhaustive and non-functioning checks. Unused in this sprint
 */
class DSU {
    /**
     *
     * @param size
     */
    constructor(size) {
        this.parent = new Array(size).map((_, i) => i);
        this.size = new Array(size).fill(1);
    }

    /**
     *
     * @param x
     * @returns {number|*}
     */
    find(x) {
        if (this.parent[x] === x) {
            return x;
        }
        this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }

    /**
     *
     * @param x
     * @param y
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            return;
        }

        if (this.size[rootX] < this.size[rootY]) {
            [rootX, rootY] = [rootY, rootX];
        }

        this.parent[rootY] = rootX;
        this.size[rootX] += this.size[rootY];
    }
}

/**
 * @deprecated since sprint 2 due to non-exhaustive and non-functioning checks. neighbor index depends on current row parity
 */
function getCellNeighbours(row, col) {
    return [
        [row, col + 1],
        [row + 1, col + 1],
        [row + 1, col],
        [row, col - 1],
        [row - 1, col],
        [row - 1, col + 1]
    ]
}

/**
 * @deprecated since sprint 2 due to non-exhaustive and non-functioning checks.
 */
function checkMapComponents(rows, cols, field) {
    const dsu = new DSU(rows * cols);

    const getIndex = (row, col) => row * cols + col;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = getIndex(row, col);
            const neighbors = getCellNeighbours(row, col).filter(([nRow, nCol]) => {
                return nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols;
            });

            if (field[row][col] === '+' || field[row][col] === '-') {
                for (const [nRow, nCol] of neighbors.filter(([nRow, nCol]) => field[nRow][nCol] === field[row][col])) {
                    const nIndex = getIndex(nRow, nCol);
                    dsu.union(index, nIndex);
                }
            }
        }
    }

    const components1 = new Set();
    const components2 = new Set();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = getIndex(row, col);
            if (field[row][col] === '+') {
                components1.add(dsu.find(index));
            }
            if (field[row][col] === '-') {
                components2.add(dsu.find(index));
            }
        }
    }
    if (components1.size === 0 || components2.size === 0) {
        return "Error: One of the bug swarms is missing.";
    }
    if (components1.size > 1 || components2.size > 1) {
        return "Error: Swarm have to be linked.";
    }
    return "";
}

/**
 * @deprecated since sprint 2 due to non-exhaustive and non-functioning checks.
 */
function checkMapFormat(fileContent) {
    const lines = fileContent.split('\n');

    if (lines.length < 2) {
        return "Error: Incorrect file format.";
    }

    const height = parseInt(lines[0].trim(), 10);
    const width = parseInt(lines[1].trim(), 10);

    if (isNaN(height) || isNaN(width)) {
        return "Error: Incorrect file format.";
    }

    if (height <= 0 || width <= 0) {
        return "Error: Incorrect dimensions.";
    }

    let fieldLines = lines.slice(2);

    if (fieldLines.length !== height) {
        return "Error: The field does not correspond to the indicated dimensions.";
    }

    const validSymbols = /^[# +\-.0-9]+$/;

    for (const line of fieldLines) {
        if (!validSymbols.test(line)) {
            return "Error: Incorrect file format.";
        }
    }

    fieldLines = fieldLines.map(line => line.split(' '));

    for (const line of fieldLines) {
        if (line.length !== width) {
            return "Error: The field does not correspond to the indicated dimensions.";
        }
        line.forEach(element => {
            if (element.length !== 1) {
                return "Error: Incorrect file format.";
            }
        })
    }

    fieldLines = fieldLines.map(line => line.join(''));

    for (let row = 0; row < height; row++) {
        if (row === 0 || row + 1 === height) {
            for (let col = 0; col < width; col++) {
                if (fieldLines[row][col] !== '#') {
                    return "Error: There\'s no outer border.";
                }
            }
        } else {
            if (fieldLines[row][0] !== '#' || fieldLines[row][width - 1] !== '#') {
                return "Error: There\'s no outer border.";
            }
        }
    }

    return checkMapComponents(height, width, fieldLines);
}

/**
 *
 * @param fileContent
 * @returns {Boolean}
 */
function validateMapFormat(fileContent) {
    return WorldMap.validate(fileContent);
}

/**
 * check file formats
 * @param {String} fileId id of file input
 * @param {function} formatChecker function for check content
 * @return {Promise<Boolean>} True if validation has been successful
 */
async function checkFileFormat(fileId, formatChecker) {
    const text = await $(`#${fileId}`).prop('files')[0].text();
    return formatChecker(text);
}


/**
 * @return {Promise<Boolean>} True if validation of input files has been successful
 */
export async function handleGameStart() {
    const noErrorsMap = await checkFileFormat('world-map', validateMapFormat);
    const noErrorsBrain1 = await checkFileFormat('brain1', validateBugFormat);
    const noErrorsBrain2 = await checkFileFormat('brain2', validateBugFormat);
    return noErrorsMap && noErrorsBrain1 && noErrorsBrain2
}