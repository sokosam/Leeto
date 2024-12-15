let isSubmitReceived = false;

// Listen for requests to the /submit/ endpoint
console.log("on");

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log("on2");

    // Check if the request is a POST request to /submit
    if (details.method === "POST" && details.url.includes("/submit")) {
      // Capture the request body
      const requestBody = details.requestBody;
      if (requestBody && requestBody.raw) {
        // Decode the request body and parse it (assuming it's JSON)
        const data = new TextDecoder().decode(requestBody.raw[0].bytes);
        try {
          const submitData = JSON.parse(data);
          console.log("Submit Data:", submitData);

          // Flag that the /submit request was received
          isSubmitReceived = true;

          // Process the data (store it, send to background, etc.)
        } catch (error) {
          console.error("Error parsing /submit request body:", error);
        }
      }
    }

    // Wait for /check request after /submit
    // Wait for /check request after /submit
    if (
      isSubmitReceived &&
      details.method === "GET" &&
      details.url.includes("/check")
    ) {
      const requestBody = details.requestBody;
      if (requestBody && requestBody.raw) {
        const checkData = new TextDecoder().decode(requestBody.raw[0].bytes);
        try {
          const parsedCheckData = JSON.parse(checkData);
          console.log("Check Data:", parsedCheckData);

          // Only proceed if the state is SUCCESS
          if (parsedCheckData.state === "SUCCESS") {
            console.log("Success state received!");

            // After /check, reset the flag and collect data as needed
            isSubmitReceived = false;

            // Process the /check data (store, send to background, etc.)
          } else {
            console.log("State is not SUCCESS, skipping processing.");
          }
        } catch (error) {
          console.error("Error parsing /check request body:", error);
        }
      }
    }
  },
  { urls: ["https://leetcode.com/*"] }, // Listen for requests to LeetCode domain
  ["requestBody"]
);
