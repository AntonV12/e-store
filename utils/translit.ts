export function translit(word: string) {
	const converter: Record<string, string> = {
		а: "a",
		б: "b",
		в: "v",
		г: "g",
		д: "d",
		е: "e",
		ё: "e",
		ж: "zh",
		з: "z",
		и: "i",
		й: "y",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		о: "o",
		п: "p",
		р: "r",
		с: "s",
		т: "t",
		у: "u",
		ф: "f",
		х: "h",
		ц: "c",
		ч: "ch",
		ш: "sh",
		щ: "sch",
		ь: "",
		ы: "y",
		ъ: "",
		э: "e",
		ю: "yu",
		я: "ya",
	};

	word = word.toLowerCase();

	let answer = "";
	for (let i = 0; i < word.length; ++i) {
		if (converter[word[i]] == undefined) {
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}

	answer = answer.replace(/[^-0-9a-z]/g, "-");
	answer = answer.replace(/[-]+/g, "-");
	answer = answer.replace(/^\-|-$/g, "");
	return answer;
}

export function reverseTranslit(slug: string) {
	const reverseConverter: Record<string, string> = {
		a: "а",
		b: "б",
		v: "в",
		g: "г",
		d: "д",
		e: "е",
		zh: "ж",
		z: "з",
		i: "и",
		y: "й",
		k: "к",
		l: "л",
		m: "м",
		n: "н",
		o: "о",
		p: "п",
		r: "р",
		s: "с",
		t: "т",
		u: "у",
		f: "ф",
		h: "х",
		c: "ц",
		ch: "ч",
		sh: "ш",
		sch: "щ",
		yu: "ю",
		ya: "я",
	};

	let result = "";
	let i = 0;

	while (i < slug.length) {
		let found = false;

		if (i + 2 <= slug.length) {
			const twoChars = slug.substring(i, i + 2);
			if (reverseConverter[twoChars]) {
				result += reverseConverter[twoChars];
				i += 2;
				found = true;
			}
		}

		if (!found && i + 3 <= slug.length) {
			const threeChars = slug.substring(i, i + 3);
			if (reverseConverter[threeChars]) {
				result += reverseConverter[threeChars];
				i += 3;
				found = true;
			}
		}

		if (!found) {
			const singleChar = slug[i];
			if (reverseConverter[singleChar]) {
				result += reverseConverter[singleChar];
			} else {
				result += singleChar;
			}
			i++;
		}
	}

	return result;
}
