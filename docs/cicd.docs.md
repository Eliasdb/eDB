## 5. CI/CD

To smoothly update my staging and production environments, I have built several pipelines. This is how it goes:

**Creating a branch**

Checkout dev branch and pull latest code. Create a feature-branch locally, make changes and open a PR to compare your branch to the dev branch.

**Opening a PR: pre-merge checks**

When you open the PR, a pre-merge pipeline will attempt to lint, test and build only the affected code. It will also push Docker images to Docker Hub. When these checks pass, you can then safely merge to dev branch to automatically start deployment to staging.

![Development Workflow](./docs/devops/staging/premerge-checks_v3.png)

**Deploying to staging: post-merge deployment**

After all checks pass and you have merged successfully, a pipeline will run deploying the build to a staging environment that mimics production.

**URLs**:

-   https://app.staging.eliasdebock.com
-   https://app.staging.eliasdebock.com/admin
-   https://api.staging.eliasdebock.com

**Opening a second PR: pre-merge checks**

After you merged to the dev branch, you can proceed to make another PR. This time to push to production, to merge with the main branch. A pre-merge pipeline will running the same linting, testing and building process as the pre-merge checks for staging. After those pass you can merge to main branch.

**Deploying to production: post-merge deployment**

You can then click the button to merge to main branch. This will trigger the final pipeline to deploy to production.

**URLs**:

-   https://app.eliasdebock.com
-   https://app.eliasdebock.com/admin
-   https://api.eliasdebock.com

Below is a visual representation of all the pipelines running in the project.
![Development Workflow](./docs/devops/cicd_v2.png)

You can also see this run live on GitHub, under the Actions tab:
![Staging Deployment Pipeline Github](./docs/devops/staging/postmerge-deployment-github_v2.png)
