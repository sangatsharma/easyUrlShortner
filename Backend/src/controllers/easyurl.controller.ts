import express from "express";
import { generateUniqueId } from "../utils/generateUniqueId";
import easyUrlModel from "../model/db.model";
import { redisClient } from "../config/redisConfig";
import {
  getURLFromCache,
  setClickEventInCache,
  setURLInCache,
} from "../utils/redisCache";
import { sendExpiryEmail } from "../nodemailer/sendVerificationEmail";
import userModel from "../model/user.model";
import ClickEvent from "../model/clickEvent.model";

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
    return;
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
    const { id, deviceType, visitorId } = req.params;
    const externalReferer =
      decodeURIComponent(req.params.externalReferer) || null;
    const location = req.params.location || null;
    console.log("externalReferer:", externalReferer);
    if (location) {
      console.log("city:", location.split("::")[0]);
      console.log("country:", location.split("::")[1]);
    }
    console.log("deviceType", deviceType);
    console.log("visitorId", visitorId);
    let newVisitor = false;
    //check in redis cache
    const clickEventCache = await getURLFromCache(`clickEvent-${id}`);
    if (clickEventCache !== "") {
      const clickEvent = JSON.parse(clickEventCache);
      if (
        !clickEvent
          .map(
            (event: {
              urlId: string;
              externalReferer: string;
              location: string;
              deviceType: string;
              visitorId: string;
            }) => event.visitorId
          )
          .includes(visitorId)
      ) {
        clickEvent.push({
          urlId: id,
          externalReferer,
          location,
          deviceType,
          visitorId,
        });
        setClickEventInCache(`clickEvent-${id}`, JSON.stringify(clickEvent));
        newVisitor = true;
      }
    } else {
      setClickEventInCache(
        `clickEvent-${id}`,
        JSON.stringify([
          {
            urlId: id,
            externalReferer,
            location,
            deviceType,
            visitorId,
          },
        ])
      );
      // Create a new click event
      const clickEvent = new ClickEvent({
        urlId: id,
        externalReferer,
        location,
        deviceType,
        visitorId,
      });
      await clickEvent.save();
      newVisitor = true;
    }

    if (newVisitor) {
      const url = await easyUrlModel.findOne({ shortId: id });
      if (url) {
        url.uniqueClicks += 1;
        await url.save();
        res.status(200).redirect(url.originalUrl);
        const cachedUrl = await getURLFromCache(id);
        setURLInCache(url.shortId, url.originalUrl);
        return;
      }
    }
    // Check Redis cache first
    const cachedUrl = await getURLFromCache(id);
    if (cachedUrl !== "") {
      console.log("getting url from :", cachedUrl);
      res.status(200).redirect(cachedUrl);
      return;
    }
    console.log("URL dont  exists in cache, fetching from DB:");
    const url = await easyUrlModel.findOne({ shortId: id });
    if (!url) {
      const referer = req.get("Referer") || "/";
      console.log("URL not found in DB, redirecting to referer:", referer);
      res.status(404).redirect(`${referer}404`);
      return;
    }
    // Cache the URL in Redis
    setURLInCache(url.shortId, url.originalUrl);
    res.status(200).redirect(url.originalUrl);
    return;
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
    return;
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ success: false, error: "Failed to delete URL." });
  }
};

export const cronJobExpiryNotifier = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { task } = req.headers;
  console.log("Task:", task);
  if (task !== "notify-expiry") {
    res.status(403).json({ error: "Unauthorized access" });
    return;
  }

  console.log("Cron job started: notify expiry");

  const today = new Date();
  const expiryDateThreshold = new Date(
    today.getTime() + 3 * 24 * 60 * 60 * 1000
  ); // 3 days from today

  try {
    const expiringUrls = await easyUrlModel.find({
      expiryDate: { $lte: expiryDateThreshold },
      expiryNotificationSent: { $ne: true }, // only fetch URLs that haven't been notified
    });

    for (const url of expiringUrls) {
      const daysLeft = Math.round(
        (url.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft <= 3) {
        const user = await userModel.findById(url.userId);

        if (user) {
          await sendExpiryEmail(
            user.email,
            user.name,
            url.originalUrl,
            daysLeft
          );

          // Update the URL document to mark it as notified
          await easyUrlModel.findByIdAndUpdate(url._id, {
            expiryNotificationSent: true,
          });
        }
      }
    }

    console.log(
      "Checked for expiring links and sent notifications where necessary."
    );
    res.status(200).json({
      message: "notify expiry cron job completed",
      count: expiringUrls.length,
    });
    return;
  } catch (error) {
    console.error("Error fetching expiring URLs:", error);
  }
};
