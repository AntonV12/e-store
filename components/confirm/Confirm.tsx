import style from "./confirm.module.css";

export default function Confirm({
	action,
	setIsShow,
}: {
	action: () => void;
	setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<div className={style.container}>
			<div className={style.modal}>
				<p className={style.title}>Вы действительно хотите безвозвратно удалить этот продукт?</p>
				<div className={style.buttons}>
					<button onClick={action}>ДА</button>
					<button onClick={() => setIsShow(false)}>НЕТ</button>
				</div>
			</div>
		</div>
	);
}
