import { pagesCollection } from "../config/database.js";

export async function postPage(url, pageID, title, isActive) {
  try {
    await pagesCollection.insertOne({
      title: title,
      pageId: pageID,
      url: url,
      isActive: isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  } catch (err) {
    console.log(err);
  }
}

export async function findPage() {
  try {
    const pages = await pagesCollection.find().toArray();

    return pages;
  } catch (err) {
    console.log(err);
  }
}
