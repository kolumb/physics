"use strict";

function tick() {
    if (pause) {
        if (Input.drag) {
            if (
                Input.gridSnapping ||
                (Input.ctrl && Input.gridCreation === false)
            ) {
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
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    if (Input.drag && Input.gridCreation) {
        let gridWidth =
            cellSize *
            Math.round((Input.pointer.x - Input.downPos.x) / cellSize);
        let gridHeight =
            cellSize *
            Math.round((Input.pointer.y - Input.downPos.y) / cellSize);
        ctx.strokeRect(Input.downPos.x, Input.downPos.y, gridWidth, gridHeight);
    } else if (Input.downState && Input.boxSelection) {
        ctx.strokeStyle = "grey";
        ctx.setLineDash([5, 10]);
        const selectionBox = Input.pointer.sub(Input.downPos);
        ctx.strokeRect(
            Input.downPos.x,
            Input.downPos.y,
            selectionBox.x,
            selectionBox.y
        );
    } else if (
        Input.downState &&
        (Input.drawConnections || Input.alt) &&
        activePoint
    ) {
        ctx.beginPath();
        ctx.moveTo(activePoint.pos.x, activePoint.pos.y);
        ctx.lineTo(Input.pointer.x, Input.pointer.y);
        ctx.stroke();
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
