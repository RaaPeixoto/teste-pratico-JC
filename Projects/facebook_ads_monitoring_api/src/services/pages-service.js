
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { findPage, postPage } from '../repositories/pages-repository.js';

async function getPages(){
 
  const pages = findPage();
  return pages;
}


async function getPageId(profileUrl, page) {
  //fazer verificação se o perfil está vindo com ou sem a ultima barra
  await page.goto(`${profileUrl}/about_profile_transparency`);

  const pageContent = await page.content();
  const regex = /"profile_transparency_id":\s*"(\d+)"/;
  const match = pageContent.match(regex);
  const Id = match ? match[1] : null;

  if (Id) {
    console.log("ID :", Id);
    return Id;
  } else {
    console.log("ID not found");
  }
}

async function getAdStatus(id, page) {
  await page.goto(
    `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${id}&search_type=page&media_type=all`
  );

  try {
    // Aguarda até que o seletor do elemento desejado esteja presente na página, com um timeout de 10 segundos
    await page.waitForSelector(
      'span.x8t9es0.xw23nyj.xo1l8bm.x63nzvj.x108nfp6.xq9mrsl.x1h4wwuj.xeuugli.x1i64zmx',
      { timeout: 10000 } 
    );

    const html = await page.content();
    const $ = cheerio.load(html);
    const span = $(
      'span.x8t9es0.xw23nyj.xo1l8bm.x63nzvj.x108nfp6.xq9mrsl.x1h4wwuj.xeuugli.x1i64zmx:contains("Ativo")'
    );
    if (span.length) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function postNewPage(req){
    const{title,url}= req
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pageId = await getPageId(url, page);
    const isActive = await getAdStatus(pageId, page);
    console.log("anuncio ativo?", isActive);
    await postPage(url,pageId,title,isActive)
    await browser.close();
}

const pagesService = {
  getPages,
  postNewPage
};

export default pagesService;