import style from "./sort.module.css";
import SortButton from "./SortButton";
import { SearchParamsType } from "@/lib/types";

export default async function SortForm({ updatedParams }: { updatedParams: SearchParamsType }) {
	return (
		<div className={style.sort}>
			<SortButton term="cost" value="цена" updatedParams={updatedParams} />
			<SortButton term="name" value="название" updatedParams={updatedParams} />
			<SortButton term="rating" value="рейтинг" updatedParams={updatedParams} />
			<SortButton term="viewed" value="популярность" updatedParams={updatedParams} />
		</div>
	);
}
