import React, {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2'
import { collection, getDocs } from "firebase/firestore";
import { db } from '../server/firebase';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const Chart = ()=>{
    const [users, setUsers] = useState([])
    useEffect(()=>{
        const getUsers = async()=>{
            const usersRef = await getDocs(collection(db, 'users'))
            const allUsers = usersRef.docs.map(doc => doc.data());
            setUsers(allUsers)
        }
        getUsers()
    },[])

    // const items = [{itemName:'aaa', quantity:5},
    // {itemName:'aaron', quantity:10},
    // {itemName:'bbb', quantity:15},
    // {itemName:'ccc', quantity:20},
    // {itemName:'ddd', quantity:5}]
    return(
        <>
            <div className="chart-empty-space"></div>
            <h2 className="ranking">Players Star Ranking</h2>
            <div className="chart">
                <Bar
                    data={{

                        // labels:items.map(item=> item.itemName),
                        labels:users.map(user=> user.displayName),
                        datasets:[{
                            label: 'Players Star Ranking',
                            // data: items.map(item=>item.quantity),
                            data: users.map(user=> user.star),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(204, 244, 123, 0.2)',
                                'rgba(6, 0, 0, 0.2)',
                                'rgba(224, 0, 184, 0.2)',
                                'rgba(176, 102, 184, 0.2)',
                                'rgba(53, 191, 208, 0.2)',
                                'rgba(255, 118, 0, 0.2)',
                                'rgba(255, 118, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(204, 244, 123, 1)',
                                'rgba(6, 0, 0, 1)',
                                'rgba(224, 0, 184, 1)',
                                'rgba(176, 102, 184, 1)',
                                'rgba(53, 191, 208, 1)',
                                'rgba(255, 118, 0, 1)',
                                'rgba(255, 118, 255, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }}
                />
            </div>
        </>
    )
  }

  export default Chart