// src/App.jsx
import React from 'react';
import Header from './src/Header';
import Introduction from './src/Introduction';
import Results from './src/Results';
import Comments from './src/Comments';
import DeepLearning from './src/DeepLearning';
import './index.css';

const App = () => {
    return (
        <div className={`bg-gradient-to-b from-white to-gray-200`}>
            <Header/>
            <main>
                <Introduction />
                <Results />
                <DeepLearning />
                <Comments />
            </main>
        </div>
    );
};

export default App;