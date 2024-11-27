export const shuffle = <T>(array: T[]): T[] =>
  array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const chunk = <T>(array: T[], size: number): T[][] =>
  array.reduce<T[][]>((all, one, i) => {
    const ch = Math.floor(i / size);
    if (!all[ch]) all[ch] = [];
    all[ch].push(one);
    return all;
  }, []);
