import { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


import axios from 'axios';

export default function ImageUpload({ ad, setAd }) {
  const [imagePreviews, setImagePreviews] = useState([]);

  const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dvivgcsz9/image/upload';

  const uploadPostImage = async (image) => {
    try {
      setAd({ ...ad, uploading: true });

      // Create a FormData object to send the file to Cloudinary

      //go to dashboard of cloudinary
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset','t1dgl3g9');
      formData.append('cloud_name', 'dvivgcsz9');

      // Use axios to send the FormData to Cloudinary
      const response = await fetch(cloudinaryUploadUrl,{
        method:"POST",
        body:formData
      })
    

      if (response.ok) {
        const responseData = await response.json(); // Extract JSON data from the response
        if (responseData.secure_url) {
          const imageUrl = responseData.secure_url;
          setAd({ ...ad, uploading: false, photos: [...ad.photos, imageUrl] });
        } else {
          console.error('Invalid Cloudinary response:', responseData);
          setAd({ ...ad, uploading: false });
        }
      } else {
        console.error('Failed Cloudinary response:', response);
        setAd({ ...ad, uploading: false });
      }


    } 
    catch (err) {
      setAd({ ...ad, uploading: false });
      console.log(err);
    }
  };

  return (
    <div>
      <Upload
        customRequest={({ file, onSuccess, onError }) =>
          uploadPostImage(file)
            .then(() => onSuccess())
            .catch((error) => onError(error))
        }
        maxCount={10}
        multiple={true}
      >
        <Button style={{ marginTop: 10 }} icon={<UploadOutlined />} block>
          Upload Images
        </Button>
      </Upload>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {ad.photos.map((imageUrl, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px' }}>
            <img src={imageUrl} alt={`Preview ${index}`} style={{ width: '48px', height: '48px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}



