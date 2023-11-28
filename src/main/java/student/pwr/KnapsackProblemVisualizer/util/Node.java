package student.pwr.KnapsackProblemVisualizer.util;

import java.util.ArrayList;
import java.util.List;

public class Node {

    public float ub;


    public float lb;


    public int level;


    public boolean flag;

    public float tv;
    public float tw;
    public Node() {}
    public Node(Node cpy)
    {
        this.tv = cpy.tv;
        this.tw = cpy.tw;
        this.ub = cpy.ub;
        this.lb = cpy.lb;
        this.level = cpy.level;
        this.flag = cpy.flag;
    }
}