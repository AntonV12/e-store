import style from "@/app/styles/layout.module.css";

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className={style.tooltip}>{children}</div>;
};
