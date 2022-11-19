import { build } from "esbuild";
import { BuildOptions } from "esbuild/lib/main";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "fs";
import path from "path";

const copyStaticAssets = () => {
  const dist = path.join(process.cwd(), "./dist/");
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }

  const assetsPath = path.join(process.cwd(), "./dist/assets/");
  if (existsSync(assetsPath)) {
    rmSync(assetsPath, { force: true, recursive: true });
  }
  mkdirSync(assetsPath);
  for (let asset of [
    "node_modules/box2d-wasm/dist/es/Box2D.wasm",
    "node_modules/box2d-wasm/dist/es/Box2D.simd.wasm",
  ]) {
    const filename = path.basename(asset);
    copyFileSync(
      path.join(process.cwd(), asset),
      path.join(assetsPath, filename)
    );
  }
};

const options: BuildOptions = {
  logLevel: "info",
  format: "esm",
  entryPoints: ["./src/index.ts"],
  write: true,
  sourcemap: true,
  watch: !!process.env.WATCH,
  target: "esnext",
  outfile: "./dist/bundle.js",
  minify: true,
  keepNames: true,
  bundle: true,
  define: {
    __DEV__: "true",
    "process.env.NODE_ENV": '"development"',
    "process.versions": '""', // box2d importer thinks we're building for Node if this is not unset
  },
  loader: {
    ".frag": "text",
    ".vert": "text",
  },
};

copyStaticAssets();
build(options).catch(() => process.exit(1));
