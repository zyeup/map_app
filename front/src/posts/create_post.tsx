import axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from "react-router-dom";

interface PostData {
    id: string;
    title: string;
    content: string;
    created_at: string;
    update_at: string;
}

interface CreatePostProps {
    posts: Record<string, PostData>;
    setPosts: React.Dispatch<React.SetStateAction<Record<string, PostData>>>;
}


const CreatePost: React.FC<CreatePostProps> = ({ posts, setPosts }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/v1/posts", {
                title: title,
                content: content
            })

            const newPost: PostData = response.data;
            setPosts({
                ...posts,
                [newPost.id]: newPost
            });
            navigate("/");

        } catch (err) {

            alert("投稿に失敗しました")
        }
    }

    return (
        <>
            <h1>新規投稿</h1>
            <form onSubmit={handleSubmit}>
                <label>タイトル</label>
                <input
                    className='block bg-gray-200 appearance-none border-2 border-gray-400 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                    type="text"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
                <label>本文</label>
                <textarea className='block bg-gray-200 appearance-none border-2 border-gray-400 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} />
                <button
                    className='block bg-blue-500 hover:bg-blue-700 text-white rounded'
                    type='submit'
                >
                    投稿
                </button>
            </form>
        </>
    )
}

export default CreatePost