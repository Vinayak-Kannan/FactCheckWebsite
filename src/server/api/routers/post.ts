import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Mocked DB
interface Post {
  id: number;
  name: string;
}
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];

// Actual interfaces
export interface Claim {
  text: string;
  cluster_name: string;
  x: number;
  y: number;
  cleaned_veracity: string;
  cleaned_predict_veracity: string;
  predict: boolean;
  cluster: number;
  source: string;
  id: string;
  explanation: string;
  similar_claims: string;
}

export interface ClaimComparison {
  text: string;
  id: string;
}

export interface GetCommunityClaimsResponse {
  unclassified_claim: ClaimComparison;
  paired_claim: ClaimComparison;
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),

  // The real code
  listClaims: publicProcedure.query(async () => {
    const allData: Claim[] = [];
    let index = 0;
    let totalChunks = 0;

    interface response {
      message: string;
      processedData: Claim[];
      totalChunks: number;
    }

    const route = process.env.LIST_POSTS_ROUTE ?? "";

    do {
      console.log("Index retrieved:", index);

      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Origin: "https://wefactcheck-994733.webflow.io",
        },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data at index ${index}`);
      }

      const result: response = (await response.json()) as response;
      const processedData = result.processedData.flat().map((claim) => ({
        ...claim,
        x: Number(claim.x),
        y: Number(claim.y),
        predict: Boolean(claim.predict),
        cluster: Number(claim.cluster),
      }));
      allData.push(...processedData);
      totalChunks = result.totalChunks;
      index++;
    } while (index < totalChunks);

    return allData;
  }),

  getCommunityClaims: publicProcedure.query(async () => {
    interface response {
      message: string;
      unclassified_claim: ClaimComparison;
      paired_claim: ClaimComparison;
    }

    const route = process.env.GET_COMMUNITY_CLAIMS_ROUTE ?? "";

    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Origin: "https://wefactcheck-994733.webflow.io",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data`);
    }

    const result = (await response.json()) as response;

    const data: GetCommunityClaimsResponse = {
      unclassified_claim: result.unclassified_claim,
      paired_claim: result.paired_claim,
    };
    return data;
  }),
});
