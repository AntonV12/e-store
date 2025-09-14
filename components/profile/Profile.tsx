import style from "./profile.module.css";
import Link from "next/link";
import Image from "next/image";
import PhotoCamera from "@/public/photo_camera.svg";
import LoginIcon from "@/public/person-circle.svg";
import { UserType } from "@/lib/types";
import LogoutForm from "./LogoutForm";
import AvatarForm from "./AvatarForm";

export default async function Profile({ currentUser }: { currentUser: Omit<UserType, "password"> | null }) {
  if (!currentUser) return null;
  return (
    <div className={style.profile}>
      <h2>Мои Данные</h2>
      <div className={style.profile__data}>
        <div className={style.avatar__container}>
          <div className={style.avatar}>
            <AvatarForm currentUser={currentUser} />

            <PhotoCamera className={style.camera} />
            {currentUser.avatar ? (
              <Image
                src={`/api/image?name=${currentUser.avatar}&path=users`}
                alt="avatar"
                width={72}
                height={72}
                className={style.avatar__img}
                priority
              />
            ) : (
              <LoginIcon className={style.loginIcon} />
            )}
          </div>
          {currentUser.name}
        </div>
        <div className={style.profile__links}>
          {currentUser.isAdmin ? <Link href="/add-product">Добавить новый товар</Link> : null}

          <LogoutForm />
        </div>
      </div>
    </div>
  );
}
