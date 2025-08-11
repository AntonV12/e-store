"use client";

import styles from "@/styles/layout.module.css";
import ListIcon from "@/public/list.svg";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks";

export default function SearchForm({ initialValue }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue || "");
  const debouncedValue = useDebounce(value, 500);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (debouncedValue !== searchParams.get("search")) {
      if (debouncedValue) {
        router.push(`/?search=${debouncedValue}`);
      } else {
        router.push("/");
      }
    }
  }, [debouncedValue, searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.searchForm}>
      <div className={styles.menu}>
        <button className={styles.button}>
          <ListIcon />
          <span>Категории</span>
        </button>
      </div>
      <input type="search" name="search" className={styles.input} value={value} onChange={handleChange} />
    </div>
  );
}

/* "use client";

import styles from "@/styles/layout.module.css";
import ListIcon from "@/public/list.svg";

const SearchForm = ({
  value,
  setValue,
  toggleCategories,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  toggleCategories: () => void;
}) => {
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.searchForm}>
      <div className={styles.menu}>
        <button className={styles.button} onClick={toggleCategories}>
          <ListIcon />
          <span>Категории</span>
        </button>
      </div>
      <input type="search" name="search" className={styles.input} value={value} onChange={handleSearch} />
    </div>
  );
};

export default SearchForm;
 */
