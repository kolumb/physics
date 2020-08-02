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
    ctx.fillStyle = pause ? "#ddb" : "#ccc";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, floor, width, height / FLOOR_FACTOR);
    ctx.restore();

    points.map((p) => p.draw());
    lines.map((l) => l.draw());
    if (pause === true) selectedPoints.map((sp) => sp.highlight());
    if (hoverPoint) hoverPoint.highlight();
}

function frame() {
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
