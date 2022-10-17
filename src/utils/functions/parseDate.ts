type FormatPattern = Intl.DateTimeFormatOptions;

export const parseDate = (value: string | number, format: FormatPattern) => {
  const date = new Date(value);

  const isValid = date.getTime() > 0;
  if (!isValid) return;

  return date.toLocaleString('en-US', format);
};
