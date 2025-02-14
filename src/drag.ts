export const drag =
  (
    position: { x: number; y: number },
    setPosition: (value: { x: number; y: number }) => void,
  ) =>
  (event: React.MouseEvent) => {
    if (event.button) return;
    event.stopPropagation();
    const { clientX, clientY } = event;
    function drag(event: MouseEvent) {
      setPosition({
        x: position.x + event.clientX - clientX,
        y: position.y + event.clientY - clientY,
      });
    }
    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };
