"use strict";

const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d");

let width, height;
let pause = false;
const FLOOR_FACTOR = 6;
let floor;
let alreadyRequestedFrame = false;
resizeHandler();
const GRAVITY = new Vector(0, 0.1);
const FRICTION = 0.8;
const AIR_DENSITY = 0.98;
const MAX_FORCE = 10;
const RIGIDITY = 2;
const selectedPoints = [];
const selectedLines = [];
let activePoint;
let hoverPoint;
let cellSize = 50;
let hoverLine;
let grabFix = new Vector();
const DRAG_THRESHOLD = 10;
Input.pointer.set(-DRAG_THRESHOLD, -DRAG_THRESHOLD);
let frames = 0;
let FPS = 60;
let lastTime = 0;

let points = [];
points.push(new Point(new Vector(width / 3, height / 3)));
points.push(new Point(new Vector((2 * width) / 3, height / 3)));
points.push(new Point(new Vector((5 * width) / 11, (2 * height) / 3)));
let lines = [];
lines.push(new Line(points[0], points[1]));
lines.push(new Line(points[1], points[2]));
lines.push(new Line(points[2], points[0]));

frame();

window.addEventListener("resize", resizeHandler);
window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);
canvas.addEventListener("pointerdown", pointerDownHandler);
window.addEventListener("pointermove", pointerMoveHandler);
window.addEventListener("pointerup", pointerUpHandler);
document.querySelector("#PauseElem").addEventListener("click", pauseHandler);
document
    .querySelector("#SelectAllElem")
    .addEventListener("click", selectAllPoints);
document
    .querySelector("#DeselectAllElem")
    .addEventListener("click", deselectAll);
document
    .querySelector("#GridSnapElem")
    .addEventListener("click", gridSnapHandler);
document
    .querySelector("#GridCreateElem")
    .addEventListener("click", gridCreateHandler);
document
    .querySelector("#LatticeCreateElem")
    .addEventListener("click", LatticeCreateHandler);
document
    .querySelector("#ConnectedModeElem")
    .addEventListener("click", connectedModeHandler);
document
    .querySelector("#ConnectSelectedElem")
    .addEventListener("click", connectSelectedPoints);
document
    .querySelector("#TensionElem")
    .addEventListener("click", () => (Input.showTension = !Input.showTension));
document.querySelector("#RelaxLinesElem").addEventListener("click", relaxLines);
document.querySelector("#HideElem").addEventListener("click", hide);
document.querySelector("#UnhideElem").addEventListener("click", unhide);
document.querySelector("#DeleteElem").addEventListener("click", deleteSelected);
