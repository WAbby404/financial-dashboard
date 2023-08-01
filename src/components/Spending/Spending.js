import React, { useState, useEffect } from 'react';
import { VictoryPie } from 'victory';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';

function Spending(props) {

    const [ user ] = useAuthState(auth);

    const [ count, setCount ] = useState(0);


    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid);
        onValue(dbRef, (snapshot) => {
            let transactionArray = Object.values(snapshot.val().transactions);
            console.log(transactionArray);
            let filteredArray = transactionArray.filter((transaction) => {
                if(transaction.category === 'Credit Card Payment' || transaction.category === 'Profit'){
                    return null;
                }
                return transaction;
            })
            console.log(filteredArray);
            setCount(count + 1);
            // let structuredData;
            // structuredData is an array of objects
            // find transaction.category, set x as category, y as total, find all other transactions with that category, add its total to y
            // repeat for each other category


            // props.toSetAllSpendingValues(filteredArray);
        });
    }, []); // eslint-disable-line

    return (
        <div className="spending">
            Spending
            <VictoryPie 
            data={[
                { x: "Cats", y: 35 },
                { x: "Dogs", y: 40 },
                { x: "Birds", y: 55 }
              ]}
            categories={{ x: ["Dogs", "Cats", "Birds"] }}
            colorScale="heatmap"
            height={150}
            // padding={{top:10, bottom:10}}
            />
        </div>
    );
}

export default Spending;