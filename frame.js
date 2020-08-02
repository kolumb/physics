"use strict";

function tick() {
    if (pause === false) {
        if (Input.drag) {
            lastSelectedPoint.pos = Input.pointer.add(grabFix);
        }
    }
    points.map((p) => p.update());
    lines.map((l) => l.update());
}
function render() {
    alreadyRequestedFrame = false;
    ctx.fillStyle = pause ? "#ddb" : "#ccc";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, floor, width, height / FLOOR_FACTOR);
    ctx.restore();
    if (hoverLine) hoverLine.highlight();
    if (pause === true) {
        selectedPoints.map((sp) => sp.highlight());
        selectedLines.map((sl) => sl.highlight());
    }
    lines.map((l) => l.draw());
    points.map((p) => p.draw());
    if (hoverPoint) hoverPoint.highlight();
}

function frame() {
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
