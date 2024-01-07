#include <iostream>
using namespace std;

class demo
{   
    int num;

    public:
        demo(int x)
        {
            num = x;
        }

        demo()
        {

        }

        void printData()
        {
            cout<<num<<endl;
        }

        demo operator --(int);
};

demo demo :: operator--(int)
{
    demo temp;
    temp.num = num--;
    return temp;
}

int main()
{
    demo d(20);
    cout<<"Value of d before: ";
    d.printData();
    demo d2 = d--;
    cout<<"Value of d just after post: ";
    d2.printData();
    cout<<"Value of d after: ";
    d.printData();
    return 0;
}