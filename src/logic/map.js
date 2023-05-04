import {WorldCell} from "./worldCell.js";
import {Team} from "./core.js";


export class WorldMap {
    /**
     *
     * @param map
     */
    constructor(map) {

    }

    /**
     *
     * @param line
     * @returns {*}
     */
    static to_map_view(line) {
        return line.replace(new RegExp('\r', 'g'), '').replace(new RegExp(' ', 'g'), '')
    }

    /**
     * Validates String representation of map
     * @param {String} map 2d representation of map
     * @return {Boolean} True if map is Valid
     */
    static validate(map) {
        /**
         *
         * @type {string[]}
         */
        let lines = map.split("\n");
        /**
         *
         * @type {*[]}
         */
        lines = lines.map(this.to_map_view)
        /**
         *
         * @type {number}
         */
        if (lines.length < 2) {
            alert("Dimensions mismatch");
            return false;
        }
        /**
         *
         * @type {number}
         */
        let width = parseInt(lines[0]);
        /**
         *
         * @type {number}
         */
        let height = parseInt(lines[1]);

        lines = lines.slice(2);
        /**
         *
         * @type {number}
         */
        if (lines.length !== height) {
            alert("Height mismatch");
            return false;
        }
        /**
         *
         * @type {boolean}
         */
        if (!lines.every(it => {
            return it.length === width;
        })) {
            alert("Width mismatch");
            return false;
        }
        /**
         *
         * @type {boolean}
         */
        if (!this.validateBorder(lines)) {
            alert("Bad border");
            return false;
        }
        /**
         *
         * @type {RegExp}
         */
        let regexp = new RegExp(`^[#1-9.\\-+]{${width}}$`);
        /**
         *
         * @type {boolean}
         */
        if (!lines.every(it => {
            return regexp.test(it)
        })) {
            alert("bad symbols");
            return false;
        }
        /**
         *
         * @type {boolean}
         */
        let containsRed = false, containsBlack = false;
        /**
         *
         * @type {string}
         */
        lines.forEach(it => {
            if (it.includes("-")) {
                containsBlack = true;
            }
            if (it.includes("+")) {
                containsRed = true;
            }
        })

        /**
         *
         * @type {boolean}
         * @returns {boolean}
         */
        if (!containsBlack || !containsRed) {
            alert("Missing team");
            return false;
        }

        /**
         *
         * @type {boolean}
         * @returns {boolean}
         */
        if (!this.validateConnectivity(lines, '-', width, height) ||
            !this.validateConnectivity(lines, '+', width, height)) {
            alert("Swarms have to be linked");
            return false;
        }

        return true;
    }

    /**
     * Validates, that all the characters of `symbol` are connected
     * @param {Array.<String>} map
     * @param {string} symbol
     */
    static validateConnectivity(map, symbol, w, h) {
        /**
         *
         * @type {Map<any, any>}
         */
        let visited = new Map();
        /**
         *
         * @type {number}
         */
        let count = 0;
        /**
         *
         * @type {Array}
         */
        let start;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const element = map[i][j];
                if (element === symbol) {
                    count++;
                    start = [i, j];
                }
            }
        }

        this.dfs(start, visited, map, symbol, w, h);
        let size = 0;

        let it = visited.entries();
        while (true) {
            let set = it.next().value;
            if (set === undefined) {
                break;
            }
            size += set[1].size;
        }

        return count === size;
    }

    static directions_even = [[1, 0], [0, 1], [-1, 0], [0, -1], [-1, -1], [-1, 1]]
    static directions_odd = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, -1], [1, 1]]

    /**
     *
     * @param {Array} v
     * @param {Map.<Set>} visited
     * @param map
     * @param symbol
     * @param {Number} w
     * @param {Number} h
     */
    static dfs(v, visited, map, symbol, w, h) {
        if (!visited.has(v[0])) {
            visited.set(v[0], new Set());
        }
        if (visited.get(v[0]).has(v[1])) {
            return;
        }
        visited.get(v[0]).add(v[1]);
        let directions
        if (v[0][1] % 2 === 0){
            directions = this.directions_even
        } else {
            directions = this.directions_odd
        }
            directions.forEach(dir => {
                let newY = v[0] + dir[0];
                let newX = v[1] + dir[1];
                if (0 <= newY < h && 0 <= newX < w) {
                    if (map[newY].charAt(newX) === symbol) {
                        this.dfs([newY, newX], visited, map, symbol, w, h);
                    }
                }
            })
    }

    /**
     * Validates border
     * @param {Array.<String>} map 2d representation of map
     * @return {Boolean} True if border is Valid
     */
    static validateBorder(map) {
        if (![...map[0]].every(element => {
            return element === "#"
        })) {
            return false;
        }

        if (!map.every(it => {
            return it.charAt(0) === '#' && it.charAt(it.length - 1) === '#'
        })) {
            return false;
        }

        return [...map[map.length - 1]].every(element => {
            return element === "#"
        });


    }

    /**
     * Converts String representation of map to a 2d array
     * @param {String} map 2d representation of map
     * @return {Array.<Array.<WorldCell>>} 2d Array of Cells
     */
    static Convert(map) {
        let lines = map.split("\n").slice(2);
        lines = lines.map(this.to_map_view)
        return lines.map(line => {
            return [...line].map(c => {
                switch (c) {
                    case '#':
                        return WorldCell.createObstacle();
                    case '.':
                        return WorldCell.createEmpty();
                    case '-':
                        return WorldCell.createNest(Team.Black);
                    case '+':
                        return WorldCell.createNest(Team.Red);
                    default:
                        return WorldCell.createFood(parseInt(c));
                }
            })
        })
    }
}
