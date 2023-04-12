import {parse_map_from_file} from '../utils/MapParser.js'
import {parse_assembler_from_file} from "../utils/AssemblerParser.js";

let setting_ids = ['world_map_file', 'bug_assembler_file_1', 'bug_assembler_file_2', 'iterations']
let option_ids = ['color1', 'color2', 'iterations', 'duration']

let map = undefined
let assembler1 = undefined
let assembler2 = undefined

await welcome_page()

async function load_page(name) {
    let body = $('body');
    body.empty()
    $('link[rel=stylesheet]').remove()
    $('head').append(`<link rel="stylesheet" type="text/css" href="../../styles/${name}.css">`)
    body.load(`${name}.html`, function () {
        set_available_characters()
    })
}

async function welcome_page() {
    await load_page('welcome')
}

async function settings_page() {
    await load_page('settings')
}

async function game_page() {
    await load_page('game')
}

async function quit_page() {
    await load_page('quit')
}

async function options_page() {
    await load_page('options')
}

async function restart_page() {
    await load_page('restart')
}

async function validate_settings() {
    if (check_setting_fields()) {
        try {
            map = await parse_map_from_file($('#world_map_file').prop('files')[0])
            assembler1 = await parse_assembler_from_file($('#bug_assembler_file_1').prop('files')[0])
            assembler2 = await parse_assembler_from_file($('#bug_assembler_file_2').prop('files')[0])
        } catch (e) {
            map = undefined
            assembler1 = undefined
            assembler2 = undefined
            alert(e)
            return
        }
        await game_page()
    }
}

function check_setting_fields() {
    return check_fields(setting_ids)
}

async function validate_options() {
    if (check_option_fields()) {
        await game_page()
    }
}

function check_option_fields() {
    return check_fields(option_ids)
}

function check_fields(ids) {
    ids.forEach(id => {
        $(`#${id}`).focus(function () {
            $(this).css('border-color', '');
        })
    })
    const conditions = ids.map(check_required_field)
    return conditions.every(condition => condition === true)
}

function check_required_field(id) {
    let field = $(`#${id}`);
    if (field.val() === '') {
        field.css('border-color', 'red')
        return false
    }
    return true
}

function set_available_characters() {
    $('input[type="number"]').on('input', function () {
        let sanitizedValue = $(this).val().replace(/[^0-9]/g, '')
        $(this).val(sanitizedValue)
    })
}

window.welcome_page = welcome_page
window.settings_page = settings_page
window.game_page = game_page
window.quit_page = quit_page
window.options_page = options_page
window.quit_page = quit_page
window.restart_page = restart_page
window.validate_settings = validate_settings
window.validate_options = validate_options
