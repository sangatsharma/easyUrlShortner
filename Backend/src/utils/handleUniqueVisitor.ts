import ClickEvent from "../model/clickEvent.model";
import easyUrlModel from "../model/db.model";
import { getURLFromCache, setClickEventInCache } from "./redisCache";

export const handleUniqueVisitor = async (
  id: string,
  externalReferer: string,
  location: string,
  deviceType: string,
  visitorId: string
) => {
  let newVisitor = true;
  const clickEventCache = await getURLFromCache(`clickEvent-${id}`);
  try {
    if (clickEventCache !== "") {
      const clickEvent = JSON.parse(clickEventCache);
      if (
        clickEvent
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
        newVisitor = false;
      } else {
        clickEvent.push({
          urlId: id,
          externalReferer,
          location,
          deviceType,
          visitorId,
        });
        setClickEventInCache(`clickEvent-${id}`, JSON.stringify(clickEvent));
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
    }
    // if new visitor save to db
    if (newVisitor) {
      const url = await easyUrlModel.findOne({ shortId: id });
      if (url) {
        const clickEvent = new ClickEvent({
          urlId: url._id,
          externalReferer,
          location,
          deviceType,
          visitorId,
        });

        try {
          await clickEvent.save();
          url.uniqueClicks += 1;
        } catch (error) {
          console.error("Error saving ClickEvent:", error);
        }

        await url.save();

        return url;
      }
    }
    return null;
  } catch (err) {
    throw new Error("Failed to save ClickEvent or update URL.");
  }
};
