#!/usr/bin/env node

import fs from "fs";
import { analyzeConfig } from "../src/analyzer.js";

const file = process.argv[3];
const mode = process.argv[5] || "full";

if (!file) {
  console.log("Usage: analyze <file> --mode full");
  process.exit(1);
}

const config = fs.readFileSync(file, "utf-8");

analyzeConfig(config, mode).then(console.log);
