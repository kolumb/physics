"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(width / 2, height / 2, 20, 0, Math.PI * 2);
ctx.fill();
