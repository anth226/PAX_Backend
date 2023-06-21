export enum EnumGradeTypes {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  INVALID = "INVALID",
}

export const getGrade = (total: number) => {
  if (total > 100 || total < 0) {
    return EnumGradeTypes.INVALID;
  } else if (total >= 90 && total <= 100) {
    return EnumGradeTypes.A;
  } else if (total >= 80 && total <= 89) {
    return EnumGradeTypes.B;
  } else if (total >= 60 && total <= 79) {
    return EnumGradeTypes.C;
  } else if (total >= 0 && total < 60) {
    return EnumGradeTypes.D;
  } else {
    return "";
  }
};
