export const toDateString = (date) => {
  if (date) {
    var time = new Date(date);
    var outraData = new Date();
    outraData.setDate(time.getDate() + 1);

    return outraData.toDateString();
  }

  return null;
};
