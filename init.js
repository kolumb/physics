"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b},1)`;
}

let pos = new Vector(30, 30);
let radius = 20;
let color = randomColor();
const GRAVITY = new Vector(0, 1);

function frame() {
    ctx.clearRect(0, 0, width, height);

    pos.addMut(GRAVITY);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    requestAnimationFrame(frame);
}
frame();
