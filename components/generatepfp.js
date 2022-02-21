// taken from https://stackoverflow.com/a/19301306 (mostly)

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

function seed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}

function random() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}

function randcolor() {
    let hex = "#";
    let hexString = "0123456789abcdef";
    for (i = 0; i < 6; i++) {
        hex += hexString[Math.floor(random() * hexString.length)];
    }
    return hex;
}

export function generate(name) {
    seed(new TextEncoder().encode(name).join(""));
    let color1 = randcolor();
    let color2 = randcolor();
    let angle = Math.floor(random() * 360);
    return [color1, color2, angle];
}
