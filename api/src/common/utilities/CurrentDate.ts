export default function CurrentDate(){
  // Default  Date Object
  const startTime = new Date();
  //Get Ios Time  (GMt to Utc 0)
  const isoTime = new Date(new Date(startTime).toISOString());
  // getTime() is the unix time value, in milliseconds.
  // getTimezoneOffset() is UTC time and local time in minutes.
  // 60000 = 60*1000 converts getTimezoneOffset() from minutes to milliseconds.
  const fixedTime = new Date(
    isoTime.getTime() - startTime.getTimezoneOffset() * 60000
  );
  return fixedTime.toISOString().slice(0, 19).replace("T", "");
}