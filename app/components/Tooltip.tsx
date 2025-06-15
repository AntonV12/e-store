import style from "@/app/styles/layout.module.css";

export const Tooltip = ({
  children,
  coords,
  controlGroupRef,
}: {
  children: React.ReactNode;
  coords: { x: number; y: number };
  controlGroupRef: React.RefObject<HTMLDivElement>;
}) => {
  const rect = controlGroupRef.current?.getBoundingClientRect();

  return (
    <div className={style.tooltip} style={{ left: coords.x - rect!.left, top: -40 }}>
      {children}
    </div>
  );
};
