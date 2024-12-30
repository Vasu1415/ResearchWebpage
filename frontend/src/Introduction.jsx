import React from 'react';

const Introduction = () => {
    return (
        <section id="introduction" className="py-12 text-black">
            <div className="max-w-5xl mx-auto px-6">
                {/* Centered Heading */}
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Introduction & Motivation
                </h2>
                {/* Content */}
                <p className="text-lg font-semibold leading-relaxed mb-6">
                    Music streaming platforms have revolutionized how people discover and enjoy music, offering
                    personalized features like Spotify’s Song Radio and Daylist. However, existing recommendation systems
                    often fail to suggest songs with comparable auditory features, such as rhythm, tempo, and frequency composition.
                    This limitation can lead to user dissatisfaction, particularly for those seeking recommendations that
                    align more closely with the sound of a song rather than its popularity or metadata.
                </p>
                <p className="text-lg font-semibold leading-relaxed">
                    Recognizing this gap, our research focuses on an audio-centric approach to music recommendation by leveraging
                    deep learning techniques. Using a two-stream Residual Convolutional Neural Network (ResCNN) architecture, our model
                    processes raw audio content to classify and recommend music more effectively. By capturing both temporal and spectral features
                    through mel-spectrogram representations, we aim to offer listeners a richer and more meaningful music discovery experience,
                    addressing the limitations of traditional recommendation systems.
                </p>
            </div>
        </section>
    );
};

export default Introduction;
