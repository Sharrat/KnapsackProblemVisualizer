package student.pwr.KnapsackProblemVisualizer.util;

import java.util.Comparator;

public class sortByC implements Comparator<Node> {
    public int compare(Node a, Node b)
    {
        boolean temp = a.lb > b.lb;
        return temp ? 1 : -1;
    }
}
