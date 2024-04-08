import { useState } from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {  useAddNewPostMutation} from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";


const AddPostForm = () => {
  const [addNewPost, {isloading}] = useAddNewPostMutation()

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("")
  const [userId, setUserId] = useState("")
  
  const navigate  = useNavigate();

  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);
  
  const canSave = [title, content, userId].every(Boolean) && !isloading;

  const onSavePostClicked = async () => {
      if (canSave) {
          try {
              await addNewPost({title, body: content, userId}).unwrap()

              setTitle('')
              setContent('')
              setUserId('')
              navigate('/')
          } catch (err) {
              console.error('Failed to save the post', err)
          }
      }

  }

  

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
        {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select name="postAuthor" id="postAuthor" value={userId} onChange={onAuthorChanged} >
            <option value=''></option>
            {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button
            type="button"
            onClick={onSavePostClicked}
            disabled={!canSave}
        >Save Post</button>
      </form>
    </section>
  );
};

export default AddPostForm;
