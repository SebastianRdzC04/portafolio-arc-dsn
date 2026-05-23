import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];

if (!inputPath) {
  throw new Error('Missing input markdown path');
}

const absolutePath = path.resolve(inputPath);
const source = fs.readFileSync(absolutePath, 'utf8').replace(/\r\n?/g, '\n');

const frontmatterMatch = source.match(/^---\n[\s\S]*?\n---\n*/);
const frontmatter = frontmatterMatch?.[0] ?? '';
let body = source.slice(frontmatter.length);

const definitionsMatch = body.match(/\n(\[image1\]:[\s\S]*)$/);
const definitions = definitionsMatch?.[1].trim() ?? '';

if (definitionsMatch) {
  body = body.slice(0, body.lastIndexOf(`\n${definitionsMatch[1]}`));
}

const rawLines = body.split('\n');

function cleanInline(text) {
  return text
    .replace(/\*\*/g, '')
    .replace(/\[(.+?)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCatalogText(text) {
  return cleanInline(text.replace(/[\t ]+\d+\s*$/, '').replace(/\s*\{#.+\}\s*$/, '').trim());
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/["'`]/g, '')
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function createSlugRegistry() {
  const counts = new Map();
  return (text) => {
    const base = slugify(text);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

function sanitizeLine(line) {
  let next = line.replace(/\u0000/g, '').replace(/\s+$/g, '');
  next = next.replace(/^!\[\]\[(image\d+)\]\*\*$/, '![][$1]');
  next = next.replace(/^#\s+\*\*\s*$/, '');
  next = next.replace(/^\*\*\s*$/, '');
  next = next.replace(/\s*\{#.+\}\s*$/, '');

  if (/^#+\s+\*\*.+\*\*$/.test(next.trim())) {
    const hashes = next.match(/^#+/)?.[0] ?? '#';
    const text = next.trim().replace(/^#+\s+/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
    next = `${hashes} ${text}`;
  }

  return next;
}

function isFigureLine(trimmed) {
  return /^\*Figure\s+/i.test(trimmed);
}

function isTableLine(trimmed) {
  return /^\*Table\s+/i.test(trimmed);
}

function isStandaloneImage(trimmed) {
  return /^!\[.*\]\[(image\d+)\]$/.test(trimmed) || /^!\[.*\]\(\.\/.+\)$/.test(trimmed);
}

function isCodeFence(trimmed) {
  return /^```[a-zA-Z0-9_-]*$/.test(trimmed);
}

function isLanguageLabel(trimmed) {
  return /^(Bash|JavaScript|JSON|YAML|Dockerfile|Terminal|Text)$/i.test(trimmed);
}

function isLikelyCodeLine(trimmed) {
  if (trimmed === '') {
    return false;
  }

  const patterns = [
    /^#\s/,
    /^#!\//,
    /^@echo\b/i,
    /^set(local)?\b/i,
    /^::/,
    /^pause$/i,
    /^(mongodump|mongorestore|mongoexport|mongoimport|mongosh|sudo|docker|docker-compose|mkdir|cd\s+|touch|chmod|find\s+|openssl|make-cadir|\.\/easyrsa|openvpn|newgrp|ip\s+|ss\s+|systemctl|echo\s+|cat\s+|chown\s+)/i,
    /^(db\.|use\s+|show dbs$|rs\.|print\(|const\s+|let\s+|var\s+|if\s*\(|else\s*\{|else$|return\b)/,
    /^(version:|services:|entrypoint:|systemLog:|storage:|processManagement:|net:|tls:|security:|replication:|auditLog:|destination:|format:|path:|filter:|bindIp:|port:|dbPath:|journal:|enabled:|pidFilePath:|timeZoneInfo:)/,
    /^(client$|dev\s+|proto\s+|ca\s+|cert\s+|key\s+|dh\s+|tls-crypt\s+|server\s+|push\s+|keepalive\s+|cipher\s+|auth\s+|persist-key$|persist-tun$|user\s+|group\s+|verb\s+|resolv_retry\s+|nobind$|remote\s+|remote-cert-tls\s+)/i,
    /^[A-Za-z]:\\/,
    /^Host:/,
    /^Port:/,
    /^Toolbar\s*>/,
    /^Edit\s*>/,
    /^Studio 3T\s*>/,
    /^Connection Tree$/,
    /^Connection Manager$/,
    /^empresa(?:\.empleados)?$/i,
    /^empleados$/i,
    /^(Add|Create|Drop|Export)\s+[A-Za-z]/,
    /^Import$/,
    /^Run$/,
    /^BSON - mongodump(?: archive| folder)?$/,
    /^[A-Za-z0-9_.-]+\.archive$/,
    /^[A-Za-z0-9_.-]+\.bson$/,
    /^[A-Za-z0-9_.-]+\.metadata\.json$/,
    /^FROM\b/,
    /^RUN\b/,
    /^CMD\b/,
    /^\/\//,
    /^\*nat$/,
    /^:POSTROUTING\s+/,
    /^-A\s+POSTROUTING\s+/,
    /^COMMIT$/,
    /^\{$/,
    /^\}$/,
    /^\[$/,
    /^\]$/,
    /^\s*"[^"]+":/,
    /^[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*.+,?$/,
    /^[A-Za-z0-9_-]+(?:,[A-Za-z0-9_-]+)+$/,
    /^[)\]}][,;]?$/,
  ];

  if (patterns.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  return (
    /\s--[a-z]/i.test(trimmed) ||
    /^[a-zA-Z0-9_.$-]+\s*=\s*.+$/.test(trimmed) ||
    /^mongodb:\/\//i.test(trimmed) ||
    /^0\s+\d+\s+\*\s+\*\s+\*/.test(trimmed)
  );
}

function inferLanguage(lines) {
  const first = lines.map((line) => line.trim()).find(Boolean) ?? '';

  if (/^@echo\b|^set(local)?\b|^::|^pause$/i.test(first)) {
    return 'bat';
  }

  if (/^#\s|^#!\//.test(first)) {
    return 'bash';
  }

  if (/^(db\.|use\s+|show dbs$|rs\.|print\(|const\s+|let\s+|var\s+|if\s*\(|return\b)/.test(first)) {
    return 'javascript';
  }

  if (/^(version:|services:|entrypoint:|systemLog:|storage:|processManagement:|net:|tls:|security:|replication:|auditLog:|destination:|format:|path:|filter:|bindIp:|port:|dbPath:|journal:|enabled:|pidFilePath:|timeZoneInfo:)/.test(first)) {
    return 'yaml';
  }

  if (/^(client$|dev\s+|proto\s+|ca\s+|cert\s+|key\s+|dh\s+|tls-crypt\s+|server\s+|push\s+|keepalive\s+|cipher\s+|auth\s+|persist-key$|persist-tun$|user\s+|group\s+|verb\s+|resolv_retry\s+|nobind$|remote\s+|remote-cert-tls\s+)/i.test(first)) {
    return 'conf';
  }

  if (/^FROM\b|^RUN\b|^CMD\b/.test(first)) {
    return 'dockerfile';
  }

  if (/^\{|^\}|^\s*"[^"]+":/.test(first)) {
    return 'json';
  }

  if (/^[A-Za-z_$][A-Za-z0-9_$]*\s*:\s*.+,?$/.test(first)) {
    return 'javascript';
  }

  if (/^(mongodump|mongorestore|mongoexport|mongoimport|mongosh|sudo|docker|docker-compose|mkdir|cd\s+|touch|chmod|find\s+|openssl|make-cadir|\.\/easyrsa|openvpn|newgrp|ip\s+|ss\s+|systemctl|echo\s+|cat\s+|chown\s+)/i.test(first)) {
    return 'bash';
  }

  return 'text';
}

function buildCover() {
  return [
    '![][image1]',
    '',
    '# MONGODB',
    '',
    '**Alumnos:**',
    '',
    '- Jorge Luis Ibarra Villa',
    '- Juan Antonio Deras Duron',
    '- Jesus Alberto Villarreal Perez',
    '- Luis Fernando Robles Ibarra',
    '- Sebastian Rodriguez Contreras',
    '- Anthony Fuentes Carrera',
    '',
    '**Docente:**',
    'MSC Ochoa del Toro David',
    '',
    '**Institución:**',
    'Universidad Tecnológica de Torreón',
    '',
    '**Fecha:**',
    '7 / Mayo / 2026',
  ];
}

function collectCatalogEntries(lines) {
  const entries = [];
  let inToc = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '## Tabla de contenido') {
      inToc = true;
      continue;
    }

    if (!inToc) {
      continue;
    }

    if (trimmed === '## Tabla de figuras' || trimmed === '## Lista de tablas') {
      break;
    }

    const match = trimmed.match(/^- \[(.+?)\]\(#.+\)$/);
    if (!match) {
      continue;
    }

    const text = normalizeCatalogText(match[1]);
    if (!text) {
      continue;
    }

    entries.push({ text, depth: line.startsWith('  ') ? 3 : 2 });
  }

  return entries;
}

function collectMainStart(lines) {
  for (let index = 0; index < lines.length; index += 1) {
    if (/^#\s+Copias de Seguridad y Restauración en MongoDB desde Compass en Windows/.test(lines[index].trim())) {
      return index;
    }
  }

  return -1;
}

const catalogEntries = collectCatalogEntries(rawLines);
const allowedHeadingTexts = new Set(catalogEntries.map((entry) => entry.text));
const mainStart = collectMainStart(rawLines);

if (mainStart === -1) {
  throw new Error('Could not locate real main heading');
}

function isAllowedHeading(trimmed) {
  if (!/^#{1,6}\s+/.test(trimmed)) {
    return false;
  }

  if (/^#!\//.test(trimmed)) {
    return false;
  }

  const text = normalizeCatalogText(trimmed.replace(/^#{1,6}\s+/, ''));
  return allowedHeadingTexts.has(text);
}

const createSlug = createSlugRegistry();
const contentLines = rawLines.slice(mainStart).map(sanitizeLine);
const normalizedContent = [];
const figureLines = [];
const tableLines = [];
const seenHeadings = [];

for (const line of contentLines) {
  const trimmed = line.trim();

  if (trimmed === '') {
    normalizedContent.push('');
    continue;
  }

  if (isCodeFence(trimmed)) {
    continue;
  }

  if (isAllowedHeading(trimmed)) {
    const level = trimmed.match(/^#+/)?.[0].length ?? 1;
    const text = normalizeCatalogText(trimmed.replace(/^#{1,6}\s+/, ''));
    const heading = `${'#'.repeat(level)} ${text}`;
    normalizedContent.push(heading);
    seenHeadings.push({ level, text, slug: createSlug(text) });
    continue;
  }

  if (trimmed === '## Tabla de contenido' || trimmed === '## Tabla de figuras' || trimmed === '## Lista de tablas') {
    continue;
  }

  if (/\(#(?:bookmark=|heading=|id\.)/i.test(trimmed)) {
    continue;
  }

  if (isFigureLine(trimmed)) {
    figureLines.push(trimmed.replace(/^\*/, '').replace(/\*$/, '').trim());
    normalizedContent.push(trimmed);
    continue;
  }

  if (isTableLine(trimmed)) {
    tableLines.push(trimmed.replace(/^\*/, '').replace(/\*$/, '').trim());
    normalizedContent.push(trimmed);
    continue;
  }

  normalizedContent.push(line);
}

function dedupeBlankLines(lines) {
  const output = [];
  for (const line of lines) {
    if (line === '' && output[output.length - 1] === '') {
      continue;
    }
    output.push(line);
  }

  while (output[0] === '') {
    output.shift();
  }

  while (output[output.length - 1] === '') {
    output.pop();
  }

  return output;
}

function normalizeCodeBlocks(lines) {
  const output = [];

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === '') {
      output.push('');
      index += 1;
      continue;
    }

    if (isAllowedHeading(trimmed) || isStandaloneImage(trimmed) || isFigureLine(trimmed) || isTableLine(trimmed) || /^\|/.test(trimmed)) {
      output.push(line);
      index += 1;
      continue;
    }

    if (isLanguageLabel(trimmed)) {
      const nextMeaningful = lines.slice(index + 1).map((candidate) => candidate.trim()).find(Boolean) ?? '';
      if (isLikelyCodeLine(nextMeaningful)) {
        index += 1;
        continue;
      }
    }

    if (!isLikelyCodeLine(trimmed)) {
      output.push(line);
      index += 1;
      continue;
    }

    const block = [];

    while (index < lines.length) {
      const current = lines[index];
      const currentTrimmed = current.trim();

      if (currentTrimmed === '') {
        const nextMeaningful = lines.slice(index + 1).map((candidate) => candidate.trim()).find(Boolean) ?? '';
        if (isLikelyCodeLine(nextMeaningful)) {
          block.push('');
          index += 1;
          continue;
        }
        break;
      }

      if (isAllowedHeading(currentTrimmed) || isStandaloneImage(currentTrimmed) || isFigureLine(currentTrimmed) || isTableLine(currentTrimmed)) {
        break;
      }

      if (!isLikelyCodeLine(currentTrimmed)) {
        break;
      }

      block.push(current.replace(/\*\*/g, ''));
      index += 1;
    }

    while (block[0] === '') {
      block.shift();
    }
    while (block[block.length - 1] === '') {
      block.pop();
    }

    if (block.length > 0) {
      output.push(`\`\`\`${inferLanguage(block)}`);
      output.push(...block);
      output.push('```');
    }
  }

  return dedupeBlankLines(output);
}

const rebuiltContent = normalizeCodeBlocks(dedupeBlankLines(normalizedContent));

const tocSlugRegistry = createSlugRegistry();
const tocLines = catalogEntries.map((entry) => {
  const slug = tocSlugRegistry(entry.text);
  const indent = entry.depth === 3 ? '  ' : '';
  return `${indent}- [${entry.text}](#${slug})`;
});

const finalLines = dedupeBlankLines([
  ...buildCover(),
  '',
  '## Tabla de contenido',
  '',
  ...tocLines,
  '',
  '## Tabla de figuras',
  '',
  ...figureLines.map((line) => `- ${line}`),
  '',
  '## Lista de tablas',
  '',
  ...tableLines.map((line) => `- ${line}`),
  '',
  ...rebuiltContent,
]);

const finalParts = [frontmatter.trimEnd(), '', finalLines.join('\n'), '', definitions, ''];
fs.writeFileSync(absolutePath, `${finalParts.join('\n')}\n`);
