import React, { useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

export default function ImageUpload({ 
  photo,
  setPhoto,
  uploading,
  setUploading 
}) {
  const [imagePreview, setImagePreview] = useState(photo);

  const customRequest = async (options) => {
    try {
      setUploading(true);
      // Simulate uploading and processing the image
      setTimeout(() => {
        setUploading(false);
        const { file } = options;
        setImagePreview(URL.createObjectURL(file));
        setPhoto(file);
        options.onSuccess();
      }, 2000); // Simulating a 2-second delay
    } catch (err) {
      setUploading(false);
      options.onError(err);
    }
  };

  const handleDelete = () => {
    setPhoto(null); // Clear the selected photo
    setImagePreview(null);
  };

  return (
    <div>
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        maxCount={1}
      >
        <Button style={{ marginTop: 10 }} icon={<UploadOutlined/>} block>
          Upload Image
        </Button>
      </Upload>
      {imagePreview && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px' }}>
          <img src={imagePreview} style={{ width: '48px', height: '48px' }} alt="Uploaded" onClick={handleDelete} />
          <Button icon={<DeleteOutlined />} type="link" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

