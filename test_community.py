import asyncio
import httpx
from colorama import Fore, Style, init

init()

BASE_URL = "http://localhost:8000/api/community"

async def test_community_flow():
    async with httpx.AsyncClient() as client:
        print(f"{Fore.CYAN}Testing Multi-User Community API...{Style.RESET_ALL}")
        
        # User 1: Alice (user_456)
        ALICE_ID = "user_456"
        # User 2: Bob (user_789)
        BOB_ID = "user_789"

        # 1. Alice Creates Post
        print(f"\n{Fore.YELLOW}1. Alice ({ALICE_ID}) Creating Post...{Style.RESET_ALL}")
        post_data = {
            "content": "Hello from Alice! #EcoTravel",
            "location": "Bangalore",
            "tags": ["Eco", "Test"]
        }
        res = await client.post(f"{BASE_URL}/posts", json=post_data, headers={"x-user-id": ALICE_ID})
        if res.status_code != 200:
            print(f"{Fore.RED}Failed: {res.text}{Style.RESET_ALL}")
            return
        
        post = res.json()["post"]
        post_id = post["id"]
        print(f"{Fore.GREEN}Success! Alice posted ID: {post_id}{Style.RESET_ALL}")
        
        # 2. Bob Likes Alice's Post
        print(f"\n{Fore.YELLOW}2. Bob ({BOB_ID}) Liking Alice's Post...{Style.RESET_ALL}")
        res = await client.post(f"{BASE_URL}/posts/{post_id}/like", headers={"x-user-id": BOB_ID})
        print(f"{Fore.GREEN}Like Result: {res.json()}{Style.RESET_ALL}")
        
        # 3. Bob Comments
        print(f"\n{Fore.YELLOW}3. Bob Commenting...{Style.RESET_ALL}")
        comment_data = {"content": "Great post Alice! - Bob"}
        res = await client.post(f"{BASE_URL}/posts/{post_id}/comment", json=comment_data, headers={"x-user-id": BOB_ID})
        print(f"{Fore.GREEN}Comment Result: {res.json()}{Style.RESET_ALL}")
        
        # 4. Verify in Feed
        print(f"\n{Fore.YELLOW}4. Fetching Feed...{Style.RESET_ALL}")
        res = await client.get(f"{BASE_URL}/posts")
        posts = res.json()["posts"]
        target_post = next((p for p in posts if p["id"] == post_id), None)
        
        if target_post:
            print(f"{Fore.GREEN}Post verified! Likes: {target_post['likes']}, Comments: {target_post['comments_count']}{Style.RESET_ALL}")
            print(f"Author: {target_post['user']['name']}")
        
        # 5. Check Alice's Points (Should have increased by 50 (post) + 10 (like))
        print(f"\n{Fore.YELLOW}5. Checking Alice's Points in Leaderboard...{Style.RESET_ALL}")
        res = await client.get("http://localhost:8000/api/users/leaderboard")
        leaderboard = res.json()["leaderboard"]
        alice = next((u for u in leaderboard if u["name"] == "Alice Green"), None)
        
        if alice:
            print(f"{Fore.GREEN}Alice found! Points: {alice['points']} (Should be high){Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}Alice not found in Top 10 users.{Style.RESET_ALL}")

if __name__ == "__main__":
    asyncio.run(test_community_flow())
