import axios from "axios";

interface ThreadsSDKConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

class ThreadsSDK {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scope: string;
  private accessToken: string | null;

  constructor(config: ThreadsSDKConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scope = config.scope;
    this.accessToken = null;
  }

  // Get Authorization URL
  getAuthorizationUrl(state?: string): string {
    const baseUrl = "https://threads.net/oauth/authorize";
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      response_type: "code",
    });

    if (state) {
      params.append("state", state);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  // Exchange Authorization Code for Access Token
  async getAccessToken(
    code: string
  ): Promise<{ accessToken: string; userId: string }> {
    const url = "https://graph.threads.net/oauth/access_token";
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "authorization_code",
      redirect_uri: this.redirectUri,
      code: code,
    });

    try {
      const response = await axios.post(url, params);
      const data = response.data;
      this.accessToken = data.access_token;
      return {
        accessToken: data.access_token,
        userId: data.user_id,
      };
    } catch (error) {
      throw new Error(
        `Failed to get access token: ${error.response.data.error_message}`
      );
    }
  }

  // Exchange Short-Lived Token for Long-Lived Token
  async getLongLivedToken(shortLivedToken: string): Promise<string> {
    const url = "https://graph.threads.net/access_token";
    const params = new URLSearchParams({
      grant_type: "th_exchange_token",
      client_secret: this.clientSecret,
      access_token: shortLivedToken,
    });

    try {
      const response = await axios.get(url, { params });
      const data = response.data;
      return data.access_token;
    } catch (error) {
      throw new Error(
        `Failed to get long-lived token: ${error.response.data.error_message}`
      );
    }
  }

  //Refresh Long-Lived Token
  async refreshLongLivedToken(longLivedToken: string): Promise<string> {
    const url = "https://graph.threads.net/refresh_access_token";
    const params = new URLSearchParams({
      grant_type: "th_refresh_token",
      access_token: longLivedToken,
    });

    try {
      const response = await axios.get(url, { params });
      const data = response.data;
      return data.access_token;
    } catch (error) {
      throw new Error(
        `Failed to refresh long-lived token: ${error.response.data.error_message}`
      );
    }
  }

  // Create Media Container for Single Thread Post
  async createMediaContainer(
    userId: string,
    mediaType: "TEXT" | "IMAGE" | "VIDEO",
    mediaUrl?: string,
    text?: string
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads`;
    const params: any = {
      media_type: mediaType,
      access_token: this.accessToken,
    };

    if (mediaType === "IMAGE" && mediaUrl) {
      params.image_url = mediaUrl;
    } else if (mediaType === "VIDEO" && mediaUrl) {
      params.video_url = mediaUrl;
    } else if (mediaType === "TEXT" && text) {
      params.text = text;
    }

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to create media container: ${error.response.data.error_message}`
      );
    }
  }

  // Publish Media Container
  async publishMediaContainer(
    userId: string,
    creationId: string
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads_publish`;
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: this.accessToken,
    });

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to publish media container: ${error.response.data.error_message}`
      );
    }
  }

  // Create Carousel Item Container
  async createCarouselItemContainer(
    userId: string,
    mediaType: "IMAGE" | "VIDEO",
    mediaUrl: string
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads`;
    const params: any = {
      media_type: mediaType,
      is_carousel_item: true,
      access_token: this.accessToken,
    };

    if (mediaType === "IMAGE") {
      params.image_url = mediaUrl;
    } else if (mediaType === "VIDEO") {
      params.video_url = mediaUrl;
    }

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to create carousel item container: ${error.response.data.error_message}`
      );
    }
  }

  // Create Carousel Container
  async createCarouselContainer(
    userId: string,
    children: string[],
    text?: string
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads`;
    const params: any = {
      media_type: "CAROUSEL",
      children: children.join(","),
      access_token: this.accessToken,
    };

    if (text) {
      params.text = text;
    }

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to create carousel container: ${error.response.data.error_message}`
      );
    }
  }

  // Publish Carousel Container
  async publishCarouselContainer(
    userId: string,
    creationId: string
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads_publish`;
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: this.accessToken,
    });

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to publish carousel container: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve All User's Threads
  async getUserThreads(
    userId: string,
    fields: string[],
    since?: string,
    until?: string,
    limit: number = 10
  ): Promise<any[]> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads`;
    const params: any = {
      fields: fields.join(","),
      limit: limit.toString(),
      access_token: this.accessToken,
    };

    if (since) {
      params.since = since;
    }

    if (until) {
      params.until = until;
    }

    try {
      const response = await axios.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve user's threads: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve Single Threads Media Object
  async getThreadsMediaObject(mediaId: string, fields: string[]): Promise<any> {
    const url = `https://graph.threads.net/v1.0/${mediaId}`;
    const params: any = {
      fields: fields.join(","),
      access_token: this.accessToken,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve threads media object: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve Threads User's Profile
  async getUserProfile(userId: string, fields: string[]): Promise<any> {
    const url = `https://graph.threads.net/v1.0/${userId}`;
    const params: any = {
      fields: fields.join(","),
      access_token: this.accessToken,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve user's profile: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve Replies
  async getReplies(
    mediaId: string,
    fields: string[],
    reverse: boolean = true
  ): Promise<any[]> {
    const url = `https://graph.threads.net/v1.0/${mediaId}/replies`;
    const params: any = {
      fields: fields.join(","),
      reverse: reverse.toString(),
      access_token: this.accessToken,
    };
    try {
      const response = await axios.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve replies: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve Conversation
  async getConversation(
    mediaId: string,
    fields: string[],
    reverse: boolean = true
  ): Promise<any[]> {
    const url = `https://graph.threads.net/v1.0/${mediaId}/conversation`;
    const params: any = {
      fields: fields.join(","),
      reverse: reverse.toString(),
      access_token: this.accessToken,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve conversation: ${error.response.data.error_message}`
      );
    }
  }

  // Hide/Unhide Replies
  async hideReply(replyId: string, hide: boolean): Promise<boolean> {
    const url = `https://graph.threads.net/v1.0/${replyId}/manage_reply`;
    const params = new URLSearchParams({
      hide: hide.toString(),
      access_token: this.accessToken,
    });

    try {
      const response = await axios.post(url, params);
      return response.data.success;
    } catch (error) {
      throw new Error(
        `Failed to hide/unhide reply: ${error.response.data.error_message}`
      );
    }
  }

  // Respond to Replies
  async respondToReply(
    userId: string,
    mediaType: "TEXT" | "IMAGE" | "VIDEO",
    text: string,
    replyToId: string
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads`;
    const params: any = {
      media_type: mediaType,
      text: text,
      reply_to_id: replyToId,
      access_token: this.accessToken,
    };

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to respond to reply: ${error.response.data.error_message}`
      );
    }
  }

  // Control Who Can Reply
  async controlWhoCanReply(
    userId: string,
    mediaType: "TEXT" | "IMAGE" | "VIDEO",
    text: string,
    replyControl: "everyone" | "accounts_you_follow" | "mentioned_only"
  ): Promise<string> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads`;
    const params: any = {
      media_type: mediaType,
      text: text,
      reply_control: replyControl,
      access_token: this.accessToken,
    };

    try {
      const response = await axios.post(url, params);
      return response.data.id;
    } catch (error) {
      throw new Error(
        `Failed to control who can reply: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve Media Insights
  async getMediaInsights(mediaId: string, metrics: string[]): Promise<any> {
    const url = `https://graph.threads.net/v1.0/${mediaId}/insights`;
    const params: any = {
      metric: metrics.join(","),
      access_token: this.accessToken,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve media insights: ${error.response.data.error_message}`
      );
    }
  }

  // Retrieve User Insights
  async getUserInsights(
    userId: string,
    metrics: string[],
    since?: number,
    until?: number
  ): Promise<any> {
    const url = `https://graph.threads.net/v1.0/${userId}/threads_insights`;
    const params: any = {
      metric: metrics.join(","),
      access_token: this.accessToken,
    };

    if (since) {
      params.since = since.toString();
    }

    if (until) {
      params.until = until.toString();
    }

    try {
      const response = await axios.get(url, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to retrieve user insights: ${error.response.data.error_message}`
      );
    }
  }
}

export default ThreadsSDK;
