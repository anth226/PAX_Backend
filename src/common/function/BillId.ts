export const createBillId = () => {
  let dt = new Date().getTime();
  const billId = "YXXYYXXYYX".replace(/[YX]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "Y" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return billId;
};
