import axios from "axios";
import React, {useState, useEffect, Component} from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../../services/auth.service";
import {deleteBook, fetchBooks} from "../../services/apiService";

class BookHeader extends React.Component {
    render() {
        const {showAdminFeature} = this.props;
        if (showAdminFeature) {
            return (<tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Release Date</th>
                <th>Number of Pages</th>
                <th>Sold</th>
                <th>View</th>
                <th>Delete</th>
            </tr>);
        } else {
            return (<tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>View</th>
            </tr>);
        }
    }
}

class BookItem extends React.Component {
    formattedDate(releaseDate) {
        return new Date(releaseDate).toISOString().split("T")[0];
    }

    render() {
        const {book, showAdminFeature, handleDelete} = this.props;

        if (showAdminFeature) {
            return (<tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{this.formattedDate(book.releaseDate)}</td>
                <td>{book.numPages}</td>
                <td>{book.sold}</td>
                <td>
                    <button className="btn btn-info">
                        <Link to={`/${book.id}`} className="text-white">
                            View
                        </Link>
                    </button>
                </td>
                <td>
                    <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(book.id)}>
                        Delete
                    </button>
                </td>
            </tr>);
        } else {
            return (<tr key={book.id}>
                <td>
                    <img src={book.selectedImage} alt="Book Cover" style={{width: '200px', height: '300px'}}/>
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                    <button className="btn btn-info">
                        <Link to={`/${book.id}`} className="text-white">
                            View
                        </Link>
                    </button>
                </td>
            </tr>);
        }
    }
}

export const Book = () => {
    const [book, setBook] = useState([]);
    const [remain, setRemain] = useState([]);
    const [showAdminFeature, setShowAdminFeature] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setShowAdminFeature(user.roles.includes("admin"));
        }
        const fetchBook = async () => {
            try {
                const response = await fetchBooks();
                setBook(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBook().then(r => console.log(r));
    }, []);

    useEffect(() => {
        setRemain(book);
    }, [book]);

    const handleSearch = (e) => {
        const res = book.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()) || item.brand.toLowerCase().includes(e.target.value.toLowerCase()));
        setRemain(res);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này?");
        if (!confirmed) return;
        try {
            const callApi = async () => {
                await deleteBook(id);
                setBook(book.filter((item) => item.id !== id));
            }
            callApi().then(r => console.log(r));
            alert("Xóa thành công!")
        } catch (error) {
            console.log(error);
        }
    }

    const handleAdd = () => {
        navigate("/-1");
    };

    return (<div className="bg-light">
        <div className="container py-5">
            {showAdminFeature && <div className="add-btn text-center">
                <button className="btn btn-primary" onClick={handleAdd}>
                    Add Book
                </button>
            </div>}

            <table className="table table-hover">
                <thead className="table-dark">
                <BookHeader showAdminFeature={showAdminFeature}/>
                </thead>
                <tbody>
                {remain.map((book) => (<BookItem
                    key={book.id}
                    book={book}
                    showAdminFeature={showAdminFeature}
                    handleDelete={handleDelete}
                />))}
                </tbody>
            </table>
        </div>
    </div>);
};
