import sqlite3

DB_PATH = "gigs.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gigs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            url TEXT,
            content TEXT,
            platform TEXT,
            post_date TEXT,
            tags TEXT
        )
    """)
    conn.commit()
    conn.close()

def insert_gig(title, url, content, platform, post_date, tags):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO gigs (title, url, content, platform, post_date, tags) VALUES (?, ?, ?, ?, ?, ?)",
        (title, url, content, platform, post_date, tags)
    )
    conn.commit()
    conn.close()

def get_all_gigs():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, url, content, platform, post_date, tags FROM gigs ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows

def clear_gigs():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM gigs")
    conn.commit()
    conn.close()
