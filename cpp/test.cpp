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

        friend demo operator ++(demo &);
};

demo operator++(demo &o)
{
    demo temp;
    temp.num = ++(o.num);
    return temp;
}

int main()
{
    demo d(20);
    cout<<"Value of d before: ";
    d.printData();
    cout<<"Value of d after: ";
    ++d;
    d.printData();
    return 0;
}