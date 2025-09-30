import { SearchParamsType, SortType } from "@/lib/types";

export function parsePath(pathname: string): SearchParamsType {
  const segments = pathname.split("/").filter(Boolean);
  const params: SearchParamsType = {};

  for (let i = 0; i < segments.length; i++) {
    switch (segments[i]) {
      case "category":
        params.category = decodeURIComponent(segments[i + 1] || "");
        i++;
        break;
      case "search":
        params.search = decodeURIComponent(segments[i + 1] || "");
        i++;
        break;
      case "sort":
        params.sortBy = segments[i + 1] as SortType;
        if (segments[i + 2] === "asc" || segments[i + 2] === "desc") {
          params.sortByDirection = segments[i + 2] as "asc" | "desc";
          i++;
        }
        i++;
        break;
      case "page":
        params.page = Number(segments[i + 1]) || 1;
        i++;
        break;
    }
  }

  return params;
}
