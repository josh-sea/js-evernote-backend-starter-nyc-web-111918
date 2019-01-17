document.addEventListener('DOMContentLoaded', () => {
  const notesIndexURL = 'http://localhost:3000/api/v1/notes';
  const usersIndexURL = 'http://localhost:3000/api/v1/users';
  const sideBar = document.querySelector('#sidebar');
  const previewPane = document.querySelector('#preview');
  const editForm = document.querySelector('.edit');
  const inputTitle=document.querySelector('#input-title');
  const inputBody = document.querySelector('#input-body');
  const inputId = document.querySelector('#hidden-id');
  const createNoteBtn = document.querySelector('#create-note');
  let allNotes = [];

  function renderNotes(notes){
    allNotes = notes;
    const mapNotes = notes.map(function(note){
      return `
      <div class="card text-white" data-card-id="${note.id}">
        <div class="card-body" data-cardbody-id="${note.id}">
          <h5 class="card-title"> ${note.title}</h5>
          <p class="card-text">${note.body.substring(0,50)+'...'}</p>
        </div>
      </div>`
    })
    return sideBar.innerHTML = mapNotes.join('')
  }

  function renderNote(note){
    previewPane.innerHTML = '';
    // note.body..replace(/\n/g, ",")
    return previewPane.innerHTML =
    `<div class="jumbotron text-white jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">${note.title}</h1>
        <p class="lead">${note.body.replace(/\\n/g, " ")}</p>
        <div class="btn-group" role="group">
          <button data-edit-id="${note.id}" class="btn btn-light">Edit Note</button>
          <button data-delete-id="${note.id}" class="btn btn-light">Delete Note</button>
        </div>
      </div>
    </div>`
  }

  function parseJSON(response){
    return response.json();
  }
  function getNoteFetch(){
    return fetch(notesIndexURL)
    .then(parseJSON)
    .then(renderNotes)
  }
  function deleteFetch(id){
    return fetch(`http://localhost:3000/api/v1/notes/${id}`, {method: "DELETE"})
  }

  function postFetch(note){
    return fetch(notesIndexURL,{
      method: "POST",
      headers:
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({title: note.title, body: note.body, user: note.user})
    })
  }

  function patchFetch(note){
    return fetch(`http://localhost:3000/api/v1/notes/${note.id}`,{
      method: "PATCH",
      headers:
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({title: note.title, body: note.body, user: note.user})
    })//end of patch fetch
  }

//------------------end helpers
getNoteFetch()

// document.addEventListener('contextmenu', function(ev) {
//     ev.preventDefault();
//     alert('success!');
//     console.log(ev);
//     return false;
// }, false  );

  sideBar.addEventListener('click', (e)=>{
    window.scrollTo(0,0);
    // console.log(e);
    if (e.target.parentNode.dataset.cardbodyId || e.target.parentNode.dataset.cardId){
      let foundNote = allNotes.find(function(note){
          return note.id == e.target.parentNode.dataset.cardbodyId || e.target.parentNode.dataset.cardId;
        })
        inputTitle.value = '';
        inputBody.value = '';
        inputId.value = '';
        renderNote(foundNote)
    }
  })

  previewPane.addEventListener('click', (e)=>{
    if(e.target.dataset.deleteId){
      deleteFetch(e.target.dataset.deleteId)
      //uses id from delete button and deletes the item from DB nothign is returned
      const foundNote =allNotes.find(function(note){
        return note.id == e.target.dataset.deleteId;
      })
      allNotes.splice(allNotes.indexOf(foundNote),1);
      renderNotes(allNotes);
      previewPane.innerHTML = '';
//end of if
    } else if (e.target.dataset.editId){
      //get edit form change visibility
      const foundNote =allNotes.find(function(note){
        return note.id == e.target.dataset.editId;
      })
      inputTitle.value = foundNote.title;
      inputBody.value = foundNote.body.replace(/\\n/g, " ");
      inputId.value = foundNote.id
//end of else if
} //end of delte/edit render if/elseif
  }) //end of previewpane event
  editForm.addEventListener('submit',(e)=>{
      e.preventDefault()
      console.log(inputTitle.value);
      console.log(inputBody.value);
      const foundNote = allNotes.find(function(note){
        return note.id == e.target.dataset.inputId.value;
      })
      console.log(foundNote);
      // foundNote.title = inputTitle.value;
      // foundNote.body = inputBody.value
      // patchFetch(foundNote)
      // .then(parseJSON)
      // .then(renderNote)
    })//end of submit

}) //end of dom content loaded
