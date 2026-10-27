import { tokenize } from "@/utils/normalization";

export class InvertedIndex {
  private readonly postings = new Map<string, Set<string>>();

  public addDocument(id: string, fields: string[]): void {
    const uniqueTokens = new Set(fields.flatMap(tokenize));
    uniqueTokens.forEach((token) => {
      const posting = this.postings.get(token) ?? new Set<string>();
      posting.add(id);
      this.postings.set(token, posting);
    });
  }

  public search(query: string): Map<string, number> {
    const terms = tokenize(query);
    const matches = new Map<string, number>();
    terms.forEach((term) => {
      this.postings.get(term)?.forEach((id) => {
        matches.set(id, (matches.get(id) ?? 0) + 1);
      });
    });
    return matches;
  }

  public get size(): number {
    return this.postings.size;
  }

  public has(term: string): boolean {
    return this.postings.has(term);
  }
}