import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { RTFJS } from 'rtf.js';

GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
RTFJS.loggingEnabled(false);

function isValidTextItem(item: any): item is TextItem {
  return Boolean(item.str);
}

/**
 * Extract all text content from a PDF file
 */
export async function extractPdfTextContent(data: any) {
  try {
    const pdf = await getDocument(data).promise;

    const pages = [];

    for (let i = 0; i < pdf.numPages; i++) {
      pages.push(i + 1);
    }

    const getPageContent = async (pageNumber: number) => {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      return content.items
        .map(item => {
          if (isValidTextItem(item)) {
            return item.str;
          }
          return '';
        })
        .join(' ');
    };

    const pdfTextContent = (await Promise.all(pages.map(getPageContent))).join(
      '\r\n'
    );

    return pdfTextContent;
  } catch (error: any) {
    throw new Error(
      `Could not parse document: ${
        error?.message || 'unexpected error occured'
      }`
    );
  }
}

/**
 * "Convert" RTF text to plain text, not a very robust solution...
 * Use rtf.js to convert RTF ArrayBuffer to html elements, loop trough all elements and parse text contents from them.
 * There seems to be no better way (in browser) to do this, other than using some regex hacks for RTF files, which do not work correclty.
 */
export async function convertRtfToPlainText(rtf: ArrayBuffer) {
  try {
    const doc = new RTFJS.Document(rtf, {});
    const contents: string[] = [];

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const htmlElements = await doc.render();

    for (let el of htmlElements) {
      if (el.textContent) {
        contents.push(el.textContent);
      }
    }

    return contents.join(' ');
  } catch (error: any) {
    throw new Error(
      `Could not parse document: ${
        error?.message || 'unexpected error occured'
      }`
    );
  }
}
