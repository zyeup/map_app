import api from '../api/axios';
import { Link } from 'react-router-dom';
import React, { Dispatch, SetStateAction } from 'react';

type PostData = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    update_at: string;
};

type PostProps = {
    posts: PostData[];
    setPosts: Dispatch<SetStateAction<PostData[]>>;
};

const Home: React.FC<PostProps> = ({ posts, setPosts }) => {

    const handleDelete = async (postId: number) => {
        const confirm = window.confirm("このリストを削除します。\n本当によろしいですか？");
        if (confirm) {
            try {
                await api.delete(`/posts/${postId}`);
                const newArray = [...posts].filter(post => post.id !== postId);
                setPosts([...newArray]);
            } catch (err) {
                alert("削除に失敗しました");
                console.log(err);
            }
        }
    };

    const sortedPosts = posts.sort((a, b) => a.id - b.id);

    return (
        <div className="p-6 bg-gray-100 shadow-lg rounded-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                Home
            </h2>
            <p className="text-gray-600 mb-8 text-center">
                <Link to="/create_posts" className="text-blue-500 hover:text-blue-600 hover:underline font-semibold">
                    新しく地図を作成する
                </Link>
            </p>
            <div className="grid grid-cols-1 gap-6 max-h-[700px] overflow-y-scroll">
                {sortedPosts.map((post) => (
                    <div
                        key={post.id}
                        className="block p-6 bg-white shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300"
                    >
                        <Link
                            to={`/posts/${post.id}`}
                            className="block mb-4 text-xl font-bold text-gray-700"
                        >
                            {post.id}: {post.title}
                        </Link>
                        <p className="text-gray-500 text-sm mb-4">
                            Created at: {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Link
                                to={`/edit_posts/${post.id}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200">
                                    Edit
                                </button>
                            </Link>
                            <button
                                onClick={(e) => {
                                    handleDelete(post.id);
                                    e.preventDefault();
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
