package student.pwr.KnapsackProblemVisualizer.Requests;

public class AcoRequest extends KnapsackRequest {
    private int alpha;
    private int beta;
    private float evRate;
    private int maxIter;
    private int noAnts;

    public int getAlpha() {
        return alpha;
    }

    public void setAlpha(int alpha) {
        this.alpha = alpha;
    }

    public int getBeta() {
        return beta;
    }

    public void setBeta(int beta) {
        this.beta = beta;
    }

    public float getEvRate() {
        return evRate;
    }

    public void setEvRate(float evRate) {
        this.evRate = evRate;
    }

    public int getMaxIter() {
        return maxIter;
    }

    public void setMaxIter(int maxIter) {
        this.maxIter = maxIter;
    }

    public int getNoAnts() {
        return noAnts;
    }

    public void setNoAnts(int noAnts) {
        this.noAnts = noAnts;
    }
}
