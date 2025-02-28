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

export interface PostRealTimeInferenceResponse {
  claim: Claim;
  is_check_worthy: boolean;
  check_worthiness_score: number;
  uuid: string;
  isFound: boolean;
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

  postHumanInput: publicProcedure
    .input(
      z.object({ text: z.string(), claim_id: z.string(), score: z.number() }),
    )
    .mutation(async ({ input }) => {
      const route = process.env.POST_HUMAN_INPUT_ROUTE ?? "";
      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Origin: "https://wefactcheck-994733.webflow.io",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Failed to post data`);
      }

      return input;
    }),

  postRealTimeInference: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      interface ResponseInterface {
        prediction: string;
        explanation: string;
        similar_claims: string;
        claim: string;
        cluster_name: string;
        is_check_worthy: boolean;
        check_worthiness_score: number;
        uuid: string;
        isFound: boolean;
      }

      const postObject = {
        claim_inference: input.text,
      };

      postObject.claim_inference = postObject.claim_inference.replace(/'/g, "");
      postObject.claim_inference = postObject.claim_inference.replace(/"/g, "");

      const route = process.env.POST_HUMAN_INPUT_ROUTE ?? "";
      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Origin: "https://wefactcheck-994733.webflow.io",
        },
        body: JSON.stringify(postObject),
      });

      if (!response.ok) {
        throw new Error(`Failed to post data`);
      }

      try {
        const resultText = await response.text();
        const result = JSON.parse(resultText) as ResponseInterface;

        if (result.prediction === "1") {
          result.prediction = "False";
        } else if (result.prediction === "3") {
          result.prediction = "True";
        } else if (result.prediction === "3") {
          result.prediction = "Unclassified";
        }

        const cleanedResult: PostRealTimeInferenceResponse = {
          claim: {
            text: result.claim,
            cluster_name: result.cluster_name,
            x: 0,
            y: 0,
            cleaned_veracity: "Unknown",
            cleaned_predict_veracity: result.prediction,
            predict: true,
            cluster: result.prediction === "Unclassified" ? -1 : 1,
            source: "N/A",
            id: "N/A - Inference",
            explanation: result.explanation,
            similar_claims: result.similar_claims,
          },
          is_check_worthy: result.is_check_worthy,
          check_worthiness_score: result.check_worthiness_score,
          uuid: result.uuid,
          isFound: result.isFound,
        };

        return cleanedResult;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Failed to parse response: ${error}`);
      }
    }),

  getRealTimeInferenceUpdate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const route = process.env.POST_CHECK_INFERENCE_ROUTE ?? "";
      interface ResponseInterface {
        prediction: string;
        explanation: string;
        similar_claims: string;
        claim: string;
        cluster_name: string;
        is_check_worthy: boolean;
        check_worthiness_score: number;
        uuid: string;
        isFound: boolean;
      }

      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Origin: "https://wefactcheck-994733.webflow.io",
        },
        body: JSON.stringify({
          id: input.id,
        }),
      });

      const resultText = await response.text();
      const result = JSON.parse(resultText) as ResponseInterface;
      console.log(result);

      if (!response.ok) {
        throw new Error(`Failed to fetch data`);
      }

      if (result.prediction === "1") {
        result.prediction = "False";
      } else if (result.prediction === "3") {
        result.prediction = "True";
      } else if (result.prediction === "3") {
        result.prediction = "Unclassified";
      }

      const cleanedResult: PostRealTimeInferenceResponse = {
        claim: {
          text: result.claim,
          cluster_name: result.cluster_name,
          x: 0,
          y: 0,
          cleaned_veracity: "Unknown",
          cleaned_predict_veracity: result.prediction,
          predict: true,
          cluster: result.prediction === "Unclassified" ? -1 : 1,
          source: "N/A",
          id: "N/A - Inference",
          explanation: result.explanation,
          similar_claims: result.similar_claims,
        },
        is_check_worthy: result.is_check_worthy,
        check_worthiness_score: result.check_worthiness_score,
        uuid: result.uuid,
        isFound: result.isFound,
      };

      return cleanedResult;
    }),
});
