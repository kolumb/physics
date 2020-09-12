"use strict";

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b},1)`;
}

// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
function dist2(v, w) {
    return (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
}
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}
function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}
