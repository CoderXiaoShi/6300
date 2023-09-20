import { ViteDevServer } from 'vite'


export const devPlugin = () => {
  return {
    name: 'dev-plugin',
    configureServer: (server: ViteDevServer) => {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      server.httpServer?.once('listening', () => {
        const { spawn } = require('child_process');
        const addressInfo = server.httpServer?.address();
        console.log('addressInfo', addressInfo);
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;

        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit",
        });

        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });

      })
    }
  }
}
