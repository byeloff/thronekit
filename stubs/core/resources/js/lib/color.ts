/**
 * Conversão bidirecional entre hex e oklch.
 * Implementa o caminho: hex → sRGB linear → XYZ D65 → Oklab → oklch (e inverso).
 */

function toLinear(c: number): number {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function toSRGB(c: number): number {
    const clipped = Math.max(0, Math.min(1, c));

    return clipped <= 0.0031308 ? 12.92 * clipped : 1.055 * Math.pow(clipped, 1 / 2.4) - 0.055;
}

export function hexToOklch(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const lr = toLinear(r);
    const lg = toLinear(g);
    const lb = toLinear(b);

    const x = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const y = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const z = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
    const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);

    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    const C = Math.sqrt(a * a + bVal * bVal);
    const H = (Math.atan2(bVal, a) * 180) / Math.PI;
    const hue = H < 0 ? H + 360 : H;

    return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${hue.toFixed(3)})`;
}

export function oklchToHex(value: string): string {
    const match = value.match(/oklch\(([^)]+)\)/);

    if (!match) {
return '#808080';
}

    const parts = match[1].trim().split(/\s+/).filter((p) => p !== '/');
    const L = parseFloat(parts[0] ?? '0');
    const C = parseFloat(parts[1] ?? '0');
    const H = parseFloat(parts[2] ?? '0') || 0;

    const hRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const x = 1.227013851 * l_ ** 3 - 0.5577999806 * m_ ** 3 + 0.2812561490 * s_ ** 3;
    const y = -0.0405801784 * l_ ** 3 + 1.1122568696 * m_ ** 3 - 0.0716766787 * s_ ** 3;
    const z = -0.0763812845 * l_ ** 3 - 0.4214819784 * m_ ** 3 + 1.5861632204 * s_ ** 3;

    const lr = 4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z;
    const lg = -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z;
    const lb = -0.0041960863 * x - 0.7034186147 * y + 1.7076147010 * z;

    const ri = Math.round(toSRGB(lr) * 255);
    const gi = Math.round(toSRGB(lg) * 255);
    const bi = Math.round(toSRGB(lb) * 255);

    return `#${ri.toString(16).padStart(2, '0')}${gi.toString(16).padStart(2, '0')}${bi.toString(16).padStart(2, '0')}`;
}

export function isOklch(value: string): boolean {
    return value.trim().startsWith('oklch(');
}
