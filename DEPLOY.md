Deployment Guide
================

This guide shows how the repository can be deployed to an Amazon EC2 server using Docker, and how the CI/CD workflow is configured.

Prerequisites (on EC2):
- Ubuntu or other Linux with Docker installed
- A user that can run Docker (or use `sudo`)
- Port 80 open in the instance security group

Quick EC2 setup (example):

```
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

GitHub Actions workflow
- The workflow at `.github/workflows/ci-cd.yml` builds a Docker image and pushes it to Docker Hub.
- It then SSHes to your EC2 host and runs `docker pull` and `docker run` to update the container.

Required GitHub Secrets
- `DOCKERHUB_USERNAME` — Docker Hub account name
- `DOCKERHUB_TOKEN` — Docker Hub access token or password
- `EC2_HOST` — public IP or DNS of the EC2 instance
- `EC2_USER` — SSH user (e.g., `ubuntu`)
- `EC2_SSH_KEY` — private SSH key (PEM) with access to the EC2 user

Notes
- Ensure your EC2 user can run Docker commands without password prompts.
- The workflow uses image tag `DOCKERHUB_USERNAME/unct:latest` — change in workflow if you prefer a different tag strategy.
- For production, consider using a private registry, a rolling update strategy, or ECS/EKS.
