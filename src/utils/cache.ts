import { promises as fs } from 'fs';
import path from 'path';

const cacheFilePath = (prefix = '') =>
  path.resolve(`${prefix ? `${prefix}-` : ''}db.json`);

const cache = {
  set: async (data: any, prefix?: string) => {
    await fs.writeFile(cacheFilePath(prefix), JSON.stringify(data));
  },
  get: async <T>(id: string, prefix?: string) => {
    const cacheData = await fs.readFile(cacheFilePath(prefix));
    const parsedData: Record<string, T> = await JSON.parse(
      cacheData.toString()
    );

    return parsedData[id];
  },
};

export default cache;
