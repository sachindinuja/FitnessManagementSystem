import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByUserId, savePost } from "../../app/actions/post.actions";
import storage from "../../util/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Slider from "react-slick";

function PostAdd() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const [caption, setCaption] = React.useState("");
  const [imgLink, setImgLink] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption) {
      alert("Caption is required!");
      return;
    }
    const post = {
      userId: user.userId,
      caption,
      imgLink,
    };
    await dispatch(savePost(post));
    await dispatch(getPostsByUserId(user.userId));
    setCaption("");
    setImgLink([]);
    fileInputRef.current.value = "";

  };

  const uploadImage = (e) => {
    const files = e.target.files;

    if (files.length === 0) {
      alert("Please upload at least one file!");
      return;
    }

    // upload up to 3 images or 1 video
    let numImages = 0;
    let numVideos = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith('video/')) {
        if (numVideos === 0 && numImages === 0) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            if (video.duration <= 30) {
              continueUpload(file);
            } else {
              alert('Video duration must be less than or equal to 30 seconds!');
              fileInputRef.current.value = '';
            }
          };
          video.src = URL.createObjectURL(file);
          numVideos++;
        } else {
          alert('Only 1 video file is allowed!');
          fileInputRef.current.value = '';
          return;
        }
      } else if (numImages < 3) {
        continueUpload(file);
        numImages++;
      } else {
        alert('Only up to 3 images are allowed!');
        fileInputRef.current.value = '';
        return;
      }
    }
  };

  const continueUpload = (file) => {
    const storageRef = ref(storage, `/posts/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },

      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImgLink((prevLinks) => [...prevLinks, url]);
          console.log(url);
        });
      }
    );
  };


  return (
    <div className="container mb-3 card create-card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <h1 className="mt-2">Share your thoughts</h1>
          <div className="mt-2 mb-3">
            <label className="form-label"></label>
            <input
              type="text"
              className="form-control"
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <i>*maximum 3 images or 1 video</i>
          <div className="mb-3">
            <Slider style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0px 0px 2px 0px #000000",
              backgroundColor: "#fff",
              margin: "10px auto",
            }}>
              {imgLink?.map((img, index) => (
                <div key={index}  >
                  {img.includes("mp4") ? (
                    <video controls className="img-fluid me-3"
                      style={{ width: "100%", height: "210px" }}
                    >
                      <source src={img} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={img}
                      className="img-fluid me-3"
                      alt=""
                      style={{
                        width: "100%",
                        height: "210px",
                        objectFit: "contain",
                      }}
                    />
                  )}

                </div>
              ))}
            </Slider>
            <input
              type="file"
              className="form-control"
              onChange={(e) => uploadImage(e)}
              ref={fileInputRef}
              multiple
              // IMAGES AND VIDEOS
              accept="image/*, video/*"
            />
          </div>

          <button
            type="submit"
            className="btn btn-outline-primary"
            disabled={caption === "" || imgLink.length === 0}
          >
            PUBLISH
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostAdd;
