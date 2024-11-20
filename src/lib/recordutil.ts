export const normalizeAlbumTitle = (title: string) => {
  const titleRe = /\s+[([].*(deluxe|remaster|expanded|anniversary).*[)\]]$/i;
  const titleMatch = title.match(titleRe);
  if (titleMatch && titleMatch[0]) {
    return title.replace(titleRe, "");
  }
  return title;
};

export const normalizeTrackTitles = (titles: string[]): [string[], boolean] => {
  if (!titles || titles.length === 0) {
    return [titles, false];
  }

  const suffixRe = /\s-\s[\w\d\s]+$/;
  const suffixMatch = titles[0].match(suffixRe);
  if (!suffixMatch || !suffixMatch[0]) {
    return [titles, false];
  }
  return [titles.map((t) => t.replace(suffixRe, "")), true];
};
