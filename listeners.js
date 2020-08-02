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
        if (pause === false) {
            frame();
        }
    } else if (e.code === "KeyF") {
        if (pause === false) return;
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
        render();
    }
};
window.addEventListener("keydown", keydownHandler);

const pointerDownHandler = function(e) {
    if (e.button === 2) return;
    Input.downPos.set(e.pageX, e.pageY);
    Input.downState = true;
    let found = false;
    points.map((p) => {
        if (found) return;
        if (p.radius > p.pos.dist(Input.downPos)) {
            found = true;
            lastSelectedPoint = p;
        }
    });
    if (pause) {
        if (found) {
            if (e.shiftKey) {
                const selectionIndex = selectedPoints.indexOf(
                    lastSelectedPoint
                );
                if (selectionIndex < 0) {
                    selectedPoints.push(lastSelectedPoint);
                } else {
                    Input.downState = false;
                    const deselectedPoint = selectedPoints.splice(
                        selectionIndex,
                        1
                    )[0];
                    if (deselectedPoint === lastSelectedPoint) {
                        lastSelectedPoint =
                            selectedPoints[selectedPoints.length - 1];
                    }
                }
            } else {
                selectedPoints.length = 0;
                selectedPoints.push(lastSelectedPoint);
            }
        } else {
            if (e.shiftKey) {
                const newPoint = new Point(Input.downPos.copy());
                points.push(newPoint);
                if (lastSelectedPoint)
                    lines.push(new Line(newPoint, lastSelectedPoint));
                selectedPoints.length = 0;
                selectedPoints.push(newPoint);
                lastSelectedPoint = newPoint;
            } else {
                if (selectedPoints.length > 0) {
                    selectedPoints.length = 0;
                } else {
                    const newPoint = new Point(Input.downPos.copy());
                    points.push(newPoint);
                    lastSelectedPoint = newPoint;
                }
            }
        }
        render();
    } else {
        if (found) {
            grabFix = lastSelectedPoint.pos.sub(Input.downPos);
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
    points.map((p) => {
        if (hoverPoint) return;
        if (p.radius > p.pos.dist(Input.pointer)) {
            hoverPoint = p;
        }
    });
    if (pause) {
        if (Input.downState) {
            if (Input.drag) {
                selectedPoints.map((p) => {
                    p.pos.addMut(Input.speed);
                });
            } else {
                if (Input.downPos.dist(Input.pointer) > DRAG_THRESHOLD) {
                    Input.drag = true;
                    const wasNotDragingVector = Input.pointer.sub(
                        Input.downPos
                    );
                    selectedPoints.map((p) => {
                        p.pos.addMut(wasNotDragingVector);
                    });
                }
            }
        }
        render();
    }
};
const pointerUpHandler = function(e) {
    Input.downState = false;
    Input.drag = false;
    render();
};

window.addEventListener("pointerdown", pointerDownHandler);
window.addEventListener("pointermove", pointerMoveHandler);
window.addEventListener("pointerup", pointerUpHandler);
