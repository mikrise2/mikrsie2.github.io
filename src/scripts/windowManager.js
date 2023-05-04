import {handleGameStart} from './fileChecker.js'
import {drawField} from './mapDrawer.js'
import {WorldMap} from '../logic/map.js'

$(document).ready(welcome_page);
/**
 * @type {string[]}
 */
let setting_ids = ['world-map', 'brain1', 'brain2', 'iterations']
/**
 *
 * @type {string[]}
 */
let option_ids = ['color1', 'color2', 'iterations', 'duration']
/**
 *
 * @type {WorldMap}
 */
let map
/**
 *
 * @type {number}
 */
let width
/**
 *
 * @type {number}
 */
let height

/**
 *
 * @param page_name
 * @param after
 * @returns {void}
 */
function load_page(page_name, after = function () {
}) {
    let body = $('body');
    body.empty()
    $('link[rel=stylesheet]').remove()
    $('head').append(`<link rel="stylesheet" type="text/css" href="src/styles/${page_name}.css">`)
    body.load(`src/pages/${page_name}.html`, function () {
        after()
    })
}

function welcome_page() {
    load_page('welcome')
}

function settings_page() {
    load_page('settings')
}

function game_page() {
    load_page('game', function (){
        drawField(width,height)
    })
}

function option_page() {
    load_page('options')
}

function quit_page() {
    load_page('quit')
}

/**
 *
 * @returns {Promise<void>}
 */
async function validate_settings() {
    if (check_fields(setting_ids) && await handleGameStart()) {
        let text = await $(`#world-map`).prop('files')[0].text()
        map = WorldMap.Convert(text)
        height = map.length
        width = map[0].length
        console.log(map)

    game_page()
    }
}

function validate_options() {
    if (check_fields(option_ids)) {
        game_page()
    }
}

/**
 *
 * @param ids
 * @returns {*}
 */
function check_fields(ids) {
    ids.forEach(id => {
        $(`#${id}`).focus(function () {
            $(this).css('border-color', '');
        })
    })
    const conditions = ids.map(check_required_field)
    return conditions.every(condition => condition === true)
}

/**
 *
 * @param id
 * @returns {boolean}
 */
function check_required_field(id) {
    let field = $(`#${id}`);
    if (field.val() === '') {
        field.css('border-color', 'red')
        return false
    }
    return true
}

window.welcome_page = welcome_page
window.validate_settings = validate_settings
window.validate_options = validate_options
window.quit_page = quit_page
window.game_page = game_page
window.settings_page = settings_page
window.option_page = option_page