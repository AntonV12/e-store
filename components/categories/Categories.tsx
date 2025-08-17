import style from "./categories.module.css";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Categories({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const term = (e.target as HTMLLIElement).textContent.trim();

    if (params.size) {
      if (params.get("category") === term) {
        params.delete("category");
      } else {
        params.set("category", term);
      }
    } else {
      params.set("category", term);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={style.categories}>
      <h3>Категории</h3>

      <ul className={style.list}>
        {categories.map((category) => (
          <li key={category} onClick={handleClick} className={params.get("category") === category ? style.active : ""}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}
