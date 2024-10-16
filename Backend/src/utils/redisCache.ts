import { getRedisStatus ,redisClient} from "../config/redisConfig";

export const getURLFromCache = async (text: string) => {
  let isRedisReady = getRedisStatus();
  console.log("Check:", isRedisReady);
  if (isRedisReady) {
    const value = await redisClient.get(text);
    if (value) {
      console.log(`Got value: ${value}`);
      return value;
    }
  }

  return "";
};
export const setURLInCache = async (shortId: string, originalURL: string) => {
  let isRedisReady = getRedisStatus();
  if (isRedisReady) {
    await redisClient.set(shortId, originalURL, {
      EX: 3600, // Set the expiration time to 3600 seconds
    });
    await redisClient.set(originalURL, shortId, {
      EX: 3600, // Set the expiration time to 3600 seconds
    });
  }
};
