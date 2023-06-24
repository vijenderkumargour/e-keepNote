import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from "../components/context/note/noteContext";
import AddNote from './AddNote';
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom";


const Notes = (props) => {
    const context = useContext(noteContext)
    const { notes, fetchNotes, editNote } = context;
    const ref = useRef(null);
    const refclose = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: '', etag: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchNotes();
        } else {
            navigate('/loging');
        }
        // eslint-disable-next-line       
    }, []);

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }
    const onchangeHander = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    const submitHander = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        refclose.current.click();
        props.showAlert("Note has been updated Successfully", "success");
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" aria-describedby="emailHelp" name="etitle" onChange={onchangeHander} id="etitle" value={note.etitle} />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" name="edescription" onChange={onchangeHander} id="edescription" value={note.edescription} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" name="etag" onChange={onchangeHander} id="etag" value={note.etag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refclose}>Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={submitHander} >Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h3 className='my-3'>Your Notes</h3>
                <div className='container mx-1'>
                    <div className='row'>
                        {notes.length === 0 && "No note to display"}
                        {
                            notes.map((note) => {
                                return <NoteItem note={note} key={note._id} updateNote={updateNote} showAlert={props.showAlert} />
                            })
                        }
                    </div>
                </div>
            </div>
        </>

    )
}

export default Notes
