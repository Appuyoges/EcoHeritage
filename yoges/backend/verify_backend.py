
import asyncio
import aiohttp
import sys

async def check_health():
    url = "http://localhost:8000/"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=2) as resp:
                if resp.status == 200:
                    print(f"Backend is UP: {await resp.json()}")
                else:
                    print(f"Backend returned status: {resp.status}")
    except Exception as e:
        print(f"Backend is DOWN or Unreachable: {e}")

async def check_user_profile():
    url = "http://localhost:8000/api/users/user_001"
    try:
        async with aiohttp.ClientSession() as session:
            print(f"Fetching {url}...")
            async with session.get(url, timeout=5) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"User Profile Fetched: {data.get('name')}")
                else:
                    print(f"Failed to fetch profile. Status: {resp.status}")
                    text = await resp.text()
                    print(f"Response: {text}")
    except asyncio.TimeoutError:
         print("Request Timed Out (Backend hanging)")
    except Exception as e:
        print(f"Error fetching profile: {e}")

async def main():
    print("--- Verifying Backend Health ---")
    await check_health()
    print("\n--- Verifying User Profile API ---")
    await check_user_profile()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
