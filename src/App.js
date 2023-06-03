import logo from './logo.svg';
import './App.css';
import {BookDetailAdmin} from "./components/Book/Detail/BookDetailAdmin";
import {Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import {Book} from "./components/Book/Book";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile/Profile";
import OrderList from "./components/User/OrderList";
import {BookDetail} from "./components/Book/Detail/BookDetail";



function App() {
    return (<div>
        <Header></Header>
        <div className="container">
            <Routes>
                <Route path="/" element={<Book/>}></Route>
                <Route path="/home" element={<Book/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/orders" element={<OrderList/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/:id" element={<BookDetail/>}></Route>
            </Routes>
        </div>
        </div>);
}

export default App;
