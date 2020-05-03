"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");

let x = 30;
let y = 30;
let pos = new Vector(30, 30);
let radius = 20;
let color = "#000";

function frame() {
    ctx.clearRect(0, 0, width, height);

    x += 10;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    requestAnimationFrame(frame);
}
frame();
