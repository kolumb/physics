"use strict";

function createNewPoint(connected = false) {
    let newPos = Input.downPos.copy();
    if (activePoint) {
        if (Input.ctrl || Input.gridSnapOnCreate) {
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
    if (activePoint && (connected || Input.createConnected))
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

const toggleHidden = (x) =>
    (x.color = x.color === "transparent" ? x.originalColor : "transparent");
function hide() {
    selectedPoints.map(toggleHidden);
    selectedLines.map(toggleHidden);
}

function unhide() {
    points.map((p) => (p.color = p.originalColor));
    lines.map((l) => (l.color = l.originalColor));
}

function deleteSelected() {
    lines = lines.filter(
        (l) =>
            selectedPoints.indexOf(l.p1) < 0 && selectedPoints.indexOf(l.p2) < 0
    );
    points = points.filter((p) => selectedPoints.indexOf(p) < 0);
    selectedPoints.length = 0;
    lines = lines.filter((l) => selectedLines.indexOf(l) < 0);
    selectedLines.length = 0;
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
    alreadyRequestedFrame = false;
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
