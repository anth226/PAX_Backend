import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class DataTransformGlobalPipe implements PipeTransform {
  //constructor(private schema) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (typeof value !== "object" || Array.isArray(value)) {
        console.log("please provide json data");
      }
      return this.objectTrim(value);
    } catch (err) {
      console.log("err", err);
    }
  }
  arrayTrim(items) {
    for (const item in items) {
      if (typeof items[item] === "string") {
        items[item] = items[item].trim();
      } else if (Array.isArray(items[item])) {
        items[item] = this.arrayTrim(items[item]);
      } else if (Array[item] !== null && typeof items[item] === "object") {
        items[item] = this.objectTrim(items[item]);
      }
    }
    return items;
  }
  objectTrim(obj) {
    Object.keys(obj).forEach((ele) => {
      if (typeof obj[ele] === "string") {
        obj[ele] = obj[ele].trim();
      } else if (Array.isArray(obj[ele])) {
        obj[ele] = this.arrayTrim(obj[ele]);
      } else if (obj[ele] !== null && typeof obj[ele] === "object") {
        obj[ele] = this.objectTrim(obj[ele]);
      }
    });
    return obj;
  }
}
