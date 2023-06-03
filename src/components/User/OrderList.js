import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleCancel = (orderId) => {
        // Thực hiện hủy đặt mua sách ở đây
    };

    return (
        <div>
            <h2>My Orders</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.book.title}</td>
                        <td>{order.book.author}</td>
                        <td>{order.quantity}</td>
                        <td>{order.price}</td>
                        <td>{order.status}</td>
                        <td>
                            {order.status === 'Pending' && (
                                <button className="btn btn-danger" onClick={() => handleCancel(order.id)}>Cancel</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderList;