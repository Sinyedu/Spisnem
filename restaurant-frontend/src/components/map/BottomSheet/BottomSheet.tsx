import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import "./BottomSheet.scss";

// Resting heights as a fraction of the screen: peek, half, full.
const SNAPS = [0.15, 0.5, 0.9];
const CLOSED = SNAPS[0];
const OPEN = SNAPS[SNAPS.length - 1];

type BottomSheetProps = {
  children: ReactNode;
};

function BottomSheet({ children }: BottomSheetProps) {
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
    // Settle on whichever snap point the finger stopped nearest to.
    setHeight((current) =>
      SNAPS.reduce((best, snap) =>
        Math.abs(snap - current) < Math.abs(best - current) ? snap : best,
      ),
    );
  }

  return (
    <section
      className="sheet"
      style={{
        height: `${height * 100}%`,
        transition: dragging ? "none" : "height 0.25s ease",
      }}
    >
      <div
        className="sheet__grip"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="sheet__handle" />
      </div>

      <div className="sheet__body">{children}</div>
    </section>
  );
}

export default BottomSheet;
