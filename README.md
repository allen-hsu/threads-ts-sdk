# ThreadsSDK

[English](./README.md) | [繁體中文](./README_zh-TW.md)

ThreadsSDK is a TypeScript SDK for interacting with the Threads API. It encapsulates functionalities such as obtaining authorization, posting content, managing replies, retrieving insights, and more, simplifying the integration process with the Threads API.

Threads OfficialAPI Document [here](https://developers.facebook.com/docs/threads).

## Installation

Install the `threads-ts-sdk` dependency using npm:

```sh
npm install threads-ts-sdk
```

## Configuration

Before using ThreadsSDK, you need to configure the following parameters:

- clientId: Your Threads App ID.
- clientSecret: Your Threads App Secret.
- redirectUri: Redirect URI.
- scope: Authorization scope.

```typescript
import ThreadsSDK from "./ThreadsSDK";

const sdk = new ThreadsSDK({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
  scope: "threads_basic,threads_manage_insights", // Adjust the scope as needed
});
```

## Usage Examples

### Get Authorization URL and Redirect User

```typescript
const authUrl = sdk.getAuthorizationUrl();
console.log("Authorization URL:", authUrl);
// Redirect the user to `authUrl` in your application
```

### Get Access Token

After the user is redirected back to your application and provides the authorization code, use the following code to get the access token:

```typescript
const authorizationCode = "CODE_FROM_QUERY_STRING";

sdk
  .getAccessToken(authorizationCode)
  .then((response) => {
    console.log("Access Token:", response.accessToken);
    console.log("User ID:", response.userId);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Get Long-Lived Access Token

```typescript
const shortLivedToken = "YOUR_SHORT_LIVED_TOKEN";

sdk
  .getLongLivedToken(shortLivedToken)
  .then((longLivedToken) => {
    console.log("Long-Lived Token:", longLivedToken);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Refresh Long-Lived Access Token

```typescript
const longLivedToken = "YOUR_LONG_LIVED_TOKEN";

sdk
  .refreshLongLivedToken(longLivedToken)
  .then((refreshedToken) => {
    console.log("Refreshed Long-Lived Token:", refreshedToken);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Publish a Single Thread Post

```typescript
sdk
  .createMediaContainer(
    response.userId,
    "IMAGE",
    "https://www.example.com/images/bronz-fonz.jpg",
    "#BronzFonz"
  )
  .then((mediaContainerId) => {
    return sdk.publishMediaContainer(response.userId, mediaContainerId);
  })
  .then((postId) => {
    console.log("Published Single Image Post ID:", postId);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Publish a Carousel Post

```typescript
const item1 = await sdk.createCarouselItemContainer(
  response.userId,
  "IMAGE",
  "https://www.example.com/images/image1.jpg"
);
const item2 = await sdk.createCarouselItemContainer(
  response.userId,
  "IMAGE",
  "https://www.example.com/images/image2.jpg"
);
const carouselContainerId = await sdk.createCarouselContainer(
  response.userId,
  [item1, item2],
  "Check out these images!"
);
const carouselPostId = await sdk.publishCarouselContainer(
  response.userId,
  carouselContainerId
);
console.log("Published Carousel Post ID:", carouselPostId);
```

### Retrieve All User's Threads

```typescript
sdk
  .getUserThreads(response.userId, [
    "id",
    "media_product_type",
    "media_type",
    "text",
  ])
  .then((threads) => {
    console.log("User Threads:", threads);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Retrieve a Single Threads Media Object

```typescript
sdk
  .getThreadsMediaObject("MEDIA_ID", [
    "id",
    "media_product_type",
    "media_type",
    "text",
  ])
  .then((mediaObject) => {
    console.log("Threads Media Object:", mediaObject);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Retrieve User Profile Information

```typescript
sdk
  .getUserProfile(response.userId, [
    "id",
    "username",
    "threads_profile_picture_url",
    "threads_biography",
  ])
  .then((profile) => {
    console.log("User Profile:", profile);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Manage Replies

```typescript
// Retrieve Replies
sdk
  .getReplies("MEDIA_ID", ["id", "text", "timestamp"])
  .then((replies) => {
    console.log("Replies:", replies);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Retrieve Conversation
sdk
  .getConversation("MEDIA_ID", ["id", "text", "timestamp"])
  .then((conversation) => {
    console.log("Conversation:", conversation);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Hide/Unhide Reply
sdk
  .hideReply("REPLY_ID", true)
  .then((success) => {
    console.log("Hide Reply Success:", success);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Respond to Reply
sdk
  .respondToReply(
    response.userId,
    "TEXT",
    "Thank you for your comment!",
    "REPLY_TO_ID"
  )
  .then((replyId) => {
    console.log("Respond to Reply ID:", replyId);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Control Who Can Reply
sdk
  .controlWhoCanReply(
    response.userId,
    "TEXT",
    "This is a new post",
    "accounts_you_follow"
  )
  .then((controlReplyId) => {
    console.log("Control Who Can Reply ID:", controlReplyId);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Retrieve Insights

```typescript
// Retrieve Media Insights
sdk
  .getMediaInsights("MEDIA_ID", ["likes", "replies"])
  .then((mediaInsights) => {
    console.log("Media Insights:", mediaInsights);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Retrieve User Insights
sdk
  .getUserInsights(response.userId, ["views", "likes"], 1712991600, 1713078000)
  .then((userInsights) => {
    console.log("User Insights:", userInsights);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```
