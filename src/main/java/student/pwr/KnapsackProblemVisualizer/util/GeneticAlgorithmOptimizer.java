package student.pwr.KnapsackProblemVisualizer.util;

import java.util.*;

public class GeneticAlgorithmOptimizer {
    private int numberOfItems;
    private int capacity;
    private int[] values;
    private int[] weights;
    private int populationSize;
    private int maxGenerations;
    private double crossoverRate;
    private double mutationRate;
    private Random random = new Random();

    public GeneticAlgorithmOptimizer(int numberOfItems, int capacity, int[] values, int[] weights, int populationSize,
                                     int maxGenerations, double crossoverRate, double mutationRate) {
        this.numberOfItems = numberOfItems;
        this.capacity = capacity;
        this.values = values;
        this.weights = weights;
        this.populationSize = populationSize;
        this.maxGenerations = maxGenerations;
        this.crossoverRate = crossoverRate;
        this.mutationRate = mutationRate;
    }

    public List<Integer> optimize() {
        // Initialize a population of random solutions.
        List<List<Integer>> population = new ArrayList<>();
        for (int i = 0; i < populationSize; i++) {
            population.add(generateRandomSolution());
        }

        for (int generation = 0; generation < maxGenerations; generation++) {
            // Evaluate the fitness of each solution in the population.
            List<Double> fitnessValues = evaluatePopulationFitness(population);

            // Select parents for the next generation using tournament selection.
            List<List<Integer>> parents = selectParents(population, fitnessValues);

            // Create the next generation through crossover and mutation.
            List<List<Integer>> offspring = generateOffspring(parents);

            // Replace the current population with the new generation.
            population = offspring;
        }

        // Find the best solution in the final population.
        List<Integer> bestSolution = findBestSolution(population);
        return bestSolution;
    }

    private List<Integer> generateRandomSolution() {
        List<Integer> solution = new ArrayList<>();
        int currentWeight = 0;

        for (int i = 0; i < numberOfItems; i++) {
            if (currentWeight + weights[i] <= capacity) {
                // If adding the item doesn't exceed the capacity, include it.
                solution.add(1);
                currentWeight += weights[i];
            } else {
                // Otherwise, exclude the item.
                solution.add(0);
            }
        }

        return solution;
    }

    private List<Double> evaluatePopulationFitness(List<List<Integer>> population) {
        List<Double> fitnessValues = new ArrayList<>();
        for (List<Integer> solution : population) {
            double fitness = evaluateSolution(solution);
            fitnessValues.add(fitness);
        }
        return fitnessValues;
    }

    private List<List<Integer>> selectParents(List<List<Integer>> population, List<Double> fitnessValues) {
        List<List<Integer>> parents = new ArrayList<>();
        int tournamentSize = 3; // Adjust as needed

        for (int i = 0; i < populationSize; i++) {
            List<Integer> selectedParent = null;
            double bestFitness = Double.NEGATIVE_INFINITY;

            for (int j = 0; j < tournamentSize; j++) {
                int randomIndex = random.nextInt(populationSize);
                List<Integer> candidateParent = population.get(randomIndex);
                double candidateFitness = fitnessValues.get(randomIndex);

                if (candidateFitness > bestFitness) {
                    bestFitness = candidateFitness;
                    selectedParent = candidateParent;
                }
            }

            parents.add(selectedParent);
        }

        return parents;
    }

    private List<List<Integer>> generateOffspring(List<List<Integer>> parents) {
        List<List<Integer>> offspring = new ArrayList<>();

        while (offspring.size() < populationSize) {
            List<Integer> parent1 = parents.get(random.nextInt(parents.size()));
            List<Integer> parent2 = parents.get(random.nextInt(parents.size()));

            if (random.nextDouble() < crossoverRate) {
                // Perform crossover to create two children.
                int crossoverPoint = random.nextInt(numberOfItems);
                List<Integer> child1 = new ArrayList<>(parent1.subList(0, crossoverPoint));
                child1.addAll(parent2.subList(crossoverPoint, numberOfItems));
                List<Integer> child2 = new ArrayList<>(parent2.subList(0, crossoverPoint));
                child2.addAll(parent1.subList(crossoverPoint, numberOfItems));

                // Mutate the children with a certain probability.
                mutate(child1);
                mutate(child2);

                // Check if the children exceed the capacity and adjust them if needed.
                enforceCapacityConstraint(child1);
                enforceCapacityConstraint(child2);

                offspring.add(child1);
                offspring.add(child2);
            }
        }

        return offspring;
    }

    private void enforceCapacityConstraint(List<Integer> solution) {
        int totalWeight = 0;

        for (int i = 0; i < numberOfItems; i++) {
            if (solution.get(i) == 1) {
                totalWeight += weights[i];
            }
        }

        while (totalWeight > capacity) {
            // Randomly select an item to remove until the capacity is satisfied.
            int indexToRemove = random.nextInt(numberOfItems);
            if (solution.get(indexToRemove) == 1) {
                solution.set(indexToRemove, 0);
                totalWeight -= weights[indexToRemove];
            }
        }
    }

    private void mutate(List<Integer> solution) {
        for (int i = 0; i < solution.size(); i++) {
            if (random.nextDouble() < mutationRate) {
                solution.set(i, 1 - solution.get(i)); // Flip 0 to 1 or 1 to 0
            }
        }
    }

    private double evaluateSolution(List<Integer> solution) {
        int totalValue = 0;
        int totalWeight = 0;

        for (int i = 0; i < numberOfItems; i++) {
            if (solution.get(i) == 1) {
                totalValue += values[i];
                totalWeight += weights[i];
            }
        }

        // Penalize solutions that exceed the capacity.
        if (totalWeight > capacity) {
            return 0.0;
        }

        return (double) totalValue;
    }

    private List<Integer> findBestSolution(List<List<Integer>> population) {
        List<Integer> bestSolution = null;
        double bestFitness = Double.NEGATIVE_INFINITY;

        for (List<Integer> solution : population) {
            double fitness = evaluateSolution(solution);
            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestSolution = solution;
            }
        }

        return bestSolution;
    }
}
