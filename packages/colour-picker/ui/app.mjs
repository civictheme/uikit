/**
 * Colour picker UI — static vanilla ESM, no framework, no build step.
 * All computation happens client-side through the same pure engine the CLI
 * uses (engine/core.mjs + the tokens model), loaded via the import map in
 * index.html: '@civictheme/tokens/' -> /colour-picker-tokens/ and
 * '@civictheme/colour-picker/' -> /colour-picker/ — paths served
 * identically by `colour-picker serve` and by the sdc Storybook's
 * staticDirs. The recipe object is the single source of truth; every panel
 * renders from the resolved state (session-11 design, artifact
 * VGjiPayrZz1UrmV1eUzd3D). Recorded decisions honoured here: no import
 * button (the recipe JSON block is editable copy/paste), add-token flows
 * for palette slots and component tokens, component-centric live preview
 * with the component's tokens editable below it, contrast warnings never
 * block, and no in-browser generation (Leonardo is Node-side only, P5).
 */
import { mergeTrees, flattenTree, MODES_EXTENSION } from '@civictheme/tokens/build/model.mjs';
import { FIGMA_NAMES } from '@civictheme/tokens/build/figma-names.mjs';
import { validateRecipe, targetsForRecipe, resolveRecipe } from '@civictheme/colour-picker/engine/core.mjs';
import { contrastRatio, roundRatio, checkContrast } from '@civictheme/colour-picker/engine/contrast.mjs';
import { emitCss, emitFigma, emitScssOverrides } from '@civictheme/colour-picker/engine/emit.mjs';

const TOKEN_FILES = ['color.brand.json', 'color.components.json', 'color.palette.json'];
const MODES = ['light', 'dark'];
const BRANDS = ['brand1', 'brand2', 'brand3'];
const GROUP_ORDER = ['Typography', 'Background', 'Border', 'Interaction', 'Status', 'Highlight'];
const GROUP_LABELS = { Background: 'Backgrounds', Border: 'Borders' };
const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const $ = (selector) => document.querySelector(selector);
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const state = {
  recipe: { version: 1 },
  component: null,
  recent: [],
  expanded: new Set(),
  search: '',
  filter: 'all',
  overriddenOnly: false,
  storybook: { base: null, sameOrigin: false, stories: null },
};
let base = null;
let derived = null;
let refresh = () => {};
let renderPreviewLate = () => {};

/* ---------------------------------------------------------------- data */

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

function recompute() {
  const { tree, resolved } = resolveRecipe(state.recipe, base.tree);
  const targets = targetsForRecipe(state.recipe, base.targets);
  const rows = checkContrast(resolved, targets);
  derived = { tree, flat: flattenTree(tree), resolved, targets, rows, failures: rows.filter((row) => !row.pass) };
}

/** Commits a mutation only if it validates; returns the error otherwise. */
function tryRecipe(mutate) {
  const next = structuredClone(state.recipe);
  mutate(next);
  ['brands', 'overrides', 'additions'].forEach((key) => {
    if (next[key] && !Object.keys(next[key]).length) delete next[key];
  });
  try {
    validateRecipe(next, base.tree);
  } catch (error) {
    return error.message;
  }
  state.recipe = next;
  refresh();
  return null;
}

/* ------------------------------------------------------------- helpers */

const paletteSlots = () => Object.keys(base.flat).filter((p) => p.startsWith('color.palette.'));
const customSlots = () => Object.keys(state.recipe.additions ?? {}).filter((p) => p.startsWith('color.palette.'));
const isAddition = (path) => Boolean(state.recipe.additions?.[path]);
const overrideOf = (path) => state.recipe.overrides?.[path];
const shortAlias = (path) => path.replace(/^color\./, '');
const slotLeaf = (path) => path.split('.').pop();

function componentOf(path) {
  return path.startsWith('color.component.') ? path.split('.')[2] : null;
}

function componentNames() {
  const names = new Set();
  Object.keys(derived.flat).forEach((path) => {
    const comp = componentOf(path);
    if (comp) names.add(comp);
  });
  return [...names].sort();
}

function componentTokens(comp) {
  return Object.keys(derived.flat).filter((path) => componentOf(path) === comp).sort();
}

function targetLabel(path) {
  const target = derived.targets[path];
  if (target) {
    const family = target.target >= 7 ? 'text' : target.target >= 4.5 ? 'on fill' : 'UI';
    return `≥ ${target.target}:1 · ${isAddition(path) ? 'custom' : family}`;
  }
  if (/background/.test(path) || path.endsWith('highlight')) return 'surface';
  return 'decorative';
}

function contrastRowFor(path, mode) {
  return derived.rows.find((row) => row.tokenPath === path && row.mode === mode);
}

/** A token's per-mode source in the applied tree: alias path or literal. */
function sourceOf(path, mode) {
  const node = derived.flat[path];
  const value = mode === 'dark' ? (node.$extensions?.[MODES_EXTENSION]?.dark ?? node.$value) : node.$value;
  if (typeof value === 'string' && value.startsWith('{')) return { alias: value.slice(1, -1) };
  return { literal: value.alpha === 0 ? 'transparent' : value.hex };
}

function download(filename, text, type = 'application/json') {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function swatchHex(hex, small = false) {
  const colour = hex === 'transparent' ? 'repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0 / 12px 12px' : hex;
  return `<span class="swatch${small ? ' swatch--small' : ''}" style="background: ${colour}"></span><span class="hex">${esc(hex)}</span>`;
}

function ratioChip(path, mode) {
  const row = contrastRowFor(path, mode);
  if (!row) return '';
  const ratio = row.ratio === null ? 'n/a' : `${row.ratio.toFixed(2)}:1`;
  return row.pass
    ? `<span class="chip chip--pass">✓ ${ratio}</span>`
    : `<span class="chip chip--warn">▲ ${ratio}</span>`;
}

function selectComponent(comp) {
  if (state.component && state.component !== comp) {
    state.recent = [state.component, ...state.recent.filter((name) => name !== state.component)].slice(0, 6);
  }
  state.component = comp;
  renderPreviewLate();
}

/* ------------------------------------------------------------- editors */

function openDialog(html, wire) {
  const editor = $('#editor');
  editor.innerHTML = html;
  editor.querySelector('.editor__close')?.addEventListener('click', () => editor.close());
  wire(editor);
  editor.showModal();
}

function editorError(editor, message) {
  const slot = editor.querySelector('.editor__error');
  slot.textContent = message ?? '';
  slot.hidden = !message;
}

/** A · palette slot override (one mode), also edits custom slots. */
function openSlotEditor(path, mode) {
  const addition = state.recipe.additions?.[path];
  const current = derived.resolved[mode][path];
  const stock = addition ? null : base.resolved[mode][path];
  const target = derived.targets[path];
  const hasOverride = overrideOf(path)?.[mode] !== undefined;
  openDialog(`
    <form method="dialog">
      <div class="editor__head"><span class="tname">${esc(slotLeaf(path))}</span>
        <span class="chip chip--muted">${mode}</span>
        <button type="button" class="editor__close" aria-label="Close">✕</button></div>
      ${stock ? `<p style="margin:0;font-size:12.5px;color:#5c5d5e">Stock value <span class="mono">${esc(stock)}</span>${target ? ` · target ≥ ${target.target}:1 against ${esc(slotLeaf(target.against))}` : ' · no contrast target'}</p>` : ''}
      <div class="editor__row">
        <label for="slot-hex">Hex</label>
        <input type="color" id="slot-pick" value="${esc(current === 'transparent' ? '#000000' : current)}" aria-label="Colour picker">
        <input type="text" id="slot-hex" class="hex-input" value="${esc(current)}">
      </div>
      <div class="editor__note" id="slot-ratio" hidden></div>
      <div class="editor__error" hidden></div>
      <div class="editor__actions">
        ${addition ? '<button type="button" class="button button--danger" id="slot-remove">Remove slot</button>' : ''}
        ${hasOverride ? '<button type="button" class="button button--plain" id="slot-reset">Reset to stock</button>' : ''}
        <button type="submit" class="button button--primary" id="slot-apply">🔒 ${addition ? 'Set value' : 'Lock override'}</button>
      </div>
    </form>`, (editor) => {
    const hexInput = editor.querySelector('#slot-hex');
    const pick = editor.querySelector('#slot-pick');
    const note = editor.querySelector('#slot-ratio');
    const feedback = () => {
      const hex = hexInput.value.trim().toLowerCase();
      if (!target || !HEX_RE.test(hex)) {
        note.hidden = true;
        return;
      }
      const against = derived.resolved[mode][target.against];
      const ratio = against === 'transparent' ? null : roundRatio(contrastRatio(hex, against));
      const pass = ratio !== null && ratio >= target.target;
      note.hidden = false;
      note.className = `editor__note${pass ? ' editor__note--ok' : ''}`;
      note.innerHTML = pass
        ? `<strong>${ratio}:1</strong> against ${esc(slotLeaf(target.against))} (${esc(against)}) — meets the ${target.target}:1 target.`
        : `<strong>${ratio === null ? 'n/a' : `${ratio}:1`}</strong> against ${esc(slotLeaf(target.against))} (${esc(against)}) — below the ${target.target}:1 target. You can still lock this value; it stays flagged in Contrast QA until it passes.`;
    };
    pick.addEventListener('input', () => {
      hexInput.value = pick.value;
      feedback();
    });
    hexInput.addEventListener('input', () => {
      if (HEX_RE.test(hexInput.value.trim())) pick.value = hexInput.value.trim();
      feedback();
    });
    feedback();
    editor.querySelector('form').addEventListener('submit', (event) => {
      const hex = hexInput.value.trim().toLowerCase();
      if (hex !== 'transparent' && !HEX_RE.test(hex)) {
        event.preventDefault();
        editorError(editor, 'Enter a #rrggbb value or "transparent".');
        return;
      }
      const problem = tryRecipe((next) => {
        if (addition) next.additions[path][mode] = hex;
        else {
          next.overrides = next.overrides ?? {};
          next.overrides[path] = { ...next.overrides[path], [mode]: hex };
        }
      });
      if (problem) {
        event.preventDefault();
        editorError(editor, problem);
      }
    });
    editor.querySelector('#slot-reset')?.addEventListener('click', () => {
      tryRecipe((next) => {
        delete next.overrides[path][mode];
        if (!Object.keys(next.overrides[path]).length) delete next.overrides[path];
      });
      editor.close();
    });
    editor.querySelector('#slot-remove')?.addEventListener('click', () => {
      const problem = tryRecipe((next) => {
        delete next.additions[path];
      });
      if (problem) editorError(editor, `${problem}\n(Remove the tokens aliasing this slot first.)`);
      else editor.close();
    });
  });
}

/** B · token editor: alias re-point (both modes) or per-mode literals. */
function openTokenEditor(path) {
  const addition = state.recipe.additions?.[path];
  const override = overrideOf(path);
  const slots = [...paletteSlots(), ...customSlots()];
  const currentAlias = sourceOf(path, 'light').alias ?? slots[0];
  let tab = 'both';
  openDialog(`
    <form method="dialog">
      <div class="editor__head"><span class="tname">${esc(path)}</span>
        <button type="button" class="editor__close" aria-label="Close">✕</button></div>
      <div class="editor__tabs" role="tablist">
        ${['both', 'light', 'dark'].map((name) => `<button type="button" class="editor__tab" role="tab" data-tab="${name}" aria-selected="${name === 'both'}">${name === 'both' ? 'Both modes' : name[0].toUpperCase() + name.slice(1)}</button>`).join('')}
      </div>
      <div class="editor__field" id="alias-field">
        <label><input type="radio" name="kind" value="alias" checked> Alias a palette slot</label>
        <select id="alias-pick" aria-label="Palette slot">${slots.map((slot) => `<option value="${esc(slot)}"${slot === currentAlias ? ' selected' : ''}>${esc(shortAlias(slot))}</option>`).join('')}</select>
      </div>
      <div class="editor__field">
        <label><input type="radio" name="kind" value="literal"> Literal colour</label>
        <div class="editor__row">
          <input type="color" id="lit-pick" value="#000000" aria-label="Colour picker">
          <input type="text" id="lit-hex" class="hex-input" value="${esc(derived.resolved.light[path])}" aria-label="Literal hex value">
        </div>
      </div>
      <div class="editor__resolves"><strong>Resolves to</strong><span id="resolves-line"></span>
        <span class="editor__delta" id="delta-line"></span></div>
      <div class="editor__error" hidden></div>
      <div class="editor__actions">
        ${addition ? '<button type="button" class="button button--danger" id="tok-remove">Remove addition</button>' : ''}
        ${override ? '<button type="button" class="button button--danger" id="tok-remove-ovr">Remove override</button>' : ''}
        <button type="submit" class="button button--primary">Apply</button>
      </div>
    </form>`, (editor) => {
    const aliasField = editor.querySelector('#alias-field');
    const aliasRadio = editor.querySelector('input[value="alias"]');
    const litRadio = editor.querySelector('input[value="literal"]');
    const litHex = editor.querySelector('#lit-hex');
    const litPick = editor.querySelector('#lit-pick');

    function spec() {
      const kind = editor.querySelector('input[name="kind"]:checked').value;
      if (kind === 'alias') return { $value: `{${editor.querySelector('#alias-pick').value}}` };
      const hex = litHex.value.trim().toLowerCase();
      if (hex !== 'transparent' && !HEX_RE.test(hex)) return null;
      if (tab === 'both') return { light: hex, dark: hex };
      return { [tab]: hex };
    }

    function mutateWith(next, patch) {
      if (addition) {
        const spec0 = next.additions[path];
        if (patch.$value !== undefined) {
          next.additions[path] = { ...(spec0.target !== undefined ? { target: spec0.target } : {}), ...(spec0.against !== undefined ? { against: spec0.against } : {}), $value: patch.$value };
        } else {
          delete spec0.$value;
          Object.assign(spec0, patch);
          if (spec0.light === undefined && spec0.$value === undefined) spec0.light = derived.resolved.light[path];
        }
      } else {
        next.overrides = next.overrides ?? {};
        const spec0 = { ...next.overrides[path] };
        if (patch.$value !== undefined) {
          delete spec0.light;
          delete spec0.dark;
        }
        next.overrides[path] = { ...spec0, ...patch };
      }
    }

    function preview() {
      const patch = spec();
      const resolvesLine = editor.querySelector('#resolves-line');
      const deltaLine = editor.querySelector('#delta-line');
      if (!patch) {
        resolvesLine.textContent = 'Enter a #rrggbb value or "transparent".';
        deltaLine.textContent = '';
        return;
      }
      try {
        const next = structuredClone(state.recipe);
        mutateWith(next, patch);
        validateRecipe(next, base.tree);
        const resolved = resolveRecipe(next, base.tree).resolved;
        resolvesLine.innerHTML = MODES.map((mode) => `<span class="tcell">${swatchHex(resolved[mode][path], true)} ${mode}</span>`).join(' · ');
        const key = addition ? 'additions' : 'overrides';
        deltaLine.textContent = `recipe: ${key}[${JSON.stringify(path)}] = ${JSON.stringify(next[key][path])}`;
        editorError(editor, null);
      } catch (error) {
        resolvesLine.textContent = '';
        deltaLine.textContent = '';
        editorError(editor, error.message);
      }
    }

    if (HEX_RE.test(litHex.value)) litPick.value = litHex.value;
    litPick.addEventListener('input', () => {
      litHex.value = litPick.value;
      litRadio.checked = true;
      preview();
    });
    litHex.addEventListener('input', () => {
      litRadio.checked = true;
      if (HEX_RE.test(litHex.value.trim())) litPick.value = litHex.value.trim();
      preview();
    });
    editor.querySelector('#alias-pick').addEventListener('change', () => {
      aliasRadio.checked = true;
      preview();
    });
    editor.querySelectorAll('input[name="kind"]').forEach((radio) => radio.addEventListener('change', preview));
    editor.querySelectorAll('[data-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        tab = button.dataset.tab;
        editor.querySelectorAll('[data-tab]').forEach((other) => other.setAttribute('aria-selected', other === button ? 'true' : 'false'));
        const aliasAllowed = tab === 'both';
        aliasField.style.opacity = aliasAllowed ? '' : '0.45';
        aliasRadio.disabled = !aliasAllowed;
        if (!aliasAllowed) litRadio.checked = true;
        preview();
      });
    });
    preview();

    editor.querySelector('form').addEventListener('submit', (event) => {
      const patch = spec();
      if (!patch) {
        event.preventDefault();
        editorError(editor, 'Enter a #rrggbb value or "transparent".');
        return;
      }
      const problem = tryRecipe((next) => mutateWith(next, patch));
      if (problem) {
        event.preventDefault();
        editorError(editor, problem);
      }
    });
    editor.querySelector('#tok-remove')?.addEventListener('click', () => {
      const problem = tryRecipe((next) => {
        delete next.additions[path];
      });
      if (problem) editorError(editor, problem);
      else editor.close();
    });
    editor.querySelector('#tok-remove-ovr')?.addEventListener('click', () => {
      tryRecipe((next) => {
        delete next.overrides[path];
      });
      editor.close();
    });
  });
}

/** C · add token (palette slot or component token). */
function openAddEditor(kind = 'component', component = '') {
  const slots = [...paletteSlots(), ...customSlots()];
  const comps = componentNames();
  openDialog(`
    <form method="dialog">
      <div class="editor__head"><span class="tname">Add token</span>
        <button type="button" class="editor__close" aria-label="Close">✕</button></div>
      <div class="editor__row" role="radiogroup" aria-label="Token kind">
        <label><input type="radio" name="add-kind" value="palette"${kind === 'palette' ? ' checked' : ''}> Palette slot</label>
        <label><input type="radio" name="add-kind" value="component"${kind === 'component' ? ' checked' : ''}> Component token</label>
      </div>
      <div class="editor__field" id="add-comp-field">
        <label for="add-comp">Component — pick one of the ${comps.length} or type a new name</label>
        <input type="text" id="add-comp" list="comp-list" value="${esc(component)}">
        <datalist id="comp-list">${comps.map((name) => `<option value="${esc(name)}">`).join('')}</datalist>
        <span class="editor__hint" id="new-comp-hint" hidden>New component group</span>
      </div>
      <div class="editor__field">
        <label for="add-name" id="add-name-label">Token name</label>
        <input type="text" id="add-name" placeholder="background-color">
      </div>
      <div class="editor__field">
        <span>Source</span>
        <div class="editor__row">
          <label><input type="radio" name="add-src" value="alias" checked> Alias</label>
          <select id="add-alias" aria-label="Palette slot to alias">${slots.map((slot) => `<option value="${esc(slot)}">${esc(shortAlias(slot))}</option>`).join('')}</select>
        </div>
        <div class="editor__row">
          <label><input type="radio" name="add-src" value="literal"> Literals</label>
          <input type="color" id="add-light-pick" value="#6a3bb5" aria-label="Light colour">
          <input type="text" id="add-light" class="hex-input" value="#6a3bb5" aria-label="Light hex">
          <input type="color" id="add-dark-pick" value="#c9a1e8" aria-label="Dark colour">
          <input type="text" id="add-dark" class="hex-input" value="#c9a1e8" aria-label="Dark hex">
        </div>
      </div>
      <div class="editor__field" id="add-target-field" hidden>
        <label for="add-target">Contrast target (ratio against background-light; blank = untargeted)</label>
        <input type="text" id="add-target" class="hex-input" value="3" inputmode="decimal">
      </div>
      <div class="editor__resolves"><strong>Creates</strong><span class="tname" id="add-path"></span>
        <span class="editor__delta" id="add-delta"></span></div>
      <div class="editor__error" hidden></div>
      <div class="editor__actions">
        <button type="button" class="button button--plain" id="add-cancel">Cancel</button>
        <button type="submit" class="button button--primary">Add token</button>
      </div>
    </form>`, (editor) => {
    const kindOf = () => editor.querySelector('input[name="add-kind"]:checked').value;
    const compField = editor.querySelector('#add-comp-field');
    const targetField = editor.querySelector('#add-target-field');
    const nameLabel = editor.querySelector('#add-name-label');
    const hint = editor.querySelector('#new-comp-hint');

    function pathOf() {
      const name = editor.querySelector('#add-name').value.trim();
      if (kindOf() === 'palette') return name ? `color.palette.${name}` : null;
      const comp = editor.querySelector('#add-comp').value.trim();
      return comp && name ? `color.component.${comp}.${name}` : null;
    }

    function specOf() {
      const src = editor.querySelector('input[name="add-src"]:checked').value;
      const spec = {};
      if (src === 'alias') spec.$value = `{${editor.querySelector('#add-alias').value}}`;
      else {
        spec.light = editor.querySelector('#add-light').value.trim().toLowerCase();
        spec.dark = editor.querySelector('#add-dark').value.trim().toLowerCase();
      }
      if (kindOf() === 'palette') {
        const raw = editor.querySelector('#add-target').value.trim();
        if (raw) spec.target = Number(raw);
      }
      return spec;
    }

    function preview() {
      const isPalette = kindOf() === 'palette';
      compField.hidden = isPalette;
      targetField.hidden = !isPalette;
      nameLabel.textContent = isPalette ? 'Slot name' : 'Token name';
      hint.hidden = isPalette || !editor.querySelector('#add-comp').value.trim() || comps.includes(editor.querySelector('#add-comp').value.trim());
      const path = pathOf();
      editor.querySelector('#add-path').textContent = path ?? '…';
      editor.querySelector('#add-delta').textContent = path ? `recipe: additions[${JSON.stringify(path)}] = ${JSON.stringify(specOf())}` : '';
    }

    ['#add-light', '#add-dark'].forEach((selector) => {
      const hexInput = editor.querySelector(selector);
      const pickInput = editor.querySelector(`${selector}-pick`);
      pickInput.addEventListener('input', () => {
        hexInput.value = pickInput.value;
        editor.querySelector('input[name="add-src"][value="literal"]').checked = true;
        preview();
      });
      hexInput.addEventListener('input', () => {
        if (HEX_RE.test(hexInput.value.trim())) pickInput.value = hexInput.value.trim();
        preview();
      });
    });
    editor.querySelectorAll('input, select').forEach((control) => control.addEventListener('input', preview));
    preview();

    editor.querySelector('#add-cancel').addEventListener('click', () => editor.close());
    editor.querySelector('form').addEventListener('submit', (event) => {
      const path = pathOf();
      if (!path) {
        event.preventDefault();
        editorError(editor, 'Name the token first.');
        return;
      }
      const segments = path.split('.').slice(2);
      if (!segments.every((segment) => SLUG_RE.test(segment))) {
        event.preventDefault();
        editorError(editor, 'Names must be lowercase slugs (letters, digits, hyphens).');
        return;
      }
      const problem = tryRecipe((next) => {
        next.additions = next.additions ?? {};
        next.additions[path] = specOf();
      });
      if (problem) {
        event.preventDefault();
        editorError(editor, problem);
      }
    });
  });
}

/* ------------------------------------------------------------ storybook */

async function detectStorybook() {
  const candidates = [];
  try {
    const config = await fetchJson('./serve-config.json');
    if (config.storybookUrl) candidates.push(config.storybookUrl);
  } catch { /* not served by the CLI */ }
  let stored = null;
  try {
    stored = localStorage.getItem('ct-picker-storybook-url');
  } catch { /* storage unavailable */ }
  if (stored) candidates.push(stored);
  candidates.push(new URL('/', window.location.href).href);

  for (const candidate of candidates) {
    const normalised = candidate.endsWith('/') ? candidate : `${candidate}/`;
    try {
      const index = await fetchJson(`${normalised}index.json`);
      const stories = new Map();
      Object.values(index.entries ?? {}).forEach((entry) => {
        if (entry.type !== 'story') return;
        const slug = (entry.title ?? '').split('/').pop().trim().toLowerCase().replace(/\s+/g, '-');
        if (!stories.has(slug)) stories.set(slug, entry);
      });
      state.storybook = { base: normalised, sameOrigin: new URL(normalised, window.location.href).origin === window.location.origin, stories };
      return;
    } catch { /* try the next candidate */ }
  }
  state.storybook = { base: null, sameOrigin: false, stories: null };
}

function storyFor(comp) {
  return state.storybook.stories?.get(comp) ?? null;
}

function injectIntoPane(iframe) {
  if (!state.storybook.sameOrigin) return;
  try {
    const doc = iframe.contentDocument;
    if (!doc?.head) return;
    let style = doc.getElementById('ct-picker-overrides');
    if (!style) {
      style = doc.createElement('style');
      style.id = 'ct-picker-overrides';
      doc.head.appendChild(style);
    }
    style.textContent = emitCss(derived.tree, derived.resolved);
  } catch {
    /* cross-origin or not ready — stock colours render instead */
  }
}

function renderStorybookConfig(container) {
  const config = document.createElement('div');
  config.className = 'preview-config';
  config.innerHTML = `<label for="sb-url">Storybook URL</label>
    <input id="sb-url" type="url" placeholder="https://…  (a running sdc Storybook)" value="${esc(localStorage.getItem('ct-picker-storybook-url') ?? '')}">
    <button class="button button--outline" id="sb-url-apply">Use</button>`;
  container.after(config);
  config.querySelector('#sb-url-apply').addEventListener('click', async () => {
    const url = config.querySelector('#sb-url').value.trim();
    try {
      localStorage.setItem('ct-picker-storybook-url', url);
    } catch { /* storage unavailable — session-only */ }
    await detectStorybook();
    refresh();
  });
}

/* ----------------------------------------------------------- rendering */

function renderQa() {
  const band = $('#qa-band');
  band.hidden = false;
  const failures = derived.failures;
  if (!failures.length) {
    band.className = 'qa-band qa-band--pass';
    band.innerHTML = '<p style="margin:0"><strong>Contrast QA — every targeted check passes</strong> in both themes.</p>';
    return;
  }
  band.className = 'qa-band';
  const detail = failures.map((row) => `${slotLeaf(row.tokenPath)} ${row.ratio === null ? 'n/a' : `${row.ratio.toFixed(2)}:1`} (${row.mode})`).join(', ');
  band.innerHTML = `<p style="margin:0; flex:1 1 420px"><strong>Contrast QA — ${failures.length} check${failures.length === 1 ? '' : 's'} below target:</strong> ${esc(detail)}. QA runs on resolved values, so overrides stay in the loop — flagged, never blocked.</p><a href="#palette">Review in palette</a>`;
}

function renderHeaderCard() {
  const overrides = Object.keys(state.recipe.overrides ?? {}).length;
  const additions = Object.keys(state.recipe.additions ?? {}).length;
  const brands = Object.values(state.recipe.brands ?? {}).reduce((count, set) => count + Object.keys(set).length, 0);
  const parts = [];
  if (brands) parts.push(`${brands} brand input${brands === 1 ? '' : 's'}`);
  parts.push(`${overrides} override${overrides === 1 ? '' : 's'}`);
  parts.push(`${additions} addition${additions === 1 ? '' : 's'}`);
  $('#recipe-name').textContent = state.recipe.name ? `${state.recipe.name}.recipe.json` : 'recipe.json';
  $('#recipe-meta').textContent = parts.join(' · ');
}

function renderBrands() {
  const box = (mode, label) => `
    <div class="brand-box"><strong>${label} theme</strong>
      ${BRANDS.map((brand) => {
    const value = state.recipe.brands?.[mode]?.[brand] ?? derived.resolved[mode][`color.brand.${brand}`];
    const id = `brand-${mode}-${brand}`;
    return `<div class="brand-row">
          <label for="${id}">Brand ${brand.slice(-1)}</label>
          <input type="color" value="${esc(value)}" data-brand="${mode}:${brand}" aria-label="Brand ${brand.slice(-1)} ${mode} picker">
          <input class="hex-input" id="${id}" type="text" value="${esc(value)}" data-brand-hex="${mode}:${brand}">
        </div>`;
  }).join('')}
    </div>`;
  $('#brand-inputs').innerHTML = box('light', 'Light') + box('dark', 'Dark');

  const setBrand = (mode, brand, hex) => tryRecipe((next) => {
    next.brands = next.brands ?? {};
    next.brands[mode] = next.brands[mode] ?? {};
    if (hex.toLowerCase() === base.resolved[mode][`color.brand.${brand}`]) {
      delete next.brands[mode][brand];
      if (!Object.keys(next.brands[mode]).length) delete next.brands[mode];
    } else {
      next.brands[mode][brand] = hex.toLowerCase();
    }
  });
  $('#brand-inputs').querySelectorAll('[data-brand]').forEach((input) => {
    input.addEventListener('change', () => {
      const [mode, brand] = input.dataset.brand.split(':');
      setBrand(mode, brand, input.value);
    });
  });
  $('#brand-inputs').querySelectorAll('[data-brand-hex]').forEach((input) => {
    input.addEventListener('change', () => {
      const [mode, brand] = input.dataset.brandHex.split(':');
      if (HEX_RE.test(input.value)) setBrand(mode, brand, input.value);
      else refresh();
    });
  });
}

function paletteCell(path, mode) {
  const hex = derived.resolved[mode][path];
  const override = overrideOf(path);
  const addition = state.recipe.additions?.[path];
  const lock = override?.[mode] !== undefined
    ? `<span class="chip chip--lock">🔒 was ${esc(base.resolved[mode][path])}</span>`
    : (addition ? '<span class="chip chip--add">added</span>' : '');
  const ratio = ratioChip(path, mode) || '<span class="chip chip--muted">—</span>';
  return `<button class="cellbtn" data-slot="${esc(path)}" data-mode="${mode}" title="Override ${esc(slotLeaf(path))} (${mode})">
    ${swatchHex(hex)} ${ratio} ${lock}</button>`;
}

function renderPalette() {
  const groups = new Map(GROUP_ORDER.map((group) => [group, []]));
  paletteSlots().forEach((path) => {
    const group = (FIGMA_NAMES[path] ?? '').split('/')[0];
    if (groups.has(group)) groups.get(group).push(path);
  });
  let html = '<div class="palette-grid"><div class="thead"><span>Slot</span><span>Target</span><span>Light</span><span>Dark</span></div>';
  const row = (path) => `<div class="trow">
      <span class="tname">${esc(slotLeaf(path))}</span>
      <span class="ttarget">${esc(targetLabel(path))}</span>
      <span class="tcell">${paletteCell(path, 'light')}</span>
      <span class="tcell">${paletteCell(path, 'dark')}</span>
    </div>`;
  groups.forEach((paths, group) => {
    html += `<div class="tier-hdr">${esc(GROUP_LABELS[group] ?? group)}</div>${paths.map(row).join('')}`;
  });
  const custom = customSlots();
  if (custom.length) {
    html += `<div class="tier-hdr">Custom — added by this recipe</div>${custom.map(row).join('')}`;
  }
  $('#palette-table').innerHTML = `${html}</div>`;
  $('#palette-table').querySelectorAll('[data-slot]').forEach((button) => {
    button.addEventListener('click', () => openSlotEditor(button.dataset.slot, button.dataset.mode));
  });
}

function sourceCell(path) {
  const light = sourceOf(path, 'light');
  const dark = sourceOf(path, 'dark');
  const chips = [];
  if (light.alias) chips.push(`<span class="chip chip--alias">→ ${esc(shortAlias(light.alias))}</span>`);
  else chips.push(`<span class="chip chip--muted mono">${esc(light.literal)}</span>`);
  if (JSON.stringify(light) !== JSON.stringify(dark)) {
    chips.push(`<span class="chip chip--muted mono">dark → ${esc(dark.alias ? shortAlias(dark.alias) : dark.literal)}</span>`);
  }
  const override = overrideOf(path);
  if (override) {
    const label = override.$value !== undefined && override.light === undefined && override.dark === undefined
      ? 're-pointed'
      : `literal · ${['light', 'dark'].filter((mode) => override[mode] !== undefined).join('+') || 'both'}`;
    chips.push(`<span class="chip chip--lock">🔒 ${esc(label)}</span>`);
  }
  if (isAddition(path)) chips.push('<span class="chip chip--add">added</span>');
  return chips.join(' ');
}

function tokenRow(path) {
  return `<div class="trow">
      <span class="tname">${esc(path)}</span>
      <span class="tcell">${sourceCell(path)}</span>
      <span class="tcell">${swatchHex(derived.resolved.light[path], true)}</span>
      <span class="tcell">${swatchHex(derived.resolved.dark[path], true)}</span>
      <button class="button button--ghost" data-edit="${esc(path)}">Edit</button>
    </div>`;
}

function matchesFilters(path) {
  if (state.search && !path.includes(state.search)) return false;
  if (state.overriddenOnly && !overrideOf(path) && !isAddition(path)) return false;
  return true;
}

function renderComponentTable() {
  const names = componentNames();
  const filtered = state.filter === 'all' ? names : names.filter((name) => name === state.filter);
  let html = '<div class="token-grid"><div class="thead"><span>Token</span><span>Source</span><span>Resolved · light</span><span>Resolved · dark</span><span></span></div>';
  let shown = 0;
  filtered.forEach((comp) => {
    const tokens = componentTokens(comp).filter(matchesFilters);
    if (!tokens.length && (state.search || state.overriddenOnly)) return;
    const isCustomGroup = componentTokens(comp).every(isAddition);
    const hasAdditions = componentTokens(comp).some(isAddition);
    const forceOpen = Boolean(state.search) || state.overriddenOnly || state.filter !== 'all';
    const open = forceOpen || state.expanded.has(comp);
    html += `<button class="group-hdr" data-group="${esc(comp)}" aria-expanded="${open}">
        <svg class="caret" width="9" height="6" viewBox="0 0 10 7" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <strong>${esc(comp)}</strong><span>${componentTokens(comp).length} tokens${isCustomGroup ? ' · custom — added by this recipe' : hasAdditions ? ' · includes additions' : ''}</span>
      </button>`;
    if (open) {
      html += tokens.map(tokenRow).join('');
      shown += tokens.length;
    }
  });
  $('#component-table').innerHTML = `${html}</div>`;
  $('#component-table').querySelectorAll('[data-group]').forEach((button) => {
    button.addEventListener('click', () => {
      const comp = button.dataset.group;
      if (state.expanded.has(comp)) state.expanded.delete(comp);
      else state.expanded.add(comp);
      renderComponentTable();
    });
  });
  $('#component-table').querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => openTokenEditor(button.dataset.edit));
  });

  const total = Object.keys(derived.flat).filter((path) => path.startsWith('color.component.')).length;
  const added = Object.keys(state.recipe.additions ?? {}).filter((path) => path.startsWith('color.component.')).length;
  $('#comp-count').textContent = `${total - added} core · ${added} added${state.search || state.overriddenOnly ? ` · ${shown} shown` : ''}`;
  const overridden = Object.keys(state.recipe.overrides ?? {}).filter((path) => path.startsWith('color.component.')).length;
  $('#ovr-only-label').textContent = `Overridden only (${overridden})`;

  const filter = $('#comp-filter');
  filter.innerHTML = `<option value="all">All (${names.length})</option>${names.map((name) => `<option value="${esc(name)}"${name === state.filter ? ' selected' : ''}>${esc(name)}</option>`).join('')}`;
}

function renderPreview() {
  const names = componentNames();
  if (!state.component || !names.includes(state.component)) state.component = names.includes('promo-card') ? 'promo-card' : names[0];
  const comp = state.component;

  const pick = $('#comp-pick');
  pick.innerHTML = names.map((name) => `<option value="${esc(name)}"${name === comp ? ' selected' : ''}>${esc(name)} · ${componentTokens(name).length} tokens</option>`).join('');

  const recents = [comp, ...state.recent.filter((name) => name !== comp)].slice(0, 6);
  $('#recent-chips').innerHTML = `<span>Recent</span>${recents.map((name) => `<button class="recent-chip${name === comp ? ' recent-chip--sel' : ''}" data-recent="${esc(name)}">${esc(name)}</button>`).join('')}`;
  $('#recent-chips').querySelectorAll('[data-recent]').forEach((button) => {
    button.addEventListener('click', () => selectComponent(button.dataset.recent));
  });

  const story = storyFor(comp);
  const panes = $('#preview-panes');
  if (story) {
    panes.innerHTML = MODES.map((mode) => `
      <div class="preview-pane preview-pane--${mode}">
        <span class="preview-pane__tag">.ct-theme-${mode}</span>
        <iframe title="${esc(comp)} story — ${mode} theme" data-pane="${mode}"
          src="${esc(state.storybook.base)}iframe.html?id=${esc(story.id)}&viewMode=story&globals=theme:${mode}"></iframe>
      </div>`).join('');
    panes.querySelectorAll('iframe').forEach((iframe) => {
      iframe.addEventListener('load', () => injectIntoPane(iframe));
    });
    const note = state.storybook.sameOrigin
      ? 'generated properties injected over the story’s token CSS'
      : 'cross-origin Storybook — stories render with stock colours (generated properties cannot be injected)';
    $('#preview-src').textContent = `iframe.html?id=${story.id} · globals: theme=light / theme=dark · ${note}`;
  } else {
    const swatches = (mode) => componentTokens(comp).map((path) => `
        <span class="preview-swatch"><span class="swatch" style="background: ${esc(derived.resolved[mode][path])}"></span>${esc(slotLeaf(path))}</span>`).join('');
    panes.innerHTML = MODES.map((mode) => `
      <div class="preview-pane preview-pane--${mode}">
        <span class="preview-pane__tag">.ct-theme-${mode}</span>
        <div class="preview-swatches">${swatches(mode)}</div>
      </div>`).join('');
    $('#preview-src').textContent = state.storybook.base
      ? `No story found for "${comp}" in the Storybook index — showing resolved swatches.`
      : 'No Storybook reachable — showing resolved swatches. Set a Storybook URL below for live component previews.';
    if (!state.storybook.base) renderStorybookConfig(panes);
  }

  $('#preview-tokens-title').textContent = `Tokens — ${comp}`;
  $('#preview-tokens-count').textContent = `${componentTokens(comp).length} tokens · follows the component picker`;
  const rows = componentTokens(comp).map(tokenRow).join('');
  $('#preview-token-table').innerHTML = `<div class="token-grid"><div class="thead"><span>Token</span><span>Source</span><span>Resolved · light</span><span>Resolved · dark</span><span></span></div>${rows}
    <div class="trow" style="display:block"><button class="button button--ghost" id="add-to-comp">+ Add token to ${esc(comp)}</button></div></div>`;
  $('#preview-token-table').querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => openTokenEditor(button.dataset.edit));
  });
  $('#add-to-comp').addEventListener('click', () => openAddEditor('component', comp));
}

function renderRecipeJson() {
  $('#recipe-json').value = JSON.stringify(state.recipe, null, 2);
  $('#recipe-error').hidden = true;
}

function renderDownloads() {
  const files = [
    ['recipe.json', 'The durable artefact — brand inputs, overrides and additions. Commit this to your sub-theme.', () => download('recipe.json', `${JSON.stringify(state.recipe, null, 2)}\n`)],
    ['color.tokens.json', 'The recipe-applied DTCG token tree, both modes.', () => download('color.tokens.json', `${JSON.stringify(derived.tree, null, 2)}\n`)],
    ['figma.light.tokens.json', 'Native Figma variable import — Light mode.', () => download('figma.light.tokens.json', `${JSON.stringify(emitFigma(derived.tree, 'light'), null, 2)}\n`)],
    ['figma.dark.tokens.json', 'Native Figma variable import — Dark mode.', () => download('figma.dark.tokens.json', `${JSON.stringify(emitFigma(derived.tree, 'dark'), null, 2)}\n`)],
    ['variables.css', 'The full theme-scoped custom-property stylesheet.', () => download('variables.css', emitCss(derived.tree, derived.resolved), 'text/css')],
    ['civictheme-overrides.scss', 'Only the changed custom properties — drop-in for a sub-theme, loaded after the stock variables.', () => download('civictheme-overrides.scss', emitScssOverrides(base.tree, base.resolved, derived.tree, derived.resolved), 'text/x-scss')],
  ];
  $('#downloads').innerHTML = files.map(([file, desc], index) => `
    <div class="dl-row">
      <div class="dl-row__info"><div class="dl-row__file">${esc(file)}</div><div class="dl-row__desc">${esc(desc)}</div></div>
      <button class="button button--outline" data-dl="${index}">Download</button>
    </div>`).join('');
  $('#downloads').querySelectorAll('[data-dl]').forEach((button) => {
    button.addEventListener('click', () => files[Number(button.dataset.dl)][2]());
  });
}

function renderAll() {
  renderQa();
  renderHeaderCard();
  renderBrands();
  renderPalette();
  renderPreview();
  renderComponentTable();
  renderRecipeJson();
  renderDownloads();
}

/* ---------------------------------------------------------------- boot */

function wireStatic() {
  $('#comp-pick').addEventListener('change', (event) => selectComponent(event.target.value));
  $('#token-search').addEventListener('input', (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderComponentTable();
  });
  $('#comp-filter').addEventListener('change', (event) => {
    state.filter = event.target.value;
    renderComponentTable();
  });
  $('#ovr-only').addEventListener('change', (event) => {
    state.overriddenOnly = event.target.checked;
    renderComponentTable();
  });
  $('#add-slot').addEventListener('click', () => openAddEditor('palette'));
  $('#add-token').addEventListener('click', () => openAddEditor('component', state.filter === 'all' ? '' : state.filter));
  $('#copy-recipe').addEventListener('click', () => navigator.clipboard?.writeText($('#recipe-json').value));
  $('#apply-recipe').addEventListener('click', () => {
    const errorBox = $('#recipe-error');
    try {
      const parsed = JSON.parse($('#recipe-json').value);
      validateRecipe(parsed, base.tree);
      state.recipe = parsed;
      refresh();
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.hidden = false;
    }
  });
}

async function boot() {
  try {
    const [targetsFile, ...sources] = await Promise.all([
      fetchJson('/colour-picker/targets.json'),
      ...TOKEN_FILES.map((file) => fetchJson(`/colour-picker-tokens/tokens/${file}`)),
    ]);
    const tree = mergeTrees(...sources);
    base = { tree, flat: flattenTree(tree), resolved: resolveRecipe({ version: 1 }, tree).resolved, targets: targetsFile.targets };
  } catch (error) {
    const box = $('#load-error');
    box.hidden = false;
    box.textContent = `Could not load the token data (${error.message}). Serve this page with "npx @civictheme/colour-picker serve" or from the sdc Storybook — it cannot run from file://.`;
    return;
  }
  refresh = () => {
    recompute();
    renderAll();
  };
  renderPreviewLate = () => renderPreview();
  await detectStorybook();
  recompute();
  wireStatic();
  renderAll();
}

boot();
