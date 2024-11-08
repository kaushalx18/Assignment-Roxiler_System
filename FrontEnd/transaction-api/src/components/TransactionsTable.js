import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 10;

    useEffect(() => {
        fetchTransactions();
    }, [month, search, page]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
                params: { month, search, page, perPage },
            });
            setTransactions(response.data.transactions);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <div>
            <h2>Transactions</h2>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            <td>{transaction.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                <span> Page {page} of {Math.ceil(total / perPage)} </span>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;