#include <bits/stdc++.h>
#include <sys/time.h>
using namespace std;

#define rep(i,n) for(long long i = 0; i < (long long)(n); i++)
#define repi(i,a,b) for(long long i = (long long)(a); i < (long long)(b); i++)
#define pb push_back
#define all(x) (x).begin(), (x).end()
#define fi first
#define se second
#define mt make_tuple
#define mp make_pair
template<class T1, class T2> bool chmin(T1 &a, T2 b) { return b < a && (a = b, true); }
template<class T1, class T2> bool chmax(T1 &a, T2 b) { return a < b && (a = b, true); }

using ll = long long; using vll = vector<ll>; using vvll = vector<vll>; using P = pair<ll, ll>;
using ld = long double;  using vld = vector<ld>; 
using vi = vector<int>; using vvi = vector<vi>; vll conv(vi& v) { vll r(v.size()); rep(i, v.size()) r[i] = v[i]; return r; }

inline void input(int &v){ v=0;char c=0;int p=1; while(c<'0' || c>'9'){if(c=='-')p=-1;c=getchar();} while(c>='0' && c<='9'){v=(v<<3)+(v<<1)+c-'0';c=getchar();} v*=p; } // これを使うならば、tieとかを消して！！
template <typename T, typename U> ostream &operator<<(ostream &o, const pair<T, U> &v) {  o << "(" << v.first << ", " << v.second << ")"; return o; }
template<size_t...> struct seq{}; template<size_t N, size_t... Is> struct gen_seq : gen_seq<N-1, N-1, Is...>{}; template<size_t... Is> struct gen_seq<0, Is...> : seq<Is...>{};
template<class Ch, class Tr, class Tuple, size_t... Is>
void print_tuple(basic_ostream<Ch,Tr>& os, Tuple const& t, seq<Is...>){ using s = int[]; (void)s{0, (void(os << (Is == 0? "" : ", ") << get<Is>(t)), 0)...}; }
template<class Ch, class Tr, class... Args> 
auto operator<<(basic_ostream<Ch, Tr>& os, tuple<Args...> const& t) -> basic_ostream<Ch, Tr>& { os << "("; print_tuple(os, t, gen_seq<sizeof...(Args)>()); return os << ")"; }
ostream &operator<<(ostream &o, const vvll &v) { rep(i, v.size()) { rep(j, v[i].size()) o << v[i][j] << " "; o << endl; } return o; }
template <typename T> ostream &operator<<(ostream &o, const vector<T> &v) { o << '['; rep(i, v.size()) o << v[i] << (i != v.size()-1 ? ", " : ""); o << "]";  return o; }
template <typename T> ostream &operator<<(ostream &o, const deque<T> &v) { o << '['; rep(i, v.size()) o << v[i] << (i != v.size()-1 ? ", " : ""); o << "]";  return o; }
template <typename T>  ostream &operator<<(ostream &o, const set<T> &m) { o << '['; for (auto it = m.begin(); it != m.end(); it++) o << *it << (next(it) != m.end() ? ", " : ""); o << "]";  return o; }
template <typename T>  ostream &operator<<(ostream &o, const unordered_set<T> &m) { o << '['; for (auto it = m.begin(); it != m.end(); it++) o << *it << (next(it) != m.end() ? ", " : ""); o << "]";  return o; }
template <typename T, typename U>  ostream &operator<<(ostream &o, const map<T, U> &m) { o << '['; for (auto it = m.begin(); it != m.end(); it++) o << *it << (next(it) != m.end() ? ", " : ""); o << "]";  return o; }
template <typename T, typename U, typename V>  ostream &operator<<(ostream &o, const unordered_map<T, U, V> &m) { o << '['; for (auto it = m.begin(); it != m.end(); it++) o << *it; o << "]";  return o; }
vector<int> range(const int x, const int y) { vector<int> v(y - x + 1); iota(v.begin(), v.end(), x); return v; }
template <typename T> istream& operator>>(istream& i, vector<T>& o) { rep(j, o.size()) i >> o[j]; return i;}
template <typename T, typename S, typename U> ostream &operator<<(ostream &o, const priority_queue<T, S, U> &v) { auto tmp = v; while (tmp.size()) { auto x = tmp.top(); tmp.pop(); o << x << " ";} return o; }
template <typename T> ostream &operator<<(ostream &o, const queue<T> &v) { auto tmp = v; while (tmp.size()) { auto x = tmp.front(); tmp.pop(); o << x << " ";} return o; }
template <typename T> ostream &operator<<(ostream &o, const stack<T> &v) { auto tmp = v; while (tmp.size()) { auto x = tmp.top(); tmp.pop(); o << x << " ";} return o; }
template <typename T> unordered_map<T, ll> counter(vector<T> vec){unordered_map<T, ll> ret; for (auto&& x : vec) ret[x]++; return ret;};
string substr(string s, P x) {return s.substr(x.fi, x.se - x.fi); }
void vizGraph(vvll& g, int mode = 0, string filename = "out.png") { ofstream ofs("./out.dot"); ofs << "digraph graph_name {" << endl; set<P> memo; rep(i, g.size())  rep(j, g[i].size()) { if (mode && (memo.count(P(i, g[i][j])) || memo.count(P(g[i][j], i)))) continue; memo.insert(P(i, g[i][j])); ofs << "    " << i << " -> " << g[i][j] << (mode ? " [arrowhead = none]" : "")<< endl;  } ofs << "}" << endl; ofs.close(); system(((string)"dot -T png out.dot >" + filename).c_str()); }
size_t random_seed; namespace std { using argument_type = P; template<> struct hash<argument_type> { size_t operator()(argument_type const& x) const { size_t seed = random_seed; seed ^= hash<ll>{}(x.fi); seed ^= (hash<ll>{}(x.se) << 1); return seed; } }; }; // hash for various class
struct timeval start; double sec() { struct timeval tv; gettimeofday(&tv, NULL); return (tv.tv_sec - start.tv_sec) + (tv.tv_usec - start.tv_usec) * 1e-6; }
struct init_{init_(){ ios::sync_with_stdio(false); cin.tie(0); gettimeofday(&start, NULL); struct timeval myTime; struct tm *time_st; gettimeofday(&myTime, NULL); time_st = localtime(&myTime.tv_sec); srand(myTime.tv_usec); random_seed = RAND_MAX / 2 + rand() / 2; }} init__;
#define ldout fixed << setprecision(40) 

#define EPS (double)1e-14
#define INF (ll)1e18
#define mo  (ll)(1e9+7)

vll args(100);
void init(int argc, char** argv) { repi(i, 1, argc) { args[i-1] = atoll(argv[i]); } }

// [i, j]のランダムな整数
ll rint(ll i, ll j) { if (i > j) return i; else return (ll)rand() % (j - i + 1) + i; }
// [i, j]のランダムな小数
ld rdouble(ld i, ld j) { return ((ld)rand() / RAND_MAX) * (j - i) + i; }
// ランダムな整数l, r in [i, j]の区間P(l, r)
// l == rを許容する
P rinterval(ll i, ll j) { ll a = rint(i, j), b = rint(i, j); if (a > b) swap(a, b); return P(a, b); }
// ランダムな整数l, r in [i, j]の区間P(l, r)
// l == rを許容しない
P rinterval_strict(ll i, ll j) { ll a = rint(i, j), b = rint(i, j); if (a == b) return rinterval_strict(i, j); else { swap(a, b); return P(a, b); } }
// ランダムな長さnのvll aであって、a_i in [x, y]なるものを出力
vll rvector(ll n, ll x, ll y) { vll a(n); rep(i, n) a[i] = rint(x, y); return a; }
// ランダムな長さnのvll aであって、a_i in [x, y]なる広義単調増加数列を出力
vll rvector_increasing(ll n, ll x, ll y) { auto ret = rvector(n, x, y); sort(all(ret)); return ret; }


string hiragana = "りんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらるれろわゐゑをがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょ";
string at(string& s, ll i) {
    assert(i < s.size() / 3);
    return s.substr(3*i, 3);
}
string back(string& s) {
    ll i = s.length() / 3;
    i--;
    return at(s, i);
}
ll size(string& s) {
    return s.size() / 3;
}
string random(string i, string j, ll len) {
    if (len == 1) return i;
    string ret = i;
    rep(i, len-2) {
        ret += at(hiragana, rint(0, size(hiragana)-1));
    }
    ret += j;
    return ret;
}

// build:
//     g++ -std=c++11 -o input input.cpp
// usage:
//     ./input n ret [random]

int main(int argc, char** argv)
{
    init(argc, argv);
    ll n = args[0];
    assert(1<=n&&n<=100000);
    ll ret = args[1];

    bool reachable = 1;
    if (ret == -1) {
        reachable = 0;
        ret = rint(1, size(hiragana));
    }

    if (argc == 4) {
        set<string> memo;
        while (memo.size() != n) {
            string tmp;
            ll len = rint(1, 10);
            ll id = 1; while (id == 1) id = rint(0, size(hiragana) - 1);
            tmp += at(hiragana, id);
            rep(_, len - 1) {
                tmp += at(hiragana, rint(0, size(hiragana) - 1));
            }
            memo.insert(tmp);
        }
        cout << n << endl;
        for (auto tmp : memo) 
            cout << tmp << endl;
        cerr << "辞書に" << n << "単語入っている場合に正答できる";
        return 0;
    }

    vll ids;
    repi(i, 2, size(hiragana)) {
        ids.pb(i);
    }
    random_shuffle(all(ids));
    vector<ll> order;
    order.pb(0);
    rep(i, ret-1) {
        order.pb(ids[i]);
    }
    order.pb(1);

    /*
    cout << order << endl;
    for (auto id : order) { cout << at(hiragana, id) << endl; } 
    cout << random("あ", "ほ", 10);
    */

    vector<string> dict;
    ll rem = n;
    set<string> used;

    if (!reachable) {
        ll except = rint(0, order.size() - 2);
        rep(i, order.size()-1) if (i != except) {
            string tmp = random(at(hiragana, order[i]), at(hiragana, order[i+1]), rint(2, 10));
            if (!used.count(tmp)) { used.insert(tmp); dict.pb(tmp); rem--; if (!rem) break; }
        }
        while (rem) {
            ll i = rint(0, order.size() - 2);
            if (i == except) continue;
            string tmp = random(at(hiragana, order[i]), at(hiragana, order[i+1]), rint(1, 10));
            if (!used.count(tmp)) { used.insert(tmp); dict.pb(tmp); rem--; if (!rem) break; }
        }
    } else {
        rep(i, order.size()-1) {
            string tmp = random(at(hiragana, order[i]), at(hiragana, order[i+1]), rint(2, 10));
            if (!used.count(tmp)) { used.insert(tmp); dict.pb(tmp); rem--; if (!rem) break; }
        }
        while (rem) {
            ll i = rint(0, order.size() - 2);
            string tmp = random(at(hiragana, order[i]), at(hiragana, order[i+1]), rint(1, 10));
            if (!used.count(tmp)) { used.insert(tmp); dict.pb(tmp); rem--; if (!rem) break; }
        }
    }

    cout << n << endl;
    for (auto x : dict) {
        cout << x << endl;
    }

    if (!reachable) {
        cerr << "辞書に" << n << "単語入っており、しりとりを終わらせることができない場合に正答できる";
    } else {
        cerr << "辞書に" << n << "単語入っており、" << ret << "回でしりとりを終わらせることができる場合に正答できる";
    }
    return 0;
}

