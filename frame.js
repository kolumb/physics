"use strict";

function tick() {
    if (pause) {
        if (Input.drag) {
            if (Input.gridSnapDrag) {
                const shift = Input.pointer.sub(Input.downPos);
                const currentCell = new Vector(
                    Math.round(shift.x / cellSize),
                    Math.round(shift.y / cellSize)
                );
                if (
                    currentCell.x !== Input.downCellIndex.x ||
                    currentCell.y !== Input.downCellIndex.y
                ) {
                    const diff = currentCell.sub(Input.downCellIndex);
                    selectedPoints.map((p) => {
                        p.pos.addMut(diff.scale(cellSize));
                    });
                    Input.downCellIndex.addMut(diff);
                }
            } else if (Input.ctrl) {
                Input.gridSnapDrag = true;
                Input.downPos.setFrom(Input.pointer);
                Input.downCellIndex.set(0, 0);
            }
        }
    } else {
        if (Input.drag) {
            activePoint.pos = Input.pointer.add(grabFix);
        }
        points.map((p) => p.update());
        lines.map((l) => l.update());
    }
}
function render() {
    ctx.fillStyle = pause ? "#ddb" : "#ccc";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, floor, width, height / FLOOR_FACTOR);
    ctx.fillText("FPS: " + FPS, 10, 15);
    if (Input.gridCreation) {
        ctx.strokeStyle = "blue";
        let gridWidth =
            cellSize *
            Math.round((Input.pointer.x - Input.downPos.x) / cellSize);
        let gridHeight =
            cellSize *
            Math.round((Input.pointer.y - Input.downPos.y) / cellSize);
        ctx.strokeRect(Input.downPos.x, Input.downPos.y, gridWidth, gridHeight);
    }
    ctx.restore();
    if (hoverLine) hoverLine.highlight();
    if (pause === true) {
        selectedPoints.map((sp) => sp.highlight());
        selectedLines.map((sl) => sl.highlight());
        if (activePoint) activePoint.activeHighlight();
    }
    lines.map((l) => l.draw());
    points.map((p) => p.draw());
    if (hoverPoint) hoverPoint.highlight();
}

function frame() {
    frames++;
    if (performance.now() - lastTime > 1000) {
        lastTime += 1000;
        FPS = frames;
        frames = 0;
    }
    alreadyRequestedFrame = false;
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
