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
const selectedPoints = [];
let lastCreatedPoint;

function tick() {
    points.map((p) => p.update());
    lines.map((l) => l.update());
}
function render() {
    ctx.fillStyle = pause ? "#ddb" : "#ccc";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, FLOOR, width, height / FLOOR_FACTOR);
    ctx.restore();

    points.map((p) => p.draw());
    lines.map((l) => l.draw());
    if (pause === true) selectedPoints.map((sp) => sp.highlight());
}

function frame() {
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
frame();

const keydownHandler = function(e) {
    if (e.code === "Space") {
        pause = !pause;
        if (pause === false) {
            frame();
        }
    } else if (e.code === "KeyF") {
        if (pause === false) return;
        for (let i = 0; i < selectedPoints.length; i++) {
            for (let j = i + 1; j < selectedPoints.length; j++) {
                const p1 = selectedPoints[i];
                const p2 = selectedPoints[j];
                let found = false;
                lines.map((l) => {
                    if (
                        (l.p1 === p1 && l.p2 === p2) ||
                        (l.p1 === p2 && l.p2 === p1)
                    ) {
                        found = true;
                    }
                });
                if (found === false) {
                    lines.push(new Line(p1, p2));
                }
            }
        }
        render();
    }
};

const mouseDownHandler = function(e) {
    if (pause === false || e.button === 2) return;
    const mousePos = new Vector(e.pageX, e.pageY);
    if (e.shiftKey === false) {
        while (selectedPoints.pop()) {}
    }
    let found = false;
    points.map((p) => {
        if (found === true) return;
        if (p.radius > p.pos.dist(mousePos)) {
            found = true;
            const selectionIndex = selectedPoints.indexOf(p);
            if (selectionIndex < 0) {
                selectedPoints.push(p);
            } else {
                selectedPoints.splice(selectionIndex, 1);
            }
        }
    });
    if (found === false) {
        const newPoint = new Point(new Vector(mousePos.x, mousePos.y));
        if (lastCreatedPoint && e.shiftKey) {
            lines.push(new Line(newPoint, lastCreatedPoint));
        }
        points.push(newPoint);
        lastCreatedPoint = newPoint;
    }
    render();
};

window.addEventListener("keydown", keydownHandler);
window.addEventListener("mousedown", mouseDownHandler);
