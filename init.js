"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");
const GRAVITY = new Vector(0, 1);
const FLOOR_FACTOR = 6;
const FLOOR = ((FLOOR_FACTOR - 1) * height) / FLOOR_FACTOR;
let pause = false;

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
const lines = [];
lines.push(new Line(points[0], points[1]));
lines.push(new Line(points[1], points[2]));
lines.push(new Line(points[2], points[0]));

function frame() {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, FLOOR, width, height / FLOOR_FACTOR);
    ctx.restore();

    points.map((p) => p.update());
    points.map((p) => p.draw());

    lines.map((l) => l.update());
    lines.map((l) => l.draw());

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
frame();

const pauseHandler = function() {
    pause = !pause;
    if (pause === false) {
        frame();
    }
};

window.addEventListener("keydown", pauseHandler);
