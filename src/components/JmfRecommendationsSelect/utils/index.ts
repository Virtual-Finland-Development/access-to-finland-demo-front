import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

function isValidTextItem(item: any): item is TextItem {
  return Boolean(item.str);
}

export async function extractPdfTextContent(data: any) {
  try {
    const pdfTextContent = await getDocument(data).promise.then(pdf => {
      const pages = [];

      for (let i = 0; i < pdf.numPages; i++) {
        pages.push(i + 1);
      }

      return Promise.all(
        pages.map(pageNumber => {
          return pdf.getPage(pageNumber).then(page => {
            return page.getTextContent().then(textContent => {
              return textContent.items
                .map(item => {
                  if (isValidTextItem(item)) {
                    return item.str;
                  }
                  return '';
                })
                .join(' ');
            });
          });
        })
      ).then(pages => {
        return pages.join('\r\n');
      });
    });

    return pdfTextContent;
  } catch (error: any) {
    throw new Error(
      `Could not parse document: ${
        error?.message || 'unexpected error occured'
      }`
    );
  }
}
