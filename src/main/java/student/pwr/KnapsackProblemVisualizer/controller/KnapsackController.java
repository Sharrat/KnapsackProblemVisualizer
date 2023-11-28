package student.pwr.KnapsackProblemVisualizer.controller;

import org.springframework.web.bind.annotation.*;
import student.pwr.KnapsackProblemVisualizer.Requests.AcoRequest;
import student.pwr.KnapsackProblemVisualizer.Requests.GenaRequest;
import student.pwr.KnapsackProblemVisualizer.Requests.KnapsackRequest;
import student.pwr.KnapsackProblemVisualizer.util.*;

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
        long startTime = System.nanoTime();

        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;

        int[][] dp = new int[n + 1][capacity + 1];
        List<Integer> selectedItems = new ArrayList<>();


        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0)

                    dp[i][w] = 0;
                else if (weights[i - 1] <= w)

                    dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
                else

                    dp[i][w] = dp[i - 1][w];
            }
        }


        int w = capacity;
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i - 1][w]) {

                selectedItems.add(i);
                w = w - weights[i - 1];
            }
        }
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

        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", dp[n][capacity]);
        result.put("selectedItems", selectedItems);
        result.put("exeTime", (endTime - startTime));
        result.put("memoryUsed",memoryUsedByAlgorithm);

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


        long startTime = System.nanoTime();


        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;


        double[][] items = new double[n][3];
        for (int i = 0; i < n; i++) {
            items[i][0] = values[i];
            items[i][1] = weights[i];
            items[i][2] = i;
        }
        java.util.Arrays.sort(items, (a, b) -> Double.compare(b[0] / b[1], a[0] / a[1]));


        int maxValue = 0;
        List<Integer> selectedItems = new ArrayList<>();


        for (double[] item : items) {
            int weight = (int) item[1];
            if (capacity >= weight) {
                capacity -= weight;
                maxValue += (int) item[0];
                selectedItems.add((int) item[2]+1);
            }
        }


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
        Collections.sort(selectedItems);
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", maxValue);
        result.put("selectedItems", selectedItems.reversed());
        result.put("exeTime", (endTime - startTime));
        result.put("memoryUsed", memoryUsedByAlgorithm);

        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/gena")
    public Map<String, Object> knapsack01GENA(@RequestBody GenaRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();


        long startTime = System.nanoTime();
        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();


        int numberOfItems = values.length;
        int populationSize = request.getPopSize();
        int maxGenerations = request.getMaxGen();
        double crossoverRate = request.getCrossRate();
        double mutationRate = request.getMutRate();


        GeneticAlgorithmOptimizer optimizer = new GeneticAlgorithmOptimizer(
                numberOfItems, capacity, values, weights, populationSize, maxGenerations, crossoverRate, mutationRate
        );

        List<Integer> bestSolution = optimizer.optimize();
        int totalValue = 0;
        for (int i = 0; i < bestSolution.size(); i++) {
            if (bestSolution.get(i) == 1) {
                totalValue += values[i];
            }
        }
        List<Integer> selectedItems = new ArrayList<>();
        for(int j=1;j<=bestSolution.size();j++)
        {
            if(bestSolution.get(j-1)==1)
            {
                selectedItems.add(j);
            }
        }
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
        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", totalValue);
        result.put("selectedItems", selectedItems.reversed());
        result.put("exeTime", (endTime - startTime));
        result.put("memoryUsed", memoryUsedByAlgorithm);
        return result;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/knapsack01/aco")
    public Map<String, Object> knapsack01ACO(@RequestBody AcoRequest request) {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.gc();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage beforeMemoryUse = memoryBean.getHeapMemoryUsage();
        long beforeUsedMemory = beforeMemoryUse.getUsed();


        long startTime = System.nanoTime();


        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();
        int n = values.length;

        AntColonyOptimizer aco1 = new AntColonyOptimizer(values, weights, request.getAlpha(), request.getBeta(), request.getEvRate(), capacity);
        aco1.optimize(request.getMaxIter(), request.getNoAnts());
        long endTime = System.nanoTime();
        List<Integer> selectedIndexes = aco1.getBestSolution();
        int maxValue=0;

        List<Integer> selectedItems = new ArrayList<>();
        for (int temp : selectedIndexes) {
            maxValue += values[temp];
            temp++;
            selectedItems.add(temp);
        }


        System.gc();
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        MemoryUsage afterMemoryUse = memoryBean.getHeapMemoryUsage();
        long afterUsedMemory = afterMemoryUse.getUsed();
        long memoryUsedByAlgorithm = afterUsedMemory - beforeUsedMemory;
        Collections.sort(selectedItems);

        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", maxValue);
        result.put("selectedItems",selectedItems.reversed());
        result.put("exeTime", (endTime - startTime));
        result.put("memoryUsed", memoryUsedByAlgorithm);

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


        long startTime = System.nanoTime();


        int[] values = request.getValues();
        int[] weights = request.getWeights();
        int capacity = request.getCapacity();


        int maxValue = 0;
        List<Integer> bestItems = new ArrayList<>();

        int n = values.length;
        for (int i = 0; i < (1 << n); i++) {
            int totalWeight = 0;
            int totalValue = 0;
            List<Integer> selectedItems = new ArrayList<>();

            for (int j = 0; j < n; j++) {
                if ((i & (1 << j)) > 0) {
                    totalWeight += weights[j];
                    totalValue += values[j];
                    selectedItems.add(j+1);
                }
            }


            if (totalWeight <= capacity && totalValue > maxValue) {
                maxValue = totalValue;
                bestItems = selectedItems;
            }
        }


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


        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", maxValue);
        result.put("selectedItems", bestItems.reversed());
        result.put("exeTime", (endTime - startTime));
        result.put("memoryUsed", memoryUsedByAlgorithm);

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

        Arrays.sort(arr, new sortByRatio());

        Node current, left, right;
        current = new Node();
        left = new Node();
        right = new Node();


        float minLB = 0, finalLB
                = Integer.MAX_VALUE;
        current.tv = current.tw = current.ub
                = current.lb = 0;
        current.level = 0;
        current.flag = false;


        PriorityQueue<Node> pq
                = new PriorityQueue<Node>(
                new sortByC());


        pq.add(current);

        boolean currPath[] = new boolean[sizebnb];
        boolean finalPath[] = new boolean[sizebnb];

        while (!pq.isEmpty()) {
            current = pq.poll();
            if (current.ub > minLB
                    || current.ub >= finalLB) {

                continue;
            }

            if (current.level != 0)
                currPath[current.level - 1]
                        = current.flag;

            if (current.level == sizebnb) {
                if (current.lb < finalLB) {

                    for (int i = 0; i < sizebnb; i++)
                        finalPath[arr[i].idx]
                                = currPath[i];
                    finalLB = current.lb;
                }
                continue;
            }

            int level = current.level;

            assign(right, upperBound(current.tv,
                            current.tw,
                            level + 1, arr),
                    lowerBound(current.tv, current.tw,
                            level + 1, arr),
                    level + 1, false,
                    current.tv, current.tw);

            if (current.tw + arr[current.level].weight
                    <= capacitybnb) {

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

            else {

                left.ub = left.lb = 1;
            }

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
                bestItems.add(i+1);
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

        Map<String, Object> result = new HashMap<>();
        result.put("maxValue", (-finalLB));
        result.put("selectedItems", bestItems.reversed());
        result.put("exeTime", (endTime - startTime));
        result.put("memoryUsed", memoryUsedByAlgorithm);

        return result;
    }






}