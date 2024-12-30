import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Comments = () => {
  const [feedback, setFeedback] = useState([]); // Feedback state
  const [rating, setRating] = useState(0); // User rating
  const [hover, setHover] = useState(0); // Hover state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comments: "",
    rating: 0,
  }); // Form state

  const [error, setError] = useState(""); // Error handling

  // Fetch feedback from the backend
  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Unable to fetch feedback. Please try again later.");
    }
  };

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comments || !formData.rating) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Clear form and refetch feedback after successful submission
      setFormData({ name: "", email: "", comments: "", rating: 0 });
      setRating(0); // Reset star rating
      fetchFeedback(); // Refetch feedback
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Unable to submit feedback. Please try again later.");
    }
  };

  return (
    <section id="comments" className="py-12 px-6 text-black">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Feedback List */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-8">User Feedback</h3>
          {feedback.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto"
            >
              {feedback.map((item) => (
                <div
                  key={item.FeedbackID}
                  className="bg-gray-100 rounded-lg p-4 shadow-md border border-gray-200 space-y-3"
                >
                  <h4 className="text-lg font-bold text-purple-500">{item.Name}</h4>
                  <p className="text-sm text-gray-700">{item.Comments}</p>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Number(item.Rating) || 0 }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <small className="text-gray-400 text-xs">
                    {new Date(item.Timestamp).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-bold text-center">No feedback available yet.</p>
          )}
        </div>

        {/* Comment Form */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Leave a Comment</h2>
            <p className="text-black font-semibold">
              We value your feedback and would love to hear your thoughts on our
              recommendation model! Please rate it on the basis of the tonal
              similarity the recommended songs had in comparison to the song you
              selected.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Comments Textarea */}
            <div>
              <label
                htmlFor="comments"
                className="block text-lg font-medium mb-2"
              >
                Your Comments
              </label>
              <textarea
                id="comments"
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Write your comments here"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows="4"
              />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-lg font-medium mb-2">
                Rating (Stars)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-3xl ${
                      hover >= star || rating >= star
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => {
                      setRating(star);
                      setFormData({ ...formData, rating: star });
                    }}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-black text-white px-8 py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Comments;
