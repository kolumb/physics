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
const AIR_DENSITY = 0.98;
const selectedPoints = [];
const selectedLines = [];
let lastSelectedPoint;
let hoverPoint;
let cellSize = 50;
let hoverLine;
let grabFix = new Vector();
const DRAG_THRESHOLD = 10;
Input.pointer.set(-DRAG_THRESHOLD, -DRAG_THRESHOLD);

const points = [];
points.push(new Point(new Vector(width / 3, height / 3)));
points.push(new Point(new Vector((2 * width) / 3, height / 3)));
points.push(new Point(new Vector((5 * width) / 11, (2 * height) / 3)));
const lines = [];
lines.push(new Line(points[0], points[1]));
lines.push(new Line(points[1], points[2]));
lines.push(new Line(points[2], points[0]));

frame();
