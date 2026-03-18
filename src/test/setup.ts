import { GlobalWindow } from "happy-dom";

const win = new GlobalWindow({ url: "http://localhost:3000" });

globalThis.window = win as any;
globalThis.document = win.document as any;
globalThis.navigator = win.navigator as any;
