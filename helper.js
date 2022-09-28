import got from "got";
import { load } from "cheerio";
import scrapingbee from "scrapingbee";

async function get(url) {
  var client = new scrapingbee.ScrapingBeeClient(
    // I know this is not good :), but didn't want to mess with your time with extra configuration and stuff like that
    "N5GB02IJPO01XT64Z77B9HUXJWFN8MFAJRBV4WIR4QW138DLNOJ8LZ907O7TYQV3SJPXTATOX8BNCOTT"
  );
  var response = await client.get({
    url: url,
    params: {},
  });
  return response;
}

export async function getWebPageTitles(urls) {
  const links = [];

  const promises = urls.map((url) => {
    return get(url).then((response) => {
      var decoder = new TextDecoder();
      var text = decoder.decode(response.data);
      const webpageTitle = load(text)("title").text();

      links.push({
        url,
        title: webpageTitle,
      });
    });
  });

  await Promise.all(promises);

  return links;
}
