// Server-side PDF text extraction using pdfjs-dist legacy build.
// Polyfills browser globals before importing pdfjs.

const _g = globalThis as any;

if (!_g.DOMMatrix) {
  _g.DOMMatrix = class DOMMatrix {
    a=1;b=0;c=0;d=1;e=0;f=0;
    m11=1;m12=0;m13=0;m14=0;m21=0;m22=1;m23=0;m24=0;
    m31=0;m32=0;m33=1;m34=0;m41=0;m42=0;m43=0;m44=1;
    is2D=true;isIdentity=true;
    constructor(..._:any[]){}
    static fromMatrix(){return new _g.DOMMatrix();}
    static fromFloat32Array(){return new _g.DOMMatrix();}
    static fromFloat64Array(){return new _g.DOMMatrix();}
    multiply(){return this;}translate(){return this;}scale(){return this;}
    rotate(){return this;}inverse(){return this;}
    toFloat32Array(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
    toFloat64Array(){return new Float64Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
    toJSON(){return {};}
  };
}
if (!_g.Path2D)    { _g.Path2D = class Path2D { constructor(){} }; }
if (!_g.ImageData) {
  _g.ImageData = class ImageData {
    width:number;height:number;data:Uint8ClampedArray;
    constructor(w:number,h:number){this.width=w;this.height=h;this.data=new Uint8ClampedArray(w*h*4);}
  };
}

async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // Use an empty data URI — prevents pdfjs from trying to load a worker package
  // while still allowing the inline fake-worker fallback
  pdfjs.GlobalWorkerOptions.workerSrc = 'data:application/javascript,';
  return pdfjs;
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await getPdfJs();

  let pdf: any;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      disableFontFace: true,
      verbosity: 0,
      useWorkerFetch: false,
      isEvalSupported: false,
    });
    pdf = await loadingTask.promise;
  } catch (err: any) {
    console.error('PDF load error:', err);
    throw new Error('Failed to load PDF file.');
  }

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
        .trim();
      if (text) pageTexts.push(text);
    } catch { /* skip bad pages */ }
  }

  const full = pageTexts.join('\n\n').trim();
  if (full.length < 50) throw new Error('SCANNED_PDF');
  return full;
}
