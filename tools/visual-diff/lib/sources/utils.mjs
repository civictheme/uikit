import {execSync} from "child_process";
import path from "path";
import {getDirectoryForSource} from "../config.mjs";
import {captureScreenshots} from "../screenshot.mjs";

/**
 * Install dependencies for the project.
 */
export function installDependencies (cwd = process.cwd()) {
    // Handle workspace installation.
    const installationScript = 'if grep -q \'"workspaces"\' package.json; then\n  npm install --workspaces\nelse\n  npm install\nfi'
    execSync(installationScript, {
        stdio: 'inherit',
        cwd,
    });
}

export function buildStoryBook(cwd = process.cwd()) {
    execSync('npm run build-storybook', {
        stdio: 'inherit',
        cwd,
    });
}


/**
 * Get the current commit hash.
 *
 * @param {string} cwd The current working directory.
 * @returns {string} The commit hash.
 */
export function getCommitHash(cwd = process.cwd()) {
    return execSync('git rev-parse HEAD', { cwd }).toString().trim();
}

/**
 * Get the path to storybook.
 *
 * @param cwd - current working directory
 * @param source - Release tag, branch or current_branch.
 * @param sourceType - Type - release, branch or current_branch.
 * @param packageName - Twig or SDC or other framework.
 *
 * @returns {string} - Path to storybook.
 */
function getStorybookPath(cwd = process.cwd(), source, sourceType, packageName) {
    return path.join(cwd, getDirectoryForSource(source, sourceType, packageName, 'storybookPath'))
}

export function cloneRepository(cwd, checkoutTarget) {
    const repoUrl = execSync('git config --get remote.origin.url').toString().trim();
    execSync(`git clone ${repoUrl} ${cwd} --depth 1 --branch ${checkoutTarget}`, {
        stdio: 'inherit'
    });
}

export async function captureScreenshotsForSource(cwd, source, sourceType, packageName, outputDir) {
    const storybookDir = getStorybookPath(cwd, source, sourceType, packageName);
    await captureScreenshots({
        storybookDir,
        outputDir,
        port: 6009
    });
}
