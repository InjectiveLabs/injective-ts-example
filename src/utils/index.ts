export const uint8ArrayToString = (
  string: string | Uint8Array | null | undefined
): string => {
  if (!string) {
    return "";
  }

  if (string.constructor !== Uint8Array) {
    return string as string;
  }

  return new TextDecoder().decode(string);
};
