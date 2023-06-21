import { LangTypeEnum } from "../enums/admin/lang-type.enum";

export const numbers = {
  0: "০",
  1: "১",
  2: "২",
  3: "৩",
  4: "৪",
  5: "৫",
  6: "৬",
  7: "৭",
  8: "৮",
  9: "৯",
};

export default function numberConverter(lang: string, inputValue: number) {
  if (lang === LangTypeEnum.ENGLISH) {
    return inputValue;
  }
  const convertedNum = [];
  const stringInputValue = inputValue?.toString()?.split("");
  for (let i = 0; i < stringInputValue.length; i++) {
    convertedNum.push(numbers[+stringInputValue[i]]);
  }
  return convertedNum.join("");
}
