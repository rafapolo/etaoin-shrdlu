import { serve } from "bun";

const server = serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    let path = "." + (url.pathname === "/" ? "/index.html" : url.pathname);
    const file = Bun.file(path);
    if (file.exists()) {
      const ext = path.split(".").pop();
      const contentType = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        otf: "font/otf",
        ico: "image/x-icon",
        png: "image/png",
        gif: "image/gif",
      }[ext] || "application/octet-stream";
      return new Response(file, { headers: { "Content-Type": contentType } });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);