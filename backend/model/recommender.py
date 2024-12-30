import boto3
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
from torchvision import transforms
import json
import io

# S3 bucket details
BUCKET_NAME = "audio-spectrogram-bucket"
EMBEDDINGS_FILE = "embeddings.npy"
MAPPINGS_FILE = "mappings.json"

# Initialize S3 client
s3_client = boto3.client("s3")


class Recommender:
    def __init__(self):
        """
        Initialize the recommender system with precomputed embeddings and mappings.
        """
        self.embeddings = self.load_embeddings()
        self.mappings = self.load_mappings()

    def download_from_s3(self, key):
        """
        Download a file from S3 and return its content as bytes.

        Args:
            key (str): S3 key of the file to download.

        Returns:
            bytes: File content.

        Raises:
            Exception: If the file cannot be downloaded.
        """
        try:
            response = s3_client.get_object(Bucket=BUCKET_NAME, Key=key)
            return response["Body"].read()
        except Exception as e:
            raise Exception(f"Error downloading {key} from S3: {e}")

    def load_embeddings(self):
        """
        Load precomputed embeddings directly from S3.

        Returns:
            dict: Precomputed embeddings.

        Raises:
            Exception: If the embeddings cannot be loaded.
        """
        try:
            embeddings_bytes = self.download_from_s3(EMBEDDINGS_FILE)
            return np.load(io.BytesIO(embeddings_bytes), allow_pickle=True).item()
        except Exception as e:
            raise Exception(f"Error loading embeddings: {e}")

    def load_mappings(self):
        """
        Load mappings directly from S3.

        Returns:
            dict: Mappings data.

        Raises:
            Exception: If the mappings cannot be loaded.
        """
        try:
            mappings_bytes = self.download_from_s3(MAPPINGS_FILE)
            return json.loads(mappings_bytes.decode("utf-8"))
        except Exception as e:
            raise Exception(f"Error loading mappings: {e}")

    def find_similar_files(self, selected_audio_file, top_k=6):
        """
        Find similar audio files based on precomputed embeddings.

        Args:
            selected_audio_file (str): Audio file name to find recommendations for.
            top_k (int): Number of similar files to return.

        Returns:
            list: List of recommended audio file names.

        Raises:
            ValueError: If the selected audio file is not found in embeddings.
        """
        if selected_audio_file not in self.embeddings:
            raise ValueError(f"Audio file '{selected_audio_file}' not found in embeddings.")

        # Retrieve the embedding for the selected audio file
        selected_embedding = self.embeddings[selected_audio_file].reshape(1, -1)

        # Compute cosine similarities with all other embeddings
        all_audio_files = list(self.embeddings.keys())
        all_embeddings = np.vstack([self.embeddings[audio] for audio in all_audio_files])

        similarities = cosine_similarity(selected_embedding, all_embeddings).flatten()

        # Get top-k similar files, excluding the selected file itself
        top_indices = similarities.argsort()[-(top_k + 1):][::-1]
        similar_audio_files = [all_audio_files[i] for i in top_indices if all_audio_files[i] != selected_audio_file]
        return similar_audio_files[:top_k]

    def load_spectrogram(self, spectrogram_key):
        """
        Load a spectrogram from S3 directly into memory as an Image object.

        Args:
            spectrogram_key (str): S3 key of the spectrogram file.

        Returns:
            PIL.Image.Image: Loaded image.

        Raises:
            Exception: If the spectrogram cannot be loaded.
        """
        try:
            spectrogram_bytes = self.download_from_s3(spectrogram_key)
            return Image.open(io.BytesIO(spectrogram_bytes)).convert("RGB")
        except Exception as e:
            raise Exception(f"Error loading spectrogram {spectrogram_key}: {e}")
