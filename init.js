"use strict";

const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });

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

Input.gridCreation = true
Input.drag = true
Input.downPos.set(width / 4, - height)
Input.pointer.set(width / 4 + cellSize * 4, - height + cellSize * 4)
Input.latticeCreation = true

pointerUpHandler({shiftKey: false})
selectedPoints.length = 0

Input.gridCreation = false
Input.drag = false
Input.downPos.set(0, 0)
Input.pointer.set(0, 0)
Input.latticeCreation = false

frame();

window.addEventListener("resize", resizeHandler);
window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);
canvas.addEventListener("pointerdown", pointerDownHandler);
window.addEventListener("pointermove", pointerMoveHandler);
window.addEventListener("pointerup", pointerUpHandler);
document.querySelector("#PauseElem").addEventListener("click", pauseHandler);
document.querySelector("#BoxSelectionElem").addEventListener("click", () => {
    Input.boxSelection = !Input.boxSelection;
    Input.boxSelection ? BoxSelectionElem.classList.add("enabled") : BoxSelectionElem.classList.remove("enabled");
});
document
    .querySelector("#SelectAllPointsElem")
    .addEventListener("click", selectAllPoints);
document
    .querySelector("#SelectAllLinesElem")
    .addEventListener("click", selectAllLines);
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
document.querySelector("#CreateConnectedElem").addEventListener("click", () => {
    Input.createConnectedPoint = !Input.createConnectedPoint;
    CreateConnectedElem.classList.toggle("enabled");
});
document
    .querySelector("#DrawConnectionsElem")
    .addEventListener("click", drawConnectionsHandler);
document
    .querySelector("#ConnectSelectedElem")
    .addEventListener("click", connectSelectedPoints);
document.querySelector("#TensionElem").addEventListener("click", () => {
    Input.showTension = !Input.showTension;
    TensionElem.classList.toggle("enabled");
});
document.querySelector("#RelaxLinesElem").addEventListener("click", relaxLines);
document.querySelector("#HideElem").addEventListener("click", hide);
document.querySelector("#UnhideElem").addEventListener("click", unhide);
document.querySelector("#DeleteElem").addEventListener("click", deleteSelected);
