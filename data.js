export const modes = ['keywords', 'snippets', 'full'];

const fullCodeSources = {
    // --- PYTHON ---
    python: [
        // Quick Sort
        `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,

        // Binary Search
        `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,

        // Merge Sort
        `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,

        // DP: 0/1 Knapsack
        `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]`,

        // Dijkstra
        `import heapq

def dijkstra(graph, start):
    pq = [(0, start)]
    distances = {node: float('inf') for node in graph}
    distances[start] = 0

    while pq:
        d, node = heapq.heappop(pq)
        if d > distances[node]:
            continue
        
        for neighbor, weight in graph[node].items():
            dist = d + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                heapq.heappush(pq, (dist, neighbor))
    return distances`
    ],

    // --- JAVA ---
    java: [
        // Quick Sort
        `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}`,

        // Binary Search
        `public class BinarySearch {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,

        // DP: LCS
        `public class LCS {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`
    ],

    // --- C ---
    c: [
        // Bubble Sort
        `void bubbleSort(int arr[], int n) {
    int i, j, temp;
    for (i = 0; i < n-1; i++) {
        for (j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,

        // Linked List Node
        `struct Node {
    int data;
    struct Node* next;
};

void push(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}`,

        // Binary Search
        `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
    ],

    // --- C++ ---
    cpp: [
        // Quick Sort
        `#include <vector>
#include <algorithm>

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        int pi = i + 1;

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,

        // Quick Pow (Modular Exponentiation)
        `long long quickPow(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp /= 2;
    }
    return res;
}`,

        // Dijkstra
        `#include <vector>
#include <queue>
#include <limits>

using namespace std;

vector<int> dijkstra(int n, vector<vector<pair<int, int>>>& adj, int src) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(n, numeric_limits<int>::max());

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
    ],

    // --- JavaScript ---
    javascript: [
        // Merge Sort
        `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [], i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,

        // DP: 0/1 Knapsack
        `function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}`
    ],

    // --- TypeScript ---
    typescript: [
        // Binary Search
        `function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,

        // Quick Sort
        `function quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[arr.length - 1];
    const left: number[] = [];
    const right: number[] = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) left.push(arr[i]);
        else right.push(arr[i]);
    }
    
    return [...quickSort(left), pivot, ...quickSort(right)];
}`
    ],

    // --- Go ---
    go: [
        // Merge Sort
        `package main

func mergeSort(items []int) []int {
    if len(items) < 2 {
        return items
    }
    first := mergeSort(items[:len(items)/2])
    second := mergeSort(items[len(items)/2:])
    return merge(first, second)
}

func merge(a []int, b []int) []int {
    final := []int{}
    i := 0
    j := 0
    for i < len(a) && j < len(b) {
        if a[i] < b[j] {
            final = append(final, a[i])
            i++
        } else {
            final = append(final, b[j])
            j++
        }
    }
    for ; i < len(a); i++ {
        final = append(final, a[i])
    }
    for ; j < len(b); j++ {
        final = append(final, b[j])
    }
    return final
}`,

        // Quick Sort
        `func quickSort(arr []int, low, high int) {
    if low < high {
        p := partition(arr, low, high)
        quickSort(arr, low, p-1)
        quickSort(arr, p+1, high)
    }
}

func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low
    for j := low; j < high; j++ {
        if arr[j] < pivot {
            arr[i], arr[j] = arr[j], arr[i]
            i++
        }
    }
    arr[i], arr[high] = arr[high], arr[i]
    return i
}`
    ],

    // --- SQL ---
    sql: [
        // CTE Recursive (Hierarchy)
        `WITH RECURSIVE Subordinates AS (
    SELECT EmployeeID, Name, ManagerID
    FROM Employees
    WHERE ManagerID IS NULL
    
    UNION ALL
    
    SELECT e.EmployeeID, e.Name, e.ManagerID
    FROM Employees e
    INNER JOIN Subordinates s ON e.ManagerID = s.EmployeeID
)
SELECT * FROM Subordinates;`,

        // Rank Window Function
        `SELECT 
    EmployeeID, 
    DepartmentID, 
    Salary,
    RANK() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC) as Rank
FROM Employees
WHERE Salary > 50000;`,

        // Complex Logic 
        `SELECT 
    p.ProductName,
    SUM(od.Quantity) as TotalSold,
    AVG(od.UnitPrice) as AvgPrice
FROM Products p
JOIN OrderDetails od ON p.ProductID = od.ProductID
JOIN Orders o ON od.OrderID = o.OrderID
WHERE o.OrderDate >= '2024-01-01'
GROUP BY p.ProductName
HAVING SUM(od.Quantity) > 100
ORDER BY TotalSold DESC;`
    ]
};

// --- Helper to Generate Keywords & Snippets ---
// We simply define standard keywords for new Languages if needed, or extract them?
// For simplicity, we define lists.
const keywordLists = {
    python: ['def', 'class', 'return', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with', 'lambda', 'await', 'async', 'pass', 'break', 'continue'],
    java: ['public', 'class', 'static', 'void', 'int', 'extends', 'implements', 'new', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'throw', 'package', 'import'],
    c: ['int', 'char', 'float', 'double', 'void', 'struct', 'if', 'else', 'for', 'while', 'return', 'switch', 'case', 'break', 'continue', 'typedef', 'sizeof', 'static', 'extern', 'const'],
    cpp: ['int', 'float', 'double', 'char', 'void', 'class', 'struct', 'public', 'private', 'template', 'typename', 'if', 'else', 'for', 'while', 'return', '#include', 'std', 'vector', 'const'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'async', 'await', 'import', 'export', 'class', 'if', 'else', 'switch', 'map', 'filter', 'reduce', 'promise', 'try', 'catch'],
    typescript: ['interface', 'type', 'const', 'let', 'function', 'return', 'number', 'string', 'boolean', 'any', 'void', 'import', 'export', 'class', 'implements', 'readonly', 'as'],
    go: ['func', 'package', 'import', 'return', 'var', 'type', 'struct', 'interface', 'if', 'else', 'for', 'range', 'go', 'chan', 'defer', 'map', 'make', 'len', 'append', 'nil'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'UNION', 'VAlUES', 'NULL']
};

export const languages = {};

Object.keys(fullCodeSources).forEach(lang => {
    // Generate Snippets: Take random non-empty lines from Full Code
    const allCode = fullCodeSources[lang].join('\n');
    const lines = allCode.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 10 && !l.startsWith('//') && !l.startsWith('#'));

    // Unique lines to avoid duplicates
    const uniqueSnippets = [...new Set(lines)];

    // Pick up to 20 snippets randomly if too many, or just keep all valid ones
    // We'll keep them all for variety

    languages[lang] = {
        keywords: keywordLists[lang] || keywordLists['javascript'],
        full: fullCodeSources[lang],
        snippets: uniqueSnippets
    };
});
