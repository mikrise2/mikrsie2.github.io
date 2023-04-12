export function parse_int(line) {
    let trim = line.trim();
    if (!/^\d+$/.test(trim)) {
        throw `${trim} can't contains not digit symbols`
    }
    return Number(trim)
}