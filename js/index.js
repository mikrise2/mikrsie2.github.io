let content = $('#content')
to_start()

function change_style(style_path) {
    $('link[rel=stylesheet]').remove()
    $('head').append(`<link rel="stylesheet" type="text/css" href="${style_path}">`)
}

function to_settings() {
    content.html(' ')
    change_style("../css/styleStartPage.css")
    content.load("../templates/SettingsPage.html")
}

function to_main_page() {
    if (check_setting_files()) {
        //TODO reading data from input
        content.html(' ')
        change_style("../css/MainPage.css")
        content.load("../templates/MainPage.html")
    }
}

function to_options() {
    content.html(' ')
    change_style("../css/optionsPage.css")
    content.load("../templates/OptionsPage.html")
}

function check_setting_files() {
    return !['worldMap', 'bugAssembler1', 'bugAssembler2', 'numIterations'].map(check_field)
        .some(condition => condition === false)
}

function check_field(field_name) {
    let field = $(`#${field_name}`);
    if (field.val() === '') {
        field.css('border', '2px solid #d90606')
        return false
    }
    field.css('border', '')
    return true
}

function to_start() {
    //TODO remove current simulation data if exists
    content.html(' ')
    change_style("../css/index.css")
    content.load("../templates/StartPage.html")
}

function to_end_game() {
    content.html(' ')
    change_style("../css/styleRestartPage.css")
    content.load("../templates/RestartPage.html")
}

function to_quit() {
    content.html(' ')
    change_style("../css/styleQuitPage.css")
    content.load("../templates/QuitPage.html")
}

