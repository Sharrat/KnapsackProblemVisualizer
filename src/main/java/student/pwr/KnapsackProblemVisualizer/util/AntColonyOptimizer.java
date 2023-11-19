package student.pwr.KnapsackProblemVisualizer.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class AntColonyOptimizer {
    private double[][] pheromoneLevels;
    private int[] values;
    private int[] weights;
    private double alpha;
    private double beta;
    private double evaporationRate;
    private double knapsackCapacity;
    private List<Integer> bestSolution;
    private double bestSolutionValue;

    public AntColonyOptimizer(int[] values, int[] weights, double alpha, double beta,
                              double evaporationRate, double knapsackCapacity) {
        this.values = values;
        this.weights = weights;
        this.alpha = alpha;
        this.beta = beta;
        this.evaporationRate = evaporationRate;
        this.knapsackCapacity = knapsackCapacity;
        this.pheromoneLevels = new double[values.length][values.length];
        this.bestSolution = new ArrayList<>();
        this.bestSolutionValue = 0;
    }

    private class Ant {
        public List<Integer> solution;
        public double solutionValue;

        public Ant() {
            this.solution = new ArrayList<>();
            this.solutionValue = 0;
        }

        // Construct a solution for one ant
        public void constructSolution() {
            this.solution.clear();
            double currentWeight = 0;
            while (currentWeight < knapsackCapacity) {
                int selectedItem = selectNextItem(this.solution, currentWeight);
                if (selectedItem == -1) break;
                this.solution.add(selectedItem);
                currentWeight += weights[selectedItem];
            }
            this.solutionValue = evaluateSolution(this.solution);
        }
    }

    public void initializePheromones() {
        for (int i = 0; i < pheromoneLevels.length; i++) {
            for (int j = 0; j < pheromoneLevels[i].length; j++) {
                pheromoneLevels[i][j] = 1.0; // initial pheromone level
            }
        }
    }

    public void optimize(int maxIterations, int numberOfAnts) {
        initializePheromones();

        for (int iteration = 0; iteration < maxIterations; iteration++) {
            List<Ant> ants = new ArrayList<>();
            for (int antIndex = 0; antIndex < numberOfAnts; antIndex++) {
                Ant ant = new Ant();
                ant.constructSolution();
                ants.add(ant);
                if (ant.solutionValue > bestSolutionValue) {
                    bestSolution = ant.solution;
                    bestSolutionValue = ant.solutionValue;
                }
            }
            double avgSolutionValue = calculateAverageSolutionValue(ants);
            updatePheromoneLevels(ants, bestSolutionValue, avgSolutionValue);
        }
    }

    private List<Integer> constructSolution() {
        List<Integer> solution = new ArrayList<>();
        double currentWeight = 0;

        while (currentWeight < knapsackCapacity) {
            int selectedItem = selectNextItem(solution, currentWeight);
            if (selectedItem == -1) break;

            solution.add(selectedItem);
            currentWeight += weights[selectedItem];
        }

        return solution;
    }

    private int selectNextItem(List<Integer> currentSolution, double currentWeight) {
        double[] probabilities = new double[values.length];
        double probabilitySum = 0;
        List<Integer> allowedItems = new ArrayList<>();

        // First, identify the set N of objects that can still be selected
        for (int i = 0; i < values.length; i++) {
            if (!currentSolution.contains(i) && (currentWeight + weights[i] <= knapsackCapacity)) {
                allowedItems.add(i);
            }
        }

        // Calculate the sum of probabilities for all items in set N
        for (int i : allowedItems) {
            double heuristic = values[i] / (weights[i] * knapsackCapacity); // This is the μ_j heuristic
            probabilities[i] = Math.pow(pheromoneLevels[i][i], alpha) * Math.pow(heuristic, beta);
            probabilitySum += probabilities[i];
        }

        // If no items can be added, return -1 indicating no selection is possible
        if (probabilitySum == 0) {
            return -1;
        }

        // Select the next item based on the computed probabilities
        double rand = new Random().nextDouble() * probabilitySum;
        double cumulativeProbability = 0.0;
        for (int i : allowedItems) {
            cumulativeProbability += probabilities[i];
            if (cumulativeProbability >= rand) {
                return i;
            }
        }

        return -1; // In case no selection occurs due to rounding errors
    }

    private double evaluateSolution(List<Integer> solution) {
        double value = 0;
        for (int item : solution) {
            value += values[item];
        }
        return value;
    }

    private void updatePheromoneLevels(List<Ant> ants, double bestSolutionValue, double avgSolutionValue) {
        // Evaporate pheromone on all trails
        for (int i = 0; i < pheromoneLevels.length; i++) {
            for (int j = 0; j < pheromoneLevels[i].length; j++) {
                pheromoneLevels[i][j] *= (1 - evaporationRate);
            }
        }

        // Deposit new pheromones based on the quality of solutions
        for (Ant ant : ants) {
            double deltaTau = calculateDeltaTau(ant.solutionValue, avgSolutionValue, bestSolutionValue);
            for (int item : ant.solution) {
                // Ensure that the pheromone is deposited on the trails associated with the solution
                pheromoneLevels[item][item] += deltaTau; // This assumes a simple pheromone model
            }
        }
    }
    private double calculateDeltaTau(double solutionValue, double avgSolutionValue, double bestSolutionValue) {
        return 1.0 / (1.0 + (avgSolutionValue - solutionValue) / bestSolutionValue);
    }
    private double calculateAverageSolutionValue(List<Ant> ants) {
        double sumSolutionValues = 0;
        for (Ant ant : ants) {
            sumSolutionValues += ant.solutionValue;
        }
        return sumSolutionValues / ants.size();
    }

    public List<Integer> getBestSolution() {
        return bestSolution;
    }
}