import api from '../api/axios';
import React, { FormEvent, useRef, useState } from 'react';
import { MarkerFormProps } from "../interfaces/index"

const MarkerForm: React.FC<MarkerFormProps> = ({ id, lat, lng, title, setTitle, content, setContent, addMarker, makeMarker, map }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMarker = async (e: FormEvent) => {

    e.preventDefault();

    if (!map || !title) {
      alert("必要な情報が不足しています");
      return;
    }

    try {
      const formData = new FormData();

      // formDataを使用するため、数値は文字列に変換する
      formData.append('lat', lat.toString());
      formData.append('lng', lng.toString());
      formData.append('title', title);
      formData.append('content', content);
      formData.append('post_id', id.toString());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/markers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newMarkerData = response.data;
      const marker = makeMarker(lat, lng, title)
      marker.setMap(map)

      addMarker({ id, lat, lng, title, content, marker, image: newMarkerData.image_url });
      setTitle("");
      setContent("");
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      alert("マーカーの作成に失敗しました")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md border rounded-md w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">現在のピンの位置情報</h3>
      <div className="mb-4">
        <p className="text-gray-600"><span className="font-medium text-gray-800">緯度：</span>{lat}</p>
        <p className="text-gray-600"><span className="font-medium text-gray-800">経度：</span>{lng}</p>
      </div>
      <form onSubmit={handleAddMarker} className="space-y-4">
        <div>
          <label htmlFor="marker_name" className="block font-bold text-gray-800 mb-2">
            マーカーに表示する名前を入力
          </label>
          <input
            id="marker_name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none py-2 px-4 rounded-md"
          />
          <div>
            <label htmlFor="marker_content" className="block font-bold text-gray-800 mb-2">
              マーカーの説明文を入力
            </label>
            <textarea
              id="marker_content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="説明文を入力"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none py-2 px-4 rounded-md"
            ></textarea>
          </div>
          <div>
            <label htmlFor="marker_image" className="block font-bold text-gray-800 mb-2">
              マーカーに関連する画像をアップロード
            </label>
            <input
              type="file"
              id="marker_image"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="w-full border border-gray-300 py-2 px-4 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          この名前でピンを保存する
        </button>
      </form>
    </div>
  )
}

export default MarkerForm;
