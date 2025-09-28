import style from "./categories.module.css";
import { usePathname, useRouter } from "next/navigation";
import { updatePath } from "@/utils/updatePath";

export default function Categories({ categories }: { categories: string[] }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentCategory = decodeURIComponent(pathname.split("/")[2] || "");

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    const term = target?.textContent?.trim() || "";

    const newPath = updatePath(pathname, {
      category: currentCategory === term ? "" : term,
      page: 1,
    });

    replace(newPath, { scroll: false });
  };

  return (
    <div className={style.categories}>
      <h3>Категории</h3>

      <ul className={style.list}>
        {categories.map((category) => (
          <li key={category} onClick={handleClick} className={currentCategory === category ? style.active : ""}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}
