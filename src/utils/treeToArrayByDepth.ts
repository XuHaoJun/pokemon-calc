// Example usage
// const tree = {
//   data: 1,
//   children: [
//     {
//       data: 2,
//       children: [
//         { data: 4, children: [] },
//         { data: 5, children: [] },
//       ],
//     },
//     {
//       data: 3,
//       children: [
//         { data: 6, children: [] },
//         { data: 7, children: [] },
//       ],
//     },
//   ],
// }
// treeToArrayByDepth(tree)
// Output: [[{data: 1, children: ...}], [{data: 2, children: ...}, {data: 3, children: ...}], [{data: 4, children: ...}, {data: 5, children: ...}], [{data: 6, children: ...}, {data: 7, children: ...}]]
export function treeToArrayByDepth<T extends { children?: T[] }>(root: T) {
  if (!root) return []

  const result: T[][] = []
  interface QueueItem {
    node: T
    depth: number
  }
  const queue: QueueItem[] = [{ node: root, depth: 0 }]

  while (queue.length > 0) {
    const { node, depth } = queue.shift() as QueueItem

    if (!result[depth]) {
      result[depth] = []
    }

    result[depth].push(node)

    if (node.children) {
      for (const child of node.children) {
        queue.push({ node: child, depth: depth + 1 })
      }
    }
  }

  return result
}
