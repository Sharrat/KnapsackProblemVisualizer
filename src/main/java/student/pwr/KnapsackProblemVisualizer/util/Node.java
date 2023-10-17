package student.pwr.KnapsackProblemVisualizer.util;

import java.util.ArrayList;
import java.util.List;

public class Node {

    int level;      // Level in the state-space tree
    int profit;     // Profit accumulated so far
    int weight;     // Weight accumulated so far
    int bound;      // Upper bound on profit
    List<Integer> itemsInKnapsack;  // Items in the knapsack for this node

    public Node() {
        this.itemsInKnapsack = new ArrayList<>();
    }

    public Node(Node other) {
        this.level = other.level;
        this.profit = other.profit;
        this.weight = other.weight;
        this.bound = other.bound;
        this.itemsInKnapsack = new ArrayList<>(other.itemsInKnapsack);
    }
}