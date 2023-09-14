import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import AnalyticsGraph from './AnalyticsGraph';

function AnalyticsModal(props) {
    const [ user ] = useAuthState(auth);
    const [ transactions, setTransactions ] = useState([]);
    const [ income, setIncome ] = useState(0);
    const [ expenses, setExpenses ] = useState(0);
    const [ accountTotals, setAccountTotals ] = useState({debit: 0, savings: 0, creditCards: 0});
    const [ count, setCount ] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const dbRefTransactions = ref(db, user.uid);
        let accountsData;
        let transactionsData;
        onValue(dbRefTransactions, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                // console.log('childsnapshot');
                // console.log(childData);
                // console.log(Object.keys(childData));
                if(Object.keys(childData).includes('Checking')){
                    // console.log('accountsData set');
                    accountsData = childData;
                }
                if((Object.keys(childData).includes('Checking') !== true) && (Object.keys(childData).includes('initials') !== true)){
                    // console.log('transactionsData set');
                    // console.log(childData);
                    transactionsData = childData;
                }
            })
 
            setTransactions(transactionsData);
            setCount(count + 1);

            if(typeof transactionsData === 'object'){
                let transactionsTotal = 0;
                Object.values(transactionsData).forEach((transaction) => {
                    if(transaction.category === 'Money In'){
                        transactionsTotal += parseFloat(transaction.value);
                    }
                })
                setIncome(transactionsTotal);
    
                let expensesTotal = 0;
                Object.values(transactionsData).forEach((transaction) => {
                    // console.log(transaction);
                    if(transaction.category !== 'Money In' && transaction.category !== 'Transfer' && transaction.category !== 'Credit Card Payment'){
                        expensesTotal += parseFloat(transaction.value);
                    }
                })
                setExpenses(expensesTotal);
            }
    
            if(typeof accountsData === 'object'){
                let debitTotal = 0;
                let creditCardTotal = 0;
                Object.values(accountsData).forEach((transaction) => {
                    if(transaction.name === 'Savings'){
                        setAccountTotals({...accountTotals, savings: transaction.total});
                    } else if(transaction.name !== 'Savings' && transaction.debit) {
                        debitTotal += transaction.total;
                    } else if(!transaction.debit){
                        creditCardTotal += transaction.total;
                    }
                });
                setAccountTotals({...accountTotals, debit: debitTotal, creditCards: creditCardTotal});
            }
        });
        setCount(count + 1);
    }, []); // eslint-disable-line

    const formatMoney = (money) => {
        if(money){
            let formattedMoney = money.toString().split('.');
            let newMoney = [];
            if(formattedMoney[0].length > 3){
                let stringArray = formattedMoney[0].split('');
                // console.log(stringArray);
                while(stringArray.length){
                    newMoney.push(stringArray[0]);
                    stringArray.shift();
                    // console.log(stringArray);
                    if(stringArray.length % 3 === 0 && stringArray.length !== 0){
                        newMoney.push(',');
                    }
                    // console.log(newMoney);
                }
                // console.log(newMoney);
                newMoney.join('');
                // console.log(newMoney.join(''));
            }
            // console.log(newMoney.join('') + '.' + formattedMoney[1]);
            return (newMoney.join('') + '.' + formattedMoney[1]);
        }
        return '0.00';
    }


    return (
        <section className="bg-slate-50 dark:bg-indigo-900 rounded-sm p-3 m-3 flex flex-col gap-2 order-5 sm:w-10/12 sm:m-auto md:w-9/12 xl:w-full xl:h-full xl:col-span-12 xl:row-span-6">
            <div className="flex">
                <h2 className="text-indigo-900 dark:text-indigo-300 font-bold text-xl basis-7/12">Analytics</h2>
                {/* <div className='flex gap-5'> */}
                    <h2 className="text-indigo-900 dark:text-indigo-300 font-semibold text-lg hidden xl:inline">Trends</h2>
                    {/* <h3 className="text-indigo-900 dark:text-indigo-300 pl-5 text-base hidden xl:inline">Amount spent on days of the month</h3> */}
                {/* </div> */}

            </div>
            <div className="flex flex-col xl:flex-row xl:h-5/6 xl:px-5"> 
                <div className="flex flex-col pb-3 xl:flex-col xl:basis-2/3">
                    <section className="pb-3 xl:flex xl:w-11/12 xl:gap-[5%] xl:items-center">
                        <h4 className="text-indigo-900 dark:text-indigo-300">Cashflow</h4>
                        <div className="xl:flex xl:gap-10">
                            <div className="flex justify-center gap-3 items-center xl:gap-10">
                                <div className="flex flex-col justify-center items-center">
                                    <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">Income</h5>
                                    <div className={`${income > 0 ? 'text-green-600' : 'text-rose-600'} xl:text-2xl`}>${formatMoney(income)}</div>
                                </div>
                                <div className="text-indigo-900 dark:text-indigo-300 xl:text-4xl self-end">-</div>
                                <div className="flex flex-col justify-center items-center">
                                    <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">Expenses</h5>
                                    <div className={`${expenses > 0 ? 'text-rose-600' : 'text-green-600'} xl:text-2xl`}>${formatMoney(expenses)}</div>
                                </div>
                                <div className="text-indigo-900 dark:text-indigo-300 xl:text-4xl self-end">=</div>
                            </div>
                            <div className="w-4/6 h-0.5 bg-indigo-900 m-auto dark:bg-indigo-300m-auto sm:w-3/6 lg:w-2/6 xl:hidden"></div>
                            <div className="flex justify-center gap-3 items-center xl:gap-10">
                                <div className="flex flex-col justify-center items-center">
                                    <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">{income - expenses > 0 ? 'Pos. Cashflow' : 'Neg. Cashflow'}</h5>
                                    <div className={`${ income - expenses > 0 ? 'text-green-600' : 'text-rose-600' } xl:text-2xl`}>${(formatMoney(income - expenses))}</div>
                                </div>
                                <div className="text-indigo-900 dark:text-indigo-300 xl:text-2xl self-end">or</div>
                                <div>
                                    <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">{income - expenses > 0 ? '%Unspent' : '%Overspent'}</h5>
                                    <div className={`${ income - expenses > 0 ? 'text-green-600' : 'text-rose-600' } xl:text-2xl`}>%{(100 * ((income - expenses) / ( income === 0 ? 1 : income ))).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="hidden xl:block xl:w-11/12 xl:h-0.5 dark:bg-indigo-800 bg-indigo-200 m-auto"></div>
                    <section className="xl:flex xl:flex-row xl:w-11/12 xl:gap-[5%] xl:items-center">
                        <h4 className="text-indigo-900 dark:text-indigo-300">Net Worth</h4>
                        <div className="flex flex-col justify-center text-center items-center xl:flex-row xl:gap-10 ">
                            <div className='flex flex-col'>
                                <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">Debit Accs. Total</h5>
                                <div className={`${accountTotals.debit > 0 ? 'text-green-600' : 'text-rose-600'} xl:text-2xl`}>${formatMoney(accountTotals.debit)}</div>
                            </div>
                            <div className="text-indigo-900 dark:text-indigo-300">+</div>
                            <div>
                                <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">Savings</h5>
                                <div className={`${accountTotals.saving > 0 ? 'text-green-600' : 'text-rose-600'} xl:text-2xl`}>${formatMoney(accountTotals.savings)}</div>
                            </div>
                            <div className="text-indigo-900 dark:text-indigo-300 xl:text-2xl">-</div>
                            <div>
                                <h5 className="text-indigo-900 dark:text-indigo-300 text-lg">Credit Cards Total</h5>
                                <div className={`${accountTotals.creditCards > 0 ? 'text-rose-600' : 'text-green-600'} xl:text-2xl`}>${parseFloat(accountTotals.creditCards)}</div>
                            </div>
                            <div className="w-4/6 h-0.5 bg-indigo-900 dark:bg-indigo-300 m-auto sm:w-3/6 lg:w-2/6 xl:hidden"></div>
                            <div className="hidden text-indigo-900 dark:text-indigo-300 xl:block">
                                =
                            </div>
                            <div className="flex text-center m-auto gap-2 xl:flex-col-reverse">
                                <div className="text-green-600 xl:text-2xl">${formatMoney(accountTotals.debit + accountTotals.savings - accountTotals.creditCards)}</div>
                                <h5 className="text-indigo-900 dark:text-indigo-300">Total</h5>
                            </div>
                        </div>
                    </section>
                </div>
                <figure className="w-full h-full xl:basis-5/12 xl:max-h-full">
                    {/* {console.log(transactions)} */}

                    {/* need to fix this, maybe with default data??? */}
                    {(transactions && Object.keys(transactions).length > 0) ?
                        <AnalyticsGraph transactions={transactions}/>
                        :
                        <div className="text-indigo-300">Create Transactions to see your Spending Trends</div> 
                    }
                </figure>
            </div>
        </section>
    );
}

export default AnalyticsModal;