import java.util.*;
import java.io.*;
public class solution{
    static class Node{
        int dis, v;
        Node(int v, int d){this.v=v;this.dis=d;}
    }
    public static void main(String[] args){
        try{
            Scanner sc = new Scanner(new File(args[0]));
            char[] hiragana = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょん".toCharArray();
            Set<Integer> iskana = new HashSet<>();
            for(char c: hiragana)iskana.add((int)c);
            int n = sc.nextInt();
            assert 1<=n&&n<=100000;
            int[] dis = new int[256*256];
            Arrays.fill(dis, Integer.MAX_VALUE/2);
            dis['り']=0;
            List<Integer>[] edges = new List[256*256];
            for(int i=0;i<256*256;++i)edges[i]=new ArrayList<>();
            for(int i=0;i<n;++i){
                char[] s = sc.next().toCharArray();
                assert 1<=s.length&&s.length<=10;
                for(char c: s)assert iskana.contains((int)c);
                edges[s[0]].add(s[s.length-1]+0);
            }
            PriorityQueue<Node> que = new PriorityQueue<>((a,b)->a.dis-b.dis);
            que.add(new Node('り', 0));
            while(!que.isEmpty()){
                Node node = que.poll();
                if(node.dis > dis[node.v])continue;
                if(node.v == 'ん'){
                    System.out.println(node.dis);return;
                }
                for(int u: edges[node.v])if(dis[u]>node.dis+1){
                    dis[u]=node.dis+1;que.add(new Node(u, dis[u]));
                }
            }
            System.out.println(-1);
        }catch(Exception e){}
    }
}