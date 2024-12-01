import sys
import os
import tempfile
import re
from fpdf import FPDF
from PIL import Image
import yt_dlp
import cv2
from skimage.metrics import structural_similarity as compare_ssim
from youtube_transcript_api import YouTubeTranscriptApi
import openai
import base64
from dotenv import load_dotenv
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask,request,jsonify
from flask_cors import CORS
# from google.colab import files
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
load_dotenv()
openai.api_key="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"
MONGODB_STRING="mongodb+srv://adi:1234@cluster0.qozyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGODB_STRING) 
db = client["Notes_app"]
collection=db["video_data"]
videolist_collection=db["user_courses"]
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# def process_frames_with_gpt(frames_data):
#     """
#     Processes frames using GPT to extract summaries in JSON format.
#     """
#     results = []
    
#     for frame in frames_data:
#         image_path = frame["image_path"]
#         timestamp = frame["timestamp"]

#         # Encode the image as base64
#         base64_image = encode_image(image_path)

#         # GPT prompt for detailed frame analysis
#         prompt = f"""
#         You are preparing study notes from a frame of a video. Present details such as visible titles, text, code, syntaxes, formulas, as is without modification and super concise descriptions for diagrams, charts or other 
#         relevant visual information that could help in creating notes to study from. Exclude irrelevant information that wont help with studying.
#         """

#         # Send the request to OpenAI API
#         response = openai.ChatCompletion.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {
#                     "role": "user", 
#                     "content":[
#                         {
#                             "type":"text",
#                             "text":prompt
#                         },
#                         {
#                             "type": "image_url",
#                             "image_url": {
#                                 "url": f"data:image/png;base64,{base64_image}",
#                                 "detail": "low"
#                             },
#                         },
#                     ] 
#                 },
#             ],
#         )
        

#         # Parse the response and store it in JSON format
#         frame_summary = response["choices"][0]["message"]["content"]
#         results.append({"timestamp": timestamp, "description": frame_summary})
    
#     return results
def add_videos_for_user(user_id, video_id):
    """
    Adds video IDs to a user's document. If the user does not exist, creates a new document.
    """

    # Update the document for the user
    videolist_collection.update_one(
        {"_id": user_id},  # Match document by user ID
        {"$addToSet": {"video_ids":  video_id}},  
        upsert=True  # Create a new document if the user does not exist
    )
    print(f"Videos added for user {user_id}.")

# def get_videos_for_user(user_id):
#     """
#     Retrieves the list of video IDs associated with a user.

#     Args:
#         user_id (str): The unique identifier for the user.

#     Returns:
#         list: List of video IDs for the user, or None if the user does not exist.
#     """
#     user_document = collection.find_one({"_id": user_id})
#     return user_document["video_ids"] if user_document else None
def generate_mcqs(notes_json):
    """
    Generates multiple-choice questions (MCQs) based on the provided notes.

    Parameters:
        notes_json (dict): JSON object containing structured notes.

    Returns:
        list: List of MCQs in the specified JSON format.
    """
    system_message = """Generate 5-25 MCQs as you can based on notes given. The MCQ's should cover the whole range of topics in the notes. The output should be in the below json format:

    ###Output format:
    [
    {
        "question": "Question text here",
        "options": {
        "a": "Option A text here",
        "b": "Option B text here",
        "c": "Option C text here",
        "d": "Option D text here"
        },
        "correct": "Correct option letter here (a/b/c/d)"
    },
    {
        "question": "Next question text here",
        "options": {
        "a": "Option A text here",
        "b": "Option B text here",
        "c": "Option C text here",
        "d": "Option D text here"
        },
        "correct": "Correct option letter here (a/b/c/d)"
    }
    ]

    ###Example output:(In this example assume the document is about HTML.)
    [
    {
        "question": "Which attribute is used to provide an alternative text for an image in HTML?",
        "options": {
            "a": "title",
            "b": "alt",
            "c": "src",
            "d": "href"
        },
        "correct": "b"
    },
    {
        "question": "Which tag is used to create a hyperlink in HTML?",
        "options": {
        "a": "<a>",
        "b": "<link>",
        "c": "<href>",
        "d": "<hyper>"
        },
        "correct": "a"
    }
    ]


    """

    def extract_content(json_data):
        """
        Extracts headings, subheadings, and text from JSON formatted data
        and returns a formatted string containing all the information.

        Parameters:
            json_data (dict): The JSON object containing sections with content.

        Returns:
            str: Formatted string containing extracted information.
        """
        result = []
        for section in json_data.get('sections', []):
            for content in section.get('content', []):
                content_type = content.get('type')
                text = content.get('text', '').strip()
                if content_type == 'heading':
                    result.append(f"\n\n{content_type.upper()}: {text}")
                elif content_type == 'subheading':
                    result.append(f"\n  {content_type.capitalize()}: {text}")
                elif content_type == 'text':
                    result.append(f"    {text}")
        return "\n".join(result)

    notes = extract_content(notes_json)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": notes}
            ],
            temperature=0.5,
            max_tokens=10000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        response_json = response["choices"][0]["message"]["content"]
        # Clean the JSON response if necessary
        if response_json[3] == "j":
            response_json = response_json[7:-3]

        return json.loads(response_json)

    except Exception as e:
        print(f"An error occurred: {e}")
        return []
    


def generate_notes(transcripts):
    """
    Generates multiple-choice questions (MCQs) based on the provided transcripts.

    Parameters:
        transcripts (str): The text content of the transcripts.
        system_message (str): Instructions for the OpenAI API.

    Returns:
        list: List of MCQs in JSON format.
    """
    system_message="""
    You are an educational assistant that creates structured, concise student notes from video transcripts.

    Your task:
    1. Extract content from transcripts and divide it into sections. 
    2. In the transcript you will occasionally encounter "Current Section Video Data" describing whats going on in the video, till the next "Current Section Video Data" is encountered. 
    3. Identify and organize **headings**, **subheadings**, and **text content** into sections based on audio data primarily. Prefer using the timestamps belonging to "Current Section Video Data" as the start_timestamp for each section in your output.
    4. Provide clear, concise, pointwise notes for students to study, ensuring each note is informative but brief. STRICLY, do NOT skip over any topics covered in the video, they should all be there in the notes. 
    5. Include timestamps for each section.

    ### Output Format:
    {
    "sections": [
        {
        "section_number": [Section Number],
        "start_timestamp": "[start]",
        "end_timestamp": [end]",
        "content": [
            {
            "type": "heading",
            "text": "[Heading Text]"
            },
            {
            "type": "subheading",
            "text": "[Subheading Text]"
            },
            {
            "type": "text",
            "text": "[Text Content]"
            },
            ...
        ]
        },
        ...
    ]
    }

    Example input: 
    00:00:00
    Current Section Video Data: <"INTRODUCTION TO BUSINESS ECONOMICS">
    00:00:02
    hello everyone I'm Mrs sua would like to
    00:00:05
    come up with the lectures to make you
    00:00:07
    understand the very basic and
    00:00:08
    fundamental concepts of the subject
    00:00:10
    business economics and financial
    00:00:12
    analysis learning and understanding of
    00:00:15
    this subject will be of great use for
    00:00:18
    individuals from different walks of life
    00:00:21
    as it provides a solid foundation for
    00:00:24
    well-informed decision
    00:00:27
    making in today's session B will be
    00:00:30
    covering the first topic of this subject
    00:00:33
    that is introduction to business
    00:00:38
    economics now let us come let us discuss
    00:00:39
    Current Section Video Data: <"Business Economics and Financial Analysis">
    00:00:41
    about the first concept that is
    00:00:44
    understand what is the meaning of the
    00:00:46
    term
    00:00:48
    business meaning of the term
    00:00:53
    business the term business means
    00:00:57
    busyness or the state of being busy it
    00:01:01
    is a continuous human activity which
    00:01:04
    aims to earn profit by producing and
    00:01:07
    buying and selling of goods and services
    00:01:10
    to fulfill the needs of the
    00:01:13
    customers so otherwise it is it can also
    00:01:16
    be said as any human
    00:01:19
    activity any human activity which aims
    00:01:23
    at making
    00:01:25
    profit is called business social
    00:01:28
    services are not business activities
    00:01:30
    because they are not profit oriented
    00:01:33
    activities 


    Output for example input:
    {
    "sections": [
        {
        "section_number": 1,
        "start_timestamp": "00:00:02", 
        "end_timestamp": "00:00:39",
        "content": [
            {
            "type": "heading",
            "text": "Introduction to Business Economics"
            }
        ]
        },
        {
        "section_number": 2,
        "start_timestamp": "00:00:39",
        "end_timestamp": "00:01:30",
        "content": [
            {
            "type": "heading",
            "text": "Meaning of Business"
            },
            {
            "type": "subheading",
            "text": "Definition"
            },
            {
            "type": "text",
            "text": "Business means 'busyness' or the state of being busy."
            },
            {
            "type": "text",
            "text": "It is a continuous human activity aimed at earning profit by producing, buying, and selling goods and services to meet customer needs."
            },
            {
            "type": "text",
            "text": "Business involves profit-oriented activities, not social services."
            }
        ]
        }
    ]
    } 


    """

    try:
        # Make the API call
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": transcripts}
            ],
            temperature=0.5,
            max_tokens=16383,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        # Parse the JSON response
        response_json = json.loads(response["choices"][0]["message"]["content"])
        return response_json

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def process_frames_with_gpt(frames_data):
    """
    Processes frames using GPT to extract summaries in JSON format.
    """
    results = []
    prev_summary="-"
    for frame in frames_data:
        image_path = frame["image_path"]
        timestamp = frame["timestamp"]

        # Encode the image as base64
        base64_image = encode_image(image_path)

        # GPT prompt for detailed frame analysis
        prompt = f"""
        You are presented with a frame out of an educational video. Find the main heading, if any, and output that. If not, summarize it in one single expression.
        Examples: "Introduction"(example of an introduction slide), "ISO-OSI model diagram"(example if you see a diagram), "Functions and activites of Business" (example of when heading is given)
        """

        # Send the request to OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            temperature=0,
            messages=[
                {
                    "role": "user", 
                    "content":[
                        {
                            "type":"text",
                            "text":prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}",
                                "detail": "low"
                            },
                        },
                    ] 
                },
            ],
        )
        

        # Parse the response and store it in JSON format
        frame_summary = response["choices"][0]["message"]["content"]
        if prev_summary==frame_summary:
            continue
        prev_summary=frame_summary
        results.append({"timestamp": timestamp, "description": f"<{frame_summary}>"})
    
    return results


def download_video(url, output_file):
    if os.path.exists(output_file):
        os.remove(output_file)
    ydl_opts = {
        'outtmpl': output_file,
        'format': 'best',
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def get_video_id(url):
    # Match YouTube Shorts URLs
    video_id_match = re.search(r"shorts\/(\w+)", url)
    if video_id_match:
        return video_id_match.group(1)

    # Match youtube.be shortened URLs
    video_id_match = re.search(r"youtu\.be\/([\w\-_]+)(\?.*)?", url)
    if video_id_match:
        return video_id_match.group(1)
               
    # Match regular YouTube URLs
    video_id_match = re.search(r"v=([\w\-_]+)", url)
    if video_id_match:
        return video_id_match.group(1)

    # Match YouTube live stream URLs
    video_id_match = re.search(r"live\/(\w+)", url)  
    if video_id_match:
        return video_id_match.group(1)

    return None

def get_playlist_videos(playlist_url):
    ydl_opts = {
        'ignoreerrors': True,
        'playlistend': 1000,  # Maximum number of videos to fetch
        'extract_flat': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        playlist_info = ydl.extract_info(playlist_url, download=False)
        return [entry['url'] for entry in playlist_info['entries']]

# def get_captions(video_id, lang='en'):
#     try:
#         transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[lang])
#         captions = [(t['start'] * 1000, t['duration'] * 1000, t['text']) for t in transcript]
#         return captions
#     except Exception as e:
#         print(f"Error fetching captions: {e}")
#         return None

def extract_unique_frames(video_file, output_folder, n=3, ssim_threshold=0.7):
    cap = cv2.VideoCapture(video_file)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    last_frame = None
    saved_frame = None
    frame_number = 0
    last_saved_frame_number = -1
    timestamps = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # print(f"Resolution of frame {frame_number}: {frame.shape[1]}x{frame.shape[0]} (Width x Height)") #640x360

        if frame_number % n == 0:
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray_frame = cv2.resize(gray_frame, (128, 72))

            if last_frame is not None:
                similarity = compare_ssim(gray_frame, last_frame, data_range=gray_frame.max() - gray_frame.min())

                if similarity < ssim_threshold:
                    if saved_frame is not None and frame_number - last_saved_frame_number > fps:
                        frame_path = os.path.join(output_folder, f'frame{frame_number:04d}_{frame_number // fps}.png')
                        cv2.imwrite(frame_path, saved_frame)
                        timestamps.append((frame_number, frame_number // fps))

                    saved_frame = frame
                    last_saved_frame_number = frame_number
                else:
                    saved_frame = frame

            else:
                frame_path = os.path.join(output_folder, f'frame{frame_number:04d}_{frame_number // fps}.png')
                cv2.imwrite(frame_path, frame)
                timestamps.append((frame_number, frame_number // fps))
                last_saved_frame_number = frame_number

            last_frame = gray_frame

        frame_number += 1

    cap.release()
    return timestamps

def convert_frames_to_pdf(input_folder, output_file, timestamps):
    frame_files = sorted(os.listdir(input_folder), key=lambda x: int(x.split('_')[0].split('frame')[-1]))
    pdf = FPDF("L")
    pdf.set_auto_page_break(0)

    for i, (frame_file, (frame_number, timestamp_seconds)) in enumerate(zip(frame_files, timestamps)):
        frame_path = os.path.join(input_folder, frame_file)
        image = Image.open(frame_path)
        pdf.add_page()
        pdf.image(frame_path, x=0, y=0, w=pdf.w, h=pdf.h)

        timestamp = f"{timestamp_seconds // 3600:02d}:{(timestamp_seconds % 3600) // 60:02d}:{timestamp_seconds % 60:02d}"
        
        x, y, width, height = 5, 5, 60, 15
        region = image.crop((x, y, x + width, y + height)).convert("L")
        mean_pixel_value = region.resize((1, 1)).getpixel((0, 0))
        if mean_pixel_value < 64:
            pdf.set_text_color(255, 255, 255)
        else:
            pdf.set_text_color(0, 0, 0)

        pdf.set_xy(x, y)
        pdf.set_font("Arial", size=12)
        pdf.cell(0, 0, timestamp)

    pdf.output(output_file)

def create_transcripts_pdf(output_file, timestamps, captions):
    pdf = FPDF("P")
    pdf.set_auto_page_break(0)
    page_height = pdf.h

    caption_index = 0
    for i, (frame_number, timestamp_seconds) in enumerate(timestamps):
        pdf.add_page()

        timestamp = f"{timestamp_seconds // 3600:02d}:{(timestamp_seconds % 3600) // 60:02d}:{timestamp_seconds % 60:02d}"
        pdf.set_text_color(0, 0, 0)
        pdf.set_xy(10, 10)
        pdf.set_font("Arial", size=14)
        pdf.cell(0, 0, timestamp)

        if captions and caption_index < len(captions):
            transcript = ""
            start_time = 0 if i == 0 else timestamps[i - 1][1]
            end_time = timestamp_seconds

            while caption_index < len(captions) and start_time * 1000 <= captions[caption_index][0] < end_time * 1000:
                transcript += f"{captions[caption_index][2]}\n"
                caption_index += 1

            pdf.set_text_color(0, 0, 0)
            pdf.set_xy(10, 25)
            pdf.set_font("Arial", size=10)
            lines = transcript.split("\n")
            for line in lines:
                if pdf.get_y() + 10 > page_height:
                    pdf.add_page()
                    pdf.set_xy(10, 10)
                pdf.cell(0, 10, line)
                pdf.ln()

    pdf.output(output_file)

def convert_frames_to_list(input_folder, timestamps):
    """
    Converts frames into a list of image paths and their corresponding timestamps.

    Args:
        input_folder (str): The folder where extracted frames are stored.
        timestamps (list): List of tuples (frame_number, timestamp_seconds).

    Returns:
        list: A list of dictionaries with keys 'image_path' and 'timestamp'.
    """
    frame_files = sorted(os.listdir(input_folder), key=lambda x: int(x.split('_')[0].split('frame')[-1]))
    frames_data = []

    for i, (frame_file, (frame_number, timestamp_seconds)) in enumerate(zip(frame_files, timestamps)):
        frame_path = os.path.join(input_folder, frame_file)
        
        # Format the timestamp as HH:MM:SS
        formatted_timestamp = f"{timestamp_seconds // 3600:02d}:{(timestamp_seconds % 3600) // 60:02d}:{timestamp_seconds % 60:02d}"
        
        # Append frame details to the list
        frames_data.append({
            'image_path': frame_path,
            'timestamp': formatted_timestamp
        })

    return frames_data

def get_video_title(url):
    ydl_opts = {
        'skip_download': True,
        'ignoreerrors': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        video_info = ydl.extract_info(url, download=False)
        title = video_info['title'].replace('/', '-').replace('\\', '-').replace(':', '-').replace('*', '-').replace('?', '-').replace('<', '-').replace('>', '-').replace('|', '-').replace('"', '-').strip('.')
        return title
    
def fetch_subtitles(video_id, lang='en'):
    """
    Fetch subtitles for a given YouTube video ID and format them.
    :param video_id: YouTube video ID
    :param lang: Language of subtitles (default: 'en')
    :return: List of dictionaries with 'timestamp' and 'text'
    """
    try:
        # Fetch subtitles
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[lang])
        
        # Format the subtitles into a list of dictionaries
        formatted_subtitles = []
        for entry in transcript:
            start_time = entry['start']
            hours = int(start_time // 3600)
            minutes = int((start_time % 3600) // 60)
            seconds = int(start_time % 60)
            timestamp = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            formatted_subtitles.append({'timestamp': timestamp, 'text': entry['text']})
        
        return formatted_subtitles
    
    except Exception as e:
        print(f"Error fetching subtitles: {e}")
        return None

def merge_frame_data_with_transcript(transcript, frame_data):
    """
    Merge frame data into transcript by matching timestamps.
    
    :param transcript: List of dictionaries representing transcript entries, with 'timestamp' and 'text'.
    :param frame_data: List of dictionaries representing frame data with 'timestamp' and 'description'.
    :return: String containing merged transcript.
    """
    # Prepare a sorted list of frame data for efficient lookup
    frame_data_index = 0
    frame_data = sorted(frame_data, key=lambda x: x['timestamp'])

    merged_output = ""
    for entry in transcript:
        # Extract current transcript timestamp and text
        transcript_time = entry['timestamp']
        transcript_text = entry['text']

        # Add frame data descriptions if their timestamp <= current transcript timestamp
        while frame_data_index < len(frame_data) and frame_data[frame_data_index]['timestamp'] <= transcript_time:
            frame_description = frame_data[frame_data_index]['description']
            merged_output += f"{frame_data[frame_data_index]['timestamp']}\n"
            merged_output += f"Current Section Video Data: {frame_description}\n"
            frame_data_index += 1

        # Add the transcript text
        merged_output += f"{transcript_time}\n{transcript_text}\n"

    return merged_output


@app.route('/get_user_history/<user_id>', methods=['GET'])
def get_user_history(user_id):
    try:
        user_object_id = ObjectId(user_id)  # Convert to ObjectId
        user_document = videolist_collection.find_one({"_id": user_object_id})
        
        if not user_document:
            return jsonify({"error": "User not found."}), 404

        video_ids = user_document.get('video_ids', [])
        videos = collection.find({"_id": {"$in": [ObjectId(vid) for vid in video_ids]}})
        video_list = []
        for video in videos:
            video['_id'] = str(video['_id'])
            video_list.append(video)

        return jsonify({"videos": video_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/delete_course/<user_id>/<video_id>', methods=['DELETE'])
def delete_course(user_id, video_id):
    try:
        user_object_id = ObjectId(user_id)
        video_object_id = ObjectId(video_id)

        # Remove the video from the user's course list
        videolist_collection.update_one(
            {"_id": user_object_id},
            {"$pull": {"video_ids": video_object_id}}
        )

        # Optionally, delete the video record from the video_data collection
        collection.delete_one({"_id": video_object_id})

        return jsonify({"message": "Course deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_video_data/<video_id>', methods=['GET'])
def get_video_data(video_id):
    try:
        print(f"Fetching video data for ID: {video_id}")  # Add this
        video_data = collection.find_one({"_id": ObjectId(video_id)})
        if not video_data:
            print("Video not found.")
            return jsonify({"error": "Video not found."}), 404

        video_data["_id"] = str(video_data["_id"])
        return jsonify(video_data), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
# Endpoint: Get video IDs for a user
@app.route('/get_video_ids/<user_id>', methods=['GET'])
def get_video_ids(user_id):
    try:
        user_document = videolist_collection.find_one({"_id": ObjectId(user_id)})
        if not user_document:
            return jsonify({"error": "User not found."}), 404
        video_ids = [str(video_id) for video_id in user_document.get('video_ids', [])]
        return jsonify({"user_id": user_id, "video_ids": video_ids}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_course_details/<course_id>', methods=['GET'])
def get_course_details(course_id):
    """
    Fetch course details based on the given course ID (_id).
    Returns video_id, video_title, notes_json, and questions_json fields.
    """
    try:
        # Query the MongoDB collection for the given _id
        course = collection.find_one({"_id": ObjectId(course_id)})
        
        if not course:
            return jsonify({"error": "Course not found."}), 404

        # Prepare the response with the required fields
        course_details = {
            "video_id": course.get("video_id"),
            "video_title": course.get("video_title"),
            "notes_json": course.get("notes_json", {}),
            "questions_json": course.get("questions_json", [])
        }

        return jsonify(course_details), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route('/process_videos', methods=['POST'])
def process_videos():
    try:
        data = request.get_json()
        
        # Extract user_id and validate it
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required."}), 400

        try:
            user_object_id = ObjectId(user_id)
        except Exception:
            return jsonify({"error": "Invalid user ID format."}), 400

        # Extract URLs
        urls = data.get('urls', [])
        if not urls:
            return jsonify({"error": "No URLs provided."}), 400

        video_results = []

        for url in urls:
            video_urls = []
            if 'playlist?list=' in url:
                video_urls.extend(get_playlist_videos(url))
            else:
                video_urls.append(url)

            for video_url in video_urls:
                video_id = get_video_id(video_url)
                if not video_id:
                    return jsonify({"error": f"Invalid URL: {video_url}"}), 400

                video_title = get_video_title(video_url)
                video_file = f"video_{video_id}.mp4"
                download_video(video_url, video_file)

                subtitles = fetch_subtitles(video_id)
                output_pdf_filename = f"{video_title}.pdf"

                with tempfile.TemporaryDirectory() as tmp_dir:
                    frames_folder = os.path.join(tmp_dir, "frames")
                    os.makedirs(frames_folder)

                    timestamps = extract_unique_frames(video_file, frames_folder)
                    convert_frames_to_pdf(frames_folder, output_pdf_filename, timestamps)

                    frames_data = convert_frames_to_list(frames_folder, timestamps)
                    video_data = process_frames_with_gpt(frames_data)
                    merged_data = merge_frame_data_with_transcript(subtitles, video_data)

                    notes_json = generate_notes(merged_data)
                    questions_json = generate_mcqs(notes_json)

                    document = {
                        "video_id": video_id,
                        "video_title": video_title,
                        "notes_json": notes_json,
                        "questions_json": questions_json
                    }
                    inserted_doc = collection.insert_one(document)
                    mongo_vid_id = inserted_doc.inserted_id

                    add_videos_for_user(user_object_id, mongo_vid_id)

                video_results.append({
                    "video_id": video_id,
                    "video_title": video_title,
                    "notes_json": notes_json,
                    "questions_json": questions_json,
                    "output_pdf": output_pdf_filename
                })

        return jsonify(video_results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)