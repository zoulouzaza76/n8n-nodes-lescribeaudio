declare module 'node:crypto' {
  const crypto: any;
  export default crypto;
}

declare interface Buffer extends Uint8Array {}
declare var Buffer: any;
