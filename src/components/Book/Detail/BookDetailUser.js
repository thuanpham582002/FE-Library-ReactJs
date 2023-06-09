import React, {useEffect, useState} from 'react';
import AuthService from "../../../services/auth.service";
import {
    addOrder, addReview, fetchBook, fetchGenres, getOrdersByBookId, getUserById, updateReview
} from "../../../services/apiService";
import {useParams} from "react-router-dom";

export const BookDetailUser = () => {
    const [quantity, setQuantity] = useState(1);
    const {id} = useParams();
    const currentUser = AuthService.getCurrentUser();
    const [book, setBook] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseBook = await fetchBook(id);
                setBook(responseBook.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData().then((r) => console.log(r));
    }, [id]);

    const handleQuantityChange = (e) => {
        // Hàm xử lý sự kiện thay đổi giá trị của input
        const inputQuantity = e.target.value; // Giá trị nhập vào
        const quantity = parseInt(inputQuantity); // Chuyển đổi giá trị thành số nguyên

        // Kiểm tra số âm và gán giá trị mới cho quantity (nếu không âm)
        if (quantity >= 0) {
            setQuantity(quantity); // Gán giá trị mới cho state quantity
        }

    };

    const handleBuy = () => {
        if (currentUser) {
            if (quantity <= 0) {
                alert('Số lượng phải lớn hơn 0');
                return;
            }
            const order = {
                book: {id: id}, quantity: quantity, user: {id: currentUser.id},
            };
            const callApi = async () => {
                try {
                    const response = await addOrder(order);
                    console.log(response);
                    alert('Đặt mua thành công');
                    const fetchData = async () => {
                        try {
                            const responseBook = await fetchBook(id);
                            setBook(responseBook.data);
                        } catch (error) {
                            console.log(error);
                        }
                    };

                    fetchData().then((r) => console.log(r));
                } catch (error) {
                    alert('Đặt mua thất bại');
                    console.error(error);
                }
            };
            callApi().then((r) => console.log(r));
        } else {
            alert('Bạn cần đăng nhập để đặt mua sách');
            window.location.href = '/login';
        }
    };


    const formatDate = (releaseDate) => {
        const dateObj = new Date(releaseDate);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    return (<div>
        {/* Hiển thị thông tin chi tiết sách */}
        <h2>{book.title}</h2>
        <p>Tác giả: {book.author}</p>
        <p>Mô tả: {book.description}</p>
        <p>Ngày phát hành: {formatDate(book.releaseDate)}</p>
        <p>Số trang: {book.numPages}</p>
        <p>Thể loại: {book.genreId}</p>
        <p>Đã bán: {book.sold}</p>
        {/* Sử dụng selectedImage để hiển thị hình ảnh sách (nếu có) */}
        {book.selectedImage && <img src={book.selectedImage} alt="Hình ảnh sách"/>}
        {/* Form đặt mua sách */}
        <h3>Đặt mua sách</h3>
        <label>Số lượng:</label>
        <input type="number" value={quantity} onChange={handleQuantityChange}/>
        <button onClick={handleBuy}>Đặt mua</button>
        {/* Lịch sử đơn hàng */}
        <h3>Lịch sử đơn hàng</h3>
        <OrderHistory id={id} book={book}/>
    </div>);
};


const OrderHistory = ({id, book}) => {
    const [orders, setOrders] = useState([]);
    const currentUser = AuthService.getCurrentUser();
    const currentUserId = currentUser ? currentUser.id : null;
    const currentUserName = currentUser ? currentUser.username : null;

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await getOrdersByBookId(id);
                const data = response.data;
                console.log(data)
                setOrders(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrderData().then(r => console.log(r));
    }, [id, book]);

    const handleAddReview = (orderId, rating, comment) => {
        const newOrders = orders.map((order) => {
            console.log(order);
            console.log(order.id, orderId, currentUserId);
            if (order.id === orderId && order.user.id === currentUserId) {
                const callApi = async () => {
                    try {
                        const review = {orderId, rating, comment}
                        console.log(order);
                        console.log(review);
                        const response = await addReview(orderId, review);
                        console.log(response);
                    } catch (error) {
                        console.error(error);
                    }
                }
                callApi().then(r => console.log(r))
                return {
                    ...order, review: {
                        rating: rating, comment: comment,
                    },
                };
            }
            return order;
        });
        setOrders(newOrders);
    };

    const handleUpdateReview = (orderId, rating, comment) => {
        const newOrders = orders.map((order) => {
            if (order.id === orderId && order.user.id === currentUserId) {
                const callApi = async () => {
                    try {
                        const review = {orderId, rating, comment}
                        console.log(order.review.id);
                        console.log(order);
                        const response = await updateReview(order.review.id, review);
                        console.log(response);
                    } catch (error) {
                        console.error(error);
                    }
                }
                callApi().then(r => console.log(r));

                return {
                    ...order, review: {
                        rating: rating, comment: comment,
                    },
                };
            }
            return order;
        });

        setOrders(newOrders);
    };

    return (<div>
        {orders.map((order) => (<OrderHistoryItem
            key={order.id}
            order={order}
            currentUser={currentUserName}
            handleAddReview={handleAddReview}
            handleUpdateReview={handleUpdateReview}
        />))}
    </div>);
};
const OrderHistoryItem = ({order, currentUser, handleAddReview, handleUpdateReview}) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const handleAddReviewItem = (orderId, rating, comment) => {
        handleAddReview(orderId, rating, comment);
        handleHideReviewForm();
    }

    const handleUpdateReviewItem = (orderId, rating, comment) => {
        handleUpdateReview(orderId, rating, comment);
        handleHideReviewForm();
    }
    const handleShowReviewForm = () => {
        setShowReviewForm(true);
    }

    const handleHideReviewForm = () => {
        setShowReviewForm(false);
    }

    return (<div key={order.id}>
            <p>Người mua: {order.user.username}</p>
            <p>Số lượng: {order.quantity}</p>
            {order.review ? (<>
                <p>Đánh giá: {order.review.rating}/5 sao</p>
                <p>Nhận xét: {order.review.comment ? order.review.comment : "Người dùng không có nhận xét nào"}</p>
                {order.user.username === currentUser ? (<>
                    {showReviewForm ? (<ReviewForm
                        defaultRating={order.review.rating}
                        defaultComment={order.review.review}
                        onSubmit={(rating, comment) => handleUpdateReviewItem(order.id, rating, comment)}
                        onCancel={handleHideReviewForm}
                    />) : (<button onClick={handleShowReviewForm}>Chỉnh sửa đánh giá</button>)}
                </>) : null}
            </>) : (<>
                {order.user.username === currentUser && showReviewForm ? (<ReviewForm
                    onSubmit={(rating, comment) => handleAddReviewItem(order.id, rating, comment)}
                    onCancel={handleHideReviewForm}
                />) : (order.user.username === currentUser && <button onClick={handleShowReviewForm}>Thêm đánh giá</button>)}
            </>)}
            <hr/>
        </div>);
}
const ReviewForm = ({defaultRating = 5, defaultComment = '', onSubmit, onCancel}) => {
    const [rating, setRating] = useState(defaultRating);
    const [comment, setComment] = useState(defaultComment);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(rating, comment);
    };

    return (<div>
        <StarRating rating={rating} onRatingChange={handleRatingChange}/>
        <textarea value={comment} onChange={handleCommentChange}></textarea>
        <button onClick={handleSubmit}>Đăng nhận xét</button>
        <button onClick={onCancel}>Hủy</button>
    </div>);
};

const StarRating = ({rating, onRatingChange}) => {
    const handleClick = (newRating) => {
        onRatingChange(newRating);
    };

    return (<div>
        <p>Đánh giá:</p>
        <div className="rating">
            <input
                type="radio"
                id="star5"
                name="rating"
                value="5"
                checked={rating === 5}
                onChange={() => handleClick(5)}
            />
            <label htmlFor="star5">5 sao</label>

            <input
                type="radio"
                id="star4"
                name="rating"
                value="4"
                checked={rating === 4}
                onChange={() => handleClick(4)}
            />
            <label htmlFor="star4">4 sao</label>

            <input
                type="radio"
                id="star3"
                name="rating"
                value="3"
                checked={rating === 3}
                onChange={() => handleClick(3)}
            />
            <label htmlFor="star3">3 sao</label>

            <input
                type="radio"
                id="star2"
                name="rating"
                value="2"
                checked={rating === 2}
                onChange={() => handleClick(2)}
            />
            <label htmlFor="star2">2 sao</label>

            <input
                type="radio"
                id="star1"
                name="rating"
                value="1"
                checked={rating === 1}
                onChange={() => handleClick(1)}
            />
            <label htmlFor="star1">1 sao</label>
        </div>
    </div>);
};
