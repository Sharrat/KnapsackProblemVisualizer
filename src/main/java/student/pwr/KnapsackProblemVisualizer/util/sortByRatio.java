package student.pwr.KnapsackProblemVisualizer.util;

import java.util.Comparator;

public class sortByRatio implements Comparator<Item> {
    public int compare(Item a, Item b)
    {
        boolean temp = (float)a.value
                / a.weight
                > (float)b.value
                / b.weight;
        return temp ? -1 : 1;
    }
}
