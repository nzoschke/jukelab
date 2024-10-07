export const mmss = (sec: number) => {
  if (isNaN(sec)) return "00:00";
  return new Date(sec * 1000).toISOString().substring(14, 19);
};
