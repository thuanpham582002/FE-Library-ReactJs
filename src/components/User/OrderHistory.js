import {useEffect, useState} from 'react';
import {deleteOrder, fetchBook, fetchOrders, fetchOrdersByUserId} from "../../services/apiService";
import AuthService from "../../services/auth.service";

import {Link} from 'react-router-dom';

export const BookSimpleDetail = ({book}) => {
    useEffect(() => {
        console.log(book)
    })
    return (<div className="card">
        <div className="card-body">
            <h5 className="card-title">{book.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
            <p className="card-text">{book.description}</p>
            <Link to={`/${book.id}`} className="btn btn-primary">View More</Link>
        </div>
    </div>);
};

export const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        const callApi = async () => {
            if (currentUser) {
                const response = await fetchOrdersByUserId(currentUser.id);
                const data = response.data;
                setOrders(data);
            } else {
                alert("Bạn phải đăng nhập để xem lịch sử đặt hàng của bạn!");
                window.location.href = "/login";
            }
        };
        callApi().then((r) => console.log("Orders fetched"));
    }, []);

    const cancelOrder = async (orderId) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn hủy đặt hàng này không?");
        if (confirmed) {
            // Gọi API để xóa order ở đây
            try {
                await deleteOrder(orderId);
                // Nếu xóa thành công, cập nhật lại danh sách orders
                const updatedOrders = orders.filter((order) => order.id !== orderId);
                setOrders(updatedOrders);
                alert("Hủy đặt hàng thành công!");
            } catch (error) {
                console.log(error)
                alert("Đã xảy ra lỗi khi hủy đặt hàng!");
            }
        }
    };

    return (<div className="container">
        <h1>Lịch sử đặt hàng</h1>
        <div className="row">
            {orders.length === 0 && <div className="col-md-12">
                <h3>Bạn chưa đặt hàng lần nào!</h3>
            </div>}
            {orders.map((order, index) => (<div className="col-md-4" key={index}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Đơn hàng #{order.id}</h5>
                        <h className="card-subtitle mb-2 text-muted">Số lượng: {order.quantity}</h>
                        <BookSimpleDetail book={order.book} key={index}/>
                        <button className="btn btn-danger" onClick={() => cancelOrder(order.id)}>
                            Hủy đặt hàng
                        </button>
                    </div>
                </div>
            </div>))}
        </div>
    </div>);
};
