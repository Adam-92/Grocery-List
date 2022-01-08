import React, { useState, useEffect } from 'react'
import List from './components/List'
import Alert from './components/Alert'

/* Get list from LS */
const getLocalStorage = () => {

  let list = localStorage.getItem('item');
  if(list){
    return JSON.parse(localStorage.getItem('item'));
  }else
  {
    return [];
  }
}

function App() {
  /* Name of your thing */
  const [name, setName] = useState('');
  /* The whole list of you grocery bud */
  const [list, setList] = useState(getLocalStorage);
  /* Turns on if you edit one of given div's */
  const [isEditing, setIsEditing] = useState(false);
  /*Grab the ID*/
  const [editID, setEditID] = useState(null);
  /* Control the notifications/alerts */
  const [alert, setAlert] = useState({show: false,
  msg: '', type: ''})

  /* Any time in case of editing the list save in LS */
  useEffect( ()=>{
    localStorage.setItem('item', JSON.stringify(list));
  },[list])

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Alert if there is a lack of name */
    if(!name){
      showAlert(true,'danger','Fill The Form');
    }else if(name && isEditing){
      /* Edit the list */
      setList(
        list.map( (item) => {
          if(item.id === editID){
            return {...item, title:name};
          }  
      setName('');
      setIsEditing(false);
      setEditID(null);
      showAlert(true,'success', `Title changed on ${name}`);
        return item;
     }))
    }else{
      /* Add to the list */
      showAlert(true, 'success', 'New Item');
      const newItem = {id: new Date().getTime().toString(),
      title: name}
      setList([...list, newItem]);
      setName('');
    }
  } 

  const showAlert = (show=false,type="",msg=``) => {
    setAlert({show, type, msg});
  }

  const clearList = () =>{
    showAlert(true,'success','All Items deleted');
    setList([]);
  }

  const removeItem = (id,title) => {
    showAlert(true,'success',`Item ${title} deleted`)
    const newList = list.filter(item => {
      return item.id !== id;
    })
    setList(newList);
  }

  const editItem = (id) =>{
    const itemArray = list.find(item => item.id === id);
    setIsEditing(true);
    setName(itemArray.title);
    setEditID(id);
  };

  return( 
    <section className='section-center'>
      <form className='grocery-form'
            onSubmit={handleSubmit}
      > 
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
        <h3>Grocery List</h3>
        <div className="form-control">
          <input type="text" 
                 className="grocery"
                 placeholder="item"
                 value={name}
                 onChange={(e)=> setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
            <div className="grocery-container">
              <List items={list} removeFromList={removeItem} editItem={editItem} />
              <button onClick={clearList}
                      className='clear-btn'
              >
                clear items
              </button>
            </div>
      )}
    </section>
  )
}

export default App
