import getToken from "./get-token";
import createAxiosInstance from "./axiosConfig";

const token = getToken()
const apiInstance = createAxiosInstance(token);

export async function fetchUsers() {
    return await apiInstance.get('/users/');
}

export async function getUserById(index) {
    return await apiInstance.get('/users/' + index);
}

export async function fetchBooks() {
    return await apiInstance.get('/books/');
}

export async function fetchBook(index) {
    return await apiInstance.get('/books/' + index);
}

export async function addBook(book) {
    return await apiInstance.post('/books/add', book);
}

export async function deleteBook(index) {
    return await apiInstance.delete('/books/' + index);
}

export async function updateBook(index, book) {
    return await apiInstance.post('/books/' + index, book);
}

export async function getOrdersByBookId(index) {
    return await apiInstance.get('/books/orders/' + index);
}

export async function fetchGenres() {
    return await apiInstance.get('/genres/');
}

export async function fetchAllReviews() {
    return await apiInstance.get('/reviews/');
}

export async function fetchReviewsByBookId(index) {
    return await apiInstance.get('/reviews/book/' + index);
}

export async function fetchReviewsByUserId(index) {
    return await apiInstance.get('/reviews/user/' + index);
}

export async function addReview(review) {
    return await apiInstance.post('/reviews/add', review);
}

export async function deleteReview(index) {
    return await apiInstance.delete('/reviews/' + index);
}

export async function updateReview(index, review) {
    return await apiInstance.post('/reviews/' + index, review);
}

export async function fetchOrders() {
    return await apiInstance.get('/orders/');
}

export async function fetchOrdersByUserId(index) {
    return await apiInstance.get('/orders/user/' + index);
}

export async function fetchOrdersByBookId(index) {
    return await apiInstance.get('/orders/book/' + index);
}

export async function addOrder(order) {
    return await apiInstance.post('/orders/add', order);
}

export async function deleteOrder(index) {
    return await apiInstance.delete('/orders/' + index);
}

export async function updateOrder(index, order) {
    return await apiInstance.post('/orders/' + index, order);
}