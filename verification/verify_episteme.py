from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({"width": 1280, "height": 800})

    print("Navigating to Episteme...")
    page.goto("http://localhost:5173/")

    # 1. Verify Map View
    print("Verifying Map View...")
    page.wait_for_selector("text=Your Journey Map")
    page.screenshot(path="verification/01_map_initial.png")

    # 2. Click on 'Scientific Practices'
    print("Clicking on 'Scientific Practices' node...")
    page.locator("text=The Awakening").click()

    # 3. Verify Quest View
    print("Verifying Quest View...")
    page.wait_for_selector("text=The Challenge")
    page.screenshot(path="verification/02_quest_view.png")

    # 4. Answer Incorrectly First
    print("Answering incorrectly...")
    page.locator("button:has-text('Immediately hit it with a hammer')").click()
    page.wait_for_selector("text=Think about safety")
    page.screenshot(path="verification/03_quest_hint.png")

    # 5. Answer Correctly
    print("Answering correctly...")
    page.locator("button:has-text('Observe its properties')").click()
    page.wait_for_selector("text=Excellent! Observation is the foundation")
    page.screenshot(path="verification/04_quest_success.png")

    # 6. Complete Quest
    print("Completing quest...")
    # Click the complete button
    page.locator("button:has-text('Quest Complete - Continue Journey')").click()

    # 7. Verify Map Update
    print("Verifying Map Update...")
    # Wait for map to appear
    page.wait_for_selector("text=Your Journey Map")
    # Take screenshot to verify progress text visually
    page.screenshot(path="verification/05_map_updated.png")

    # 8. Open Hall of Process
    print("Opening Hall of Process...")
    page.locator("button:has-text('Hall of Process')").click()
    page.wait_for_selector("text=Your journey reflected in data")
    page.screenshot(path="verification/06_hall_of_process.png")
    # Take screenshot of the hall content to verify stats
    page.screenshot(path="verification/07_hall_content.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
