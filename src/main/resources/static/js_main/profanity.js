/**
 * ============================================================================
 * FEATURE: Client-Side Security & Content Moderation
 * ============================================================================
 * Acts as a first layer of defense for user-generated content (Reviews, Q&A).
 * Uses predefined dictionaries and RegEx patterns to block profanity, SQL injection
 * attempts, and unauthorized external links before data reaches the backend.
 */
import leoProfanity from "https://cdn.skypack.dev/leo-profanity@1.7.0";
import sanitizeHtml from "https://esm.sh/sanitize-html@2.17.0?bundle";

// LeoProfanity

const en = leoProfanity.getDictionary("en");
const ru = leoProfanity.getDictionary("ru");
const merged = [...new Set([...en, ...ru])];

const replacementMap = {
  ё: ["ё", "е", "є"],
  е: ["е", "є"],
  и: ["и", "і"],
  ы: ["ы", "и"],
  э: ["э", "е"],
};
const hasReplacableChar = /[ёеирыэ]/;

function generateAllVariants(word) {
  let variants = [""];
  for (const ch of word) {
    const options = replacementMap[ch] || [ch];
    const nextVariants = [];
    for (const prefix of variants) {
      for (const opt of options) {
        nextVariants.push(prefix + opt);
      }
    }
    variants = nextVariants;
  }
  return variants;
}

const finalSet = new Set();
for (const word of merged) {
  if (!hasReplacableChar.test(word)) {
    finalSet.add(word);
  } else {
    const variants = generateAllVariants(word);
    for (const v of variants) {
      finalSet.add(v);
    }
  }
}
const finalList = [...finalSet];

leoProfanity.clearList();
leoProfanity.add(finalList);

// Phone

function formatPhoneInput(value) {
  value = value.replace(/[^\d\s\-+]/g, "");

  let plus = value.startsWith("+") ? "+" : "";
  value = value.replace(/\+/g, "");
  value = plus + value;

  value = value.replace(/[\s\-]{2,}/g, (match) => {
    return match.includes("-") ? "-" : " ";
  });

  value = value.replace(/(\s\-)|(\-\s)/g, "-");

  return value.substring(0, 30);
}
window.formatPhoneInput = formatPhoneInput;

// Filtration & Return Helpers

/**
 * Dynamic Message Builder: Constructs customized UI validation feedback based
 * on the specific combination of security violations detected in the user input.
 */
function buildValidationMessage(hasProfanity, hasCode, hasLinks, context) {
  const issuePhrases = [];
  if (hasProfanity) issuePhrases.push("неприйнятні слова");
  if (hasCode)
    issuePhrases.push("елементи форматування або структуровані інструкції");
  if (hasLinks) issuePhrases.push("посилання або шлях до ресурсу");

  function joinIssues(arr) {
    if (arr.length === 1) {
      return arr[0];
    } else if (arr.length === 2) {
      return `${arr[0]} та ${arr[1]}`;
    } else {
      return `${arr[0]}, ${arr[1]}, а також ${arr[2]}`;
    }
  }

  const count = (hasProfanity ? 1 : 0) + (hasCode ? 1 : 0) + (hasLinks ? 1 : 0);

  let issueSentence;

  if (count === 1) {
    issueSentence = `${context} виявлено ${joinIssues(issuePhrases)}.`;
  } else if (count === 2) {
    let shortIssue = "";

    if (hasProfanity && hasCode) {
      shortIssue = "неприйнятні слова та елементи форматування";
    } else if (hasProfanity && hasLinks) {
      shortIssue = "неприйнятні слова та посилання";
    } else if (hasCode && hasLinks) {
      shortIssue = "елементи форматування та посилання";
    }

    issueSentence = `${context} виявлено ${shortIssue}.`;
  } else if (count === 3) {
    issueSentence = `${context} виявлено неприйнятні слова, елементи форматування та посилання.`;
  } else {
    issueSentence = "";
  }

  return `
        <p>${issueSentence}</p>
        <p style="margin-top: calc(100vw * -5 / 1366); margin-bottom: calc(100vw * 0 / 1366);">
            Будь ласка, видаліть їх.
        </p>
    `;
}
window.buildValidationMessage = buildValidationMessage;

// Standard checks

export function checkProfanity(text) {
  return leoProfanity.check(text);
}

export function checkLinks(text) {
  const urlPattern = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/i;
  const wwwPattern = /\bwww\.[^\s/$.?#].[^\s]*\b/i;
  const domainPattern =
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}(?:\/[^\s]*)?\b/i;

  const windowsDrivePattern = /\b[A-Za-z]:[\\/][^\s]+\b/;
  const uncPattern = /\\\\[^\s\\/]+[\\/][^\s]+/;
  const unixAbsPattern = /(?:^|\s)\/(?:[^\s\/]+\/)*[^\s\/]+\b/;
  const unixTildePattern = /(?:^|\s)~\/[^\s\/]+(?:\/[^\s\/]+)*\b/;
  const unixRelativePattern = /(?:^|\s)\.{1,2}\/[^\s]+/;

  return (
    urlPattern.test(text) ||
    wwwPattern.test(text) ||
    domainPattern.test(text) ||
    windowsDrivePattern.test(text) ||
    uncPattern.test(text) ||
    unixAbsPattern.test(text) ||
    unixTildePattern.test(text) ||
    unixRelativePattern.test(text)
  );
}

export function checkCode(text) {
  const cleaned = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const hasDirtyHtml = cleaned !== text;

  const sqlPatterns = [
    /\bUPDATE\s+[`"'A-Za-z0-9_.]+\s+SET\b/i,
    /\bSELECT\s+[\s\S]+?\s+FROM\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bINSERT\s+INTO\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bDELETE\s+FROM\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bCREATE\s+TABLE\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bDROP\s+TABLE\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bALTER\s+TABLE\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bTRUNCATE\s+TABLE\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bCREATE\s+DATABASE\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bDROP\s+DATABASE\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bCREATE\s+INDEX\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bDROP\s+INDEX\s+[`"'A-Za-z0-9_.]+\b/i,
    /\bRENAME\s+TABLE\s+[`"'A-Za-z0-9_.]+\b/i,
  ];
  const hasSql = sqlPatterns.some((pat) => pat.test(text));

  return hasDirtyHtml || hasSql;
}
