package student.pwr.KnapsackProblemVisualizer.Requests;

public class GenaRequest extends KnapsackRequest {
    private int popSize;
    private int maxGen;
    private float crossRate;
    private float mutRate;

    public int getPopSize() {
        return popSize;
    }

    public void setPopSize(int popSize) {
        this.popSize = popSize;
    }

    public int getMaxGen() {
        return maxGen;
    }

    public void setMaxGen(int maxGen) {
        this.maxGen = maxGen;
    }

    public float getCrossRate() {
        return crossRate;
    }

    public void setCrossRate(float crossRate) {
        this.crossRate = crossRate;
    }

    public float getMutRate() {
        return mutRate;
    }

    public void setMutRate(float mutRate) {
        this.mutRate = mutRate;
    }
}
