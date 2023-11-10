package student.pwr.KnapsackProblemVisualizer.controller;

import org.springframework.web.bind.annotation.*;
import student.pwr.KnapsackProblemVisualizer.Requests.KnapsackRequest;
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







}