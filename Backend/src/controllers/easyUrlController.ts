import express from "express";
import { generateUniqueId } from "../utils/generateUniqueId";
import easyUrlModel from "../model/dbmodel";

export const createUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      res.status(400).json({ error: "Invalid URL." });
    }
    const shortId = await generateUniqueId();
    const url = await easyUrlModel.create({ originalUrl, shortId });
    res.status(201).json({ success: true, url: url });
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).json({ error: "Failed to create URL." });
  }
};

export const getAllUrls = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const urls = await easyUrlModel.find();
    res.status(200).json({ success: true, urls: urls });
  } catch (error) {
    res.send("URL not found");
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Failed to fetch URLs." });
  }
};

export const getUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const url = await easyUrlModel.findOne({ shortId: req.params.id });
    if (!url) {
      const referer = req.get("Referer") || ""; 
      res.status(404).redirect(`${referer}404`);
      return;
    }
    res.status(200).redirect(url.originalUrl);
  } catch (error) {
    console.error("Error fetching URL:", error);
  }
};
export const deleteUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const result = await easyUrlModel.deleteOne({ shortId: req.params.id });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "URL not found." });
      return;
    }
    res.status(200).json({ success: true, message: "Successfully deleted." }); // No content in the response body
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Failed to delete URL." });
  }
};
