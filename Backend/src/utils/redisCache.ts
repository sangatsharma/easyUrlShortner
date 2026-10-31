import { getRedisStatus, redisClient } from "../config/redisConfig";

export const getURLFromCache = async (text: string) => {
  let isRedisReady = getRedisStatus();
  console.log("Redis connected:", isRedisReady);
  if (isRedisReady) {
    const value = await redisClient.get(text);

    if (value) {
      console.log(`Got value: ${value}`);
      if (value.includes("originalUrl")) {
        return JSON.parse(value);
      }
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
    const longUrl = JSON.parse(originalURL);
    await redisClient.set(longUrl.originalUrl, shortId, {
      EX: 3600, // Set the expiration time to 3600 seconds
    });
  }
};

export const setClickEventInCache = async (
  urlId: string,
  clickEvent: string
) => {
  let isRedisReady = getRedisStatus();
  if (isRedisReady) {
    await redisClient.set(urlId, clickEvent, {
      EX: 3600, // Set the expiration time to 3600 seconds
    });
  }
};
