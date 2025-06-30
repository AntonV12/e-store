import style from "@/styles/layout.module.css";

export const Tooltip = ({
  children,
  coords,
  controlGroupRef,
}: {
  children: React.ReactNode;
  coords: { x: number; y: number };
  controlGroupRef: React.RefObject<HTMLDivElement>;
}) => {
  const controlGroupRect = controlGroupRef.current?.getBoundingClientRect();
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
      {children}
    </div>
  );
};
