"use strict";

const resizeHandler = () => {
    width = innerWidth;
    height = innerHeight;
    canvas.height = height;
    canvas.width = width;

    floor = ((FLOOR_FACTOR - 1) * height) / FLOOR_FACTOR;
    if (pause) render();
};
window.addEventListener("resize", resizeHandler);

const keydownHandler = function(e) {
    if (e.code === "Space") {
        pause = !pause;
        Input.drag = false;
        Input.downState = false;
    }
    if (pause) {
        switch (e.code) {
            case "ControlLeft":
            case "ControlRight":
                Input.ctrl = true;
                break;
            case "KeyF":
                connectSelectedPoints();
                break;
            case "Delete":
            case "KeyX":
                deleteSelected();
                break;
            case "KeyH":
                if (e.altKey) {
                    unhide();
                } else {
                    hide();
                }
                break;
        }
    }
    if (alreadyRequestedFrame === false) {
        alreadyRequestedFrame = true;
        requestAnimationFrame(frame);
    }
};
window.addEventListener("keydown", keydownHandler);

const keyupHandler = function(e) {
    if (e.code === "ControlLeft" || e.code === "ControlRight") {
        Input.ctrl = false;
        if (Input.gridSnapDrag) {
            Input.gridSnapDrag = false;
            if (Input.drag) {
                const fixSnappingOffset = Input.pointer.sub(activePoint.pos);
                selectedPoints.map((p) => {
                    p.pos.addMut(fixSnappingOffset);
                });
            }
        }
    }
};
window.addEventListener("keyup", keyupHandler);

const pointerDownHandler = function(e) {
    if (e.button === 2) return;
    Input.downPos.set(e.pageX, e.pageY);
    Input.downCellIndex.set(0, 0);
    Input.downState = true;
    let foundPoint = false;
    let foundLine = false;
    let lastSelectedLine;
    points.map((p) => {
        if (foundPoint) return;
        if (p.radius > p.pos.dist(Input.downPos)) {
            foundPoint = true;
            activePoint = p;
        }
    });
    if (foundPoint === false) {
        lines.map((l) => {
            if (foundLine) return;
            const d = distToSegmentSquared(Input.pointer, l.p1.pos, l.p2.pos);
            if (d < l.width ** 2) {
                foundLine = true;
                lastSelectedLine = l;
            }
        });
    }
    if (pause) {
        if (foundPoint) {
            selectedLines.length = 0;
            if (e.altKey) {
                Input.lineCreation = true;
                selectedPoints.length = 0;
            } else {
                const selectionIndex = selectedPoints.indexOf(activePoint);
                if (selectionIndex < 0) {
                    if (e.shiftKey === false) {
                        selectedPoints.length = 0;
                    }
                    selectedPoints.push(activePoint);
                } else {
                    if (e.shiftKey) {
                        Input.downState = false;
                        const deselectedPoint = selectedPoints.splice(
                            selectionIndex,
                            1
                        )[0];
                        if (deselectedPoint === activePoint) {
                            activePoint =
                                selectedPoints[selectedPoints.length - 1];
                        }
                    }
                }
            }
        } else if (foundLine) {
            selectedPoints.length = 0;
            const selectionIndex = selectedLines.indexOf(lastSelectedLine);
            if (selectionIndex < 0) {
                if (e.shiftKey === false) {
                    selectedLines.length = 0;
                }
                selectedLines.push(lastSelectedLine);
            } else {
                if (e.shiftKey) {
                    Input.downState = false;
                    selectedLines.splice(selectionIndex, 1);
                }
            }
        } else {
            selectedLines.length = 0;
            selectedPoints.length = 0;
            if (e.shiftKey && e.altKey) {
                Input.gridCreation = true;
            } else {
                createNewPoint(e.shiftKey);
            }
        }
        if (alreadyRequestedFrame === false) {
            alreadyRequestedFrame = true;
            requestAnimationFrame(frame);
        }
    } else {
        if (foundPoint) {
            grabFix = activePoint.pos.sub(Input.downPos);
            Input.drag = true;
        } else {
            Input.downState = false;
        }
    }
};
const pointerMoveHandler = function(e) {
    const pointerPos = new Vector(e.pageX, e.pageY);
    Input.speed = pointerPos.sub(Input.pointer);
    Input.pointer.setFrom(pointerPos);
    hoverPoint = undefined;
    hoverLine = undefined;
    Canvas.classList.remove("interactable");
    if (Input.drag === false) {
        points.map((p) => {
            if (hoverPoint) return;
            if (p.radius > p.pos.dist(Input.pointer)) {
                hoverPoint = p;
                Canvas.classList.add("interactable");
            }
        });
        if (hoverPoint === undefined) {
            lines.map((l) => {
                if (hoverLine) return;
                const d = distToSegmentSquared(
                    Input.pointer,
                    l.p1.pos,
                    l.p2.pos
                );
                if (d < l.width ** 2) {
                    hoverLine = l;
                    Canvas.classList.add("interactable");
                }
            });
        }
    }
    if (pause) {
        if (Input.downState) {
            if (Input.drag) {
                if (Input.lineCreation) {
                    let pointedPoint;
                    points.map((p) => {
                        if (pointedPoint) return;
                        if (p.radius > p.pos.dist(Input.pointer)) {
                            pointedPoint = p;
                        }
                    });
                    if (pointedPoint && pointedPoint !== activePoint) {
                        const p1 = pointedPoint;
                        const p2 = activePoint;
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
                        activePoint = pointedPoint;
                    }
                } else {
                    if (Input.ctrl === false) {
                        selectedPoints.map((p) => {
                            p.pos.addMut(Input.speed);
                        });
                    }
                    const pointsOfSelectedLines = new Set();
                    selectedLines.map((l) => {
                        pointsOfSelectedLines.add(l.p1);
                        pointsOfSelectedLines.add(l.p2);
                    });
                    for (let p of pointsOfSelectedLines)
                        p.pos.addMut(Input.speed);
                }
            } else {
                if (Input.ctrl) {
                    Input.drag = true;
                } else if (Input.downPos.dist(Input.pointer) > DRAG_THRESHOLD) {
                    Input.drag = true;
                    const wasNotDragingVector = Input.pointer.sub(
                        Input.downPos
                    );
                    selectedPoints.map((p) => {
                        p.pos.addMut(wasNotDragingVector);
                    });
                    const pointsOfSelectedLines = new Set();
                    selectedLines.map((l) => {
                        pointsOfSelectedLines.add(l.p1);
                        pointsOfSelectedLines.add(l.p2);
                    });
                    for (let p of pointsOfSelectedLines)
                        p.pos.addMut(wasNotDragingVector);
                }
            }
        }
        if (alreadyRequestedFrame === false) {
            alreadyRequestedFrame = true;
            requestAnimationFrame(frame);
        }
    }
};
const pointerUpHandler = function(e) {
    Input.downState = false;
    Input.drag = false;
    if (Input.gridCreation) {
        let gridWidth = Math.round(
            (Input.pointer.x - Input.downPos.x) / cellSize
        );
        let gridHeight = Math.round(
            (Input.pointer.y - Input.downPos.y) / cellSize
        );
        const topLeftX = Math.min(
            Input.downPos.x,
            Input.downPos.x + gridWidth * cellSize
        );
        const topLeftY = Math.min(
            Input.downPos.y,
            Input.downPos.y + gridHeight * cellSize
        );
        const newPoints = [];
        for (let i = 0; i <= Math.abs(gridWidth); i++) {
            newPoints.push([]);
            for (let j = 0; j <= Math.abs(gridHeight); j++) {
                let x = topLeftX + i * cellSize;
                let y = topLeftY + j * cellSize;
                const newPoint = new Point(new Vector(x, y));
                newPoints[i][j] = newPoint;
                points.push(newPoint);
                selectedPoints.push(newPoint);
            }
        }
        if (e.ctrlKey) {
            for (let i = 0; i <= Math.abs(gridWidth); i++) {
                for (let j = 0; j <= Math.abs(gridHeight); j++) {
                    if (newPoints[i + 1]) {
                        lines.push(
                            new Line(newPoints[i][j], newPoints[i + 1][j])
                        );
                        if ((i + j) % 2 == 0 && newPoints[i + 1][j + 1]) {
                            lines.push(
                                new Line(
                                    newPoints[i][j],
                                    newPoints[i + 1][j + 1]
                                )
                            );
                        }
                    }
                    if (newPoints[i][j + 1]) {
                        lines.push(
                            new Line(newPoints[i][j], newPoints[i][j + 1])
                        );
                        if ((i + j) % 2 == 0 && newPoints[i - 1]) {
                            lines.push(
                                new Line(
                                    newPoints[i][j],
                                    newPoints[i - 1][j + 1]
                                )
                            );
                        }
                    }
                }
            }
        }
    }
    Input.gridCreation = false;
    Input.lineCreation = false;
    render();
};

window.addEventListener("pointerdown", pointerDownHandler);
window.addEventListener("pointermove", pointerMoveHandler);
window.addEventListener("pointerup", pointerUpHandler);
