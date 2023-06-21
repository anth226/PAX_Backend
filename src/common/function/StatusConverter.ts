import { LangTypeEnum } from "../enums/admin/lang-type.enum";
import { BnStatusTypeEnum, EnStatusTypeEnum } from "../enums/admin/status.enum";

export const statusConverter = (lang: string, status: number) => {
  return status === 1
    ? lang === LangTypeEnum.ENGLISH
      ? EnStatusTypeEnum.ACTIVE
      : BnStatusTypeEnum.ACTIVE
    : lang === LangTypeEnum.ENGLISH
    ? EnStatusTypeEnum.INACTIVE
    : BnStatusTypeEnum.INACTIVE;
};

export const nameLangConverter = (lang: string, object: any) => {
  return lang === LangTypeEnum.ENGLISH
    ? object?.name_en || ""
    : object?.name_bn || "";
};

export const convertBanglaToEnglishMonth = (lang: any, month: any) => {
  const banglaMonths: any = {
    January: "জানুয়ারি",
    February: "ফেব্রুয়ারি",
    March: "মার্চ",
    April: "এপ্রিল",
    May: "মে",
    June: "জুন",
    July: "জুলাই",
    August: "আগস্ট",
    September: "সেপ্টেম্বর",
    October: "অক্টোবর",
    November: "নভেম্বর",
    December: "ডিসেম্বর",
  };

  const englishMonth: any = {
    January: "January",
    February: "February",
    March: "March",
    April: "April",
    May: "May",
    June: "June",
    July: "July",
    August: "August",
    September: "September",
    October: "October",
    November: "November",
    December: "December",
  };
  return lang === "en" ? englishMonth[month] : banglaMonths[month];
};
