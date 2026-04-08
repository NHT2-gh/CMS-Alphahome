export const getPreviousMonth = (date: string) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - 1);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}-01`;
};

export const getNextDate = (date: string) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
