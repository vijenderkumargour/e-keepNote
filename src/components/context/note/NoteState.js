import NoteContext from "./noteContext";
import React, { useState } from 'react'


const NoteState = (props) => {
    const host = "http://localhost:5000"
    //const host = "https://e-keep-note.vercel.app/"
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial);
    //Fetch all notes from db
    const fetchNotes = async () => {
        const response = await fetch(`/api/note/fetchallnotes`, {
            method: 'get',
            headers: {
                "content-type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        })
        const json = await response.json();
        setNotes(json);
    }

    //Add a Note
    const addNote = async (title, description, tag) => {
        const response = await fetch(`/api/note/addnote`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        setNotes(notes.concat(note))
    }
    //Updae a Note
    const editNote = async (id, title, description, tag) => {
        const response = await fetch(`/api/note/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });

        const json = await response.json();
        console.log(json);
        fetchNotes();
        /* let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                element.title = title;
                element.description = description;
                element.tag = tag;
                break;
            }
        }
        console.log('new', notes);
        setNotes(newNotes); */
    }
    //Delete a Note
    const deleteNote = async (id) => {
        const response = await fetch(`/api/note/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application-json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        console.log(`deleting the note with the id: ${id}`)
        const newNotes = notes.filter((item) => {
            return item._id !== id;
        })
        setNotes(newNotes);
    }
    return (
        <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, fetchNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState
