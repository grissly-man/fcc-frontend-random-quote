import React from 'react';
import ReactDOM from 'react-dom';
import ArtistTag from './js/ArtistTag';

var styles = {
    "page-style": {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        padding: '0px',
        margin: '0px',
        fontFamily: '"Century Gothic", Monaco, sans-serif'
    }
}

ReactDOM.render(
    <div style={styles['page-style']}>
        <ArtistTag />
    </div>,
    document.getElementById('app')
);