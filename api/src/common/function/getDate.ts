export default function getDate(obj: any = new Date()) {
  // console.log(typeof obj, obj);
  let dt = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: process.env.TZ || "Asia/Dhaka",
    }),
  );
  if (obj === null || obj === undefined) {
    return dt;
  } else {
    dt = new Date(
      new Date(obj).toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      }),
    );
  }
  return dt;
}
