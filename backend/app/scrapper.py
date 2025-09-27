import praw
import os
from datetime import datetime
from dotenv import load_dotenv
from .database import insert_gig

# Load environment variables
load_dotenv()

KEYWORDS = ["react", "python", "fastapi", "developer", "freelancer", "nextjs", "javascript", "nodejs", "next.js", "fullstack", "backend", "frontend"]

def scrape_reddit():
    reddit = praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent=os.getenv("REDDIT_USER_AGENT")
    )

    for post in reddit.subreddit("WebDeveloperJobs+freelance_forhire+remotejs+remotepython+forhire+freelancing").new(limit=50):
        # Skip posts where people are offering their services
        title_lower = post.title.lower()
        if "[for hire]" in title_lower:
            continue
            
        text = f"{post.title} {post.selftext}".lower()
        
        # Find matching keywords
        matching_tags = [kw for kw in KEYWORDS if kw in text]
        
        if matching_tags:
            # Convert Reddit timestamp to readable date
            post_date = datetime.fromtimestamp(post.created_utc).strftime("%Y-%m-%d %H:%M:%S")
            
            # Convert tags list to comma-separated string for storage
            tags_str = ",".join(matching_tags)
            
            insert_gig(
                post.title,
                f"https://reddit.com{post.permalink}",
                post.selftext,
                "Reddit",
                post_date,
                tags_str
            )
