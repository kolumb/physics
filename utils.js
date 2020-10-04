"use strict";

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b},1)`;
}

// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
function dist2(v, w) {
    return (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
}
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}
function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}

function selectAllPoints() {
    deselectAll();
    points.map((p) => selectedPoints.push(p));
}
function selectAllLines() {
    deselectAll();
    lines.map((l) => selectedLines.push(l));
}
function deselectAll() {
    selectedPoints.length = 0;
    selectedLines.length = 0;
}

function createNewPoint(connected = false) {
    let newPos = Input.downPos.copy();
    if (activePoint) {
        if (Input.ctrl || Input.gridSnapping) {
            let diff = Input.downPos.sub(activePoint.pos).scale(1 / cellSize);
            diff.set(Math.round(diff.x), Math.round(diff.y));
            if (diff.length() < 1) {
                return;
            }
            newPos = activePoint.pos.add(diff.scale(cellSize));
        }
    }
    const newPoint = new Point(newPos);
    points.push(newPoint);
    if (activePoint && (connected || Input.createConnections))
        lines.push(new Line(newPoint, activePoint));
    selectedPoints.push(newPoint);
    activePoint = newPoint;
}

function connectSelectedPoints() {
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
}

function relaxLines() {
    if (selectedPoints.length) {
        selectedPoints.map((p) => {
            lines.map((l) => {
                if (l.p1 === p || l.p2 === p) {
                    l.length = l.p1.pos.dist(l.p2.pos);
                }
            });
        });
    } else if (selectedLines.length) {
        selectedLines.map((l) => {
            l.length = l.p1.pos.dist(l.p2.pos);
        });
    } else {
        lines.map((l) => {
            l.length = l.p1.pos.dist(l.p2.pos);
        });
    }
}

function hide() {
    selectedPoints.map((p) => (p.hidden = !p.hidden));
    selectedLines.map((l) => (l.hidden = !l.hidden));
    UnhideElem.classList.add("enabled");
}

function unhide() {
    points.map((p) => (p.hidden = false));
    lines.map((l) => (l.hidden = false));
    UnhideElem.classList.remove("enabled");
}

function deleteSelected() {
    activePoint = undefined;
    lines = lines.filter(
        (l) =>
            selectedPoints.indexOf(l.p1) < 0 && selectedPoints.indexOf(l.p2) < 0
    );
    points = points.filter((p) => selectedPoints.indexOf(p) < 0);
    lines = lines.filter((l) => selectedLines.indexOf(l) < 0);
    deselectAll();
}
