import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

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
 * https://stackoverflow.com/questions/29922771/convert-rtf-to-and-from-plain-text
 */
export function convertToPlainText(rtf: string) {
  rtf = rtf.replace(/\\par[d]?/g, '');
  rtf = rtf.replace(/irnaturaltightenfactor0/g, '');
  return rtf
    .replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, '')
    .trim();
}
