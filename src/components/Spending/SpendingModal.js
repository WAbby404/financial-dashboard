import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import SpendingGraph from './SpendingGraph';
import SpendingAccordion from './SpendingAccordion';

function SpendingModal(props) {
    const [ user ] = useAuthState(auth);
    const [ allTransactions, setAllTransactions ] = useState([]);
    const [ formattedTransactions, setFormattedTransactions ] = useState([]);
    const [ currentCategory, setCurrentCategory ] = useState(null);

    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/transactions');
        onValue(dbRef, (snapshot) => {
            if(snapshot.val()){
              let filteredArray = Object.values(snapshot.val()).filter((transaction) => {
                if(transaction.category === 'Credit Card Payment' || transaction.category === 'Money In' || transaction.category === 'Transfer'){
                    return null;
                }
                return transaction;
            })
            setAllTransactions(filteredArray);
            formatTransactions(filteredArray);
            } 
            else if(!snapshot.val()){
                // need handling for none? maybe just set to default?
                setAllTransactions([]);
            }
        });
    }, []); // eslint-disable-line

    const formatTransactions = (filteredArray) => {
        filteredArray.forEach((transaction) => {
            transaction.value = parseFloat(transaction.value);
        })
    
        const unique = [...new Set(filteredArray.map(item => item.category))];
        const values = new Array(unique.length).fill(0);
    
        filteredArray.forEach((transaction) => {
            unique.forEach((category, index) => {
                if(transaction.category === category){
                    values[index] += transaction.value;
                }
            })
        });
    
        // need to change colors later when we change categories

        let formattedData = [];
        for(let i = 0; i < unique.length; i++){
            let obj = {name: unique[i] , value:values[i] };
            formattedData.push(obj);
            
        }
        setFormattedTransactions(formattedData);
    };

    const toSetCurrentCategory = (categoryIndex) => {
        setCurrentCategory(categoryIndex);
    };

    const categories = formattedTransactions.map((category) => {
        return category.name;
    });

    const transactionsTotal = () => {
        let total = 0;
        allTransactions.forEach((transaction) => {
            total += transaction.value;
        })

        let formattedMoney;
        if(total > 0){
            formattedMoney = total.toString().split('.');
        } else {
            formattedMoney = (total * -1).toString().split('.');
        }
    
        
        let newMoney = [];
        let stringArray = formattedMoney[0].split('');
        // console.log(stringArray);
        while(stringArray.length){
            newMoney.push(stringArray[0]);
            stringArray.shift();
            // console.log(stringArray);
            if(stringArray.length % 3 === 0 && stringArray.length !== 0){
                newMoney.push(',');
            }
        }
        newMoney.join('');
        if(!formattedMoney[1]){
            newMoney.push('.00');
        } else {
            newMoney.push('.' + formattedMoney[1]);
        }
        return newMoney.join('');
    }

    return (
        <section className="bg-slate-50 dark:bg-indigo-900 rounded-sm p-3 m-3 flex flex-col gap-2 order-4 sm:w-10/12 sm:m-auto md:w-9/12 xl:w-full xl:h-full xl:col-span-6 xl:row-span-8">
            <h2 className="text-indigo-900 dark:text-indigo-300 font-bold text-xl">Spending per category</h2>
            {allTransactions.length === 0 ? 
                    <h3 className="text-indigo-900 dark:text-indigo-300 text-center">Add transactions to see your spending chart</h3> 
            :
                <div className="flex flex-col xl:flex-row xl:w-full xl:h-full">
                    <div className="basis-1/2 xl:m-auto">
                        <h3 data-testid="spendingCategory" className="text-indigo-900 dark:text-indigo-300 text-lg h-8 text-center self-center pt-3">{categories[currentCategory]}</h3>
                        <SpendingGraph
                            formattedTransactions={formattedTransactions}
                            currentCategory={currentCategory}
                            toSetCurrentCategory={toSetCurrentCategory}
                        />
                    </div>
                    <div className="basis-1/2 max-h-full">
                        <div className="flex justify-between pb-2 items-center md:w-10/12 md:m-auto lg:w-11/12">
                            <h3 className="text-indigo-900 dark:text-indigo-300 text-xl">Categories</h3>
                            <h3 data-testid="spendingTotal" className="text-indigo-900 dark:text-indigo-300 font-medium text-xl text-right">{`$${transactionsTotal()} total`}</h3>
                        </div>
                        <div className='xl:overflow-y-auto xl:max-h-56 2xl:max-h-64 2xl:w-11/12 2xl:m-auto'>
                            <SpendingAccordion
                            theme={props.theme}
                            formattedTransactions={formattedTransactions}
                            allTransactions={allTransactions}
                            currentCategory={currentCategory}
                            toSetCurrentCategory={toSetCurrentCategory}
                            />
                        </div>
                    </div>


                </div>
                }

        </section>
    );
}

export default SpendingModal;