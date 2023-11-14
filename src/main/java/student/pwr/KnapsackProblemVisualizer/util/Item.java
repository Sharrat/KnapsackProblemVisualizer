package student.pwr.KnapsackProblemVisualizer.util;

public class Item {

    // Stores the weight
    // of items
    public float weight;

    // Stores the values
    // of items
    public int value;

    // Stores the index
    // of items
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