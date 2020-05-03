"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");
const GRAVITY = new Vector(0, 1);

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b},1)`;
}

const points = [];
points.push(new Point(new Vector(width / 3, height / 3)));
points.push(new Point(new Vector((2 * width) / 3, height / 3)));
points.push(new Point(new Vector((5 * width) / 11, (2 * height) / 3)));

function frame() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(points[0].pos.x, points[0].pos.y);
    ctx.lineTo(points[2].pos.x, points[2].pos.y);
    ctx.stroke();

    points.map((p) => p.update());
    points.map((p) => p.draw());
    requestAnimationFrame(frame);
}
frame();
