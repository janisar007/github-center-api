
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Octokit } from "octokit";

export class PRReviewer {
  constructor(pat, geminiApiKey) {
    this.octokit = new Octokit({ auth: pat });
    this.gemini = new GoogleGenerativeAI(geminiApiKey);
  }

  async reviewPR(owner, repo, pullNumber) {
    try {
      // 1. Get PR diff
      const diff = await this.getPRDiff(owner, repo, pullNumber);

      // 2. Analyze with Gemini
      const analysis = await this.analyzeWithGemini(diff);

      // 3. Format review comments
      const reviewComments = this.formatReviewComments(analysis);

      // 4. Return results for UI
      return {
        summary: analysis.summary,
        codeReview: analysis.codeReview,
        testSuggestions: analysis.testSuggestions,
        reviewComments,
      };
    } catch (error) {
      console.error("PR review failed:", error);
      throw error;
    }
  }

  async getPRDiff(owner, repo, pullNumber) {
    const { data: pr } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
      mediaType: {
        format: "diff",
      },
    });

    const { data: files } = await this.octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      diff: pr, // No need for type casting in JS
      files: files.map((file) => ({
        filename: file.filename,
        changes: file.changes,
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch,
      })),
    };
  }

  async analyzeWithGemini(diff) {
    const prompt = `
    You are an expert code reviewer analyzing a GitHub pull request. 
    Please provide a thorough review including:

    1. CODE QUALITY ASSESSMENT:
    - Security vulnerabilities (SQLi, XSS, auth issues)
    - Performance optimizations
    - Code smells/anti-patterns
    - Readability suggestions
    - Architectural concerns

    2. POTENTIAL BUGS:
    - Edge cases not handled
    - Logical errors
    - Race conditions
    - Memory leaks

    3. TESTING RECOMMENDATIONS:
    - Unit test cases (Jest/Mocha examples)
    - Integration test scenarios
    - Mocking strategies
    - Test data suggestions

    4. ALTERNATIVE SOLUTIONS:
    - More efficient approaches
    - Simpler implementations
    - Built-in alternatives

    For file-specific comments, use this format:
    FILE: path/to/file.js
    LINE: 42
    COMMENT: Suggestion here

    Diff:
    ${JSON.stringify(diff.files, null, 2)}

    Respond in this JSON format:
    {
      "summary": "Overall assessment",
      "codeReview": ["list of specific suggestions"],
      "testSuggestions": ["list of test cases"],
      "fileSpecificComments": [
        {
          "path": "file.js",
          "line": 42,
          "comment": "Suggestion here"
        }
      ]
    }
  `;

    const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    try {
      return JSON.parse(response.text());
    } catch (e) {
      console.error("Failed to parse Gemini response:", response.text());
      throw new Error("Invalid response from AI");
    }
  }

  formatReviewComments(analysis) {
    return analysis.codeReview.map((comment) => ({
      path: "appropriate_file.js", // You'd map this to actual files
      position: 1, // You'd calculate this from diff
      body: comment,
    }));
  }

  async postReview(owner, repo, pullNumber, comments) {
    await this.octokit.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      event: "COMMENT",
      comments,
    });
  }
}
