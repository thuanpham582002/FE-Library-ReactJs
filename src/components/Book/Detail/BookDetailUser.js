import React, {useEffect, useState} from 'react';
import AuthService from "../../../services/auth.service";
import {
    addOrder, addReview, fetchBook, fetchGenres, getOrdersByBookId, getUserById, updateOrder, updateReview
} from "../../../services/apiService";
import {useParams} from "react-router-dom";

export const ImagePreview = ({uploadedImages, isSmallSize}) => {
    return (<div className="image-preview">
        {uploadedImages && uploadedImages.map((image, index) => (image !== "" && <img
            key={index}
            src={image}
            alt={`Hình ảnh ${index + 1}`}
            className={isSmallSize === false ? "img-fluid" : ""}
            style={isSmallSize === true ? {width: "200px", height: "200px"} : {}}
        />))}
    </div>);
}

export const BookDetailUser = () => {
    const [quantity, setQuantity] = useState(1);
    const {id} = useParams();
    const currentUser = AuthService.getCurrentUser();
    const [book, setBook] = useState({genre: {}});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseBook = await fetchBook(id);
                setBook(responseBook.data);
                console.log('book' + responseBook.data.selectedImage.length);
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

    return (<div className="card">
        <div className="card-body">
            <div className="row">
                <div className="col-md-4">
                    {/* Hiển thị bìa sách */}
                    <ImagePreview uploadedImages={book.selectedImage} isSmallSize={true}/>
                </div>
                <div className="col-md-8">
                    {/* Hiển thị các thông tin sách */}
                    <h2 className="card-title">{book.title}</h2>
                    <p className="card-text">Tác giả: {book.author}</p>
                    <p className="card-text">Mô tả: {book.description === "" ? "Chưa cập nhật" : book.description}</p>
                    <p className="card-text">Ngày phát hành: {formatDate(book.releaseDate)}</p>
                    <p className="card-text">Số trang: {book.numPages === 0 ? "Chưa cập nhật" : book.numPages}</p>
                    <p className="card-text">Thể loại: {book.genre.name}</p>
                    <p className="card-text">Đã bán: {book.sold}</p>
                    {/* Form đặt mua sách */}
                    <h3>Đặt mua sách</h3>
                    <div className="form-group">
                        <label>Số lượng:</label>
                        <input type="number" value={quantity} onChange={handleQuantityChange} className="form-control"/>
                    </div>
                    <button onClick={handleBuy} className="btn btn-primary">Đặt mua</button>
                    {/* Lịch sử đơn hàng */}
                    <h3>Lịch sử đơn hàng</h3>
                    <OrderHistory id={id} book={book}/>
                </div>
            </div>
        </div>
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

    const handleAddReview = (orderId, rating, comment, images) => {
        const newOrders = orders.map((order) => {
            console.log(order);
            console.log(order.id, orderId, currentUserId);
            if (order.id === orderId && order.user.id === currentUserId) {
                const callApi = async () => {
                    try {
                        const review = {orderId, rating, comment, images}
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
                        rating: rating, comment: comment, images: images
                    },
                };
            }
            return order;
        });
        setOrders(newOrders);
    };

    const handleUpdateReview = (orderId, rating, comment, images) => {
        const newOrders = orders.map((order) => {
            if (order.id === orderId && order.user.id === currentUserId) {
                const callApi = async () => {
                    try {
                        console.log(order);

                        const response = await updateOrder({
                            ...order, review: {
                                rating: rating, comment: comment, images: images,
                            }
                        });
                        console.log(response);
                    } catch (error) {
                        console.error(error);
                    }
                }
                callApi().then(r => console.log(r));

                return {
                    ...order, review: {
                        rating: rating, comment: comment, images: images
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

    useEffect(() => {
        console.log(order);
    })
    const handleAddReviewItem = (orderId, rating, comment, images) => {
        handleAddReview(orderId, rating, comment, images);
        handleHideReviewForm();
    }

    const handleUpdateReviewItem = (orderId, rating, comment, images) => {
        handleUpdateReview(orderId, rating, comment, images);
        handleHideReviewForm();
    }
    const handleShowReviewForm = () => {
        setShowReviewForm(true);
    }

    const handleHideReviewForm = () => {
        setShowReviewForm(false);
    }

    return (<div key={order.id} className="order-item">
        <p>Người mua: {order.user.username}</p>
        <p>Số lượng: {order.quantity}</p>
        {order.review ? (<>
            <p>Đánh giá: {order.review.rating}/5 sao</p>
            <p>Nhận xét: {order.review.comment ? order.review.comment : "Người dùng không có nhận xét nào"}</p>
            <ImagePreview uploadedImages={order.review.images} isSmallSize={true}/>
            {order.user.username === currentUser ? (<>
                {showReviewForm ? (<ReviewForm
                    defaultRating={order.review.rating}
                    defaultComment={order.review.comment}
                    onSubmit={(rating, comment, images) => handleUpdateReviewItem(order.id, rating, comment, images)}
                    onCancel={handleHideReviewForm}
                />) : (<button onClick={handleShowReviewForm} className="btn btn-primary">Chỉnh sửa đánh
                    giá</button>)}
            </>) : null}
        </>) : (<>
            {order.user.username === currentUser ? showReviewForm ? (<ReviewForm
                    onSubmit={(rating, comment, images) => handleAddReviewItem(order.id, rating, comment, images)}
                    onCancel={handleHideReviewForm}
                />) : (order.user.username === currentUser &&
                    <button onClick={handleShowReviewForm} className="btn btn-primary">Thêm đánh giá</button>) :
                <p>Người dùng chưa đánh giá</p>}
        </>)}
        <hr/>
    </div>);
}
const ReviewForm = ({defaultRating = 5, defaultComment = '', onSubmit, onCancel}) => {
    const [rating, setRating] = useState(defaultRating);
    const [comment, setComment] = useState(defaultComment);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(rating, comment, uploadedImages);
    };

    return (<div>
        <div className="form-group">
            <StarRating rating={rating} onRatingChange={handleRatingChange}
                        onImageUpload={(images) => setUploadedImages(images)}/>
        </div>
        <div className="form-group">
            <ImageUpload onImageUpload={(images) => setUploadedImages(images)}/>
        </div>
        <div className="form-group">
            <label>Nhận xét:</label>
            <textarea value={comment} onChange={handleCommentChange} className="form-control"/>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary">Đăng nhận xét</button>
        <button onClick={onCancel} className="btn btn-secondary">Hủy</button>
    </div>);
};

const ImageUpload = ({onImageUpload}) => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const handleImageUpload = (images) => {
        setUploadedImages(images);
    };

    const handleImageUploadChange = (event) => {
        const files = event.target.files;
        const _updatedImages = [];

        // Kiểm tra số lượng tệp đã chọn và giới hạn là 5 tệp
        if (files.length > 5) {
            alert("Bạn chỉ có thể chọn tối đa 5 ảnh.");
            event.target.value = null; // Đặt giá trị của input file về null để xóa các tệp đã chọn
            return;
        }

        // Lặp qua từng tệp được chọn
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            // Đọc tệp và chuyển đổi thành base64
            reader.onload = () => {
                const base64Image = reader.result;
                _updatedImages.push(base64Image);

                // Kiểm tra nếu đã chọn đủ số lượng tệp tối đa
                if (_updatedImages.length === files.length) {
                    handleImageUpload(_updatedImages);
                    onImageUpload(_updatedImages);
                }
            };

            // Đọc tệp dưới dạng base64
            reader.readAsDataURL(file);
        }

    };
    return (<div>
        <div className="form-group">
            <label htmlFor="images">Hình ảnh:</label>
            <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUploadChange}
                className="form-control"
            />
        </div>

        <ImagePreview uploadedImages={uploadedImages} isSmallSize={true}/>

    </div>)
}
const StarRating = ({rating, onRatingChange, onImageUpload}) => {
    const handleRatingChange = (newRating) => {
        onRatingChange(newRating);
    };


    return (<div>
        <label>Đánh giá:</label>
        <div className="rating">
            <input
                type="radio"
                id="star5"
                name="rating"
                value="5"
                checked={rating === 5}
                onChange={() => handleRatingChange(5)}
            />
            <label htmlFor="star5">5 sao</label>

            <input
                type="radio"
                id="star4"
                name="rating"
                value="4"
                checked={rating === 4}
                onChange={() => handleRatingChange(4)}
            />
            <label htmlFor="star4">4 sao</label>

            <input
                type="radio"
                id="star3"
                name="rating"
                value="3"
                checked={rating === 3}
                onChange={() => handleRatingChange(3)}
            />
            <label htmlFor="star3">3 sao</label>

            <input
                type="radio"
                id="star2"
                name="rating"
                value="2"
                checked={rating === 2}
                onChange={() => handleRatingChange(2)}
            />
            <label htmlFor="star2">2 sao</label>

            <input
                type="radio"
                id="star1"
                name="rating"
                value="1"
                checked={rating === 1}
                onChange={() => handleRatingChange(1)}
            />
            <label htmlFor="star1">1 sao</label>
        </div>

    </div>);
};
