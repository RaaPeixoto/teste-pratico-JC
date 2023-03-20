import pagesService from "../services/pages-service.js";

export async function listPages(req, res) {
  try {
    const pages = await pagesService.getPages();
    return res.status(200).send(pages);
  } catch (error) {
    return res.sendStatus(404);
  }
}


export async function newPage(req, res) {
    try {
      await pagesService.postNewPage(req.body);
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(404);
    }
  }