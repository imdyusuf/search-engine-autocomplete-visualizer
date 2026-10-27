import { describe, expect, it } from "vitest";
import { PriorityQueue } from "@/structures/PriorityQueue";

describe("PriorityQueue", () => {
  it("returns entries in ascending priority for a min heap", () => {
    const heap = new PriorityQueue<number>((a, b) => a - b);
    [8, 2, 5, 1, 3].forEach((value) => heap.push(value));

    expect(heap.peek()).toBe(1);
    expect([heap.pop(), heap.pop(), heap.pop(), heap.pop(), heap.pop()]).toEqual([1, 2, 3, 5, 8]);
  });

  it("replaces the root while preserving heap ordering", () => {
    const heap = new PriorityQueue<number>((a, b) => a - b);
    [2, 4, 7].forEach((value) => heap.push(value));

    expect(heap.replaceTop(6)).toBe(2);
    expect([heap.pop(), heap.pop(), heap.pop()]).toEqual([4, 6, 7]);
  });
});