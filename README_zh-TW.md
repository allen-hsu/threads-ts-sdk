# ThreadsSDK

[English](./README.md) | [繁體中文](./README_zh-TW.md)

ThreadsSDK 是一個用於與 Threads API 互動的 TypeScript SDK。它封裝了獲取授權、發布內容、管理回覆、檢索洞察等功能，簡化了與 Threads API 的整合過程。

Threads Official API Document [here](https://developers.facebook.com/docs/threads).

## 安裝

使用 npm 安裝 `npm install threads-ts-sdk`：

```sh
npm install threads-ts-sdk
```

## 配置

在使用 ThreadsSDK 之前，您需要配置以下參數：

- clientId：您的 Threads 應用程式 ID。
- clientSecret：您的 Threads 應用程式密鑰。
- redirectUri：重定向 URI。
- scope：授權範圍。

```typescript
import ThreadsSDK from "./ThreadsSDK";

const sdk = new ThreadsSDK({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
  scope: "threads_basic,threads_manage_insights", // 根據需要調整範圍
});
```

## 使用範例

### 獲取授權 URL 並重定向用戶

```typescript
const authUrl = sdk.getAuthorizationUrl();
console.log("授權 URL：", authUrl);
// 在您的應用程式中將用戶重定向到 `authUrl`
```

### 獲取訪問令牌

在用戶被重定向回您的應用程式並提供授權碼後，使用以下代碼獲取訪問令牌：

```typescript
const authorizationCode = "QUERY_STRING_中的代碼";

sdk
  .getAccessToken(authorizationCode)
  .then((response) => {
    console.log("訪問令牌：", response.accessToken);
    console.log("用戶 ID：", response.userId);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 獲取長期訪問令牌

```typescript
const shortLivedToken = "YOUR_SHORT_LIVED_TOKEN";

sdk
  .getLongLivedToken(shortLivedToken)
  .then((longLivedToken) => {
    console.log("長期令牌：", longLivedToken);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 刷新長期訪問令牌

```typescript
const longLivedToken = "YOUR_LONG_LIVED_TOKEN";

sdk
  .refreshLongLivedToken(longLivedToken)
  .then((refreshedToken) => {
    console.log("刷新後的長期令牌：", refreshedToken);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 發布單個 Thread 帖子

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
    console.log("已發布的單張圖片帖子 ID：", postId);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 發布輪播帖子

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
  "來看看這些圖片！"
);
const carouselPostId = await sdk.publishCarouselContainer(
  response.userId,
  carouselContainerId
);
console.log("已發布的輪播帖子 ID：", carouselPostId);
```

### 檢索所有用戶的 Threads

```typescript
sdk
  .getUserThreads(response.userId, [
    "id",
    "media_product_type",
    "media_type",
    "text",
  ])
  .then((threads) => {
    console.log("用戶 Threads：", threads);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 檢索單個 Threads 媒體對象

```typescript
sdk
  .getThreadsMediaObject("MEDIA_ID", [
    "id",
    "media_product_type",
    "media_type",
    "text",
  ])
  .then((mediaObject) => {
    console.log("Threads 媒體對象：", mediaObject);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 檢索用戶個人資料信息

```typescript
sdk
  .getUserProfile(response.userId, [
    "id",
    "username",
    "threads_profile_picture_url",
    "threads_biography",
  ])
  .then((profile) => {
    console.log("用戶個人資料：", profile);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });
```

### 管理回覆

```typescript
// 檢索回覆
sdk
  .getReplies("MEDIA_ID", ["id", "text", "timestamp"])
  .then((replies) => {
    console.log("回覆：", replies);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });

// 檢索對話
sdk
  .getConversation("MEDIA_ID", ["id", "text", "timestamp"])
  .then((conversation) => {
    console.log("對話：", conversation);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });

// 隱藏/取消隱藏回覆
sdk
  .hideReply("REPLY_ID", true)
  .then((success) => {
    console.log("隱藏回覆成功：", success);
  })
  .catch((error) => {
    console.error("錯誤：", error.message);
  });

// 回覆評論
sdk
  .respondToReply(
    response.userId,
    "TEXT",
    "感謝您的評論！",
    "REPLY_TO_ID"
  )
  .then((
```
