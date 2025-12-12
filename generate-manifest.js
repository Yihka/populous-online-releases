#!/usr/bin/env node
/**
 * Generate game-components.json manifest with SHA-256 hashes
 *
 * Run this script after updating any zip file:
 *   node generate-manifest.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MANIFEST_URL_BASE = 'https://github.com/Yihka/populous-online-releases/raw/main/';

const components = {
    populous: {
        path: 'populous/populous.zip',
        files: ['poptb.exe']
    },
    ikani: {
        path: 'ikani/ikani.zip',
        files: ['popTBM.exe', 'ikani.dll']
    },
    ddraw: {
        path: 'ddraw/ddraw.zip',
        files: ['ddraw.dll']
    },
    populousOnlineJson: {
        path: 'ikani/PopulousOnlineJson.zip',
        files: ['PopulousOnline.json']
    },
    populousOriginalFiles: {
        path: 'populous/populous-original-files.zip',
        files: ['populous-original-files.zip']
    }
};

function generateManifest() {
    const manifest = {
        schemaVersion: 1,
        lastUpdated: new Date().toISOString(),
        components: {}
    };

    for (const [name, info] of Object.entries(components)) {
        const filePath = path.join(__dirname, info.path);

        if (!fs.existsSync(filePath)) {
            console.error(`Warning: ${filePath} not found, skipping ${name}`);
            continue;
        }

        const content = fs.readFileSync(filePath);
        const sha256 = crypto.createHash('sha256').update(content).digest('hex');

        manifest.components[name] = {
            sha256,
            url: `${MANIFEST_URL_BASE}${info.path}?download=`,
            size: content.length,
            files: info.files
        };

        console.log(`${name}: ${sha256.substring(0, 16)}... (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
    }

    const outputPath = path.join(__dirname, 'game-components.json');
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    console.log(`\nManifest written to: ${outputPath}`);
}

generateManifest();
