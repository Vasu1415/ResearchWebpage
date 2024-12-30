import React from 'react';
import confusionMatrix from '/src/images/confusion_matrix.png';
import graph from '/src/images/graph.png';

const Results = () => {
    return (
        <section id="results" className="py-12 px-6 text-black mt-12">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Title Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-center">Results</h2>
                </div>

                {/* Images Grid with Caption */}
                <div>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Confusion Matrix */}
                        <div className="border rounded-lg shadow-md p-4">
                            <h3 className="text-xl font-semibold mb-3">Confusion Matrix</h3>
                            <img
                                src={confusionMatrix}
                                alt="Confusion Matrix"
                                className="rounded-md w-full object-contain"
                            />
                        </div>

                        {/* Performance Graph */}
                        <div className="border rounded-lg shadow-md p-4">
                            <h3 className="text-xl font-semibold mb-3">Performance Graph</h3>
                            <img
                                src={graph}
                                alt="Performance Graph"
                                className="rounded-md w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Caption Section */}
                    <div className="mt-6">
                        <p className="text-black font-semibold text-center leading-relaxed">
                            The confusion matrix highlights the classification performance by displaying correctly and 
                            incorrectly classified instances, while the performance graph shows training and validation 
                            accuracy over time, indicating the model's convergence and robustness against overfitting.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Results;
