const angle = 2 * Math.PI / 6;
const radius = 50;

/**
 *
 * @param width
 * @param height
 * @returns {HTMLCanvasElement}
 */
export function drawField(width, height) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    for (let y = radius, i = 0; i < height; y += radius * (1 + Math.cos(angle)), i++) {
        for (let x = radius + ((i % 2 === 0) ? 0 : radius * (Math.sin(angle))), j = 0; j < width; x += radius * 2 * (Math.sin(angle)), j++) {
            drawHexagon(x, y, ctx);
        }
    }
}

/**
 *
 * @param x
 * @param y
 * @param ctx
 * @returns
 */
function drawHexagon(x, y, ctx) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + radius * Math.sin(angle * i), y + radius * Math.cos(angle * i));
    }
    ctx.closePath()
    ctx.stroke()
}
