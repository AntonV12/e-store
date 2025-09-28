import { SearchParamsType, SortType } from "@/lib/types";

export function buildPath(params: SearchParamsType): string {
  const segments: string[] = [];

  if (params.category) {
    segments.push("category", encodeURIComponent(params.category));
  }

  if (params.search) {
    segments.push("search", encodeURIComponent(params.search));
  }

  if (params.sortBy) {
    segments.push("sort", params.sortBy);
    if (params.sortByDirection) {
      segments.push(params.sortByDirection);
    }
  }

  if (params.page && params.page > 1) {
    segments.push("page", String(params.page));
  }

  return "/" + segments.join("/");
}

export function updatePath(currentPath: string, changes: Partial<SearchParamsType>): string {
  const segments = currentPath.split("/").filter(Boolean);
  const params: SearchParamsType = {};

  for (let i = 0; i < segments.length; i++) {
    switch (segments[i]) {
      case "category":
        params.category = decodeURIComponent(segments[i + 1]);
        i++;
        break;
      case "search":
        params.search = decodeURIComponent(segments[i + 1]);
        i++;
        break;
      case "sort":
        params.sortBy = segments[i + 1] as SortType;
        params.sortByDirection =
          segments[i + 2] === "asc" || segments[i + 2] === "desc" ? (segments[i + 2] as "asc" | "desc") : "desc";
        i += params.sortByDirection ? 2 : 1;
        break;
      case "page":
        params.page = Number(segments[i + 1]) || 1;
        i++;
        break;
    }
  }

  const newParams = { ...params, ...changes };

  return buildPath(newParams);
}
