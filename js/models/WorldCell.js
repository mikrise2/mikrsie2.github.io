class WorldCell {
    constructor() {
        this.obstructed = false;
        this.bug = null;
        this.food = 0;
        this.marker = null;
        this.base = null;
    }

    is_obstructed() {
        //TODO
    }

    is_occupied() {
        //TODO
    }

    set_bug(bug) {
        //TODO
    }

    get_bug() {
        //TODO
    }

    remove_bug() {
        //TODO
    }

    set_food(num) {
        //TODO
    }

    is_friendly_base(color) {
        //TODO
    }

    is_enemy_base(color) {
        //TODO
    }

    set_marker(color, position) {
        //TODO
    }

    clear_marker(color, position) {
        //TODO
    }

    is_friendly_marker(color, position) {
        //TODO
    }

    is_enemy_marker(color, position) {
        //TODO
    }

    cell_matches(position, bug_condition, color) {
        //TODO
    }

    to_string() {
        //TODO
    }
}