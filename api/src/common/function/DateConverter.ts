import { LangTypeEnum } from "../enums/admin/lang-type.enum";
import numberConverter from "./NumberConverter";

export default function dateConverter(lang: string, inputValue: any) {
  if (lang === LangTypeEnum.ENGLISH) {
    const formattedDate = inputValue?.split("-");
    return (
      formattedDate?.[2] + "-" + formattedDate?.[1] + "-" + formattedDate?.[0]
    );
  }
  let finalDate = "";
  const stringInputValue = inputValue?.toString()?.split("-");

  for (let i = 0; i < stringInputValue.length; i++) {
    const convertedDate = [];
    const valueString = stringInputValue[i]?.toString()?.split("");
    for (let j = 0; j < valueString.length; j++) {
      convertedDate.push(numberConverter(lang, +valueString[j]));
    }
    finalDate += convertedDate.join("") + "-";
  }
  const date = finalDate.slice(0, -1);
  const formattedDate = date?.split("-");
  return (
    formattedDate?.[2] + "-" + formattedDate?.[1] + "-" + formattedDate?.[0]
  );
}
