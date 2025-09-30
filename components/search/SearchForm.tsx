// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import styles from "./searchForm.module.css";
// import ListIcon from "@/public/list.svg";
// import { useState } from "react";
// import SearchIcon from "@/public/search.svg";
// import Categories from "@/components/categories/Categories";
// import { updatePath } from "@/utils/updatePath";

// export default function SearchForm({ categories }: { categories: string[] }) {
//   const pathname = usePathname();
//   const { replace } = useRouter();
//   const [isShowCategories, setIsShowCategories] = useState<boolean>(false);
//   const currentName =
//     decodeURIComponent(pathname.split("/")[pathname.split("/").findIndex((item) => item === "search") + 1]) || "";

//   const toggleShowCategories = () => {
//     setIsShowCategories(!isShowCategories);
//   };

//   const handleSearch = useDebouncedCallback((term: string) => {
//     const newPath = updatePath(pathname, { search: term, page: 1 });
//     replace(newPath);
//   }, 300);

//   return (
//     <div className={styles.searchForm}>
//       <div className={styles.menu}>
//         <button className={styles.button} onClick={toggleShowCategories}>
//           <ListIcon />
//           <span>Категории</span>
//         </button>
//         {isShowCategories && <Categories categories={categories} />}
//       </div>

//       <div className={styles.inputBlock}>
//         <div className={styles.searchIcon}>
//           <SearchIcon className={styles.searchIcon} />
//         </div>

//         <input
//           type="search"
//           className={styles.input}
//           onChange={(e) => {
//             handleSearch(e.target.value);
//           }}
//           defaultValue={currentName}
//           placeholder="Поиск..."
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import styles from "./searchForm.module.css";
import ListIcon from "@/public/list.svg";
import { useState } from "react";
import SearchIcon from "@/public/search.svg";
import Categories from "@/components/categories/Categories";

export default function SearchForm({ categories }: { categories: string[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isShowCategories, setIsShowCategories] = useState<boolean>(false);
  const currentName = searchParams.get("search") || "";

  const toggleShowCategories = () => {
    setIsShowCategories(!isShowCategories);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={styles.searchForm}>
      <div className={styles.menu}>
        <button className={styles.button} onClick={toggleShowCategories}>
          <ListIcon />
          <span>Категории</span>
        </button>
        {isShowCategories && <Categories categories={categories} />}
      </div>

      <div className={styles.inputBlock}>
        <div className={styles.searchIcon}>
          <SearchIcon className={styles.searchIcon} />
        </div>

        <input
          type="search"
          className={styles.input}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={currentName}
          placeholder="Поиск..."
        />
      </div>
    </div>
  );
}
