package student.pwr.KnapsackProblemVisualizer.util;

public class Item {

    public float weight;

    public int value;
    public int idx;
    public Item() {}
    public Item(int value, float weight,
                int idx)
    {
        this.value = value;
        this.weight = weight;
        this.idx = idx;
    }
}