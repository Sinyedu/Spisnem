import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { BottomSheetProps } from "../../../types/generic";
import "./BottomSheet.scss";

// Resting heights as a fraction of the screen: peek, half, full.
const SNAPS = [0.18, 0.5, 0.9];
const CLOSED = SNAPS[0];
const HALF = SNAPS[1];
const OPEN = SNAPS[SNAPS.length - 1];

function nearestSnap(height: number) {
  return SNAPS.reduce((best, snap) => (Math.abs(snap - height) < Math.abs(best - height) ? snap : best));
}

function useSheetDrag() {
  const [height, setHeight] = useState(CLOSED);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ y: 0, height: CLOSED });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { y: event.clientY, height };
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    // Dragging up shrinks clientY, so the sheet grows.
    const moved = (start.current.y - event.clientY) / window.innerHeight;
    setHeight(Math.min(OPEN, Math.max(CLOSED, start.current.height + moved)));
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    setHeight(nearestSnap);
  }

  const handlers = { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
  return { dragging, handlers, height, setHeight };
}

function BottomSheet({ children, footer, expandKey }: BottomSheetProps) {
  const { dragging, handlers, height, setHeight } = useSheetDrag();

  useEffect(() => {
    if (expandKey) setHeight((current) => Math.max(current, HALF));
  }, [expandKey, setHeight]);

  return (
    <section
      className={`sheet ${dragging ? "sheet--dragging" : ""}`}
      style={{ height: `${height * 100}%` }}
    >
      <div className="sheet__grip" {...handlers}>
        <span className="sheet__handle" />
      </div>

      <div className="sheet__body">{children}</div>
      {footer && <div className="sheet__footer">{footer}</div>}
    </section>
  );
}

export default BottomSheet;
