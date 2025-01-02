# Research Webpage

## Overview
This project is a research-focused webpage designed to provide song recommendations based on precomputed embeddings. The system leverages AWS services for data storage and retrieval, with a React-based frontend and a Python-powered backend. The following guide provides a comprehensive setup and explanation of the project.

---

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv {virtual_environment_name}
```

### 2. Activate Virtual Environment
```bash
source {virtual_environment_name}/bin/activate
```

### 3. Install Backend Dependencies
Navigate to the backend folder and run:
```bash
python -m pip install -r requirements.txt
```

### 4. Run Backend Server
After installing the dependencies, run the following command to start the backend server:
```bash
python app.py
```

### 5. Install Frontend Dependencies
Navigate to the frontend folder and run:
```bash
npm install
```

### 6. Run Frontend Server
Go to the root directory of the project and run:
```bash
npx run dev
```

---

## Project Structure

### **Frontend**
- All code is located in the `src` directory within the `frontend` folder.
- A potential addition includes a **Team Members** section, which is yet to be implemented.
- The frontend is largely complete, but suggestions for improvement are welcome.

### **Backend**
- This side of the project relies heavily on AWS services for data storage and retrieval.
- **Data Storage:**
  - `AWS S3`: Stores two primary files:
    1. `embeddings.npy`: Precomputed embeddings for all spectrograms in the dataset to enable quick recommendations.
    2. `mappings.json`: Contains two mappings:
       - `genre-to-audio`: Maps genres to their corresponding audio files.
       - `audio-to-audio-url`: Maps audio files to their respective AWS S3 URLs.
- **Recommender Logic:**
  - Handled by `recommender.py`, which calculates top-k similar songs using the **cosine similarity** function.

---

## Hosting the Backend
### Current Setup
The backend is configured to run on the AWS Lambda free tier using the `zappa` library.

### Prerequisites
- Ensure you install the `zappa` library during dependency installation.
- Add the necessary AWS credentials and configuration files for Zappa in the root of the backend folder.

### Helpful Commands
1. **Deploy Backend:**
   ```bash
   zappa deploy dev
   ```
2. **Update Deployment:**
   ```bash
   zappa update dev
   ```
3. **Undeploy Backend:**
   ```bash
   zappa undeploy dev
   ```

---

## Pending Tasks
1. **Backend Hosting:**
   - Finalize and test the deployment of the backend using AWS Lambda and Zappa.
2. **Frontend Additions:**
   - Implement the **Team Members** section (optional).
3. **Code Tweaks:**
   - Perform minor adjustments to make the deployed frontend and backend listen to each other.
   - 
---

## How to Contribute
Feel free to fork this repository and open a pull request with any suggestions or improvements! 😊
