import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddUserToListParams,
  CreateTweetParams,
  FollowUserParams,
  GetLikedTweetParams,
  GetOwnedListsParams,
  GetUserMentionsParams,
  GetUserParams,
  GetUserTweetsParams,
  HttpRequestParams,
  LikeTweetParams,
  ListFollowersParams,
  RetweetParams,
  UnfollowUserParams,
  UnlikeTweetParams,
} from "../common/requestParams";

export default defineApp({
  type: "app",
  app: "twitter_v2",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Select a **List** or use a custom *List ID*.",
      async options() {
        const { id: userId } = this.getAuthenticatedUser();
        const lists = await this.getOwnedLists({
          userId,
        });
        return lists.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    userNameOrId: {
      type: "string",
      label: "User Name or ID",
      description:
        "The Twitter username (handle) of the user, prefixed with `@` (e.g. `@pipedream`). You can also reference a User ID from a previous step.",
    },
    tweetId: {
      type: "string",
      label: "Tweet ID",
      description: "The numerical ID of the tweet (also known as \"status\")",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.twitter.com/2";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._getBaseUrl(),
        headers: this._getHeaders(),
        ...args,
      });
    },
    async addUserToList({
      listId, ...args
    }: AddUserToListParams) {
      const response = await this._httpRequest({
        method: "POST",
        url: `/lists/${listId}/members`,
        ...args,
      });
      return response.data;
    },
    async createTweet(args: CreateTweetParams) {
      const response = await this._httpRequest({
        method: "POST",
        url: "/tweets",
        ...args,
      });
      return response.data;
    },
    async deleteTweet(tweetId: string) {
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/tweets/${tweetId}`,
      });
      return response.data;
    },
    async followUser(args: FollowUserParams) {
      const { id } = await this.getAuthenticatedUser();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/following`,
        ...args,
      });
      return response.data;
    },
    async getTweet({
      tweetId, ...args
    }) {
      const response = await this._httpRequest({
        url: `/tweets/${tweetId}`,
        ...args,
      });
      return response.data;
    },
    async getAuthenticatedUser() {
      const response = await this._httpRequest({
        url: "/users/me",
      });
      return response.data;
    },
    async getLikedTweets({
      userId, ...args
    }: GetLikedTweetParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/liked_tweets`,
        ...args,
      });
      return response.data;
    },
    async getOwnedLists({
      userId, ...args
    }: GetOwnedListsParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/owned_lists`,
        ...args,
      });
      return response.data;
    },
    async getUserMentions({
      userId, ...args
    }: GetUserMentionsParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/mentions`,
        ...args,
      });
      return response.data;
    },
    async getUserTweets({
      userId, ...args
    }: GetUserTweetsParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/tweets`,
        ...args,
      });
      return response.data;
    },
    async getUserByUsername(username: string) {
      const response = await this._httpRequest({
        url: `/users/by/username/${username}`,
      });
      return response.data;
    },
    async getUser({
      userId, ...args
    }: GetUserParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}`,
        ...args,
      });
      return response.data;
    },
    async likeTweet(args: LikeTweetParams) {
      const { id } = await this.getAuthenticatedUser();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/likes`,
        ...args,
      });
      return response.data;
    },
    async listFollowers({
      userId, ...args
    }: ListFollowersParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/followers`,
        ...args,
      });
      return response.data;
    },
    async retweet(args: RetweetParams) {
      const { id } = await this.getAuthenticatedUser();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/retweets`,
        ...args,
      });
      return response.data;
    },
    async unfollowUser({
      userId, ...args
    }: UnfollowUserParams) {
      const { id } = await this.getAuthenticatedUser();
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/users/${id}/following/${userId}`,
        ...args,
      });
      return response.data;
    },
    async unlikeTweet({
      tweetId, ...args
    }: UnlikeTweetParams) {
      const { id } = await this.getAuthenticatedUser();
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/users/${id}/likes/${tweetId}`,
        ...args,
      });
      return response.data;
    },
  },
});
