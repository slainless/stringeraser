export class Matcher {
  private trie: Matcher.TrieNode;
  private patterns: RegExp[];

  constructor(strings: string[], regexPatterns: (string | RegExp)[]) {
    this.trie = this.buildTrie(strings);
    this.patterns = regexPatterns.map((regex) => new RegExp(regex, "g"));
  }

  buildTrie(strings: string[]) {
    const root: Matcher.TrieNode = {};
    for (const str of strings) {
      let node = root;
      for (const char of str) {
        if (!node[char]) node[char] = {};
        node = node[char];
      }
      node.isEnd = true;
      node.word = str;
    }
    return root;
  }

  searchWithTrie(text: string) {
    const matches: Matcher.Match[] = [];
    const n = text.length;

    for (let i = 0; i < n; i++) {
      let node = this.trie;
      for (let j = i; j < n; j++) {
        const char = text[j];
        if (!node[char]) break;
        node = node[char];
        if (node.isEnd) {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          matches.push({ match: node.word!, start: i, end: j });
        }
      }
    }
    return matches;
  }

  searchWithRegex(text: string) {
    const matches: Matcher.Match[] = [];
    for (const regexp of this.patterns) {
      let match = regexp.exec(text);
      while (match !== null) {
        matches.push({
          match: match[0],
          start: match.index,
          end: regexp.lastIndex - 1,
          regexp: regexp,
        });
        match = regexp.exec(text);
      }
    }
    return matches;
  }

  findMatches(text: string) {
    const trieMatches = this.searchWithTrie(text);
    const regexMatches = this.searchWithRegex(text);
    return [...trieMatches, ...regexMatches];
  }
}

export namespace Matcher {
  export type TrieNode = { isEnd?: true; word?: string } & {
    [k: string]: TrieNode;
  };

  export interface Match {
    match: string;
    start: number;
    end: number;
    regexp?: RegExp;
  }
}
