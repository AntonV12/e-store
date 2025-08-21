import style from "@/components/profile/profile.module.css";
import OrdersList from "@/components/profile/OrdersList";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className={style.profile}>{children}</div>;
}
