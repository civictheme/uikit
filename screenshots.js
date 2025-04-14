import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import http from 'http';
import handler from 'serve-handler';
import { execSync } from 'child_process';
import pLimit from 'p-limit'

// Configuration
const config = {
    storybookInstances: [
        {
            port: 6008,
            staticStorybookDir: path.join(process.cwd(), 'storybook-static'),
            outputDir: path.join(process.cwd(), 'screenshots/components')
        },
        {
            port: 6007,
            staticStorybookDir: path.join(process.cwd(), 'components-sdc/storybook-static'),
            outputDir: path.join(process.cwd(), 'screenshots/components-sdc')
        }
    ],
    viewports: [
        { width: 1280, height: 800, name: 'desktop' }
    ],
};

// Ensure output directories exist
async function ensureDirectories() {
    config.storybookInstances.forEach(({outputDir}) => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    });
}

// Start a static server for the given directory
function startStaticServer(directory, port) {
    const server = http.createServer((request, response) => {
        return handler(request, response, {
            public: directory
        });
    });

    return new Promise((resolve, reject) => {
        server.listen(port, () => {
            console.log(`Server started on port ${port} serving ${directory}`);
            resolve(server);
        });

        server.on('error', (error) => {
            reject(error);
        });
    });
}

// Get all story IDs from a Storybook instance
function getStoryIdsFromIndexJson(staticDir) {
    const indexPath = path.join(staticDir, 'index.json');
    if (!fs.existsSync(indexPath)) {
        throw new Error(`index.json not found at ${indexPath}`);
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const indexData = JSON.parse(indexContent);

    // Filter out entries that aren't stories (e.g., docs pages)
    const storyEntries = Object.entries(indexData.entries)
        .filter(([_, entry]) => entry.type === 'story' && !entry.id.includes('--docs'));

    return storyEntries.map(([_, entry]) => ({
        id: entry.id,
        title: entry.title
    }));
}

// Take screenshots of all stories
async function takeScreenshots() {
    await ensureDirectories();

    const servers = [];

    try {
        // Start static servers for each Storybook instance
        for (const { port, staticStorybookDir } of config.storybookInstances) {
            if (!fs.existsSync(staticStorybookDir)) {
                throw new Error(`Static Storybook directory ${staticStorybookDir} not found. Make sure to build Storybook first.`);
            }

            const server = await startStaticServer(staticStorybookDir, port);
            servers.push(server);
        }

        const browser = await puppeteer.launch({
            headless: true
        });

        try {
            for (const { port, staticStorybookDir, outputDir } of config.storybookInstances) {
                const url = `http://localhost:${port}`;
                console.log(`Processing Storybook at ${url}`);
                const page = await browser.newPage();

                // Get all story IDs
                const storyIds = getStoryIdsFromIndexJson(staticStorybookDir);
                console.log(`Found ${storyIds.length} stories`);

                for (const {id: storyId, title} of storyIds) {
                    // Skip docs pages
                    if (storyId.includes('--docs')) continue;

                    const storyPath = storyId.replace(/--/g, '/');
                    const fileName = `${storyPath}.png`;
                    const filePath = path.join(outputDir, fileName);

                    // Ensure directory exists
                    const fileDir = path.dirname(filePath);
                    if (!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, { recursive: true });
                    }

                    // Navigate to story
                    const storyUrl = `${url}/iframe?id=${storyId}&viewMode=story`;
                    console.log(`Capturing: ${storyUrl}`);
                    await page.goto(storyUrl, { waitUntil: 'networkidle0' });
                    // Take screenshot
                    await page.screenshot({
                        path: filePath,
                        fullPage: true
                    });
                }

                await page.close();
            }
        } catch (error) {
            console.error('Error taking screenshots:', error);
        } finally {
            await browser.close();
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close all static servers
        for (const server of servers) {
            server.close();
        }
    }
}

async function takeScreenshotsInParallel() {
    await ensureDirectories();

    const servers = [];

    try {
        // Start static servers for each Storybook instance
        for (const { port, staticStorybookDir } of config.storybookInstances) {
            if (!fs.existsSync(staticStorybookDir)) {
                throw new Error(`Static Storybook directory ${staticStorybookDir} not found.`);
            }

            const server = await startStaticServer(staticStorybookDir, port);
            servers.push(server);
        }

        const browser = await puppeteer.launch({
            headless: true
        });

        try {
            for (const { port, staticStorybookDir, outputDir } of config.storybookInstances) {
                const url = `http://localhost:${port}`;
                console.log(`Processing Storybook at ${url}`);

                // Get all story IDs
                const storyIds = getStoryIdsFromIndexJson(staticStorybookDir);
                console.log(`Found ${storyIds.length} stories`);

                // Filter out docs pages
                const storiesToCapture = storyIds.filter(({id}) => !id.includes('--docs'));

                // Create a limit function
                const limit = pLimit(48); // Limit to 4 concurrent operations

                // Create an array of promises
                const promises = storiesToCapture.map(({id: storyId, title}) => {
                    return limit(async () => {
                        const page = await browser.newPage();

                        try {
                            const storyPath = storyId.replace(/--/g, '/');
                            const fileName = `${storyPath}.png`;
                            const filePath = path.join(outputDir, fileName);

                            // Ensure directory exists
                            const fileDir = path.dirname(filePath);
                            if (!fs.existsSync(fileDir)) {
                                fs.mkdirSync(fileDir, { recursive: true });
                            }

                            // Navigate to story
                            const storyUrl = `${url}/iframe?id=${storyId}&viewMode=story`;
                            console.log(`Capturing: ${storyUrl}`);
                            await page.goto(storyUrl, { waitUntil: 'networkidle0' });

                            // Take screenshot
                            await page.screenshot({
                                path: filePath,
                                fullPage: true
                            });
                        } catch (error) {
                            console.error(`Error capturing ${storyId}:`, error);
                        } finally {
                            await page.close();
                        }
                    });
                });

                // Wait for all promises to resolve
                await Promise.all(promises);
            }
        } catch (error) {
            console.error('Error taking screenshots:', error);
        } finally {
            await browser.close();
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close all static servers
        for (const server of servers) {
            server.close();
        }
    }
}


// Run comparison with reg-cli after screenshots are taken
async function runRegCli() {

    try {
        console.log('Running visual regression comparison...');
        execSync(
            'npx reg-cli ./screenshots/components ./screenshots/components-sdc ./screenshots/diff-report --report ./screenshots/diff-report/index.html --json ./screenshots/diff-report/reg.json',
            { stdio: 'inherit' }
        );
        console.log('Visual regression comparison complete');
    } catch (error) {
        console.error('Error running reg-cli:', error);
    }
}

// Main execution
async function main() {
    await takeScreenshotsInParallel();
    await runRegCli();
}

main().catch(console.error);
