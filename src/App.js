import React from 'react';
import { useState } from 'react';

const API_KEY = 'gTJAO48YcpmrADUyo4opy4ES4g7iDBxx';

function App() {
  const [searchField, setSearchField] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [isGrouping, setIsGrouping] = useState(false);

  const download = async () => {
    // validate search field 
    if(!searchField) {
      showNotification("заполните поле 'тег'");
      return false;
    }

    // start loading images
    setIsLoadingImages(true);

    const res = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${searchField}`);
    const data = await res.json();
    const imageUrl = data.data.image_url;

    // end loading images
    setIsLoadingImages(false);

    // checking if https 200-299
    if(res.ok) {
      // checking if there is an image
      if(imageUrl) {
        setImages([...images, {title: searchField, url: imageUrl}]);

        if(!tags.includes(searchField)) {
          setTags([...tags, searchField]);
        }
      } else {
        showNotification('По тегу ничего не найдено');
      }
    } else {
      showNotification(`Произошла  http ошибка: ${data.meta.status}`);
    }
  }

  const clear = () => {
    setSearchField('');
    setImages([]);
    setTags([]);
  }

  const grouping = () => {
    setIsGrouping(!isGrouping);
  }

  const showNotification = msg => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  }

  const choiceTag = tag => {
    setSearchField(tag);
  }

  return (
    <div className="app">
      
      <div className="panel">

        <input
          className="panel__input"
          type="text"
          placeholder="введите тег"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />

        <button
          className="download panel__btn"
          onClick={download}
          disabled={isLoadingImages}
        >
          {isLoadingImages ? 'Загрузка...' : 'Загрузить'}
        </button>

        <button className="clear panel__btn" onClick={clear}>Очистить</button>

        <button
          className="grouping panel__btn"
          onClick={grouping}
        >
          {isGrouping ? 'Разгруппировать' : 'Группировать'}
        </button>

      </div>

      {isGrouping ? (
        tags.map((tag, idx) => (
          <div className="group" key={idx}>
            
            <div className="group__title">{tag}</div>

            <div className="group__images images">
              {images.map((image, idx) => image.title === tag && (
                <div className="images__item" key={idx} onClick={() => choiceTag(image.title)}>
                  <img src={image.url} alt={image.title} />
                </div>
              ))}
            </div>

          </div>
        ))
      ) : (
        <div className="images">
          {images.map((image, idx) => (
            <div className="images__item" key={idx} onClick={() => choiceTag(image.title)}>
              <img src={image.url} alt={image.title} />
            </div>
          ))}
        </div>
      )}

      {notification && <div className="notification">{notification}</div>}

    </div>
  );
}

export default App;
