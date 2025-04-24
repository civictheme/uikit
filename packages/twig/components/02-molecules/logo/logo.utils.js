/**
 * @file
 * Logo component utilities.
 */

import fs from 'fs';
import pathUtil from 'path';

const dir = '../../../assets/logos';
const basePath = pathUtil.resolve(import.meta.dirname, dir);
const paths = fs.readdirSync(basePath);

function getLogos() {
  const urls = {};
  paths.forEach((path) => {
    const matches = path.matchAll(/logo_primary_([^_]+)+_([^.]+)/g);
    for (const match of matches) {
      if (match.length >= 3) {
        const theme = match[1] === 'dark' ? 'dark' : 'light';
        const type = match[2] === 'mobile' ? 'mobile' : 'desktop';
        urls[theme] = urls[theme] || {};
        urls[theme].primary = urls[theme].primary || {};
        urls[theme].primary[type] = urls[theme].primary[type] || {};
        urls[theme].primary[type] = `${dir.replace('../../../', '')}/${path}`;
      }
    }
    const secondaryMatches = path.matchAll(/logo_secondary_([^_]+)+_([^.]+)/g);
    for (const match of secondaryMatches) {
      if (match.length >= 3) {
        const theme = match[1] === 'dark' ? 'dark' : 'light';
        const type = match[2] === 'mobile' ? 'mobile' : 'desktop';
        urls[theme] = urls[theme] || {};
        urls[theme].secondary = urls[theme].secondary || {};
        urls[theme].secondary[type] = urls[theme].secondary[type] || {};
        urls[theme].secondary[type] = `${dir.replace('../../../', '')}/${path}`;
      }
    }
    const customMatches = path.matchAll(/logo_custom_([^_]+)+_([^_]+)+_([^.]+)/g);
    for (const match of customMatches) {
      if (match.length >= 3) {
        const theme = match[1] === 'dark' ? 'dark' : 'light';
        const type = match[2] === 'mobile' ? 'mobile' : 'desktop';
        const name = match[3];
        urls[theme] = urls[theme] || {};
        urls[theme][name] = urls[theme][name] || {};
        urls[theme][name][type] = urls[theme][name][type] || {};
        urls[theme][name][type] = `${dir.replace('../../../', '')}/${path}`;
      }
    }
  });

  return urls;
}

export default {
  getLogos
}
