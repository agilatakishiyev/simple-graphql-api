import got from "got";
import { load } from "cheerio";

export function getWebPageTitles(urls) {
  const pagePromises = urls.map((url) => {
    return got(url);
  });

  const links = Promise.all(pagePromises).then((pages) => {
    return pages.map((page) => {
      const $ = load(page.body);
      const webpageTitle = $("title").text();

      return {
        url: page.requestUrl.href,
        title: webpageTitle,
      };
    });
  });

  return links;
}
