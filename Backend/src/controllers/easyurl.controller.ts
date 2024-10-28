import express from "express";
import { generateUniqueId } from "../utils/generateUniqueId";
import easyUrlModel from "../model/db.model";
import { redisClient } from "../config/redisConfig";
import { getURLFromCache, setURLInCache } from "../utils/redisCache";

//handler to create short url from long url
export const createUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      res.status(400).json({ success: false, error: "Invalid URL." });
    }
    console.log("checking URL if exists in cache:");
    const cachedUrl = await getURLFromCache(originalUrl);
    if (cachedUrl !== "") {
      console.log("URL already exists in cache:", cachedUrl);
      res.status(200).json({ success: true, url: { shortId: cachedUrl } });
      return;
    }

    let expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); //3 days from now
    console.log("User:", res.locals.user);
    const userId = res.locals.user ? res.locals.user._id : null;
    if (userId) {
      expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }

    console.log("URL dont  exists in cache, creating new URL:");
    const shortId = await generateUniqueId();
    const url = await easyUrlModel.create({
      originalUrl,
      shortId,
      userId,
      expiryDate: expiryDate,
    });

    // Cache the new entry in Redis
    setURLInCache(shortId, originalUrl);
    res.status(201).json({ success: true, url: url, userId: userId });
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).json({ success: false, error: "Failed to create URL." });
  }
};

//handler to get all urls
export const getAllUrls = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const userId = res.locals.user ? res.locals.user._id : null;
  if (!userId) {
    res.status(400).json({ success: false, error: "User not found." });
    return;
  }
  try {
    const urls = await easyUrlModel.find({ userId: userId }).exec();
    res.status(200).json({ success: true, urls: urls });
    return;
  } catch (error) {
    res.send("URL not found");
    console.error("Error fetching URLs:", error);
    res.status(500).json({ sucess: false, error: "Failed to fetch URLs." });
  }
};

export const getUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check Redis cache first
    const cachedUrl = await getURLFromCache(id);
    if (cachedUrl !== "") {
      console.log("getting url from :", cachedUrl);
      res.status(200).redirect(cachedUrl);
      return;
    }
    console.log("URL dont  exists in cache, fetching from DB:");
    const url = await easyUrlModel.findOne({ shortId: req.params.id });
    if (!url) {
      const referer = req.get("Referer") || "/";
      res.status(404).redirect(`${referer}404`);
      return;
    }
    // Cache the URL in Redis
    setURLInCache(url.shortId, url.originalUrl);
    res.status(200).redirect(url.originalUrl);
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).json({ error: "Failed to fetch URL." });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const result = await easyUrlModel
      .deleteOne({ shortId: req.params.id })
      .exec();
    if (result.deletedCount === 0) {
      res.status(404).json({ success: false, error: "URL not found." });
      return;
    }
    // Remove the URL from Redis cache if it exists
    await redisClient.del(req.params.id).catch((err) => {
      console.error("Failed to delete URL from cache:", err);
    });
    res.status(200).json({ success: true, message: "Successfully deleted." });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ success: false, error: "Failed to delete URL." });
  }
};
