import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import AnalyticsGraph from './AnalyticsGraph';

function AnalyticsModal(props) {
    const [ user ] = useAuthState(auth);
    const [ transactions, setTransactions ] = useState([]);
    const [ accounts, setAccounts ] = useState([]);
    const [ income, setIncome ] = useState(0);
    const [ expenses, setExpenses ] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const dbRefTransactions = ref(db, user.uid);
        let accountsData;
        let transactionsData;
        // console.log(user.uid);
        onValue(dbRefTransactions, (snapshot) => {
            // console.log(snapshot.val());
            accountsData = snapshot.val().accounts;
            transactionsData = snapshot.val().transactions;
            // console.log(accountsData);
            // console.log(transactionsData);

            setTransactions(transactionsData);
            setAccounts(accountsData);

        });

        let total = 0;
        if(typeof transactions === 'object'){
            Object.values(transactions).forEach((transaction) => {
                // console.log(transaction);
                if(transaction.category === 'Money In'){
                    total += parseFloat(transaction.value);
                }
            })

            setIncome(total);
            expensesTotal(transactions);
        }
    }, []);


    // move these 2 to useeffect & condense
    const expensesTotal = (allTransactions) => {
        // console.log(allTransactions);
        if(allTransactions){
            let total = 0;
            Object.values(allTransactions).forEach((transaction) => {
                if(transaction.category !== 'Money In' && transaction.category !== 'Transfer' && transaction.category !== 'Credit Card Payment'){
                    total += parseFloat(transaction.value);
                }
            })
            setExpenses(total);
        }
    };

    return (
        <section className="bg-indigo-900 rounded-sm p-3 m-3 flex flex-col gap-2 order-5 sm:w-10/12 sm:m-auto md:w-9/12 xl:w-full xl:h-full xl:col-span-12 xl:row-span-6">
            <div className="flex">
                <h2 className="text-indigo-300 font-bold text-xl basis-7/12">Analytics</h2>
                <h2 className="text-indigo-300 font-semibold text-lg hidden xl:block">Trends</h2>
            </div>
            <div className="flex flex-col xl:flex-row xl:h-5/6 xl:px-5"> 
                <div className="flex flex-col pb-3 xl:flex-col xl:basis-2/3">
                    <section className="pb-3 xl:flex xl:w-11/12 xl:gap-[5%] xl:items-center">
                        <h4 className="text-indigo-300">Cashflow</h4>
                        <div className="xl:flex xl:gap-10">
                            <div className="flex justify-center gap-3 items-center xl:gap-10">
                                <div className="flex flex-col justify-center items-center">
                                    <h5 className="text-indigo-300 text-lg">Income</h5>
                                    <div className="text-green-600 xl:text-2xl">${income}</div>
                                </div>
                                <div className="text-indigo-300 xl:text-4xl self-end">-</div>
                                <div className="flex flex-col justify-center items-center">
                                    <h5 className="text-indigo-300 text-lg">Expenses</h5>
                                    <div className="text-rose-600 xl:text-2xl">${expenses}</div>
                                </div>
                                <div className="text-indigo-300 xl:text-4xl self-end">=</div>
                            </div>
                            <div className="w-4/6 h-0.5 bg-indigo-300 m-auto sm:w-3/6 lg:w-2/6 xl:hidden"></div>
                            <div className="flex justify-center gap-3 items-center xl:gap-10">
                                <div className="flex flex-col justify-center items-center">
                                    <h5 className="text-indigo-300 text-lg">{income - expenses > 0 ? 'Pos. Cashflow' : 'Neg. Cashflow'}</h5>
                                    <div className={`${ income - expenses > 0 ? 'text-green-600' : 'text-rose-600' } xl:text-2xl`}>${income - expenses}</div>
                                </div>
                                <div className="text-indigo-300 xl:text-2xl self-end">or</div>
                                <div>
                                    <h5 className="text-indigo-300 text-lg">{income - expenses > 0 ? '%Unspent' : '%Overspent'}</h5>
                                    <div className={`${ income - expenses > 0 ? 'text-green-600' : 'text-rose-600' } xl:text-2xl`}>%{(100 * ((income - expenses) / ( income === 0 ? 1 : income ))).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="hidden xl:block xl:w-11/12 xl:h-0.5 bg-indigo-300 m-auto"></div>
                    <section className="xl:flex xl:flex-row xl:w-11/12 xl:gap-[5%] xl:items-center">
                        <h4 className="text-indigo-300">Net Worth</h4>
                        <div className="flex flex-col justify-center text-center items-center xl:flex-row xl:gap-10 ">
                            <div className='flex flex-col'>
                                <h5 className="text-indigo-300 text-lg">Debit Accs. Total</h5>
                                <div className="text-green-600 xl:text-2xl">$947.00</div>
                            </div>
                            <div className="text-indigo-300">+</div>
                            <div>
                                <h5 className="text-indigo-300 text-lg">Savings</h5>
                                <div className="text-green-600 xl:text-2xl">$3037.22</div>
                            </div>
                            <div className="text-indigo-300 xl:text-2xl">-</div>
                            <div>
                                <h5 className="text-indigo-300 text-lg">Credit Cards Total</h5>
                                <div className="text-rose-600 xl:text-2xl">$7,099.77</div>
                            </div>
                            <div className="w-4/6 h-0.5 bg-indigo-300 m-auto sm:w-3/6 lg:w-2/6 xl:hidden"></div>
                            <div className="hidden text-indigo-300 xl:block">
                                =
                            </div>
                            <div className="flex text-center m-auto gap-2 xl:flex-col-reverse">
                                <div className="text-green-600 xl:text-2xl">$30,500.27</div>
                                <h5 className="text-indigo-300">Total</h5>
                            </div>
                        </div>
                    </section>
                </div>
                <figure className="w-full h-full xl:basis-5/12 xl:max-h-full">
                    {/* {console.log(transactions)} */}

                    {/* need to fix this, maybe with default data??? */}
                    {/* {(transactions && Object.keys(transactions).length > 0) ?
                        <AnalyticsGraph transactions={transactions}/>
                        :
                        <div className="text-indigo-300">Create Transactions to see your Spending Trends</div> 
                    } */}
                </figure>
            </div>
        </section>
    );
}

export default AnalyticsModal;