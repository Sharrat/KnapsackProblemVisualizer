package student.pwr.KnapsackProblemVisualizer.controller;

import org.springframework.web.bind.annotation.*;
import student.pwr.KnapsackProblemVisualizer.Requests.KnapsackRequest;
import student.pwr.KnapsackProblemVisualizer.util.Item;
import student.pwr.KnapsackProblemVisualizer.util.Node;
import student.pwr.KnapsackProblemVisualizer.util.sortByC;
import student.pwr.KnapsackProblemVisualizer.util.sortByRatio;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class KnapsackController {

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/dp")
    public Map<String, Object> knapsack01DP(@RequestBody KnapsackRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();
        // Record the start time for performance measurement.
        long startTime = System.nanoTime();

        // Extract values, weights, and capacity from the request.
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;

        // Initialize the dynamic programming table.
        int[][] dp = new int[n + 1][capacity + 1];
        List<Integer> selectedItems = new ArrayList<>();

        // Build the dynamic programming table.
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0)
                    // Base case: no items or zero capacity.
                    dp[i][w] = 0;
                else if (weights[i - 1] <= w)
                    // Current item can be included. Check for maximum value by including or excluding it.
                    dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
                else
                    // Current item cannot be included as it exceeds current capacity.
                    dp[i][w] = dp[i - 1][w];
            }
        }

        // Backtrack through the dynamic programming table to find selected items.
        int w = capacity;
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i - 1][w]) {
                // This item was included in the optimal solution.
                selectedItems.add(i);
                w = w - weights[i - 1];
            }
        }

        // Record the end time for performance measurement.
        long endTime = System.nanoTime();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;
        // Prepare the result map to return.
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", dp[n][capacity]);            // Maximum possible value for given items and capacity.
        result.put("selectedItems", selectedItems);         // List of selected items' indices.
        result.put("exeTime", (endTime - startTime));       // Time taken to compute the solution.
        result.put("memoryUsed",memoryUsedByAlgorithm);     // Memory used by the algorithm

        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/gra")
    public Map<String, Object> knapsack01Greedy(@RequestBody KnapsackRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();

        // Record the start time for performance measurement.
        long startTime = System.nanoTime();

        // Extract values, weights, and capacity from the request.
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;

        // Sort items by value-to-weight ratio in descending order.
        double[][] items = new double[n][3];
        for (int i = 0; i < n; i++) {
            items[i][0] = values[i]; // Value
            items[i][1] = weights[i]; // Weight
            items[i][2] = i; // Original Index
        }
        java.util.Arrays.sort(items, (a, b) -> Double.compare(b[0] / b[1], a[0] / a[1]));

        // Initialize variables to track maximum value and selected items.
        int maxValue = 0;
        List<Integer> selectedItems = new ArrayList<>();

        // Apply the greedy algorithm.
        for (double[] item : items) {
            int weight = (int) item[1];
            if (capacity >= weight) {
                capacity -= weight;
                maxValue += (int) item[0];
                selectedItems.add((int) item[2]);
            }
        }

        // Record the end time for performance measurement.
        long endTime = System.nanoTime();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;

        // Prepare the result map to return.
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", maxValue);                  // Maximum possible value for given items and capacity.
        result.put("selectedItems", selectedItems);       // List of selected items' indices.
        result.put("exeTime", (endTime - startTime));     // Time taken to compute the solution.
        result.put("memoryUsed", memoryUsedByAlgorithm);  // Memory used by the algorithm

        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/gena")
    public Map<String, Object> knapsack01GENA(@RequestBody KnapsackRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();
        // Record the start time for performance measurement.
        long startTime = System.nanoTime();

        // Extract values, weights, and capacity from the request.
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;

        // Initialize the dynamic programming table.
        int[][] dp = new int[n + 1][capacity + 1];
        List<Integer> selectedItems = new ArrayList<>();

        // Build the dynamic programming table.
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0)
                    // Base case: no items or zero capacity.
                    dp[i][w] = 0;
                else if (weights[i - 1] <= w)
                    // Current item can be included. Check for maximum value by including or excluding it.
                    dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
                else
                    // Current item cannot be included as it exceeds current capacity.
                    dp[i][w] = dp[i - 1][w];
            }
        }

        // Backtrack through the dynamic programming table to find selected items.
        int w = capacity;
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i - 1][w]) {
                // This item was included in the optimal solution.
                selectedItems.add(i);
                w = w - weights[i - 1];
            }
        }

        // Record the end time for performance measurement.
        long endTime = System.nanoTime();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;
        // Prepare the result map to return.
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", dp[n][capacity]);            // Maximum possible value for given items and capacity.
        result.put("selectedItems", selectedItems);         // List of selected items' indices.
        result.put("exeTime", (endTime - startTime));       // Time taken to compute the solution.
        result.put("memoryUsed",memoryUsedByAlgorithm);     // Memory used by the algorithm

        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/aco")
    public Map<String, Object> knapsack01ACO(@RequestBody KnapsackRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();
        // Record the start time for performance measurement.
        long startTime = System.nanoTime();

        // Extract values, weights, and capacity from the request.
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;

        // Initialize the dynamic programming table.
        int[][] dp = new int[n + 1][capacity + 1];
        List<Integer> selectedItems = new ArrayList<>();

        // Build the dynamic programming table.
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0)
                    // Base case: no items or zero capacity.
                    dp[i][w] = 0;
                else if (weights[i - 1] <= w)
                    // Current item can be included. Check for maximum value by including or excluding it.
                    dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
                else
                    // Current item cannot be included as it exceeds current capacity.
                    dp[i][w] = dp[i - 1][w];
            }
        }

        // Backtrack through the dynamic programming table to find selected items.
        int w = capacity;
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i - 1][w]) {
                // This item was included in the optimal solution.
                selectedItems.add(i);
                w = w - weights[i - 1];
            }
        }

        // Record the end time for performance measurement.
        long endTime = System.nanoTime();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;
        // Prepare the result map to return.
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", dp[n][capacity]);            // Maximum possible value for given items and capacity.
        result.put("selectedItems", selectedItems);         // List of selected items' indices.
        result.put("exeTime", (endTime - startTime));       // Time taken to compute the solution.
        result.put("memoryUsed",memoryUsedByAlgorithm);     // Memory used by the algorithm

        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/bf")
    public Map<String, Object> knapsack01BF(@RequestBody KnapsackRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();

        // Record the start time for performance measurement.
        long startTime = System.nanoTime();

        // Extract values, weights, and capacity from the request.
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();

        // Initialize variables for maximum value and selected items.
        int maxValue = 0;
        List<Integer> bestItems = new ArrayList<>();

        // Generate all subsets of items and calculate total value and weight.
        int n = values.length;
        for (int i = 0; i < (1 << n); i++) {
            int totalWeight = 0;
            int totalValue = 0;
            List<Integer> selectedItems = new ArrayList<>();

            for (int j = 0; j < n; j++) {
                if ((i & (1 << j)) > 0) {
                    totalWeight += weights[j];
                    totalValue += values[j];
                    selectedItems.add(j);
                }
            }

            // Check if this subset is the best so far.
            if (totalWeight <= capacity && totalValue > maxValue) {
                maxValue = totalValue;
                bestItems = selectedItems;
            }
        }

        // Record the end time for performance measurement.
        long endTime = System.nanoTime();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;

        // Prepare the result map to return.
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", maxValue);                  // Maximum possible value for given items and capacity.
        result.put("selectedItems", bestItems);            // List of selected items' indices.
        result.put("exeTime", (endTime - startTime));      // Time taken to compute the solution.
        result.put("memoryUsed", memoryUsedByAlgorithm);   // Memory used by the algorithm

        return result;
    }

    private static int sizebnb;
    private static float capacitybnb;

    static float upperBound(float tv, float tw,
                            int idx, Item arr[])
    {
        float value = tv;
        float weight = tw;
        for (int i = idx; i < sizebnb; i++) {
            if (weight + arr[i].weight
                    <= capacitybnb) {
                weight += arr[i].weight;
                value -= arr[i].value;
            }
            else {
                value -= (float)(capacitybnb
                        - weight)
                        / arr[i].weight
                        * arr[i].value;
                break;
            }
        }
        return value;
    }
    static float lowerBound(float tv, float tw,
                            int idx, Item arr[])
    {
        float value = tv;
        float weight = tw;
        for (int i = idx; i < sizebnb; i++) {
            if (weight + arr[i].weight
                    <= capacitybnb) {
                weight += arr[i].weight;
                value -= arr[i].value;
            }
            else {
                break;
            }
        }
        return value;
    }

    static void assign(Node a, float ub, float lb,
                       int level, boolean flag,
                       float tv, float tw)
    {
        a.ub = ub;
        a.lb = lb;
        a.level = level;
        a.flag = flag;
        a.tv = tv;
        a.tw = tw;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/bnb")
    public Map<String, Object> knapsack01BranchAndBound(@RequestBody KnapsackRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        capacitybnb = request.getCapacity();
        sizebnb = values.length;
        Item[] arr = new Item[sizebnb];
        for (int i=0;i<values.length;i++) {
        arr[i] = new Item(values[i],weights[i],i);
        }
        long startTime = System.nanoTime();
        // Sort the items based on the
        // profit/weight ratio
        Arrays.sort(arr, new sortByRatio());

        Node current, left, right;
        current = new Node();
        left = new Node();
        right = new Node();

        // min_lb -> Minimum lower bound
        // of all the nodes explored

        // final_lb -> Minimum lower bound
        // of all the paths that reached
        // the final level
        float minLB = 0, finalLB
                = Integer.MAX_VALUE;
        current.tv = current.tw = current.ub
                = current.lb = 0;
        current.level = 0;
        current.flag = false;

        // Priority queue to store elements
        // based on lower bounds
        PriorityQueue<Node> pq
                = new PriorityQueue<Node>(
                new sortByC());

        // Insert a dummy node
        pq.add(current);

        // curr_path -> Boolean array to store
        // at every index if the element is
        // included or not

        // final_path -> Boolean array to store
        // the result of selection array when
        // it reached the last level
        boolean currPath[] = new boolean[sizebnb];
        boolean finalPath[] = new boolean[sizebnb];

        while (!pq.isEmpty()) {
            current = pq.poll();
            if (current.ub > minLB
                    || current.ub >= finalLB) {
                // if the current node's best case
                // value is not optimal than minLB,
                // then there is no reason to
                // explore that node. Including
                // finalLB eliminates all those
                // paths whose best values is equal
                // to the finalLB
                continue;
            }

            if (current.level != 0)
                currPath[current.level - 1]
                        = current.flag;

            if (current.level == sizebnb) {
                if (current.lb < finalLB) {
                    // Reached last level
                    for (int i = 0; i < sizebnb; i++)
                        finalPath[arr[i].idx]
                                = currPath[i];
                    finalLB = current.lb;
                }
                continue;
            }

            int level = current.level;

            // right node -> Excludes current item
            // Hence, cp, cw will obtain the value
            // of that of parent
            assign(right, upperBound(current.tv,
                            current.tw,
                            level + 1, arr),
                    lowerBound(current.tv, current.tw,
                            level + 1, arr),
                    level + 1, false,
                    current.tv, current.tw);

            if (current.tw + arr[current.level].weight
                    <= capacitybnb) {

                // left node -> includes current item
                // c and lb should be calculated
                // including the current item.
                left.ub = upperBound(
                        current.tv
                                - arr[level].value,
                        current.tw
                                + arr[level].weight,
                        level + 1, arr);
                left.lb = lowerBound(
                        current.tv
                                - arr[level].value,
                        current.tw
                                + arr[level].weight,
                        level + 1,
                        arr);
                assign(left, left.ub, left.lb,
                        level + 1, true,
                        current.tv - arr[level].value,
                        current.tw
                                + arr[level].weight);
            }

            // If the left node cannot
            // be inserted
            else {

                // Stop the left node from
                // getting added to the
                // priority queue
                left.ub = left.lb = 1;
            }

            // Update minLB
            minLB = Math.min(minLB, left.lb);
            minLB = Math.min(minLB, right.lb);

            if (minLB >= left.ub)
                pq.add(new Node(left));
            if (minLB >= right.ub)
                pq.add(new Node(right));
        }
        List<Integer> bestItems = new ArrayList<>();
        System.out.println("Items taken"
                + "into the knapsack are");
        for (int i = 0; i < sizebnb; i++) {
            if (finalPath[i])
            {
                System.out.print("i");
                bestItems.add(i);
            }
        }
        System.out.println("\nMaximum profit"
                + " is " + (-finalLB));
        long endTime = System.nanoTime();
        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;
        // Prepare the result map to return.
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", (-finalLB));                  // Maximum possible value for given items and capacity.
        result.put("selectedItems", bestItems);            // List of selected items' indices.
        result.put("exeTime", (endTime - startTime));      // Time taken to compute the solution.
        result.put("memoryUsed", memoryUsedByAlgorithm);   // Memory used by the algorithm

        return result;
    }






}