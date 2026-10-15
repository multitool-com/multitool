/**
 * Minimal Compound File Binary (CFB/OLE2) reader.
 *
 * Legacy Word files (.doc, Word 97-2003) are not ZIP archives: they are a
 * little filesystem inside one file, with a header, a FAT, a directory and a
 * mini-stream for small entries. Extracting the text requires reading the
 * "WordDocument" stream out of it, so this module implements just enough of the
 * specification to do that — no dependency, works in the browser.
 *
 * Reference: [MS-CFB] Compound File Binary File Format.
 */

const MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const ENDOFCHAIN = 0xfffffffe;
const FREESECT = 0xffffffff;

export interface CfbEntry {
  name: string;
  size: number;
  /** Bytes of the stream. Empty for storage (directory) entries. */
  data: Uint8Array;
}

export interface CfbArchive {
  entries: CfbEntry[];
  get(name: string): CfbEntry | null;
}

export function isCfbFile(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  return MAGIC.every((byte, index) => bytes[index] === byte);
}

class Reader {
  constructor(private readonly bytes: Uint8Array, private readonly offset = 0) {}

  u8(at: number): number {
    return this.bytes[this.offset + at] ?? 0;
  }

  u16(at: number): number {
    return this.u8(at) | (this.u8(at + 1) << 8);
  }

  u32(at: number): number {
    return (
      (this.u8(at) |
        (this.u8(at + 1) << 8) |
        (this.u8(at + 2) << 16) |
        (this.u8(at + 3) << 24)) >>>
      0
    );
  }
}

/**
 * Walks a FAT chain and returns the sector numbers in order.
 * The chain is resolved before any buffer is allocated, which keeps reading
 * safe on corrupt files (no huge allocations from a bogus size field).
 */
function chainSectors(fat: number[], start: number, limit = 200000): number[] {
  const sectors: number[] = [];
  const seen = new Set<number>();
  let sector = start;
  while (sector !== ENDOFCHAIN && sector !== FREESECT && sector < fat.length) {
    if (seen.has(sector)) break; // corrupt loop guard
    seen.add(sector);
    sectors.push(sector);
    if (sectors.length >= limit) break;
    sector = fat[sector];
  }
  return sectors;
}

/**
 * Reads a stream. `size` caps how many bytes are returned (0 = read the whole
 * chain), and `sectorOffsetBase` is 512 for the file proper or 0 for the
 * mini-stream, which lives inside an already-extracted buffer.
 */
function readChain(
  bytes: Uint8Array,
  fat: number[],
  start: number,
  sectorSize: number,
  size: number,
  sectorOffsetBase: number
): Uint8Array {
  const sectors = chainSectors(fat, start);
  const available = sectors.length * sectorSize;
  const wanted = size > 0 && size < available ? size : Math.min(available, size > 0 ? size : available);
  const out = new Uint8Array(wanted);
  let written = 0;
  for (const sector of sectors) {
    if (written >= wanted) break;
    const from = sectorOffsetBase + sector * sectorSize;
    const chunk = bytes.subarray(from, from + sectorSize);
    const take = Math.min(sectorSize, wanted - written);
    out.set(chunk.subarray(0, take), written);
    written += take;
  }
  return out;
}

/**
 * Parses the container. Returns null when the file is not a CFB document or
 * when the structure is unreadable (both cases are handled by the caller).
 */
export function readCfb(input: Uint8Array): CfbArchive | null {
  if (!isCfbFile(input)) return null;
  const bytes = input;
  const header = new Reader(bytes);

  const sectorShift = header.u16(0x1e);
  const miniSectorShift = header.u16(0x20);
  const sectorSize = 1 << sectorShift;
  const miniSectorSize = 1 << miniSectorShift;
  if (sectorSize < 128 || sectorSize > 65536) return null;

  const firstDirSector = header.u32(0x30);
  const miniStreamCutoff = header.u32(0x38);
  const firstMiniFatSector = header.u32(0x3c);
  const firstDifatSector = header.u32(0x44);
  const difatCount = header.u32(0x48);

  // ---- DIFAT → list of FAT sector numbers ----
  const fatSectors: number[] = [];
  for (let i = 0; i < 109; i++) {
    const value = header.u32(0x4c + i * 4);
    if (value === FREESECT) break;
    fatSectors.push(value);
  }
  let difatSector = firstDifatSector;
  const seenDifat = new Set<number>();
  for (let guard = 0; guard < difatCount && difatSector !== ENDOFCHAIN; guard++) {
    if (seenDifat.has(difatSector)) break;
    seenDifat.add(difatSector);
    const base = 512 + difatSector * sectorSize;
    const perSector = sectorSize / 4 - 1;
    for (let i = 0; i < perSector; i++) {
      const value = new Reader(bytes, base).u32(i * 4);
      if (value !== FREESECT) fatSectors.push(value);
    }
    difatSector = new Reader(bytes, base).u32(perSector * 4);
  }

  // ---- FAT ----
  const fat: number[] = [];
  for (const sector of fatSectors) {
    const base = 512 + sector * sectorSize;
    for (let i = 0; i < sectorSize / 4; i++) fat.push(new Reader(bytes, base).u32(i * 4));
  }
  if (fat.length === 0) return null;

  // ---- directory ----
  const dirBytes = readChain(bytes, fat, firstDirSector, sectorSize, 0, 512);
  const entries: { name: string; type: number; start: number; size: number; index: number }[] = [];
  for (let offset = 0; offset + 128 <= dirBytes.length; offset += 128) {
    const entry = new Reader(dirBytes, offset);
    const nameLength = entry.u16(0x40);
    const type = entry.u8(0x42);
    if (type !== 1 && type !== 2 && type !== 5) continue;

    let name = "";
    for (let i = 0; i + 1 < Math.max(0, nameLength - 2); i += 2) {
      const code = entry.u16(i);
      if (code === 0) break;
      name += String.fromCharCode(code);
    }

    entries.push({
      name,
      type,
      start: entry.u32(0x74),
      size: entry.u32(0x78),
      index: entries.length,
    });
  }
  if (entries.length === 0) return null;

  // ---- mini stream (small entries live inside the root entry) ----
  const rootEntry = entries.find((e) => e.type === 5);
  let miniStream: Uint8Array = new Uint8Array(0);
  let miniFat: number[] = [];
  if (rootEntry && rootEntry.size > 0) {
    miniStream = readChain(bytes, fat, rootEntry.start, sectorSize, rootEntry.size, 512);
    if (firstMiniFatSector !== ENDOFCHAIN && firstMiniFatSector !== FREESECT) {
      const miniFatBytes = readChain(bytes, fat, firstMiniFatSector, sectorSize, 0, 512);
      for (let i = 0; i + 4 <= miniFatBytes.length; i += 4) {
        miniFat.push(new Reader(miniFatBytes, i).u32(0));
      }
    }
  }

  const streams: CfbEntry[] = [];
  for (const entry of entries) {
    if (entry.type !== 2) continue; // only streams carry data
    let data: Uint8Array;
    if (entry.size < miniStreamCutoff && miniStream.length > 0) {
      data = readChain(miniStream, miniFat, entry.start, miniSectorSize, entry.size, 0);
    } else {
      data = readChain(bytes, fat, entry.start, sectorSize, entry.size, 512);
    }
    streams.push({ name: entry.name, size: entry.size, data });
  }

  return {
    entries: streams,
    get(name: string) {
      return (
        streams.find((stream) => stream.name === name) ??
        streams.find((stream) => stream.name.toLowerCase() === name.toLowerCase()) ??
        null
      );
    },
  };
}
