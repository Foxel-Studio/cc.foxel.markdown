export const MAX_TEXT_BYTES = 2 * 1024 * 1024;

export function decodeText(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  if (bytes.byteLength > MAX_TEXT_BYTES) throw new Error('too-large');
  if (bytes.includes(0)) throw new Error('binary');
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('gbk').decode(bytes);
  }
}
