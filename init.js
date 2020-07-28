"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");
const GRAVITY = new Vector(0, 1);
const FLOOR_FACTOR = 6;
const FLOOR = ((FLOOR_FACTOR - 1) * height) / FLOOR_FACTOR;
let pause = false;
let mouseDownState = false;
let mouseDrag = false;
let grabFix = new Vector();
const DRAG_THRESHOLD = 10;
const mouseDownPos = new Vector(-DRAG_THRESHOLD, -DRAG_THRESHOLD);
let lastMousePos = new Vector();

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
let lastSelectedPoint;

function tick() {
    if (pause === false) {
        if (mouseDrag) {
            lastSelectedPoint.pos = lastMousePos.add(grabFix);
        }
    }
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
        mouseDrag = false;
        mouseDownState = false;
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
    if (e.button === 2) return;
    mouseDownPos.set(e.pageX, e.pageY);
    let found = false;
    points.map((p) => {
        if (found) return;
        if (p.radius > p.pos.dist(mouseDownPos)) {
            found = true;
            lastSelectedPoint = p;
        }
    });
    mouseDownState = true;
    if (pause) {
        if (found) {
            if (e.shiftKey) {
                const selectionIndex = selectedPoints.indexOf(
                    lastSelectedPoint
                );
                if (selectionIndex < 0) {
                    selectedPoints.push(lastSelectedPoint);
                } else {
                    mouseDownState = false;
                    const deselectedPoint = selectedPoints.splice(
                        selectionIndex,
                        1
                    )[0];
                    if (deselectedPoint === lastSelectedPoint) {
                        lastSelectedPoint =
                            selectedPoints[selectedPoints.length - 1];
                    }
                }
            } else {
                selectedPoints.length = 0;
                selectedPoints.push(lastSelectedPoint);
            }
        } else {
            if (e.shiftKey) {
                const newPoint = new Point(mouseDownPos.copy());
                points.push(newPoint);
                if (lastSelectedPoint)
                    lines.push(new Line(newPoint, lastSelectedPoint));
                selectedPoints.length = 0;
                selectedPoints.push(newPoint);
                lastSelectedPoint = newPoint;
            } else {
                if (selectedPoints.length > 0) {
                    selectedPoints.length = 0;
                } else {
                    const newPoint = new Point(mouseDownPos.copy());
                    points.push(newPoint);
                    lastSelectedPoint = newPoint;
                }
            }
        }
        render();
    } else {
        if (found) {
            grabFix = lastSelectedPoint.pos.sub(mouseDownPos);
            mouseDrag = true;
        } else {
            mouseDownState = false;
        }
    }
};
const mouseMoveHandler = function(e) {
    const mousePos = new Vector(e.pageX, e.pageY);
    if (pause) {
        if (mouseDownState) {
            if (mouseDrag) {
                const mouseSpeed = mousePos.sub(lastMousePos);
                selectedPoints.map((p) => {
                    p.pos.addMut(mouseSpeed);
                });
            } else {
                if (mouseDownPos.dist(mousePos) > DRAG_THRESHOLD) {
                    mouseDrag = true;
                    const wasNotDragingVector = lastMousePos.sub(mouseDownPos);
                    selectedPoints.map((p) => {
                        p.pos.addMut(wasNotDragingVector);
                    });
                }
            }
            render();
        } else {
        }
    } else {
        if (mouseDrag) {
        }
    }
    lastMousePos = mousePos;
};
const mouseUpHandler = function(e) {
    mouseDownState = false;
    mouseDrag = false;
    render();
};

window.addEventListener("keydown", keydownHandler);
window.addEventListener("mousedown", mouseDownHandler);
window.addEventListener("mousemove", mouseMoveHandler);
window.addEventListener("mouseup", mouseUpHandler);
window.addEventListener("mouseleave", mouseUpHandler);
