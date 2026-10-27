export class PriorityQueue<T> {
  private readonly heap: T[] = [];

  public constructor(private readonly compare: (a: T, b: T) => number) {}

  public get size(): number {
    return this.heap.length;
  }

  public peek(): T | undefined {
    return this.heap[0];
  }

  public push(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  public pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const root = this.heap[0];
    const tail = this.heap.pop();
    if (tail !== undefined && this.heap.length > 0) {
      this.heap[0] = tail;
      this.bubbleDown(0);
    }
    return root;
  }

  public replaceTop(value: T): T | undefined {
    if (this.heap.length === 0) {
      this.push(value);
      return undefined;
    }
    const root = this.heap[0];
    this.heap[0] = value;
    this.bubbleDown(0);
    return root;
  }

  public toArray(): T[] {
    return [...this.heap];
  }

  private bubbleUp(index: number): void {
    let child = index;
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (this.compare(this.heap[child], this.heap[parent]) >= 0) break;
      [this.heap[child], this.heap[parent]] = [this.heap[parent], this.heap[child]];
      child = parent;
    }
  }

  private bubbleDown(index: number): void {
    let parent = index;
    while (true) {
      const left = parent * 2 + 1;
      const right = left + 1;
      let smallest = parent;
      if (left < this.heap.length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < this.heap.length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === parent) return;
      [this.heap[parent], this.heap[smallest]] = [this.heap[smallest], this.heap[parent]];
      parent = smallest;
    }
  }
}