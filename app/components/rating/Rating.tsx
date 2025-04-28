import style from "./rating.module.css";

export function RatingArea() {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName === "LABEL") {
      console.log(target.title);
    }
  };

  return (
    <div className={style.rating} onClick={handleClick}>
      <input type="radio" name="star" id="5" />
      <label htmlFor="5" title="5">
        &#9733;
      </label>
      <input type="radio" name="star" id="4" />
      <label htmlFor="4" title="4">
        &#9733;
      </label>
      <input type="radio" name="star" id="3" />
      <label htmlFor="3" title="3">
        &#9733;
      </label>
      <input type="radio" name="star" id="2" />
      <label htmlFor="2" title="2">
        &#9733;
      </label>
      <input type="radio" name="star" id="1" />
      <label htmlFor="1" title="1">
        &#9733;
      </label>
    </div>
  );
}
