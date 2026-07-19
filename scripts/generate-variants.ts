import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SUBSTITUTIONS: Record<string, string[]> = {
  a: ["4", "@"],
  b: ["8"],
  e: ["3"],
  g: ["6", "9"],
  i: ["1", "!"],
  l: ["1", "|"],
  o: ["0"],
  s: ["5", "$"],
  t: ["7"],
  z: ["2"],
};

function getSubstitutableIndices(word: string): number[] {
  const indices: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (SUBSTITUTIONS[word[i].toLowerCase()]) {
      indices.push(i);
    }
  }
  return indices;
}

function generatePartialLeetSubstitutions(word: string): string[] {
  const results = new Set<string>();
  const indices = getSubstitutableIndices(word);

  if (indices.length === 0) return [];

  for (let count = 1; count <= Math.min(3, indices.length); count++) {
    const combos = getCombinations(indices, count);
    for (const combo of combos) {
      const variant = word.split("");
      for (const idx of combo) {
        const subs = SUBSTITUTIONS[variant[idx].toLowerCase()];
        if (subs) {
          variant[idx] = subs[0];
        }
      }
      results.add(variant.join(""));
    }
  }

  return [...results];
}

function generateSecondSubstitution(word: string): string[] {
  const results = new Set<string>();
  const indices = getSubstitutableIndices(word);

  if (indices.length === 0) return [];

  for (let count = 1; count <= Math.min(2, indices.length); count++) {
    const combos = getCombinations(indices, count);
    for (const combo of combos) {
      const variant = word.split("");
      for (const idx of combo) {
        const subs = SUBSTITUTIONS[variant[idx].toLowerCase()];
        if (subs && subs.length > 1) {
          variant[idx] = subs[1];
        }
      }
      results.add(variant.join(""));
    }
  }

  return [...results];
}

function getCombinations(arr: number[], size: number): number[][] {
  if (size === 0) return [[]];
  if (size > arr.length) return [];

  const result: number[][] = [];
  for (let i = 0; i <= arr.length - size; i++) {
    const rest = getCombinations(arr.slice(i + 1), size - 1);
    for (const combo of rest) {
      result.push([arr[i], ...combo]);
    }
  }
  return result;
}

function generateRepeatedVariants(word: string): string[] {
  const results = new Set<string>();
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  for (let i = 0; i < word.length; i++) {
    if (i > 0 && word[i] === word[i - 1]) continue;
    for (let repeat = 2; repeat <= 3; repeat++) {
      const repeated = word[i].repeat(repeat);
      const variant = word.slice(0, i) + repeated + word.slice(i + 1);
      if (variant !== word) results.add(variant);
    }
  }

  if (word.length >= 3) {
    for (let i = 0; i < word.length; i++) {
      if (vowels.has(word[i].toLowerCase())) {
        const variant = word.slice(0, i) + word.slice(i + 1);
        if (variant.length >= 2 && variant !== word) {
          results.add(variant);
        }
      }
    }
  }

  return [...results];
}

function generateCaseVariants(word: string): string[] {
  if (word.length < 2) return [];
  const results = new Set<string>();

  if (word === word.toLowerCase()) {
    results.add(word.toUpperCase());

    if (word.length >= 2) {
      results.add(
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
    }

    if (word.length >= 3) {
      results.add(
        word.slice(0, Math.floor(word.length / 2)).toUpperCase() +
          word.slice(Math.floor(word.length / 2)).toLowerCase()
      );
    }
  }

  return [...results];
}

function generateSeparatorVariants(word: string): string[] {
  const results = new Set<string>();

  if (word.includes("-")) {
    const separators = ["_", " ", ".", ",", "--"];
    for (const sep of separators) {
      const variant = word.replace(/-/g, sep);
      if (variant !== word) results.add(variant);
    }
  }

  if (word.length >= 4 && !word.includes("-") && !word.includes(" ")) {
    const sep = ".";
    const separated = word.split("").join(sep);
    if (separated !== word) results.add(separated);
  }

  return [...results];
}

function generateHyphenVariantCombinations(word: string): string[] {
  const results = new Set<string>();

  if (!word.includes("-")) return [...results];

  const parts = word.split("-");
  if (parts.length !== 2) return [...results];

  const [part1, part2] = parts;
  const separators = ["_", " ", ".", ",", "--"];

  for (const sep of separators) {
    const variant = part1 + sep + part2;
    if (variant !== word) results.add(variant);
  }

  return [...results];
}

function isValidVariant(variant: string, original: string): boolean {
  if (variant.length < 2) return false;
  if (variant === original.toLowerCase()) return false;
  if (variant.length > original.length * 2) return false;
  if (/^[.\-_, ]+$/.test(variant)) return false;
  return true;
}

function generateVariants(word: string): string[] {
  const lower = word.toLowerCase();
  const variants = new Set<string>();

  const leetSubs = generatePartialLeetSubstitutions(lower);
  for (const v of leetSubs) {
    if (isValidVariant(v, lower)) variants.add(v);
  }

  const secondSubs = generateSecondSubstitution(lower);
  for (const v of secondSubs) {
    if (isValidVariant(v, lower)) variants.add(v);
  }

  const repeated = generateRepeatedVariants(lower);
  for (const v of repeated) {
    if (isValidVariant(v, lower)) variants.add(v);
  }

  const caseVars = generateCaseVariants(lower);
  for (const v of caseVars) {
    if (isValidVariant(v, lower)) variants.add(v);
  }

  const separatorVars = generateSeparatorVariants(lower);
  for (const v of separatorVars) {
    if (isValidVariant(v, lower)) variants.add(v);
  }

  const hyphenVars = generateHyphenVariantCombinations(lower);
  for (const v of hyphenVars) {
    if (isValidVariant(v, lower)) variants.add(v);
  }

  return [...variants].sort();
}

function main() {
  const projectRoot = join(import.meta.dirname, "..");

  const wordsRaw = readFileSync(
    join(projectRoot, "api/pure_filipino.json"),
    "utf-8"
  );
  const words: { id: number; word: string }[] = JSON.parse(wordsRaw);

  const existingRaw = readFileSync(
    join(projectRoot, "docs/leetspeak/filipino_variants.json"),
    "utf-8"
  );
  const existing: {
    success: boolean;
    type: string;
    count: number;
    source: string;
    data: { word: string; variants: string[] }[];
  } = JSON.parse(existingRaw);

  const existingMap = new Map<string, string[]>();
  for (const entry of existing.data) {
    existingMap.set(entry.word.toLowerCase(), entry.variants);
  }

  const seenWords = new Set<string>();
  const outputData: { word: string; variants: string[] }[] = [];

  for (const { word } of words) {
    const lower = word.toLowerCase();
    if (seenWords.has(lower)) continue;
    seenWords.add(lower);

    const existingVariants = existingMap.get(lower) || [];
    const newVariants = generateVariants(lower);

    const allVariants = new Set<string>(existingVariants);
    for (const v of newVariants) {
      if (v !== lower) allVariants.add(v);
    }

    const sorted = [...allVariants]
      .map((v) => v.trim())
      .filter((v) => v.length > 0 && v !== lower)
      .sort();

    outputData.push({
      word: lower,
      variants: sorted,
    });
  }

  outputData.sort((a, b) => a.word.localeCompare(b.word));

  const output = {
    success: true,
    type: "filipino-variants",
    count: outputData.length,
    source: "database",
    data: outputData,
  };

  writeFileSync(
    join(projectRoot, "docs/leetspeak/filipino_variants.json"),
    JSON.stringify(output, null, 2) + "\n"
  );

  console.log(`Generated variants for ${outputData.length} words`);
  let totalVariants = 0;
  for (const entry of outputData) {
    totalVariants += entry.variants.length;
    console.log(`  ${entry.word}: ${entry.variants.length} variants`);
  }
  console.log(`Total variants: ${totalVariants}`);
}

main();
