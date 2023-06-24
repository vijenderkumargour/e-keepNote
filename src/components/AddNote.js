import { useContext, useState } from "react"
import noteContext from "./context/note/noteContext"


const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: '', tag: '' });

    const onchangeHander = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const submitHander = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: '', tag: '' });
        props.showAlert("Note has been Added Successfully", "success");
    }

    return (
        <div className="container my-3">
            <div className='row'>
                <h3>Add a Note</h3>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" aria-describedby="emailHelp" name="title" onChange={onchangeHander} id="title" value={note.title} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" name="description" onChange={onchangeHander} id="description" value={note.description} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" name="tag" onChange={onchangeHander} id="tag" value={note.tag} />
                    </div>

                    <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={submitHander}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote
