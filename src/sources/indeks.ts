import * as cheerio from 'cheerio';
import axios from 'axios';
import * as moment from 'moment';

import { sendEmail } from '../utils/email';
import { trim } from '../utils/string';
import { logger } from '../utils/logger';
import { config } from '../config';
import { IResultMap } from './results';

const getUrl = (page: number): string => `${config.indexUrl}&num=${page}`;

function parseImage(str: string): string {
  str = str.replace(/\?.*/, '');

  if (str && str.startsWith('/')) {
    return `https://www.index.hr${str}`;
  }

  return str;
}

async function extractAds($: CheerioStatic, selector: string): Promise<IResultMap> {
  const ads = $(selector);
  logger.info('extracting Index oglasi ads...');

  return new Promise((resolve, reject) => {
    const results = {};
    const totalSize = ads.length;
    if (!totalSize) {
      return resolve(results);
    }

    ads.each(function (index) {
      try {
        let href =$(this).attr('href');
        const title = $(this).find('.result_body > .head > .title').text();
        const description = $(this).find('.result_body > .head > .lead').text();;
        const image = parseImage($(this).find('.result_photo > img').attr('src'));
        const price = $(this).find('.result_body > .foot > .price > span').text();
        let publishedAt = $(this).find('.result_body > .foot > .info > .icon-time').text().replace('Objava ', '');
        publishedAt = moment(publishedAt, 'DD.MM.YYYY.').toISOString();

        if (publishedAt) {
          if (moment(publishedAt).isAfter(config.notBeforeDateTime)) {
            href = trim(href);
            results[href] = {
              href,
              title: trim(title),
              image: trim(image),
              description: trim(description),
              price: trim(price),
              publishedAt,
            };
          } else {
            logger.info(`skipping add because published at ${publishedAt}`);
          }
        }

        if (index + 1 === totalSize) {
          resolve(results);
        }
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  });
}

async function processPage(page: number): Promise<IResultMap> {
  logger.info(`processing page ${page}`);
  logger.info('downloading html...');

  const html = await axios.get(getUrl(page));

  logger.info('parsing regular ads...');
  const regularSelector = '.results > .OglasiRezHolder > a';
  if (!cheerio.load(html.data)('.results').length) {
    logger.error('something is wrong with Index oglasi html');
    await sendEmail(config.errorsReceiver, 'Parsing for Index oglasi failed', `<html><body><span>Something is wrong with input html. ${html.data}</span></body></html>`)
    return {};
  }

  return extractAds(cheerio.load(html.data), regularSelector);
}

export default async () => {
  if (!config.indexUrl) {
    logger.info('skipping Index oglasi url...');
    return {};
  }

  const results1 = await processPage(1);
  const results2 = await processPage(2);

  return {
    ...results1,
    ...results2,
  };
}
