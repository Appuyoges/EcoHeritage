"""
Comprehensive System Test
Tests all critical endpoints and functionality
"""
import asyncio
import aiohttp
import sys

async def test_backend_health():
    """Test if backend is running"""
    print("\n=== Testing Backend Health ===")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8000/", timeout=2) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"[OK] Backend is UP: {data}")
                    return True
                else:
                    print(f"[FAIL] Backend returned status: {resp.status}")
                    return False
    except Exception as e:
        print(f"[FAIL] Backend is DOWN: {e}")
        return False

async def test_user_profile():
    """Test user profile endpoint"""
    print("\n=== Testing User Profile API ===")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8000/api/users/user_001", timeout=5) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"[OK] Profile Fetched: {data.get('name')}")
                    print(f"  Email: {data.get('email')}")
                    print(f"  Level: {data.get('level')}")
                    print(f"  Green Points: {data.get('green_points')}")
                    return True
                else:
                    print(f"[FAIL] Failed with status: {resp.status}")
                    return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

async def test_profile_update():
    """Test profile update endpoint"""
    print("\n=== Testing Profile Update API ===")
    try:
        async with aiohttp.ClientSession() as session:
            update_data = {
                "id": "user_001",
                "name": "Yogeswaran S (Updated)",
                "email": "yogeswaran@example.com"
            }
            async with session.put(
                "http://localhost:8000/api/users/user_001",
                json=update_data,
                timeout=5
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"[OK] Profile Updated: {data}")
                    return True
                else:
                    text = await resp.text()
                    print(f"[FAIL] Failed with status: {resp.status}")
                    print(f"  Response: {text}")
                    return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

async def test_chat_endpoint():
    """Test chat endpoint"""
    print("\n=== Testing Chat API ===")
    try:
        async with aiohttp.ClientSession() as session:
            chat_data = {
                "message": "Hello, how are you?",
                "role": "user"
            }
            async with session.post(
                "http://localhost:8000/api/chat/message",
                json=chat_data,
                timeout=10
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"[OK] Chat Response: {data.get('response')[:100]}...")
                    return True
                else:
                    text = await resp.text()
                    print(f"[FAIL] Failed with status: {resp.status}")
                    print(f"  Response: {text}")
                    return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

async def test_frontend():
    """Test if frontend is accessible"""
    print("\n=== Testing Frontend ===")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:5173/", timeout=2) as resp:
                if resp.status == 200:
                    print(f"[OK] Frontend is accessible")
                    return True
                else:
                    print(f"[FAIL] Frontend returned status: {resp.status}")
                    return False
    except Exception as e:
        print(f"[FAIL] Frontend is DOWN: {e}")
        return False

async def main():
    print("=" * 60)
    print("ECOHERITAGE SYSTEM TEST")
    print("=" * 60)
    
    results = {
        "Backend Health": await test_backend_health(),
        "User Profile": await test_user_profile(),
        "Profile Update": await test_profile_update(),
        "Chat API": await test_chat_endpoint(),
        "Frontend": await test_frontend()
    }
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(results.values())
    total = len(results)
    
    for test, result in results.items():
        status = "PASS" if result else "FAIL"
        symbol = "[OK]" if result else "[FAIL]"
        print(f"{symbol} {test}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n[SUCCESS] All systems operational!")
    else:
        print("\n[WARNING] Some systems need attention")
    
    return passed == total

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
