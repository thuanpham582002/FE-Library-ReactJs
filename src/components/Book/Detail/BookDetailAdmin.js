import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {addBook, fetchBook, fetchGenres, updateBook} from "../../../services/apiService";
import "./BookDetail.css";
import {ImagePreview} from "./BookDetailUser";

class GenreItem extends React.Component {
    render() {
        const {genre} = this.props;
        console.log({genre});  // {... }

        return (<option value={JSON.stringify(genre)}>{genre.name}</option>);
    }
}

const footerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(to left, yellow, red)",
    margin: "auto",
    height: "70px",
}

class Footer extends React.Component {
    render() {
        return (<div className="container">
            <div className="row justify-content-end" style={footerStyle}>
                <h2 className="col-6">Đây là footer</h2>
                {this.props.isAddMode && (
                    <button className="btn btn-primary col-1" onClick={() => this.props.handleSave()}>
                        Add
                    </button>)}
                {this.props.isViewMode && (
                    <button className="btn btn-primary col-1" onClick={() => this.props.handleEdit()}>
                        Edit
                    </button>)}
                {this.props.isEditMode && (
                    <button className="btn btn-primary col-1" onClick={() => this.props.handleUpdate()}>
                        Save
                    </button>)}
            </div>
        </div>);
    }
}

export const BookDetailAdmin = () => {
    const {id} = useParams();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [numPages, setNumPages] = useState("");
    const [genre, setGenre] = useState({});
    const [selectedImage, setSelectedImage] = useState([]);
    const [genres, setGenres] = useState([]);
    const [sold, setSold] = useState("");
    const [isAddMode, setIsAddMode] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [titleError, setTitleError] = useState("");
    const [authorError, setAuthorError] = useState("");
    const [releaseDateError, setReleaseDateError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        console.log(id);
        setIsAddMode(id === "-1");
        setIsViewMode(id !== "-1");
        if (id !== "-1") {
            const fetchData = async () => {
                try {
                    const responseBook = await fetchBook(id);
                    const {
                        title, author, description, releaseDate, numPages, genre, selectedImage, sold
                    } = responseBook.data;
                    setTitle(title);
                    setAuthor(author);
                    setDescription(description);
                    const formattedDate = new Date(releaseDate).toISOString().split("T")[0];
                    setReleaseDate(formattedDate);
                    setNumPages(numPages);
                    setGenre(genre);
                    setSelectedImage(selectedImage);
                    setSold(sold)
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData().then(r => console.log(r));
        }
        const fetchData = async () => {
            try {
                const responseGenres = await fetchGenres();
                setGenres(responseGenres.data);
                if (id === "-1") {
                    console.log(responseGenres.data[0]);
                    setGenre(responseGenres.data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData().then(r => console.log(r));
    }, []);


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleAuthorChange = (e) => {
        setAuthor(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleReleaseDateChange = (e) => {
        setReleaseDate(e.target.value);
    };

    const handlePageCountChange = (e) => {
        // Hàm xử lý sự kiện thay đổi giá trị của input
        const inputNumPages = e.target.value;
        const numPages = parseInt(inputNumPages);

        if (numPages >= 0) {
            setNumPages(e.target.value);

        }
    };

    const handleGenreChange = (e) => {
        const selectedGenre = JSON.parse(e.target.value);
        console.log(selectedGenre);
        setGenre(selectedGenre);
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
                    setSelectedImage(_updatedImages);
                }
            };

            // Đọc tệp dưới dạng base64
            reader.readAsDataURL(file);
        }

    };

    const handleValidate = () => {
        let isValid = true;
        if (title === "") {
            setTitleError("Title is required");
            isValid = false;
        } else {
            setTitleError("");
        }
        if (author === "") {
            setAuthorError("Author is required");
            isValid = false;
        } else {
            setAuthorError("");
        }
        if (releaseDate === "") {
            setReleaseDateError("Release date is required");
            isValid = false;
        } else {
            setReleaseDateError("");
        }
        return isValid;
    }

    const handleAdd = (e) => {
        const validate = handleValidate();
        if (!validate) {
            return;
        }
        const book = {
            title, author, description, releaseDate, numPages, genre, selectedImage
        };
        const confirmed = window.confirm("Bạn có chắc chắn muốn thêm sách này?");
        if (!confirmed) {
            return;
        }

        const postBook = async () => {
            try {
                await addBook(book);
                navigate("/");
            } catch (error) {
                const resTitle = (error.response && error.response.data && error.response.data.errorCode) || error.errorCode || error.toString();
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.errorCode || error.toString();
                if (resTitle === "TITLE_EXISTED") {
                    setTitleError(resMessage);
                } else if (resTitle === "AUTHOR_EXISTED") {
                    setAuthorError(resMessage);
                }
            }
        }

        postBook().then(r => console.log(r));
    };

    const handleUpdate = () => {
        const validate = handleValidate();
        if (!validate) {
            return;
        }
        const book = {
            title, author, description, releaseDate, numPages, genre, selectedImage, sold
        };
        console.log(book);
        const callApi = async () => {
            try {
                await updateBook(id, book);
                navigate("/");
            } catch (error) {
                const resTitle = (error.response && error.response.data && error.response.data.errorCode) || error.errorCode || error.toString();
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.errorCode || error.toString();
                if (resTitle === "TITLE_EXISTED") {
                    setTitleError(resMessage);
                } else if (resTitle === "AUTHOR_EXISTED") {
                    setAuthorError(resMessage);
                }
            }
        }

        callApi().then(r => console.log(r));
    }

    return (<div className="row">
        <div className="col-md-6">
            <div className="row">
                <div className="col-md-6 form-group">
                    <label className="required-label">Tiêu đề:</label>
                    <input type="text" value={title} onChange={handleTitleChange} className="form-control"
                           disabled={isViewMode}/>
                    {titleError && <div className="alert alert-danger">{titleError}</div>}
                </div>
                <div className="col-md-6 form-group">
                    <label className="required-label">Tác giả:</label>
                    <input type="text" value={author} onChange={handleAuthorChange} className="form-control"
                           disabled={isViewMode}/>
                    {authorError && <div className="alert alert-danger">{authorError}</div>}
                </div>
            </div>
            <div className="form-group">
                <label>Mô tả sách:</label>
                <textarea value={description} onChange={handleDescriptionChange} className="form-control"
                          disabled={isViewMode}/>
            </div>
            <div className="row">
                <div className="col-md-6 form-group">
                    <label className="required-label">Ngày phát hành:</label>
                    <input
                        type="date"
                        value={releaseDate}
                        onChange={handleReleaseDateChange}
                        className="form-control"
                        disabled={isViewMode}/>
                    {releaseDateError && <div className="alert alert-danger">{releaseDateError}</div>}
                </div>
                <div className="col-md-6 form-group">
                    <label>Số trang:</label>
                    <input
                        type="number"
                        value={numPages}
                        onChange={handlePageCountChange}
                        className="form-control"
                        disabled={isViewMode}/>
                </div>
            </div>
            <div className="form-group">
                <label>Thể loại:</label>
                <span className="caret"></span>
                <select value={JSON.stringify(genre)} onChange={handleGenreChange} className="caret"
                        disabled={isViewMode}>
                    {genres.map(genre => <GenreItem genre={genre}/>)}
                </select>
            </div>
        </div>
        <div className="col-md-6">
            <div className="form-group text-center">
                <input type="file" accept="image/*" multiple onChange={handleImageUploadChange} className="form-control"
                       disabled={isViewMode}
                       style={{display: 'none'}} id="file-upload-input"/>
                <button onClick={() => document.getElementById('file-upload-input').click()}
                        className="btn btn-primary">Upload
                </button>
            </div>

            {selectedImage && (<ImagePreview uploadedImages={selectedImage} isSmallSize={false}/>)}
        </div>
        <Footer isAddMode={isAddMode} isViewMode={isViewMode} isEditMode={isEditMode} handleSave={handleAdd}
                handleEdit={() => {
                    setIsEditMode(true);
                    setIsViewMode(false);
                }} handleUpdate={handleUpdate}/>
    </div>);
}