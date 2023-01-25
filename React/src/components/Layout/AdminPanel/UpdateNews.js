import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import NotFound from './../../../pages/NotFound'
import useToggle from '../../../custom-hooks/use-toggle'
import { AuthModal } from '../../UI/Modal'
import axios from 'axios'

import classes from './UpdateNews.module.css'

function UpdateNews() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [imageUpload, setImageUpload] = useState(null);
    let [imageUrl, setImageUrl] = useState();
    const [product, setProduct] = useState([]);
    const [httpError, setHttpError] = useState();
    const [imageDeployed, setImageDeployed] = useToggle(false)

    const titleInputRef = useRef()
    const bodyInputRef = useRef()

    useEffect(() => {
        titleInputRef.current.value = product.title
        bodyInputRef.current.value = product.body
    }, [product])

    const uploadImage = (e) => {
        setImageUpload(e.target.files[0]);
    }

    useEffect(() => {
        if (imageUpload === null) return
        const formData = new FormData();
        formData.append('image', imageUpload);

        axios.post('http://localhost/react-PHP/PHP/images/upload-image.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setImageUrl(response.data.url);
        });
    }, [imageUpload])

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch(`http://localhost/React-PHP/PHP/api/news/read_single.php?id=${id}`);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseData = await response.json();

            setProduct({
                id: id,
                title: responseData.title,
                body: responseData.body,
                img_url: responseData.img_url,
            });
        };

        fetchMeals().catch((error) => {
            setHttpError(error.message);
        });
    }, [id]);

    if (imageUrl === undefined) {
        imageUrl = product.img_url
    } else {
        imageUrl = `http://localhost/REACT-PHP/PHP/images/${imageUrl}`
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            id: id,
            title: titleInputRef.current.value,
            body: bodyInputRef.current.value,
            img_url: imageUrl,
            current_img: product.img_url,
        }

        if (window.confirm('Are you sure you want to update product')) {
            axios.post('http://localhost/react-PHP/PHP/api/news/update.php', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                setImageDeployed(true)

                setTimeout(() => {
                    setImageDeployed(false)
                    navigate('/')
                }, 2000)
            });
        }
    }


    if (httpError) {
        return (
            <NotFound />
        );
    }

    return (
        <div>
            <form className={classes.form} onSubmit={handleSubmit}>
                <img src={product.img_url} className={classes.img} alt="This is a img" />
                <input type="file" onChange={uploadImage} />
                <input type="text" ref={titleInputRef} />
                <input type="text" ref={bodyInputRef} />
                <button type="submit">Update</button>
            </form>
            {imageDeployed && <AuthModal><p className={classes.deployed}>Product successfully added</p></AuthModal>}
        </div>
    )
}

export default UpdateNews