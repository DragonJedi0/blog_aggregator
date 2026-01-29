# blog_aggregator

**blog_aggregator** is a terminal-based RSS feed aggregator built with TypeScript and PostgreSQL. It allows users to collect posts from RSS feeds across the internet, manage their subscriptions, and view aggregated post summaries in the terminal.

---

## Features

- Add RSS feeds from across the internet to be collected.  
- Store collected posts in a PostgreSQL database.  
- Follow and unfollow RSS feeds that other users have added.  
- View summaries of aggregated posts in the terminal, with links to the full post.

---

## Commands

| Command     | Description |
|------------|-------------|
| `login` | Log in a user by name. |
| `register` | Register a new user by name. |
| `users` | List all registered users. |
| `agg` | Aggregate posts from the feed list (fetch new posts). |
| `addfeed` | Add a feed by URL to the current user's follow list and store the feed in the database with a name. |
| `feeds` | List all feeds in the database by name. |
| `follow` | Add a feed by URL to the current user's follow list. |
| `following` | List feeds currently being followed by the current user. |
| `unfollow` | Remove a feed from the current user's follow list. |
| `browse` | List posts found in the feed follow list of the current user. |

---

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd blog_aggregator
```

2. Install dependencies:

  ```bash
    npm install
  ```

3. Set up your PostgreSQL database and configure connection details (via environment variables or config file).

---

## Usage

Start the CLI and use the available commands:

  ```bash
npm run start
  ```

Example workflow:

1. Register or login:

  ```bash
register Alice
login Alice
  ```

2. Add and follow feeds:

  ```bash
addfeed "TechCrunch" "https://techcrunch.com/feed/"
follow "https://techcrunch.com/feed/"
  ```

3. Aggregate posts from followed feeds:

  ```bash
agg
  ```

4. Browse posts:

  ```bash
browse 5
  ```

> The `browse` command can take an optional limit to specify how many posts to display (default: 2).

---

## Database Schema

- **users**: Stores user accounts.  
- **feeds**: Stores RSS feed URLs and names.  
- **feed_follows**: Maps users to the feeds they follow.  
- **posts**: Stores aggregated posts with fields such as `title`, `url`, `description`, `publishedAt`, and `feedId`.

---

## Contributing

Feel free to fork the project and submit PRs. Suggestions for new features, improvements, or bug fixes are welcome!