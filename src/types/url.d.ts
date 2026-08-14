// Required so TypeScript understands the "?url" import used by pdf.js worker.
declare module "*?url" {
  const src: string;
  export default src;
}
