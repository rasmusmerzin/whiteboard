export function animatePosition(
  start: { x: number; y: number },
  end: { x: number; y: number },
  duration: number,
  callback: (position: { x: number; y: number }) => void,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const start_time = Date.now();
  function frame() {
    const elapsed = Date.now() - start_time;
    if (elapsed < duration) {
      const progress = elapsed / duration;
      callback({
        x: start.x + dx * progress,
        y: start.y + dy * progress,
      });
      requestAnimationFrame(frame);
    } else {
      callback(end);
    }
  }
  requestAnimationFrame(frame);
}
