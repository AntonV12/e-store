import style from "./sort.module.css";
import SortButton from "./SortButton";

export default function SortForm() {
	return (
		<div className={style.sort}>
			<SortButton term="cost" value="цена" />
			<SortButton term="name" value="название" />
			<SortButton term="rating" value="рейтинг" />
			<SortButton term="viewed" value="популярность" />
		</div>
	);
}
