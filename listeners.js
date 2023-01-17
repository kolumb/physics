"use strict";

const resizeHandler = () => {
    width = innerWidth;
    height = innerHeight;
    canvas.height = height;
    canvas.width = width;

    floor = ((FLOOR_FACTOR - 1) * height) / FLOOR_FACTOR;
    if (pause && alreadyRequestedFrame === false) {
        alreadyRequestedFrame = true;
        requestAnimationFrame(frame);
    }
};

const keydownHandler = function(e) {
    if (e.code === "Space") {
        pauseHandler(e);
    }
    if (pause) {
        switch (e.code) {
            case "ControlLeft":
            case "ControlRight":
                Input.ctrl = true;
                if (Input.drag) {
                    Input.downPos.setFrom(Input.pointer);
                    Input.downCellIndex.set(0, 0);
                } else if (e.shiftKey) {
                    BoxSelectionElem.classList.remove("enabled");
                    GridCreateElem.classList.add("enabled");
                    LatticeCreateElem.disabled = false;
                    if (Input.alt) {
                        LatticeCreateElem.classList.add("enabled");
                    }
                }
                GridSnapElem.classList.add("enabled");
                break;
            case "AltLeft":
            case "AltRight":
                Input.alt = true;
                if (selectedPoints.length === 0) {
                    Input.drag = false;
                }
                if (e.shiftKey) {
                    if (e.shiftKey && Input.ctrl) {
                        LatticeCreateElem.classList.add("enabled");
                    }
                } else {
                    CreateConnectedElem.classList.add("enabled");
                    DrawConnectionsElem.classList.add("enabled");
                }
                break;
            case "ShiftLeft":
            case "ShiftRight":
                if (Input.ctrl) {
                    GridCreateElem.classList.add("enabled");
                    LatticeCreateElem.disabled = false;
                    if (Input.alt) {
                        LatticeCreateElem.classList.add("enabled");
                    }
                    BoxSelectionElem.classList.remove("enabled");
                } else {
                    BoxSelectionElem.classList.add("enabled");
                }
                if (Input.alt) {
                    if (Input.createConnectedPoint === false)
                        CreateConnectedElem.classList.remove("enabled");
                    if (Input.drawConnections === false)
                        DrawConnectionsElem.classList.remove("enabled");
                }
                break;
            case "KeyA":
                if (Input.alt) {
                    selectAllLines();
                } else {
                    selectAllPoints();
                }
                break;
            case "KeyD":
                deselectAll();
                break;
            case "KeyF":
                connectSelectedPoints();
                break;
            case "KeyT":
                Input.showTension = !Input.showTension;
                TensionElem.classList.toggle("enabled");
                break;
            case "KeyR":
                relaxLines();
                break;
            case "Delete":
            case "KeyX":
                deleteSelected();
                break;
            case "KeyH":
                if (Input.alt) {
                    unhide();
                } else {
                    hide();
                }
                break;
        }
        if (alreadyRequestedFrame === false) {
            alreadyRequestedFrame = true;
            requestAnimationFrame(frame);
        }
    }
};

const keyupHandler = function(e) {
    if (e.code === "ControlLeft" || e.code === "ControlRight") {
        Input.ctrl = false;
        if (Input.drag && activePoint) {
            const fixSnappingOffset = Input.pointer.sub(activePoint.pos);
            selectedPoints.map((p) => {
                p.pos.addMut(fixSnappingOffset);
            });
        }
        if (Input.gridSnapping === false)
            GridSnapElem.classList.remove("enabled");

        if (Input.gridCreation === false) {
            GridCreateElem.classList.remove("enabled");
            LatticeCreateElem.disabled = true;
        }

        if (Input.latticeCreation === false)
            LatticeCreateElem.classList.remove("enabled");

        if (e.shiftKey) BoxSelectionElem.classList.add("enabled");
    } else if (e.code === "AltLeft" || e.code === "AltRight") {
        Input.alt = false;
        e.preventDefault();
        if (Input.createConnectedPoint === false)
            CreateConnectedElem.classList.remove("enabled");
        if (Input.drawConnections === false)
            DrawConnectionsElem.classList.remove("enabled");
        if (Input.latticeCreation === false) {
            LatticeCreateElem.classList.remove("enabled");
        }
    } else if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (Input.boxSelection === false)
            BoxSelectionElem.classList.remove("enabled");
        if (Input.gridCreation === false) {
            GridCreateElem.classList.remove("enabled");
            LatticeCreateElem.disabled = true;
            LatticeCreateElem.classList.remove("enabled");
        }
        if (Input.alt) {
            CreateConnectedElem.classList.add("enabled");
            DrawConnectionsElem.classList.add("enabled");
        }
    }
};

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
        if (Input.gridCreation) {
            deselectAll();
            return;
        }
        if (foundPoint) {
            selectedLines.length = 0;
            if (
                (Input.alt && e.shiftKey === false) ||
                Input.drawConnections ||
                Input.boxSelection
            ) {
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
        } else if (foundLine && Input.boxSelection === false) {
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
            deselectAll();
            if (e.shiftKey && e.ctrlKey) {
                Input.drag = true;
                Input.gridCreation = true;
                GridCreateElem.classList.add("enabled");
                LatticeCreateElem.disabled = false;
                if (Input.alt) {
                    Input.latticeCreation = true;
                    LatticeCreateElem.classList.add("enabled");
                }
            } else if (e.shiftKey || Input.boxSelection) {
                Input.boxSelection = true;
                BoxSelectionElem.classList.add("enabled");
            } else {
                createNewPoint(Input.alt || Input.createConnectedPoint);
                Input.downState = false;
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
        if (pause && hoverPoint === undefined) {
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
                if (Input.ctrl === false && Input.gridSnapping === false) {
                    selectedPoints.map((p) => {
                        p.pos.addMut(Input.speed);
                    });
                }
                const pointsOfSelectedLines = new Set();
                selectedLines.map((l) => {
                    pointsOfSelectedLines.add(l.p1);
                    pointsOfSelectedLines.add(l.p2);
                });
                for (let p of pointsOfSelectedLines) p.pos.addMut(Input.speed);
            } else {
                if (
                    ((Input.alt && e.shiftKey === false) ||
                        Input.drawConnections) &&
                    Input.gridCreation === false &&
                    Input.boxSelection === false
                ) {
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
                } else if (Input.ctrl) {
                    Input.drag = true;
                } else if (Input.downPos.dist(Input.pointer) > DRAG_THRESHOLD) {
                    Input.drag = true;
                    const wasNotDraggingVector = Input.pointer.sub(
                        Input.downPos
                    );
                    if (Input.gridSnapping === false) {
                        selectedPoints.map((p) => {
                            p.pos.addMut(wasNotDraggingVector);
                        });
                    }
                    const pointsOfSelectedLines = new Set();
                    selectedLines.map((l) => {
                        pointsOfSelectedLines.add(l.p1);
                        pointsOfSelectedLines.add(l.p2);
                    });
                    for (let p of pointsOfSelectedLines)
                        p.pos.addMut(wasNotDraggingVector);
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
    if (Input.drag && Input.gridCreation) {
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
        activePoint = newPoints[0][0];
        if (Input.alt || Input.latticeCreation) {
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
        Input.gridCreation = false;
        Input.latticeCreation = false;
        if (Input.ctrl === false && Input.gridSnapping === false)
            GridSnapElem.classList.remove("enabled");
        if (e.shiftKey === false) {
            GridCreateElem.classList.remove("enabled");
            LatticeCreateElem.disabled = true;
        }
        if (Input.alt === false) LatticeCreateElem.classList.remove("enabled");
    } else if (Input.boxSelection) {
        Input.boxSelection = false;
        if (e.shiftKey === false) BoxSelectionElem.classList.remove("enabled");
        const min = new Vector(
            Math.min(Input.pointer.x, Input.downPos.x),
            Math.min(Input.pointer.y, Input.downPos.y)
        );
        const max = new Vector(
            Math.max(Input.pointer.x, Input.downPos.x),
            Math.max(Input.pointer.y, Input.downPos.y)
        );
        points.map((p) => {
            if (
                p.pos.x > min.x &&
                p.pos.x < max.x &&
                p.pos.y > min.y &&
                p.pos.y < max.y
            ) {
                selectedPoints.push(p);
            }
        });
    }
    Input.downState = false;
    Input.drag = false;
    if (pause && alreadyRequestedFrame === false) {
        alreadyRequestedFrame = true;
        requestAnimationFrame(frame);
    }
};

const pauseHandler = function(e) {
    pause = !pause;
    PauseElem.classList.toggle("enabled");
    EditMenuElem.classList.toggle("hide");
    Input.drag = false;
    Input.downState = false;
    e.preventDefault();
    if (alreadyRequestedFrame === false) {
        alreadyRequestedFrame = true;
        requestAnimationFrame(frame);
    }
};

const gridSnapHandler = function(e) {
    Input.gridSnapping = !Input.gridSnapping;
    GridSnapElem.classList.toggle("enabled");
};

const gridCreateHandler = function(e) {
    Input.gridCreation = !Input.gridCreation;
    GridCreateElem.classList.toggle("enabled");
    LatticeCreateElem.disabled = !Input.gridCreation;
};
const LatticeCreateHandler = function(e) {
    if (Input.gridCreation) {
        Input.latticeCreation = !Input.latticeCreation;
        LatticeCreateElem.classList.toggle("enabled");
    } else {
        Input.latticeCreation = false;
        LatticeCreateElem.classList.remove("enabled");
    }
};

const drawConnectionsHandler = function(e) {
    Input.drawConnections = !Input.drawConnections;
    DrawConnectionsElem.classList.toggle("enabled");
};
