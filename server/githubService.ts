import fs from 'fs';
import path from 'path';

export interface GitHubAuthResult {
  success: boolean;
  user?: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name: string;
    email: string;
    public_repos: number;
    total_private_repos?: number;
  };
  repos?: Array<{
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    default_branch: string;
  }>;
  error?: string;
}

/**
 * Validates a GitHub Personal Access Token or credentials
 */
export async function validateGitHubToken(token: string): Promise<GitHubAuthResult> {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { success: false, error: 'GitHub Personal Access Token is required.' };
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'VanjariJodi-Sync-Agent',
      },
    });

    if (!userRes.ok) {
      const errData: any = await userRes.json().catch(() => ({}));
      return {
        success: false,
        error: errData.message || `GitHub Authentication failed with status ${userRes.status}. Please check your token permissions.`,
      };
    }

    const userData: any = await userRes.json();

    // Fetch user repositories
    const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'VanjariJodi-Sync-Agent',
      },
    });

    let repos: any[] = [];
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      if (Array.isArray(reposData)) {
        repos = reposData.map((r) => ({
          name: r.name,
          full_name: r.full_name,
          private: r.private,
          html_url: r.html_url,
          default_branch: r.default_branch || 'main',
        }));
      }
    }

    return {
      success: true,
      user: {
        login: userData.login,
        id: userData.id,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        name: userData.name || userData.login,
        email: userData.email || '',
        public_repos: userData.public_repos || 0,
        total_private_repos: userData.total_private_repos || 0,
      },
      repos,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to connect to GitHub API.',
    };
  }
}

/**
 * Creates or syncs the repository on GitHub using GitHub REST API
 */
export async function syncProjectToGitHub(params: {
  token: string;
  repoName: string;
  isPrivate?: boolean;
  commitMessage?: string;
  branch?: string;
  owner?: string;
}): Promise<{
  success: boolean;
  repoUrl?: string;
  commitUrl?: string;
  filesSyncedCount?: number;
  message?: string;
  error?: string;
}> {
  const { token, repoName, isPrivate = false, commitMessage = '🚀 Sync VanjariJodi Matrimony Code & 3-Astrology Engines', branch = 'main' } = params;
  const cleanToken = token.trim();

  try {
    // 1. Verify user & get login
    const auth = await validateGitHubToken(cleanToken);
    if (!auth.success || !auth.user) {
      return { success: false, error: auth.error || 'Invalid GitHub token.' };
    }

    const username = auth.user.login;
    const cleanRepoName = repoName.includes('/') ? repoName.split('/')[1].trim() : repoName.trim();
    const repoFullName = `${username}/${cleanRepoName}`;

    // 2. Check if repository exists or create it
    const checkRepoRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'VanjariJodi-Sync-Agent',
      },
    });

    let repoData: any;
    if (checkRepoRes.status === 404) {
      // Create repository
      const createRepoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'VanjariJodi-Sync-Agent',
        },
        body: JSON.stringify({
          name: cleanRepoName,
          description: '🚩 Vanjari Jodi Matrimony - Official Community Portal with 3 Vedic Astrology Engines & Full-Stack Engine',
          private: isPrivate,
          auto_init: true,
        }),
      });

      if (!createRepoRes.ok) {
        const createErr: any = await createRepoRes.json().catch(() => ({}));
        return {
          success: false,
          error: createErr.message || `Failed to create repository ${cleanRepoName} on GitHub.`,
        };
      }
      repoData = await createRepoRes.json();
      // wait a moment for git repo initialization
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else if (checkRepoRes.ok) {
      repoData = await checkRepoRes.json();
    } else {
      const errData: any = await checkRepoRes.json().catch(() => ({}));
      return { success: false, error: errData.message || 'Failed to check repository access on GitHub.' };
    }

    const defaultBranch = branch || repoData.default_branch || 'main';

    // 3. Collect project files from local disk (excluding node_modules, dist, .git, etc.)
    const projectRoot = process.cwd();
    const allowedFiles: { relativePath: string; contentBase64: string }[] = [];

    const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.cache', '.npm', '.vite', '.output']);
    const IGNORED_FILES = new Set(['.env', 'package-lock.json', '.DS_Store']);

    function scanDir(dir: string, relBase = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relBase, entry.name);

        if (entry.isDirectory()) {
          if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
            scanDir(fullPath, relPath);
          }
        } else if (entry.isFile()) {
          if (!IGNORED_FILES.has(entry.name) && !entry.name.endsWith('.tmp')) {
            try {
              const fileBuffer = fs.readFileSync(fullPath);
              if (fileBuffer.length < 5 * 1024 * 1024) {
                // < 5MB per file
                allowedFiles.push({
                  relativePath: relPath.replace(/\\/g, '/'),
                  contentBase64: fileBuffer.toString('base64'),
                });
              }
            } catch (readErr) {
              console.error(`Error reading ${relPath}:`, readErr);
            }
          }
        }
      }
    }

    scanDir(projectRoot);

    if (allowedFiles.length === 0) {
      return { success: false, error: 'No files found to sync.' };
    }

    // 4. Create blobs in GitHub for files
    const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];

    // Process top critical files and components
    for (const file of allowedFiles) {
      try {
        const blobRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/blobs`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'VanjariJodi-Sync-Agent',
          },
          body: JSON.stringify({
            content: file.contentBase64,
            encoding: 'base64',
          }),
        });

        if (blobRes.ok) {
          const blobData: any = await blobRes.json();
          treeItems.push({
            path: file.relativePath,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha,
          });
        }
      } catch (blobErr) {
        console.error(`Error creating blob for ${file.relativePath}:`, blobErr);
      }
    }

    // 5. Get current latest commit of default branch (if any)
    let parentCommitSha: string | null = null;
    const refRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/ref/heads/${defaultBranch}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'VanjariJodi-Sync-Agent',
      },
    });

    if (refRes.ok) {
      const refData: any = await refRes.json();
      parentCommitSha = refData.object?.sha || null;
    }

    // 6. Create Git Tree
    const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'VanjariJodi-Sync-Agent',
      },
      body: JSON.stringify({
        tree: treeItems,
      }),
    });

    if (!treeRes.ok) {
      const treeErr: any = await treeRes.json().catch(() => ({}));
      return { success: false, error: treeErr.message || 'Failed to create git tree on GitHub.' };
    }

    const treeData: any = await treeRes.json();

    // 7. Create Commit
    const commitBody: any = {
      message: commitMessage,
      tree: treeData.sha,
    };
    if (parentCommitSha) {
      commitBody.parents = [parentCommitSha];
    }

    const commitRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'VanjariJodi-Sync-Agent',
      },
      body: JSON.stringify(commitBody),
    });

    if (!commitRes.ok) {
      const commitErr: any = await commitRes.json().catch(() => ({}));
      return { success: false, error: commitErr.message || 'Failed to create commit on GitHub.' };
    }

    const commitData: any = await commitRes.json();

    // 8. Update / Create branch reference
    if (parentCommitSha) {
      await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${defaultBranch}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'VanjariJodi-Sync-Agent',
        },
        body: JSON.stringify({
          sha: commitData.sha,
          force: true,
        }),
      });
    } else {
      await fetch(`https://api.github.com/repos/${repoFullName}/git/refs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'VanjariJodi-Sync-Agent',
        },
        body: JSON.stringify({
          ref: `refs/heads/${defaultBranch}`,
          sha: commitData.sha,
        }),
      });
    }

    const repoUrl = `https://github.com/${repoFullName}`;
    const commitUrl = `https://github.com/${repoFullName}/commit/${commitData.sha}`;

    return {
      success: true,
      repoUrl,
      commitUrl,
      filesSyncedCount: treeItems.length,
      message: `✅ यशस्वीरीत्या ${treeItems.length} फाइल्स, फोटोज़, डेटा व ३ ॲस्ट्रॉलॉजी इंजिन्स तुमच्या GitHub रिपॉझिटरी (${repoFullName}) मध्ये सिंक करण्यात आल्या!`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while syncing to GitHub.',
    };
  }
}
