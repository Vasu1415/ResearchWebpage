import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from model.recommender import Recommender
import boto3
import uuid
import datetime
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

# AWS Configuration
AWS_REGION = "us-east-2"
S3_BUCKET_NAME = "audio-spectrogram-bucket"
EMBEDDINGS_FILE = "embeddings.npy"
MAPPINGS_FILE = "mappings.json"

# Initialize AWS DynamoDB resource
dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION
)
table = dynamodb.Table("Feedback")

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173", "https://research-webpage-roan.vercel.app/"]}})

# Initialize the Recommender
recommender = Recommender()

@app.route("/", methods=["GET"])
def home():
    """
    Basic endpoint for health checks.
    """
    return jsonify({"message": "Welcome to the audio playlist generator API!"}), 200


@app.route("/api/genre/<genre>/songs", methods=["GET"])
def get_songs_by_genre(genre):
    """
    Return the list of songs for a given genre using genre_to_files from mappings.json.
    """
    genre = genre.lower()
    genres = ["blues", "classical", "jazz", "reggae", "country", "rock", "metal", "disco", "hiphop", "pop"]
    if genre not in genres:
        return jsonify({"error": "Genre not found"}), 404

    try:
        # Access mappings from the recommender
        genre_to_files = recommender.mappings.get("genre_to_files", {})
        songs = genre_to_files.get(genre, [])

        return jsonify({"songs": songs})
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/recommendations", methods=["POST"])
def get_recommendations():
    """
    Return audio file recommendations with S3 URLs.
    """
    try:
        data = request.json
        audio_path = data.get("audio_path")
        if not audio_path:
            return jsonify({"error": "Audio path is required"}), 400

        # Check if the audio exists in embeddings
        if audio_path not in recommender.embeddings:
            return jsonify({"error": f"Audio file '{audio_path}' not found in embeddings"}), 404

        # Get recommendations from the recommender system
        recommended_files = recommender.find_similar_files(audio_path, top_k=7)

        # Access the audio_to_url mapping
        audio_to_url = recommender.mappings.get("audio_to_url", {})

        # Create recommendations with S3 playback links
        recommendations = [
            {
                "file_name": file,
                "link": audio_to_url.get(file, f"File '{file}' not found in mappings.json")
            }
            for file in recommended_files
        ]
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/feedback", methods=["GET"])
def get_feedback():
    """
    Fetch all feedback from the DynamoDB table.
    """
    try:
        response = table.scan()  # Get all items from the Feedback table
        feedback_items = response.get("Items", [])
        feedback_items.sort(key=lambda x: x.get("Timestamp", ""), reverse=True)

        return jsonify({"feedback": feedback_items}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/feedback", methods=["POST"])
def save_feedback():
    """
    Save user feedback to the DynamoDB table.
    """
    try:
        data = request.json

        # Validate required fields
        name = data.get("name")
        email = data.get("email")
        comments = data.get("comments")
        rating = data.get("rating")

        if not all([name, email, comments, rating]):
            return jsonify({"error": "Missing required fields"}), 400

        if not isinstance(rating, int) or not (1 <= rating <= 5):
            return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400

        # Check for valid email format
        if "@" not in email or "." not in email:
            return jsonify({"error": "Invalid email address"}), 400

        # Save feedback to DynamoDB
        feedback_id = str(uuid.uuid4())
        timestamp = datetime.datetime.utcnow().isoformat()
        table.put_item(
            Item={
                "FeedbackID": feedback_id,
                "Name": name,
                "Email": email,
                "Comments": comments,
                "Rating": int(rating),
                "Timestamp": timestamp,
            }
        )

        return jsonify({"message": "Feedback saved successfully", "FeedbackID": feedback_id}), 200
    except (NoCredentialsError, PartialCredentialsError) as e:
        return jsonify({"error": "AWS credentials error"}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
