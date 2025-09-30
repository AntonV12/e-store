import style from "./tooltip.module.css";

export const Tooltip = ({
  content,
  coords,
  controlGroupRef,
}: {
  content: React.ReactNode;
  coords: { x: number; y: number };
  controlGroupRef: HTMLDivElement;
}) => {
  const controlGroupRect = controlGroupRef?.getBoundingClientRect();
  const translateY = coords.y > 50 ? coords.y - controlGroupRect!.top - 50 : coords.y - controlGroupRect!.top + 20;
  const translateX = coords.x < controlGroupRect!.width - 50 ? 0 : -50;

  return (
    <div
      className={style.tooltip}
      style={{
        left: coords.x - controlGroupRect!.left,
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      {content}
    </div>
  );
};
