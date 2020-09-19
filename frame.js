"use strict";

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
            lastSelectedPoint.pos = Input.pointer.add(grabFix);
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
    }
    lines.map((l) => l.draw());
    points.map((p) => p.draw());
    if (hoverPoint) hoverPoint.highlight();
}

function frame() {
    alreadyRequestedFrame = false;
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
