export const generateBillCode = (): string => {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
};
